import { Component } from '@angular/core';
import { LocalStorageService } from './classes/local-storage';
import { FormControl, Validators } from '@angular/forms';
import { PollsService } from './core/polls.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  LS = new LocalStorageService('app');
  username = new FormControl(null, [Validators.required]);
  notifOptions = { timeOut: 3000 };

  get hasUsername(): boolean {
    const username = this.LS.get('username');
    return username && username !== '';
  }
  constructor(private pollService: PollsService, private router: Router) {
    this.initialiseUsername();
  }
  private initialiseUsername() {
    if (this.hasUsername) {
      this.username.setValue(this.LS.get('username'));
      this.onUsernameSubmit(false);
    }
  }
  onUsernameSubmit(redirect: boolean = true) {
    this.LS.set('username', this.username.value);
    this.pollService.setUsername(this.username.value);
    if (redirect) this.router.navigate(['/']);
  }

  onClickCreatePoll() {
    this.router.navigate(['/new']);
  }

  goHome() {
    this.router.navigate(['']);
  }
  logout() {
    this.username.reset();
    this.LS.clear();
  }
}
