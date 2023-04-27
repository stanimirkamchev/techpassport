import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-deletion-modal',
  templateUrl: './product-deletion-modal.component.html',
  styleUrls: ['./product-deletion-modal.component.scss']
})
export class ProductDeletionModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: string, name: string }
  ) { }

  ngOnInit(): void { }
}
