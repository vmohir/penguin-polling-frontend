import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  getPollsList(): Observable<PollDetails[]> {
    return this.getPollsListReq();
  }
  private getPollsListReq(): Observable<any> {
    return of<PollDetails[]>([{ id: 'test', title: 'poll1', options: [] }]);
  }

  constructor() {}
}

export interface PollDetails {
  title: string;
  options: any[];
  id: string;
}
