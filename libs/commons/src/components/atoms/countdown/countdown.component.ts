import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'claro-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {
  @Input() time: string;
  @Output() completed = new EventEmitter<{}>();
  text: string;
  duration: number;
  countDownTimer: any;

  ngOnInit() {
    this.duration = Number(this.time);
    this.start();
  }

  ngOnDestroy() {
    clearInterval(this.countDownTimer);
  }

  start() {
    let timer = this.duration;
    let minutes: number;
    let seconds: number;
    let minutesText: string;
    let secondsText: string;
    this.countDownTimer = setInterval(() => {
      minutes = parseInt(String(timer / 60), 10);
      seconds = parseInt(String(timer % 60), 10);
      minutesText = (minutes < 10 ? '0' : '') + minutes;
      secondsText = (seconds < 10 ? '0' : '') + seconds;
      this.text = minutesText + ':' + secondsText;
      if (--timer < 0) {
        clearInterval(this.countDownTimer);
        this.completed.emit();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.countDownTimer);
    this.text = '00:00';
  }
}
