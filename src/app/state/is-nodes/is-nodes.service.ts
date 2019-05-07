import { Injectable } from '@angular/core';
import { ID, StateHistoryPlugin } from '@datorama/akita';
import { IsNode } from './is-node.model';
import { ISNodesQuery } from './is-nodes.query';
import { IsNodesStore } from './is-nodes.store';
import { generateInitialTreeState } from './is-node.initial-state';

@Injectable({ providedIn: 'root' })
export class IsNodesService {
  public collection: StateHistoryPlugin<IsNode>;

  constructor(
    private isNodeQuery: ISNodesQuery,
    private isNodesStore: IsNodesStore
  ) {
    this.collection = new StateHistoryPlugin<IsNode>(isNodeQuery, {
      maxAge: 300
    });
  }

  resetHistory() {
    this.collection.jumpToPast(0);
  }

  getHistory() {
    console.log(this.collection);
  }

  get() {
    this.isNodesStore.set(generateInitialTreeState());
    this.collection.clear();
  }

  add(isNode: IsNode) {
    this.isNodesStore.add(isNode, { prepend: true });
  }

  update(id, isNode: Partial<IsNode>) {
    this.isNodesStore.update(id, isNode);
  }

  remove(id: ID) {
    this.isNodesStore.remove(id);
  }
}
