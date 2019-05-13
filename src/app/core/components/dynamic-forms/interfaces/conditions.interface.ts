export interface Condition {
  key: string;
  conditions: string[];
  type?: 'any' | 'all';
}

