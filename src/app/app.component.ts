import { Component } from '@angular/core';
import { LocalStorageService } from './classes/local-storage';
import { FormControl, Validators } from '@angular/forms';
import { PollsService } from './core/polls.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  LS = new LocalStorageService('app');
  username = new FormControl(null, [Validators.required]);

  get hasUsername(): boolean {
    const username = this.LS.get('username');
    return username && username !== '';
  }
  constructor(private pollService: PollsService) {
    this.initialiseUsername();
  }
  private initialiseUsername() {
    if (this.hasUsername) {
      this.username.setValue(this.LS.get('username'));
      this.onUsernameSubmit();
    }
  }
  onUsernameSubmit() {
    this.LS.set('username', this.username.value);
    this.pollService.setUsername(this.username.value);
  }
}
