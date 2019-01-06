import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatRadioChange } from '@angular/material';
import { FormService } from '@app/core/form.service';
import { PollsService, reqPipe, SATURDAY } from '@app/core/polls.service';
import { LoaderDirective } from '@app/directives/loader/loader.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  weekdays = [
    { value: 0, name: 'شنبه' },
    { value: 1, name: 'یک‌شنبه' },
    { value: 2, name: 'دوشنبه' },
    { value: 3, name: 'سه‌شنبه' },
    { value: 4, name: 'چهارشنبه' },
    { value: 5, name: 'پنج‌شنبه' },
    { value: 6, name: 'جمعه' }
  ];
  pollNormalOptions: FormArray;
  pollParticipants: FormArray;
  pollForm: FormGroup;
  pollWeeklyOptions: FormArray;
  private buildNormalPollForm() {
    this.pollNormalOptions = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollWeeklyOptions = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollParticipants = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollForm = this.formBuilder.group({
      title: [, [Validators.required]],
      description: [],
      options: this.pollNormalOptions,
      participants: this.pollParticipants,
      is_normal: [true],
      message: ['']
    });
    this.addWeeklyOption();
    this.pollForm.get('is_normal').valueChanges.subscribe(data => {
      if (data) this.pollForm.setControl('options', this.pollNormalOptions);
      else this.pollForm.setControl('options', this.pollWeeklyOptions);
    });
  }
  get formHasNormalOptions(): boolean {
    return this.pollForm.get('is_normal').value;
  }

  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private pollService: PollsService,
    private router: Router
  ) {
    this.buildNormalPollForm();
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
  private addNormalOptionToFormArray(option: string) {
    this.pollNormalOptions.push(this.formBuilder.control(option, [Validators.required]));
  }
  private addWeeklyOptionToFormArray(weekday: number, startTime: string, endTime: string) {
    this.pollWeeklyOptions.push(
      this.formBuilder.group({
        weekday: [weekday, Validators.required],
        start_time: [startTime, [Validators.required, Validators.pattern(/^\d\d:\d\d$/)]],
        end_time: [endTime, [Validators.required, Validators.pattern(/^\d\d:\d\d$/)]]
      })
    );
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  addParticipant(event: MatChipInputEvent): void {
    const value = this.chipsInputExtractValues(event);

    if ((value || '').trim()) {
      this.addParticipantToFormArray(value);
    }
  }

  addNormalOption(event: MatChipInputEvent): void {
    const value = this.chipsInputExtractValues(event);

    if ((value || '').trim()) {
      this.addNormalOptionToFormArray(value);
    }
  }
  addWeeklyOption() {
    this.addWeeklyOptionToFormArray(SATURDAY, '14:00', '15:00');
  }

  private chipsInputExtractValues(event: MatChipInputEvent) {
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
  removeNormalOption(index: number): void {
    this.pollNormalOptions.removeAt(index);
  }
  removeWeeklyOption(index: number): void {
    this.pollWeeklyOptions.removeAt(index);
  }
}
