import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderDirective } from '@app/directives/loader/loader.directive';
import { MonoTypeOperatorFunction, Observable, throwError, of } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  private username?: string;
  constructor(private http: HttpClient) {}

  setUsername(value: string) {
    this.username = value;
  }
  getUsername() {
    return this.username;
  }

  finalize(pollId: string, option: number): Observable<any> {
    return this.finalizeReq(pollId, option);
  }
  private finalizeReq(pollId: string, option: number): Observable<any> {
    // return of();
    return this.http.post(`${API_BASE}/finalize/${pollId}`, { option, username: this.username });
  }

  vote(pollId: string, options: PollOption[]): Observable<any> {
    const optionsReq = options.reduce<{ [key: string]: number }>((res, o) => ({ ...res, [o.id]: o.checked }), {});
    console.log('​PollsService -> constructor -> optionsReq', optionsReq);
    return this.voteReq(pollId, optionsReq);
  }
  private voteReq(pollId: string, options: { [key: string]: number }): Observable<any> {
    // return of();
    return this.http.post(`${API_BASE}/vote/${pollId}`, { username: this.username, options });
  }

  submitPoll(submitForm: CreateNormalPollForm): Observable<any> {
    return this.submitPollReq(submitForm);
  }
  private submitPollReq(submitForm: CreateNormalPollForm): Observable<any> {
    // return of<any[]>([]);
    return this.http.post(`${API_BASE}/create`, { ...submitForm, username: this.username });
  }

  getPollDetails(pollId: string): Observable<PollDetails> {
    return this.getPollDetailsReq(pollId).pipe(
      map(data => {
        const result: PollDetails = { ...data, options: this.convertOptionResToPollOption(data.options) };
        return result;
      })
    );
  }
  private convertOptionResToPollOption(options: PollDetailsRes['options']): PollOption[] {
    return Object.keys(options).map(x => ({ id: x, value: options[x].value, yes: options[x].yes, maybe: options[x].maybe, checked: 1 }));
  }

  private getPollDetailsReq(pollId: string): Observable<PollDetailsRes> {
    return of<PollDetailsRes>(optionsTest[0]);
    // return this.http.get<PollDetailsRes>(`${API_BASE}/${pollId}`, { params: { username: this.username } });
  }

  getParticipatedPolls(): Observable<PollDetails[]> {
    return this.getParticipatedPollsReq().pipe(
      map(data => {
        return data.map(p => ({ ...p, options: this.convertOptionResToPollOption(p.options) }));
      })
    );
  }
  private getParticipatedPollsReq(): Observable<PollDetailsRes[]> {
    // return of<PollDetailsRes[]>(optionsTest);
    return this.http.get<PollDetailsRes[]>(`${API_BASE}/participated`, { params: { username: this.username } });
  }

  getCreatedPollsList(): Observable<PollDetails[]> {
    return this.getPollsListReq().pipe(
      map(data => {
        return data.map(p => ({ ...p, options: this.convertOptionResToPollOption(p.options) }));
      })
    );
  }
  private getPollsListReq(): Observable<PollDetailsRes[]> {
    // return of<PollDetailsRes[]>(optionsTest);
    return this.http.get<PollDetailsRes[]>(`${API_BASE}/created`, { params: { username: this.username } });
  }
}

export interface PollDetailsRes {
  id: string;
  username: string;
  title: string;
  description: string;
  status: number;
  options: { [optionId: string]: { value: string; yes: number; maybe: number } };
  final_option?: string;
  creator: string;
  is_normal: boolean;
}
export interface PollDetails {
  id: string;
  username: string;
  title: string;
  description: string;
  status: number;
  options: PollOption[];
  final_option?: string;
  creator: string;
}
export interface PollOption {
  checked?: number;
  id: string;
  value: string;
  yes: number;
  maybe: number;
}

export interface CreateNormalPollForm {
  username: string;
  title: string;
  description: string;
  options: string[];
  participants: string[];
  is_normal: boolean;
  message: string;
}
export interface CreateWeeklyPollForm {
  username: string;
  title: string;
  description: string;
  options: WeekOption[];
  participants: string[];
  is_normal: boolean;
  message: string;
}

export interface WeekOption {
  weekday: number;
  start_time: string;
  end_time: string;
}

export function reqPipe<T>(
  loader?: LoaderDirective | string,
  { enCatchError = true, preventParallel = false } = {}
): MonoTypeOperatorFunction<T> {
  if (preventParallel) {
    if (this.isLoaderActive(loader, true)) return;
  }
  setLoader(loader, true);

  return (source: Observable<any>) => {
    return source.pipe(
      tap(data => {
        setLoader(loader, false);
      }),
      catchError(error => {
        if (enCatchError) {
          setLoader(loader, false);
          // this.errorHandler.shared(error);
        }
        return throwError(error);
      })
    );
  };
}

function setLoader(loader: string | LoaderDirective, value: boolean) {
  if (loader == undefined) return;
  if (typeof loader === 'string') {
    // timeout so that angular change detection counts it as a change
    setTimeout(() => (this[loader] = value), 0);
  } else if (typeof loader === 'object') {
    loader.is = value;
  }
}

const optionsTest: PollDetailsRes[] = [
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: {
      '3': { value: 'همینجوری هی گزینه تست اینجا ست', yes: 3, maybe: 5 },
      '4': { value: 'ناینم یکه کزینه دست تیسد گه', yes: 0, maybe: 7 }
    },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 1,
    final_option: 'o1',
    creator: 'vahid',
    is_normal: false
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: {
      '3': { value: 'همینجوری هی گزینه تست اینجا ست', yes: 3, maybe: 5 },
      '4': { value: 'ناینم یکه کزینه دست تیسد گه', yes: 0, maybe: 7 }
    },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 0,
    creator: 'vahid',
    is_normal: false
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: {
      '3': { value: 'همینجوری هی گزینه تست اینجا ست', yes: 3, maybe: 5 },
      '4': { value: 'ناینم یکه کزینه دست تیسد گه', yes: 0, maybe: 7 }
    },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 1,
    final_option: 'o1',
    creator: 'vahid',
    is_normal: false
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: {
      '3': { value: 'همینجوری هی گزینه تست اینجا ست', yes: 3, maybe: 5 },
      '4': { value: 'ناینم یکه کزینه دست تیسد گه', yes: 0, maybe: 7 }
    },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 0,
    creator: 'vahid',
    is_normal: false
  }
];

export const API_BASE = 'http://192.168.43.9:8100/api/v1/polling';

export const YES = 0;
export const NO = 1;
export const MAYBE = 2;

export const SATURDAY = 0;
