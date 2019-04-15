import { TestBed } from '@angular/core/testing';

import { NodePositioningService } from './node-positioning.service';

describe('NodePositioningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodePositioningService = TestBed.get(NodePositioningService);
    expect(service).toBeTruthy();
  });
});
