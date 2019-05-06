import { HierarchyLink, HierarchyNode } from 'd3-hierarchy';
import { ISNodeType } from 'src/app/state/is-nodes/is-node.model';

export interface GridItem {
  id: number;
  children: NodeItem[];
}
export interface NodeItem {
  id: string;
  parent: string;
  type: ISNodeType;
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
  _children: any;
  value: any;

}
