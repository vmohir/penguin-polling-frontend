import { Component } from '@angular/core';
import { LocalStorageService } from './classes/local-storage';
import { FormControl, Validators } from '@angular/forms';

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
  constructor() {
    this.initialiseUsername();
  }
  private initialiseUsername() {
    if (this.hasUsername) this.username.setValue(this.LS.get('username'));
  }
  onUsernameSubmit() {
    this.LS.set('username', this.username.value);
    console.log('​AppComponent -> onUsernameSubmit -> this.username', this.username, this.LS.get('username'));
  }
}
