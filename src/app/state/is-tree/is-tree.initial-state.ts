import { IsTree, ISTreeLifeCycleStatus } from './is-tree.model';

export const IS_TREE_INITIAL_STATE: IsTree[] = [
  {
    name: 'Tree 1',
    id: 'tree-1',
    key: 'tree-1-01',
    effectiveDateStart: new Date(2019, 2, 1, 0, 1, 0, 0),
    versionDateStart: new Date(2019, 3, 1, 0, 1, 0, 0),
    versionDateEnd: new Date(3000, 3, 1, 0, 1, 0, 0),
    type: 'Exposure',
    description: '',
    lifeCycleStatus: ISTreeLifeCycleStatus.active
  },
  {
    name: 'Tree 1',
    id: 'tree-1',
    key: 'tree-1-02',
    effectiveDateStart: new Date(2019, 0, 1, 0, 1, 0, 0),
    effectiveDateEnd: new Date(2019, 1, 1, 0, 1, 0, 0),
    versionDateStart: new Date(2019, 3, 1, 0, 1, 0, 0),
    versionDateEnd: new Date(3000, 3, 1, 0, 1, 0, 0),
    type: 'Exposure',
    description: '',
    lifeCycleStatus: ISTreeLifeCycleStatus.expired
  }
];
