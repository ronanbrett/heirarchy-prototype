import { TestBed } from '@angular/core/testing';

import { NodeLayoutService } from './node-layout.service';

describe('NodeLayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeLayoutService = TestBed.get(NodeLayoutService);
    expect(service).toBeTruthy();
  });
});
