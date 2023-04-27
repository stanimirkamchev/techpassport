import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { ProductReview } from "src/app/admin/store/product/product.model";

@Component({
  selector: "product-review",
  templateUrl: "./product-review.component.html",
  styleUrls: ["./product-review.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewComponent {
  @Input() productReview: ProductReview;
  @Input() hideLog: boolean;

  isArray = Array.isArray;
}
