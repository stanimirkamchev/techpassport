import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'marketplace-layout',
  templateUrl: './marketplace-layout.component.html',
  styleUrls: ['./marketplace-layout.component.scss']
})
export class MarketplaceLayoutComponent implements OnInit {
  public pagesList = [];

  constructor() { }

  ngOnInit(): void {
    this.pagesList.push({ id: "home", label: "HOME", icon: "home" });
    this.pagesList.push({
      id: "dashboard",
      label: "DASHBOARD",
      icon: "view_quilt",
    });
    this.pagesList.push({
      id: "poc",
      label: "CONNECTIONS",
      icon: "library_books",
    });

    this.pagesList.push({ id: "market", label: "MARKET", icon: "shopping_cart" });

    this.pagesList.push({
      id: "team",
      label: "TEAM",
      icon: "supervisor_account",
    });
  }


}
