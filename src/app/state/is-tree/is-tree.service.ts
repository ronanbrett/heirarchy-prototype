import { Injectable } from '@angular/core';
import { IsTreesStore } from './is-tree.store';
import { IsTree, TREE_INTERACTIVE_STATE } from './is-tree.model';
import { ID } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class IsTreeService {
  constructor(private isTreeStore: IsTreesStore) {}

  add(isTree: IsTree) {
    this.isTreeStore.add(isTree, { prepend: false });
  }

  setActive(id: string) {
    this.isTreeStore.setActive(id);
  }

  update(id, isTree: Partial<IsTree>) {
    this.isTreeStore.update(id, isTree);
  }

  remove(id: ID) {
    this.isTreeStore.remove(id);
  }

  updateInteractivity(state: TREE_INTERACTIVE_STATE) {
    this.isTreeStore.updateTreeInteractiveState(state);
  }
}
