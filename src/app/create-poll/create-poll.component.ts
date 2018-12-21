import { Component, OnInit } from '@angular/core';
import { FormService } from '@app/core/form.service';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent implements OnInit {
  pollOptions: FormArray;
  pollForm: FormGroup;
  private buildPollForm() {
    this.pollOptions = this.formBuilder.array([], [Validators.required, Validators.minLength(1)]);
    this.pollForm = this.formBuilder.group({
      title: [, [Validators.required]],
      options: this.pollOptions
    });
  }
  constructor(private formService: FormService, private formBuilder: FormBuilder) {
    this.buildPollForm();
  }
  ngOnInit() {}
  submitPollForm() {
    if (!this.formService.validateForm(this.pollForm)) return;
  }
}
