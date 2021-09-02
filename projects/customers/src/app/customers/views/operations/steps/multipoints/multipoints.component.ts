import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MultipointsPresenter } from './multipoints.presenter';
import { User, AuthService } from '@shell/app/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Channels, ErrorResponse } from '@claro/crm/commons';
import { IParameter } from '@customers/app/core';

@Component({
  selector: 'app-multipoints',
  templateUrl: './multipoints.component.html',
  styleUrls: ['./multipoints.component.scss'],
  providers: [MultipointsPresenter],
})
export class MultipointsComponent implements OnDestroy {
  @Input() error: ErrorResponse;
  @Input() channels: IParameter[];
  @Output() viewMultipoints = new EventEmitter<{}>();
  @Output() channelUpdate = new EventEmitter<string>();
  @Output() multipointsSelects = new EventEmitter<{}>();
  user: User;
  form: FormGroup;
  valid: boolean;
  selectChannel = null;
  selectPointSale = null;
  selectSellers = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    public presenter: MultipointsPresenter,
  ) {
    this.user = this.authService.getUser();
    this.form = this.fb.group({
      selectChannel: [null, [Validators.required]],
      selectPointSale: [null, [Validators.required]],
      selectSellers: [null, [Validators.required]],
    });
    this.valid = false;
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitIdentification();
    }
  }

  async submitIdentification() {
    this.error = null;
    this.viewMultipoints.emit(false);
    this.multipointsSelects.emit(this.form.value);
    this.channelUpdate.emit(this.form.value.selectChannel.value);
  }

  ngOnDestroy(): void {
    this.form.reset();
  }

  changeChannel(event: IParameter) {
    this.selectChannel = event;
    this.selectPointSale = null;
    this.selectSellers = null;
    this.valid = false;
    this.presenter.sellers$ = null;
    this.presenter.getPointsSale(event.value, this.user);
  }

  changePointSale(event: IParameter) {
    this.selectPointSale = event;
    this.selectSellers = null;
    this.valid = false;
    this.presenter.getSellers({
      code: event.value,
    });
    this.presenter.setSelectedOffice(event.value);
  }

  changeSeller() {
    this.valid = true;
  }
}
