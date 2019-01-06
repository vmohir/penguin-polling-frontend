import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollsService, PollDetails, PollOption, reqPipe, YES, NO, MAYBE, OptionComment } from '@app/core/polls.service';
import { MatRadioChange } from '@angular/material';
import { LoaderDirective } from '@app/directives/loader/loader.directive';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-poll-single-page',
  templateUrl: './poll-single-page.component.html',
  styleUrls: ['./poll-single-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PollSinglePageComponent implements OnInit {
  pollId: string;
  poll: PollDetails;
  editPollForm = this.formBuilder.group({
    message: ['']
  });
  isEditingPoll: boolean = false;
  commentForm = this.formBuilder.group({ message: ['', [Validators.required]], parent_id: [0, [Validators.required]] });
  constructor(
    private route: ActivatedRoute,
    private pollService: PollsService,
    private formBuilder: FormBuilder,
    private notif: NotificationsService
  ) {}
  ngOnInit() {
    this.pollId = this.route.snapshot.params.id;
    this.getPoll();
  }

  @ViewChild('pollLoader') pollLoader;
  getPoll() {
    this.pollService
      .getPollDetails(this.pollId)
      .pipe(reqPipe(this.pollLoader))
      .subscribe(data => {
        this.poll = data;
        this.poll.options.forEach(o => {
          if (this.poll.status === 1 && this.isFinalOption(o)) {
            this.selectedPoll = o.id;
          }
        });
      });
  }

  trackByFnOptions(index: number, option: PollOption) {
    return index;
  }

  @ViewChild('voteLoader') voteLoader?: LoaderDirective;
  vote() {
    this.pollService
      .vote(this.poll.id, this.poll.options)
      .pipe(reqPipe(this.voteLoader))
      .subscribe(
        data => {
          this.notif.success('رای شما ثبت شد');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 409 && error.error === 'overlap, You have voted for another poll for this time') {
            this.notif.error('گزینه‌های انتخابی شما با گزینه‌ی دیگری در نظرسنجی دیگری از نظر زمانی تلاقی دارد');
          }
        }
      );
  }

  get isCreator(): boolean {
    return this.poll && this.poll.creator === this.pollService.getUsername();
  }
  get final_option(): string {
    return this.poll && this.poll.final_option;
  }
  isFinalOption(option: PollOption): boolean {
    return this.poll && this.poll.final_option === option.value;
  }

  selectedPoll: number;

  @ViewChild('finalizeLoader') finalizeLoader?: LoaderDirective;
  finalize() {
    this.pollService
      .finalize(this.poll.id, this.selectedPoll)
      .pipe(reqPipe(this.finalizeLoader))
      .subscribe(data => {
        this.getPoll();
        this.notif.success('انجام شد');
      });
  }

  // finalOptionChange(event: MatRadioChange) {
  //   this.selectedPoll = event.value;
  // }

  chooseOptionYes(option: PollOption) {
    if (this.final_option) return;
    if (option.checked === YES) {
      option.yes -= 1;
      option.checked = NO;
    } else if (option.checked === NO) {
      option.yes += 1;
      option.checked = YES;
    } else if (option.checked === MAYBE) {
      option.yes += 1;
      option.maybe -= 1;
      option.checked = YES;
    }
  }
  chooseOptionMaybe(option: PollOption) {
    if (this.final_option) return;
    if (option.checked === MAYBE) {
      option.maybe -= 1;
      option.checked = NO;
    } else if (option.checked === NO) {
      option.maybe += 1;
      option.checked = MAYBE;
    } else if (option.checked === YES) {
      option.maybe += 1;
      option.yes -= 1;
      option.checked = MAYBE;
    }
  }

  isOptionMaybe(option: PollOption): boolean {
    return option.checked === MAYBE;
  }
  isOptionYes(option: PollOption): boolean {
    return option.checked === YES;
  }

  viewComments(option: PollOption) {
    this.pollService.getOptionComments(this.poll.id, option.id).subscribe(data => {
      option.comments = data;
    });
  }
  toggleComments(option: PollOption) {
    if (option.comments) option.comments = undefined;
    else this.viewComments(option);
  }

  @ViewChild('editLoader') editLoader?: LoaderDirective;
  submitEditPoll() {
    this.pollService
      .editPoll(this.poll.id, this.editPollForm.value)
      .pipe(reqPipe(this.editLoader))
      .subscribe(data => {
        this.getPoll();
      });
  }

  enableEdit() {
    this.isEditingPoll = true;
  }

  submitComment(option: PollOption) {
    this.pollService.commentOption(this.poll.id, option.id, this.commentForm.value).subscribe(
      data => {
        this.commentForm.reset();
        this.commentForm.get('parent_id').setValue(0);
        this.viewComments(option);
      },
      error => {
        this.notif.error('مشکلی در ارسال نظر پیش آمد، دوباره امتحان کنید');
      }
    );
  }

  isReplyingTo?: OptionComment;
  replyComment(option: PollOption, comment: OptionComment) {
    this.commentForm.get('parent_id').setValue(comment.id);
    this.isReplyingTo = comment;
  }
  cancelReply(option: PollOption) {
    this.isReplyingTo = undefined;
    this.commentForm.get('parent_id').setValue(0);
  }

  getOptionComments(option: PollOption, comment?: OptionComment) {
    if (comment) return option.comments.filter(c => c.parent === comment.id);
    return option.comments.filter(c => c.parent == undefined);
  }
}
