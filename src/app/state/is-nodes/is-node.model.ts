import { ID } from '@datorama/akita';

export enum ISNodeType {
  draft,
  root,
  group,
  child
}

export interface IsNode {
  id: ID;
  parent: string;
  type: ISNodeType;
}
