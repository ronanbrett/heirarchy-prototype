import { TestBed } from '@angular/core/testing';

import { ConnectionDrawService } from './connection-draw.service';

describe('ConnectionDrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnectionDrawService = TestBed.get(ConnectionDrawService);
    expect(service).toBeTruthy();
  });
});
