import { isFunction } from 'lodash';

export type CSVPropertyResolver<T> = (keyof T | ((element: T) => string));
export type CSVExporterProps<T> = Array<keyof T | [string, CSVPropertyResolver<T>]>;

export const hasResolvables = <T>(item: keyof T | [string, CSVPropertyResolver<T>]): item is [string, CSVPropertyResolver<T>] => {
  return Array.isArray(item);
};

export const isResolvable = <T>(item: keyof T | ((element: T) => string)): item is (element: T) => string => {
  return isFunction(item);
};
