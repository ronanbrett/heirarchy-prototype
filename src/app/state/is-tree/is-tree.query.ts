import { QueryEntity, QueryConfig, Order } from '@datorama/akita';
import { IsTreesStore, IsTreeState } from './is-tree.store';
import { IsTree } from './is-tree.model';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@QueryConfig({
  sortBy: 'effectiveDateStart',
  sortByOrder: Order.ASC // Order.DESC
})
@Injectable({ providedIn: 'root' })
export class IsTreesQuery extends QueryEntity<IsTreeState, IsTree> {

  selectTreeInteractivity$ = this.select(state => state.ui.tree);

  constructor(protected store: IsTreesStore) {
    super(store);
  }

  selectAllByTreeId(id: string) {
    return this.selectAll({ filterBy: [entity => entity.id === id] });
  }
}
