import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollsService, PollDetails, PollOptions } from '@app/core/polls.service';

@Component({
  selector: 'app-poll-single-page',
  templateUrl: './poll-single-page.component.html',
  styleUrls: ['./poll-single-page.component.scss']
})
export class PollSinglePageComponent implements OnInit {
  pollId: any;
  poll: PollDetails;
  constructor(private route: ActivatedRoute, private pollService: PollsService) {}
  ngOnInit() {
    this.pollId = this.route.snapshot.params.id;
    this.getPoll();
  }
  getPoll() {
    this.pollService.getPollDetails(this.pollId).subscribe(data => (this.poll = data));
  }

  trackByFnOptions(index: number, option: PollOptions) {}
}
