import { QueryEntity, QueryConfig } from '@datorama/akita';
import { ISNodesState, IsNodesStore } from './is-nodes.store';
import { IsNode, ISNodeType } from './is-node.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
@QueryConfig({ sortBy: sortByID })
export class ISNodesQuery extends QueryEntity<ISNodesState, IsNode> {
  constructor(protected store: IsNodesStore) {
    super(store);
  }
}

function sortByID(a: IsNode, b: IsNode) {
  if (a.type === ISNodeType.group && b.type !== ISNodeType.group) {
    return -1;
  } else {
    return 1;
  }
  return 0;
}
