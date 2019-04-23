import { HierarchyLink, HierarchyNode } from 'd3-hierarchy';

export enum NodeType {
  empty,
  active,
  root,
  child,
  group
}
export interface GridItem {
  id: number;
  children: NodeItem[];
}
export interface NodeItem {
  id: string;
  parent: string;
  type: NodeType;
}
export interface Heirarchy {
  items: NodeItem[];
  graph: {};
  maxCols: number;
  maxDepth: number;
  links: any;
}

export interface HeirarchyNodeWithLink extends HierarchyNode<any> {
  left: number;
  top: number;
  childParent: HeirarchyNodeWithLink;
}
