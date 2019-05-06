import { Component, OnInit } from '@angular/core';
import { IsTreesQuery } from 'src/app/state/is-tree/is-tree.query';
import { ISTreeLifeCycleStatus } from 'src/app/state/is-tree/is-tree.model';

@Component({
  selector: 'app-workspace-metadata',
  templateUrl: './workspace-metadata.component.html',
  styleUrls: ['./workspace-metadata.component.scss']
})
export class WorkspaceMetadataComponent implements OnInit {
  tree = this.isTreeQuery.selectActive();

  status = [
    ISTreeLifeCycleStatus.inactive,
    ISTreeLifeCycleStatus.preactive,
    ISTreeLifeCycleStatus.active,
    ISTreeLifeCycleStatus.expired
  ];


  constructor(private isTreeQuery: IsTreesQuery) {}

  ngOnInit() {}
}
