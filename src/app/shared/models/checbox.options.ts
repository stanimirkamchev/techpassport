export interface ICheckboxOptions {
  label: string;
  value?: boolean;
  name?: string;
  selected: boolean;
  disabled?: boolean;
  selectionChanged?: () => void;
}

export interface IMultiCheckboxOption {
  label: string;
  value?: string | boolean;
  name: string;
  selected: boolean;
  disabled: boolean;
}
