import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollsListComponent } from './polls-list/polls-list.component';
import { PollSinglePageComponent } from './poll-single-page/poll-single-page.component';
import { CreatePollComponent } from './create-poll/create-poll.component';

const routes: Routes = [
  { path: 'poll/:id', component: PollSinglePageComponent },
  { path: 'new', component: CreatePollComponent },
  { path: '', component: PollsListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
