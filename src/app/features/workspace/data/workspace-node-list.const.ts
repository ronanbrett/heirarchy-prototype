import { NodeItem, NodeType } from '../interfaces/NodeType';

export const NODE_ITEMS: NodeItem[] = [
  {
    id: 'id-0',
    parent: null,
    type: NodeType.root,
  },
  {
    id: 'id-1',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-2',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-3',
    parent: 'id-0',
    type: NodeType.active,
  },
  {
    id: 'id-4',
    parent: 'id-1',
    type: NodeType.active,
  },
  {
    id: 'id-9',
    parent: 'id-4',
    type: NodeType.active,
  },
  {
    id: 'id-5',
    parent: 'id-1',
    type: NodeType.active,
  },
  {
    id: 'id-6',
    parent: 'id-2',
    type: NodeType.active,
  },
  {
    id: 'id-7',
    parent: 'id-3',
    type: NodeType.active,
  },
  {
    id: 'id-8',
    parent: 'id-5',
    type: NodeType.active,
  },
  {
    id: 'id-10',
    parent: 'id-9',
    type: NodeType.active,
  },
  {
    id: 'id-14',
    parent: 'id-10',
    type: NodeType.active,
  },
  {
    id: 'id-15',
    parent: 'id-14',
    type: NodeType.active,
  },
  {
    id: 'id-16',
    parent: 'id-15',
    type: NodeType.active,
  },
  {
    id: 'id-17',
    parent: 'id-16',
    type: NodeType.active,
  },
  {
    id: 'id-18',
    parent: 'id-17',
    type: NodeType.active,
  },
  {
    id: 'id-11',
    parent: 'id-9',
    type: NodeType.active,
  },
  {
    id: 'id-36',
    parent: 'id-2',
    type: NodeType.active,
  },
  {
    id: 'id-1433',
    parent: 'id-36',
    type: NodeType.active,
  },
  {
    id: 'id-113',
    parent: 'id-3',
    type: NodeType.active,
  },
];
