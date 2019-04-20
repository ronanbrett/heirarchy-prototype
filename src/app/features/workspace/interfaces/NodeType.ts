export enum NodeType {
  empty,
  active,
  root
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
