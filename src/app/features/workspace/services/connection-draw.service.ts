import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ConnectionDrawService {
  activeNode$: BehaviorSubject<{
    id: string;
    event?: MouseEvent;
    location?: {x: number, y: number};
  }> = new BehaviorSubject({ id: null });
  activeNode = this.activeNode$.pipe(
    distinctUntilChanged((a, b) => a.id === b.id),
  );

  killActive: Subject<void> = new Subject();

  constructor() {}

  start(id: string, event: MouseEvent, location: {x: number, y: number}) {
    this.activeNode$.next({ id, event, location });
  }

  end() {
    this.activeNode$.next({ id: null, event: null, location: null });
    this.killActive.next();
  }
}
