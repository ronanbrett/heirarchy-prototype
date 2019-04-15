import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-workspace-node-empty',
  templateUrl: './workspace-node-empty.component.html',
  styleUrls: ['./workspace-node-empty.component.scss'],
})
export class WorkspaceNodeEmptyComponent implements OnInit {
  onMouseEnter() {
    console.log('new account ready');
  }

  onMouseExit() {
    console.log('new account disgarded');
  }

  constructor() {}

  ngOnInit() {}
}
