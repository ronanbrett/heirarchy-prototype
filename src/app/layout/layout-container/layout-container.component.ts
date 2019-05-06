import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {
  isEndSideOpen = false;
  isStartSideOpen = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  toggleEndSideNav(toggle: boolean) {
    this.isEndSideOpen = toggle;
  }

  toggleStartSideEnd(toggle: boolean) {
    this.isStartSideOpen = toggle;
  }

  sideNavClosing() {
  }

}
