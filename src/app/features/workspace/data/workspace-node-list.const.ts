import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';
import { NodeItem } from '../interfaces/NodeType';

export const NODE_ITEMS: NodeItem[] = [
  {
    id: 'id-0',
    parent: null,
    type: ISNodeType.root
  },
  {
    id: 'id-1',
    parent: 'id-0',
    type: ISNodeType.group
  },
  {
    id: 'id-2',
    parent: 'id-0',
    type: ISNodeType.group
  },
  {
    id: 'id-3',
    parent: 'id-0',
    type: ISNodeType.group
  },
  {
    id: 'id-4',
    parent: 'id-0',
    type: ISNodeType.group
  },
  {
    id: 'id-5',
    parent: 'id-0',
    type: ISNodeType.group
  },
  {
    id: 'id-6',
    parent: 'id-1',
    type: ISNodeType.group
  },
  {
    id: 'id-7',
    parent: 'id-1',
    type: ISNodeType.group
  },
  {
    id: 'id-8',
    parent: 'id-2',
    type: ISNodeType.group
  },
  {
    id: 'id-9',
    parent: 'id-2',
    type: ISNodeType.group
  },
  {
    id: 'id-10',
    parent: 'id-3',
    type: ISNodeType.group
  },
  {
    id: 'id-11',
    parent: 'id-4',
    type: ISNodeType.group
  },
  {
    id: 'id-12',
    parent: 'id-5',
    type: ISNodeType.group
  },
  {
    id: 'id-14',
    parent: 'id-6',
    type: ISNodeType.child
  },
  {
    id: 'id-15',
    parent: 'id-6',
    type: ISNodeType.child
  },
  {
    id: 'id-16',
    parent: 'id-6',
    type: ISNodeType.child
  },
  {
    id: 'id-17',
    parent: 'id-6',
    type: ISNodeType.child
  },
  {
    id: 'id-18',
    parent: 'id-6',
    type: ISNodeType.child
  },
  {
    id: 'id-19',
    parent: 'id-7',
    type: ISNodeType.child
  },
  {
    id: 'id-21',
    parent: 'id-7',
    type: ISNodeType.child
  },
  {
    id: 'id-22',
    parent: 'id-8',
    type: ISNodeType.child
  },
  {
    id: 'id-23',
    parent: 'id-8',
    type: ISNodeType.child
  },
  {
    id: 'id-24',
    parent: 'id-9',
    type: ISNodeType.child
  },
  {
    id: 'id-25',
    parent: 'id-9',
    type: ISNodeType.child
  },
  {
    id: 'id-26',
    parent: 'id-9',
    type: ISNodeType.child
  }
];

export const HUGE_LIST = [
  { id: 'id-0', parent: null, type: 2 },
  { id: 'id-1', parent: 'id-0', type: 4 },
  { id: 'id-2', parent: 'id-0', type: 4 },
  { id: 'id-3', parent: 'id-0', type: 4 },
  { id: 'id-4', parent: 'id-0', type: 4 },
  { id: 'id-5', parent: 'id-3', type: 4 },
  { id: 'id-6', parent: 'id-5', type: 4 },
  { id: 'id-7', parent: 'id-4', type: 4 },
  { id: 'id-8', parent: 'id-0', type: 4 },
  { id: 'id-9', parent: 'id-8', type: 4 },
  { id: 'id-10', parent: 'id-2', type: 4 },
  { id: 'id-11', parent: 'id-0', type: 4 },
  { id: 'id-12', parent: 'id-3', type: 4 },
  { id: 'id-13', parent: 'id-3', type: 4 },
  { id: 'id-14', parent: 'id-12', type: 4 },
  { id: 'id-15', parent: 'id-14', type: 4 },
  { id: 'id-16', parent: 'id-11', type: 4 },
  { id: 'id-17', parent: 'id-7', type: 4 },
  { id: 'id-18', parent: 'id-6', type: 4 },
  { id: 'id-19', parent: 'id-9', type: 4 },
  { id: 'id-20', parent: 'id-0', type: 3 },
  { id: 'id-21', parent: 'id-11', type: 3 },
  { id: 'id-22', parent: 'id-4', type: 3 },
  { id: 'id-23', parent: 'id-6', type: 3 },
  { id: 'id-24', parent: 'id-6', type: 3 },
  { id: 'id-25', parent: 'id-1', type: 3 },
  { id: 'id-26', parent: 'id-13', type: 3 },
  { id: 'id-27', parent: 'id-6', type: 3 },
  { id: 'id-28', parent: 'id-5', type: 3 },
  { id: 'id-29', parent: 'id-12', type: 3 },
  { id: 'id-30', parent: 'id-13', type: 3 },
  { id: 'id-31', parent: 'id-2', type: 3 },
  { id: 'id-32', parent: 'id-2', type: 3 },
  { id: 'id-33', parent: 'id-9', type: 3 },
  { id: 'id-34', parent: 'id-17', type: 3 },
  { id: 'id-35', parent: 'id-10', type: 3 },
  { id: 'id-36', parent: 'id-18', type: 3 },
  { id: 'id-37', parent: 'id-4', type: 3 },
  { id: 'id-38', parent: 'id-3', type: 3 },
  { id: 'id-39', parent: 'id-12', type: 3 },
  { id: 'id-40', parent: 'id-14', type: 3 },
  { id: 'id-41', parent: 'id-14', type: 3 },
  { id: 'id-42', parent: 'id-4', type: 3 },
  { id: 'id-43', parent: 'id-3', type: 3 },
  { id: 'id-44', parent: 'id-13', type: 3 },
  { id: 'id-45', parent: 'id-18', type: 3 },
  { id: 'id-46', parent: 'id-15', type: 3 },
  { id: 'id-47', parent: 'id-13', type: 3 },
  { id: 'id-48', parent: 'id-15', type: 3 },
  { id: 'id-49', parent: 'id-11', type: 3 }
];
