import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-workspace-home-page',
  templateUrl: './workspace-home-page.component.html',
  styleUrls: ['./workspace-home-page.component.scss']
})
export class WorkspaceHomePageComponent implements OnInit {

  // @HostListener('click')
  // onclick() {
  //   this.rowCount = 4;
  // }

  rowCount = 3;
  constructor() { }

  ngOnInit() {
  }

 

}
