import { Injectable } from '@angular/core';
import { Observable, of, MonoTypeOperatorFunction, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoaderDirective } from '@app/directives/loader/loader.directive';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { takeUntil, catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  private username: string;
  constructor(private http: HttpClient) {}

  setUsername(value: string) {
    this.username = value;
  }

  finalize(pollId: string, option: string): Observable<any> {
    return this.finalizeReq(pollId, option);
  }
  private finalizeReq(pollId: string, option): Observable<any> {
    // return of();
    return this.http.post(`${API_BASE}/finalize/${pollId}`, { option, username: this.username });
  }

  vote(pollId: string, options: PollOption[]): Observable<any> {
    const optionsReq = options.reduce((res, o) => ({ ...res, [o.name]: o.checked }), {});
    return this.voteReq(pollId, optionsReq);
  }
  private voteReq(pollId: string, options: { [key: string]: string }): Observable<any> {
    // return of();
    return this.http.post(`${API_BASE}/vote/${pollId}`, { username: this.username, options });
  }

  submitPoll(submitForm: CreatePollForm): Observable<any> {
    return this.submitPollReq(submitForm);
  }
  private submitPollReq(submitForm: CreatePollForm): Observable<any> {
    // return of<any[]>([]);
    return this.http.post(`${API_BASE}/create`, submitForm);
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
    return Object.keys(options).map(x => ({ name: x, count: options[x], checked: false }));
  }

  private getPollDetailsReq(pollId: string): Observable<PollDetailsRes> {
    // return of<PollDetailsRes>(optionsTest[0]);
    return this.http.get<PollDetailsRes>(`${API_BASE}/${pollId}`, { params: { username: this.username } });
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
    return this.http.get<PollDetailsRes[]>(`${API_BASE}/created`, { params: { username: this.username } });
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
    return this.http.get<PollDetailsRes[]>(`${API_BASE}/participated`, { params: { username: this.username } });
  }
}

export interface PollDetailsRes {
  id: string;
  username: string;
  title: string;
  description: string;
  status: number;
  options: { [option: string]: number };
  final_option?: string;
  creator: string;
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
  checked?: boolean;
  name: string;
  count: number;
}

export interface CreatePollForm {
  username: string;
  title: string;
  description: string;
  options: string[];
  participants: string[];
}

export function reqPipe<T>(
  loader?: LoaderDirective | string,
  { enCatchError = true, preventParallel = false } = {}
): MonoTypeOperatorFunction<T> {
  if (preventParallel) {
    if (this.isLoaderActive(loader, true)) return;
  }
  setLoader(loader, true);

  return (source: AnonymousSubject<any>) => {
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
    options: { 'همینجوری هی گزینه تست اینجا ست': 3, 'ناینم یکه کزینه دست تیسد گه': 0 },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 1,
    final_option: 'o1',
    creator: 'vahid'
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: { 'همینجوری هی گزینه تست اینجا ست': 3, 'ناینم یکه کزینه دست تیسد گه': 0 },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 0,
    creator: 'vahid'
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: { 'همینجوری هی گزینه تست اینجا ست': 3, 'ناینم یکه کزینه دست تیسد گه': 0 },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 1,
    final_option: 'o1',
    creator: 'vahid'
  },
  {
    id: 'test',
    title: 'نظرسنجی تست',
    options: { 'همینجوری هی گزینه تست اینجا ست': 3, 'ناینم یکه کزینه دست تیسد گه': 0 },
    username: 'vahid',
    description: 'توضیحات نسین صثمن بمثنص تصمثنبت ثصم نتبصثمن تثصنمب ت',
    status: 0,
    creator: 'vahid'
  }
];

export const API_BASE = 'http://172.30.49.86:8100/api/v1/polling';
