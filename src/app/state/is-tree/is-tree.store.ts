import {
  EntityState,
  EntityStore,
  StoreConfig,
  ActiveState
} from '@datorama/akita';
import { IsTree, TREE_INTERACTIVE_STATE } from './is-tree.model';
import { Injectable } from '@angular/core';
import { IS_TREE_INITIAL_STATE } from './is-tree.initial-state';

export interface IsTreeState extends EntityState<IsTree>, ActiveState {
  ui: {
    tree: TREE_INTERACTIVE_STATE;
  };
}

export const initialState = {
  active: null,
  ui: {
    tree: TREE_INTERACTIVE_STATE.ENABLED
  }
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'is-tree', idKey: 'key' })
export class IsTreesStore extends EntityStore<IsTreeState, IsTree> {
  constructor() {
    super(initialState);
    this.upsertMany(IS_TREE_INITIAL_STATE);
    this.setActive(IS_TREE_INITIAL_STATE[0].key);
  }

  updateTreeInteractiveState(tree: TREE_INTERACTIVE_STATE) {
    this.update({ ui: { tree } });
  }
}
