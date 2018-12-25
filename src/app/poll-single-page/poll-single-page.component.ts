import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollsService, PollDetails, PollOption, reqPipe } from '@app/core/polls.service';
import { MatRadioChange } from '@angular/material';

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
        // this.poll.options.forEach(o => {
        //   if (this.isFinalOption(o)) o.checked = true;
        // });
      });
  }

  trackByFnOptions(index: number, option: PollOption) {
    return index;
  }

  @ViewChild('voteLoader') voteLoader;
  vote() {
    this.pollService
      .vote(this.poll.id, this.poll.options)
      .pipe(reqPipe(this.voteLoader))
      .subscribe(data => {});
  }

  get isCreator(): boolean {
    return this.poll && this.poll.creator === this.pollService.getUsername();
  }
  get final_option(): string {
    return this.poll && this.poll.final_option;
  }
  isFinalOption(option: PollOption): boolean {
    return this.poll && this.poll.final_option === option.name;
  }

  selectedPoll: string;

  @ViewChild('finalizeLoader') finalizeLoader;
  finalize() {
    this.pollService
      .finalize(this.poll.id, this.selectedPoll)
      .pipe(reqPipe(this.finalizeLoader))
      .subscribe(data => {});
  }

  finalOptionChange(event: MatRadioChange) {
    this.selectedPoll = event.value;
  }
}
