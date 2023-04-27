import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChildren,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { KeysPipe } from "@pipes/keys-pipe/keys-pipe.pipe";
import { validateAllFormFields } from "@shared/helpers/common";
import { KeyboardUtil } from "../../../common/utils/keyboard-util";

@Component({
  selector: "verification-form",
  templateUrl: "./verification-form.component.html",
  styleUrls: ["./verification-form.component.scss"],
})
export class VerificationFormComponent implements OnInit {
  @Output() submitForm: EventEmitter<any> = new EventEmitter();
  @Output() resend: EventEmitter<any> = new EventEmitter();
  @Input() accountForm: FormGroup;
  @Input() verifyError: string;
  @Input() verifyLoading: boolean;
  @Input() resending: boolean = false;
  config: any = { length: 6, allowNumbersOnly: true };
  formCtrl: FormControl;
  otpForm: FormGroup;
  currentVal: string;
  inputControls: FormControl[] = new Array(this.config.length);
  componentKey =
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36);

  get inputType() {
    return "number";
  }
  private code;
  private getControlName(idx) {
    return `ctrl_${idx}`;
  }
  constructor(private keysPipe: KeysPipe) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({});
    for (let index = 0; index < this.config.length; index++) {
      this.otpForm.addControl(this.getControlName(index), new FormControl('', Validators.required));
    }
    this.otpForm.valueChanges.subscribe((v: object) => {
      this.keysPipe.transform(this.otpForm.controls).forEach((k) => {
        var val = this.otpForm.controls[k].value;
        if (val && val.length > 1) {
          if (val.length >= this.config.length) {
            this.setValue(val);
          } else {
            this.rebuildValue();
          }
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (!this.config.disableAutoFocus) {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      if (containerItem) {
        const ele: any = containerItem.getElementsByClassName("otp-input")[0];
        if (ele && ele.focus) {
          ele.focus();
        }
      }
    }
  }

  resendOTP() {
    this.resend.emit()
  }

  isFormValid(): boolean {
    return this.otpForm.valid;
  }

  submit() {
    this.submitForm.emit(this.code);
  }

  isFieldInvalid(field): boolean {
    return (
      this.otpForm.controls[field].errors?.required && (this.otpForm.controls[field].dirty || this.otpForm.controls[field].touched)
    );
  }

  onKeyDown($event, inputIdx) {
    if (KeyboardUtil.ifSpacebar($event)) {
      $event.preventDefault();
      return false;
    }
  }

  onInputChange(value) {
    this.code = value
  }

  onInput($event) {
    let newVal = this.currentVal
      ? `${this.currentVal}${$event.target.value}`
      : $event.target.value;
    if (this.config.allowNumbersOnly && !this.validateNumber(newVal)) {
      $event.target.value = "";
      $event.stopPropagation();
      $event.preventDefault();
      return;
    }
  }

  onKeyUp($event, inputIdx) {
    const nextInputId = this.appendKey(`otp_${inputIdx + 1}`);
    const prevInputId = this.appendKey(`otp_${inputIdx - 1}`);
    if (KeyboardUtil.ifRightArrow($event)) {
      $event.preventDefault();
      this.setSelected(nextInputId);
      return;
    }
    if (KeyboardUtil.ifLeftArrow($event)) {
      $event.preventDefault();
      this.setSelected(prevInputId);
      return;
    }
    if (KeyboardUtil.ifBackspaceOrDelete($event) && !$event.target.value) {
      this.setSelected(prevInputId);
      this.rebuildValue();
      return;
    }
    if (!$event.target.value) {
      return;
    }
    if (this.ifValidKeyCode($event)) {
      this.setSelected(nextInputId);
    }
    this.rebuildValue();
  }

  validateNumber(val) {
    return val && /^\d*\.?\d*$/.test(val);
  }

  appendKey(id) {
    return `${id}_${this.componentKey}`;
  }

  setSelected(eleId) {
    this.focusTo(eleId);
    const ele: any = document.getElementById(eleId);
  }

  ifValidKeyCode(event) {
    const inp = event.key;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (this.config.allowKeyCodes &&
        this.config.allowKeyCodes.includes(event.keyCode))
    );
  }

  focusTo(eleId) {
    const ele: any = document.getElementById(eleId);
    if (ele) {
      ele.focus();
    }
  }

  setValue(value: any) {
    if (this.config.allowNumbersOnly && isNaN(value)) {
      return;
    }
    this.otpForm.reset();
    if (!value) {
      this.rebuildValue();
      return;
    }
    value = value.toString().replace(/\s/g, ""); // remove whitespace
    Array.from(value).forEach((c, idx) => {
      if (this.otpForm.get(this.getControlName(idx))) {
        this.otpForm.get(this.getControlName(idx)).setValue(c);
      }
    });
    if (!this.config.disableAutoFocus) {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      var indexOfElementToFocus =
        value.length < this.config.length
          ? value.length
          : this.config.length - 1;
      let ele: any =
        containerItem.getElementsByClassName("otp-input")[
          indexOfElementToFocus
        ];
      if (ele && ele.focus) {
        ele.focus();
      }
    }
    this.rebuildValue();
  }

  rebuildValue() {
    let val = "";
    this.keysPipe.transform(this.otpForm.controls).forEach((k) => {
      if (this.otpForm.controls[k].value) {
        let ctrlVal = this.otpForm.controls[k].value;
        let isLengthExceed = ctrlVal.length > 1;
        let isCaseTransformEnabled =
          !this.config.allowNumbersOnly &&
          this.config.letterCase &&
          (this.config.letterCase.toLocaleLowerCase() == "upper" ||
            this.config.letterCase.toLocaleLowerCase() == "lower");
        ctrlVal = ctrlVal[0];
        let transformedVal = isCaseTransformEnabled
          ? this.config.letterCase.toLocaleLowerCase() == "upper"
            ? ctrlVal.toUpperCase()
            : ctrlVal.toLowerCase()
          : ctrlVal;
        if (isCaseTransformEnabled && transformedVal == ctrlVal) {
          isCaseTransformEnabled = false;
        } else {
          ctrlVal = transformedVal;
        }
        val += ctrlVal;
        if (isLengthExceed || isCaseTransformEnabled) {
          this.otpForm.controls[k].setValue(ctrlVal);
        }
      }
    });
    if (this.formCtrl?.setValue) {
      this.formCtrl.setValue(val);
    }
    this.onInputChange(val);
    this.currentVal = val;
  }

  handlePaste(e) {
    let clipboardData = e.clipboardData || window["clipboardData"];
    if (clipboardData) {
      var pastedData = clipboardData.getData("Text");
    }
    e.stopPropagation();
    e.preventDefault();
    if (
      !pastedData ||
      (this.config.allowNumbersOnly && !this.validateNumber(pastedData))
    ) {
      return;
    }
    this.setValue(pastedData);
  }
}
