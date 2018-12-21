import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule, MatTooltipModule, MatFormFieldModule, MatChipsModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PollItemComponent } from './poll-item/poll-item.component';
import { PollSinglePageComponent } from './poll-single-page/poll-single-page.component';
import { PollsListComponent } from './polls-list/polls-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { LoaderModule } from './directives/loader/loader.module';

@NgModule({
  declarations: [AppComponent, PollsListComponent, PollItemComponent, PollSinglePageComponent, CreatePollComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
