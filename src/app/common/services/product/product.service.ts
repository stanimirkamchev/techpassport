import { Injectable } from '@angular/core';

export interface ProductElement {
  id?: string;
  _id?: string;
  position?: number;
  name?: string;
  rapid?: string;
  assessments?: Array<any>;
  securityQuestions?: Array<any>;//<
  status?: string;
  statusHistory?: Array<any>;
  actions?: string;
  class?: string;

  supplier?: any;
  basic?: any;
  details?: any;
  jumpToCategory?: number;
  readOnly?: boolean;
  tags?: any;

  supplierId?: string

  insurance?: any
};

export interface ActivityElement {
  id?: string;
  connection?: boolean,
  position: number;
  date: Date;
  timestamp: number;
  message: string;
  object: string;
  scope?: string;
  class: string;
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }
}
