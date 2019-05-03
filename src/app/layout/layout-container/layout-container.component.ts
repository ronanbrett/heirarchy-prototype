import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {
  isSideOpen = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  openSideNav() {
    this.isSideOpen = true;
  }

  closeSideNav() {
    this.isSideOpen = false;
  }

  sideNavClosing() {
  }

}
