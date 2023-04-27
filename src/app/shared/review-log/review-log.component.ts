import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Identifiable } from '@abstract/identifiable';
import { ProductReviewer, ProductStatus } from 'src/app/admin/store/product/product.model';

export type ReviewLog<T = ProductStatus, K = ProductReviewer> = ReviewLogItem<T, K>[];

export interface ReviewLogItem<T = ProductStatus, K = ProductReviewer> extends Identifiable {
  date: Date;
  comment: string;
  subject: string;
  status: T;
  reviewer: K;
}

@Component({
  selector: 'review-log',
  templateUrl: './review-log.component.html',
  styleUrls: ['./review-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewLogComponent {

  @Input() log: ReviewLog;
}
