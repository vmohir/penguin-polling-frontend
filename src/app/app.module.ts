import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatRadioModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { LoaderModule } from './directives/loader/loader.module';
import { PollItemComponent } from './poll-item/poll-item.component';
import { PollSinglePageComponent } from './poll-single-page/poll-single-page.component';
import { PollsListComponent } from './polls-list/polls-list.component';

@NgModule({
  declarations: [AppComponent, PollsListComponent, PollItemComponent, PollSinglePageComponent, CreatePollComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatChipsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoaderModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
