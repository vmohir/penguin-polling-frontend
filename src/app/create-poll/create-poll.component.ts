import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { FormService } from '@app/core/form.service';
import { PollsService, reqPipe } from '@app/core/polls.service';
import { LoaderDirective } from '@app/directives/loader/loader.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  pollOptions: FormArray;
  pollParticipants: FormArray;
  pollForm: FormGroup;
  private buildPollForm() {
    this.pollOptions = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollParticipants = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollForm = this.formBuilder.group({
      title: [, [Validators.required]],
      description: [],
      options: this.pollOptions,
      participants: this.pollParticipants
    });
  }
  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private pollService: PollsService,
    private router: Router
  ) {
    this.buildPollForm();
  }
  ngOnInit() {}

  @ViewChild('submitLoader') submitLoader: LoaderDirective;
  submitPollForm() {
    if (!this.formService.validateForm(this.pollForm)) return;
    this.pollService
      .submitPoll(this.pollForm.value)
      .pipe(reqPipe(this.submitLoader))
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  private addParticipantToFormArray(username: string) {
    this.pollParticipants.push(this.formBuilder.control(username, [Validators.required]));
  }
  private addOptionToFormArray(option: string) {
    this.pollOptions.push(this.formBuilder.control(option, [Validators.required]));
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addParticipant(event: MatChipInputEvent): void {
    const value = this.extractValues(event);

    if ((value || '').trim()) {
      this.addParticipantToFormArray(value);
    }
  }

  addOption(event: MatChipInputEvent): void {
    const value = this.extractValues(event);

    if ((value || '').trim()) {
      this.addOptionToFormArray(value);
    }
  }

  private extractValues(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if (input) {
      input.value = '';
    }
    return value;
  }

  removeParticipant(index: number): void {
    this.pollParticipants.removeAt(index);
  }
  removeOption(index: number): void {
    this.pollOptions.removeAt(index);
  }
}
