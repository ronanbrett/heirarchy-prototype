import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IsNode } from './is-node.model';
import { Injectable } from '@angular/core';
import { generateInitialTreeState } from './is-node.initial-state';

export interface ISNodesState extends EntityState<IsNode> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'is-nodes' })
export class IsNodesStore extends EntityStore<ISNodesState, IsNode> {
  constructor() {
    super();
    this.upsertMany(generateInitialTreeState());
  }
}
