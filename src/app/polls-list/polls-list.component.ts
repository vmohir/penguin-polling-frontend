import { Component, OnInit, ViewChild } from '@angular/core';
import { PollsService, PollDetails, reqPipe } from '@app/core/polls.service';

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

  @ViewChild('pollsListLoading') pollsListLoading;
  getPollsList() {
    this.pollService
      .getPollsList()
      .pipe(reqPipe(this.pollsListLoading))
      .subscribe(data => {
        this.pollsList = data;
      });
  }

  trackByFnPolls(index: number, poll: PollDetails) {
    return poll.id;
  }
  get emptyPolls(): boolean {
    return !this.pollsListLoading.is && (!this.pollsList || this.pollsList.length === 0);
  }
}
