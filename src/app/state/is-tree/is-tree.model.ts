export enum ISTreeLifeCycleStatus {
  preactive = 'preactive',
  inactive = 'inactive',
  active = 'active',
  expired = 'expired'
}

export interface IsTree {
  key: string;
  id: string;
  effectiveDateStart: Date;
  effectiveDateEnd?: Date;
  versionDateStart: Date;
  versionDateEnd?: Date;
  name: string;
  type: string;
  description: string;
  lifeCycleStatus: ISTreeLifeCycleStatus;

  // UI Variables
  active?: boolean;
}

export enum TREE_INTERACTIVE_STATE {
  ENABLED,
  DISABLED
}