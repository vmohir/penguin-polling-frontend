import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  private username: string;
  constructor(private http: HttpClient) {}

  setUsername(value: string) {
    this.username = value;
  }

  getPollDetails(pollId: string): Observable<PollDetails> {
    return this.getPollDetailsReq(pollId);
  }
  private getPollDetailsReq(pollId: string): Observable<PollDetails> {
    return of<PollDetails>({ id: pollId, title: 'testpoll', options: [] });
  }

  getPollsList(): Observable<PollDetails[]> {
    return this.getPollsListReq();
  }
  private getPollsListReq(): Observable<any> {
    return of<PollDetails[]>([{ id: 'test', title: 'poll1', options: [] }]);
  }
}

export interface PollDetails {
  title: string;
  options: any[];
  id: string;
}
