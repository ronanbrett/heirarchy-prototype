import { HierarchyNode, HierarchyLink } from 'd3-hierarchy';

export interface LayoutWorkerParams {
  NODE_WIDTH: number;
  NODE_HEIGHT: number;
  node: any;
}

export interface LayoutWorkerResult {
  pageHeight: number;
  pageWidth: number;
  links: HierarchyLink<any>[];
  items: any;
}
