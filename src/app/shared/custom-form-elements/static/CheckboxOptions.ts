import { ICheckboxOptions, IMultiCheckboxOption } from '@shared/models/checbox.options';

const yesNoOptions: ICheckboxOptions[] = [
    { label: 'Yes', selected: false, name: 'Yes', disabled: false },
    { label: 'No', selected: false, name: 'No', disabled: false }
];

export class CheckboxOptions {
  public static yesNoOptions: ICheckboxOptions[] = yesNoOptions;
}

export class MultiCheckboxOptions {
  public static yesNoNAOptions: IMultiCheckboxOption[] = [
    { label: 'Yes', selected: false, name: 'yes', disabled: false, value: false },
    { label: 'No', selected: false, name: 'no', disabled: false, value: false },
    { label: 'N/A', selected: false, name: 'na', disabled: false, value: false },
  ];
  public static yesNoOptions: IMultiCheckboxOption[] = [
    { label: 'Yes', selected: false, name: 'yes', disabled: false, value: false },
    { label: 'No', selected: false, name: 'no', disabled: false, value: false },
  ];

  public static customizeNAOptionLabel(label: string): IMultiCheckboxOption[] {
    this.yesNoNAOptions.find(x => x.name === 'na').label = label;
    return this.yesNoNAOptions;
  }
}
