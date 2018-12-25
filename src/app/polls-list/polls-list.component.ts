import { Component, OnInit, ViewChild } from '@angular/core';
import { PollsService, PollDetails, reqPipe } from '@app/core/polls.service';
import { LoaderDirective } from '@app/directives/loader/loader.directive';

@Component({
  selector: 'app-polls-list',
  templateUrl: './polls-list.component.html',
  styleUrls: ['./polls-list.component.scss']
})
export class PollsListComponent implements OnInit {
  createdPolls: PollDetails[] = [];
  participatedPolls: PollDetails[] = [];
  constructor(private pollService: PollsService) {}
  ngOnInit() {
    this.getPollsList();
  }

  @ViewChild('pollsListLoading') pollsListLoading: LoaderDirective;
  getPollsList() {
    this.getCreatedPolls();
    this.getParticipatedPolls();
  }
  private getParticipatedPolls() {
    this.pollService
      .getParticipatedPolls()
      .pipe(reqPipe(this.pollsListLoading))
      .subscribe(data => {
        this.participatedPolls = data;
      });
  }

  private getCreatedPolls() {
    this.pollService
      .getCreatedPollsList()
      .pipe(reqPipe(this.pollsListLoading))
      .subscribe(data => {
        console.log('​PollsListComponent -> privategetCreatedPolls -> data', data);
        this.createdPolls = data;
      });
  }

  trackByFnPolls(index: number, poll: PollDetails) {
    return poll.id;
  }
  get emptyPolls(): boolean {
    console.log('​PollsListComponent -> constructor -> this.pollsListLoading', this.pollsListLoading);
    console.log('​PollsListComponent -> constructor -> this.createdPolls', this.createdPolls);
    console.log('​PollsListComponent -> constructor -> this.createdPolls', this.participatedPolls);
    return (
      !this.pollsListLoading.is &&
      (!this.createdPolls || this.createdPolls.length === 0) &&
      (!this.participatedPolls || this.participatedPolls.length === 0)
    );
  }
}
