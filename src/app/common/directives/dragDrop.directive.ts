import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  Input,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Directive({
  selector: "[appDrag]"
})
export class DragDirective implements AfterViewInit {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  @Input() inputField;

  @HostBinding("style.background") public background = "#eee";

  constructor(private sanitizer: DomSanitizer) {

  }

  ngAfterViewInit(): void {
    if (!this.inputField)
      return;

    const fileChoosen = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      const file = evt.target.files[0];
      if (!file)
        return

      const url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));//bypassSecurityTrustUrl

      let files: FileHandle[] = [];
      files.push({file, url});

      this.files.emit(files);
    }
    this.inputField.addEventListener('change', fileChoosen);
  }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#eee";
  }

  @HostListener("click", ["$event"]) public onClick(evt: Event) {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.inputField) {
      console.log('this', this, this.inputField);
      this.inputField.click();
    }
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';

    let files: FileHandle[] = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file));//bypassSecurityTrustUrl
      files.push({file, url});
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
