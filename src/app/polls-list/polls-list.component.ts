import { Component, OnInit } from '@angular/core';
import { PollsService, PollDetails } from '@app/core/polls.service';

@Component({
  selector: 'app-polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.scss']
})
export class PollsListComponent implements OnInit {
  pollsList: PollDetails[];
  constructor(private pollService: PollsService) {}
  ngOnInit() {
    this.getPollsList();
  }
  getPollsList() {
    this.pollService.getPollsList().subscribe(data => {
      this.pollsList = data;
    });
  }

  trackByFnPolls(index: number, poll: PollDetails) {
    return poll.id;
  }
}
