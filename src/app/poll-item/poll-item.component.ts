import { Component, OnInit, Input } from '@angular/core';
import { PollDetails, PollsService } from '@app/core/polls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-item',
  templateUrl: './poll-item.component.html',
  styleUrls: ['./poll-item.component.scss']
})
export class PollItemComponent implements OnInit {
  @Input() poll: PollDetails;
  constructor(private pollService: PollsService, private router: Router) {}

  ngOnInit() {}
  openPoll() {
    this.router.navigate([`/poll/${this.poll.id}`]);
  }
}
