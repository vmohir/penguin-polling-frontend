import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollsListComponent } from './polls-list/polls-list.component';
import { PollSinglePageComponent } from './poll-single-page/poll-single-page.component';

const routes: Routes = [{ path: '', component: PollsListComponent }, { path: 'poll/:id', component: PollSinglePageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
