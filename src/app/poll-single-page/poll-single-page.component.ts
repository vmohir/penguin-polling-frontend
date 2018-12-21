import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollsService, PollDetails, PollOption, reqPipe } from '@app/core/polls.service';

@Component({
  selector: 'app-poll-single-page',
  templateUrl: './poll-single-page.component.html',
  styleUrls: ['./poll-single-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PollSinglePageComponent implements OnInit {
  pollId: string;
  poll: PollDetails;
  constructor(private route: ActivatedRoute, private pollService: PollsService) {}
  ngOnInit() {
    this.pollId = this.route.snapshot.params.id;
    this.getPoll();
  }

  @ViewChild('pollLoader') pollLoader;
  getPoll() {
    this.pollService
      .getPollDetails(this.pollId)
      .pipe(reqPipe(this.pollLoader))
      .subscribe(data => {
        this.poll = data;
      });
  }

  trackByFnOptions(index: number, option: PollOption) {
    return index;
  }

  @ViewChild('voteLoader') voteLoader;
  vote() {
    this.pollService
      .vote(this.poll.options)
      .pipe(reqPipe(this.voteLoader))
      .subscribe(data => {});
  }

  get isCreator(): boolean {
    return this.poll && !!this.poll.creator;
  }

  @ViewChild('finalizeLoader') finalizeLoader;
  finalize() {
    this.pollService
      .vote(this.poll.options)
      .pipe(reqPipe(this.finalizeLoader))
      .subscribe(data => {});
  }
}
