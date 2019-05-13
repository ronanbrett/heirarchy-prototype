import { of, BehaviorSubject } from 'rxjs';

export class DataSourceMock {
  data: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor() {}
  connect() {
    return this.data;
  }

  setData(items: any) {
    this.data.next(items);
  }
}

export function createDataSourceMock(list: any[]) {
  return new DataSourceMock();
}
