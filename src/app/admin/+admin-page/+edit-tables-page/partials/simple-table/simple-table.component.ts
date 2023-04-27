import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { CSVToArray } from 'src/app/portal/+outer-market-page/helper/csvFormatter';
import * as uuid from 'uuid';
import { ModalPreviewComponent } from '../modal-preview/modal-preview.component';

export enum Types {
  Tags = 'tags',
  Taxonomies = 'taxonomies',
  Frameworks = 'frameworks',
  Solutions = 'solutions',
}

@Component({
  selector: 'simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss']
})
export class SimpleTableComponent implements OnInit {

  constructor(
    private addDialog: MatDialog,
    private csvExporter: CsvExporterService,
    private apiService: ApiService
  ) {
  }

  @Input() tags = [];
  @Input() frameworks = [];
  @Input() solutions = [];
  @Input() taxonomies = [];
  @Input() loadings = {} as any;

  formGroup: FormGroup = null;
  cerfificationFileState = Array(3).fill(0).map(t => ({
    error: '',
    isSaving: false,
    isRemoving: false,
    fid: uuid(),
    uploadStatus: ''
  }));

  sortedSolutions = [];
  suppliers = [];
  products = [];
  migrationObj = {
    suppliers: null,
    products: null,
  };
  showMigration = false;
  types = Types;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      supplier: new FormControl(null),
      product: new FormControl(null)
    });
    this.initData();
  }

  exportList(type: string) {
    let fileName = '';
    let template = [];
    let data = [];
    switch (type) {
      case Types.Tags:
        template = this.tagsAndFrameworkTemplate();
        fileName = Types.Tags;
        data = this.tags;
        break;
      case Types.Solutions:
        template = this.solutionsTemplate();
        fileName = Types.Solutions;
        this.solutions.forEach(el => {
          el.values.forEach(e => {
            data.push({
              type: el.key,
              name: e.name || ''
            });
          });
        });
        break;
      case Types.Frameworks:
        template = this.tagsAndFrameworkTemplate();
        fileName = Types.Frameworks;
        data = this.frameworks;
        break;
      case Types.Taxonomies:
        template = this.taxonomiesTemplate();
        fileName = Types.Taxonomies;
        this.taxonomies.forEach(element => {
          element.level2.forEach(lvl2 => {
            lvl2.level3.forEach(lvl3 => {
              data.push({
                level1: element.title,
                level2: lvl2.title2 || '',
                level3: lvl3.title3 || '',
              });
            });
          });
        });
        break;
      case 'suppliers':
        template = this.supplierTemplate();
        fileName = 'suppliers';
        this.suppliers.forEach(element => {
          data.push({
            id: element._id,
            name: element.name || '',
            companyStage: element.companyStage || ''
          });
        });
        break;
      case 'products':
        template = this.productTemplate();
        fileName = 'products';
        this.products.forEach((element: any) => {
          if (element.type) {
            element.type.forEach((lvl1: string) => {
              const obj = {
                id: element._id,
                name: element.name,
                type: lvl1
              };
              data.push(obj);
            });
          } else {
            data.push({
              id: element._id,
              name: element.name,
              type: ''
            });
          }

        });
        break;
      default:
        break;
    }
    this.csvExporter.export<any>(data, template, fileName);
  }

  private sanitize(val: string) {
    if (val) {
      val = val.replace(/,/g, '\,');
      val = val.replace(/"/g, '""');
    } else {
      val = '';
    }
    return val;
  }

  private tagsAndFrameworkTemplate() {
    return [
      ['Name', (s: any) => s && s.name ? `"${this.sanitize(s.name)}"` : ''],
    ];
  }

  private taxonomiesTemplate() {
    return [
      ['Level 1', (s: any) => s && s.level1 ? `"${this.sanitize(s.level1)}"` : ''],
      ['Level 2', (s: any) => s && s.level2 ? `"${this.sanitize(s.level2)}"` : ''],
      ['Level 3', (s: any) => s && s.level3 ? `"${this.sanitize(s.level3)}"` : ''],
    ];
  }

  private solutionsTemplate() {
    return [
      ['Type', (s: any) => s && s.type ? `"${this.sanitize(s.type)}"` : ''],
      ['Name', (s: any) => s && s.name ? `"${this.sanitize(s.name)}"` : ''],
    ];
  }

  private supplierTemplate() {
    return [
      ['ID', (s: any) => s && s.id ? `"${this.sanitize(s.id)}"` : ''],
      ['Name', (s: any) => s && s.name ? `"${this.sanitize(s.name)}"` : ''],
      ['Company Stage', (s: any) => s && s.companyStage ? `"${this.sanitize(s.companyStage)}"` : ''],
    ];
  }

  private productTemplate() {
    return [
      ['ID', (s: any) => s && s.id ? `"${this.sanitize(s.id)}"` : ''],
      ['Name', (s: any) => s && s.name ? `"${this.sanitize(s.name)}"` : ''],
      ['Types [ - ]', (s: any) => s && s.type ? `"${this.sanitize(s.type)}"` : ''],
    ];
  }

  runMigrationProcess() {
    try {
      const productJSON = this.transformCsv(this.migrationObj.products, 'taxonomy');
      const supplierJSON = this.transformCsv(this.migrationObj.suppliers, 'companyStage');
      this.apiService.runMigrationProcess(productJSON, supplierJSON).subscribe(data => {
        if (data.body.success && data.status === 200) {
          this.migrationObj.products = null;
          this.migrationObj.suppliers = null;
          this.initData();
        }
      }, error => {
        this.migrationObj.suppliers = null;
        this.migrationObj.products = null;
        console.log('ERROR transformCsv', error);
      });
    } catch (error) {
      console.log('ERROR transformCsv', error);
    }
  }

  showRecords() {
    const productJSON = this.transformCsv(this.migrationObj.products, 'taxonomy');
    const supplierJSON = this.transformCsv(this.migrationObj.suppliers, 'companyStage');
    const ref = this.addDialog.open(ModalPreviewComponent, {
      width: '1280px',
      height: '80%',
      maxWidth: undefined,
      panelClass: 'alert-modal',
      disableClose: false,
      data: { products: productJSON, suppliers: supplierJSON }
    });
    ref.afterClosed().subscribe(result => {
    });
  }

  onSave(fileInput: any, index: number, group: string) {
    if (this.cerfificationFileState[index].isRemoving || this.cerfificationFileState[index].isSaving) { return; }
    this.cerfificationFileState[index].isSaving = true;
    const reader = new FileReader();
    reader.readAsText(fileInput);

    reader.onload = (onLoadEvent) => {
      const csvData = reader.result;
      this.migrationObj[`${group}s`] = csvData;
    };
  }

  onRemove(index: number, group: string) {
    if (this.cerfificationFileState[index].isRemoving || this.cerfificationFileState[index].isSaving) { return; }
    this.cerfificationFileState[index].isRemoving = true;
  }

  private transformCsv(outerMarketData: string, field: string) {
    const delimiterType = outerMarketData.split('ID;').length === 2 ? ';' : ',';

    const outerMarketArray = CSVToArray(outerMarketData, delimiterType);
    const outerMarketObject = outerMarketArray.map(rows => {
      const obj = {
        _id: rows[0] || null,
        name: rows[1] || null,
        [field]: rows[2] || null,
      };
      return obj;
    });

    outerMarketObject.shift();

    return outerMarketObject.filter(e => e._id && e._id.length > 0);
  }

  initData() {
    this.apiService.getPrSupExport().subscribe(data => {
      this.suppliers = data.suppliers.sort((a, b) => a.name - b.name);
      this.products = data.products.sort((a, b) => a.name - b.name);
      this.showMigration = true;
    });
  }
}
