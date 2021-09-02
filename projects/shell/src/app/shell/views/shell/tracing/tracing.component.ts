import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageBus } from '@claro/commons/message-bus';

@Component({
  selector: 'app-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss'],
})
export class TracingComponent implements OnInit, OnDestroy {
  private messageBus$ = new Subscription();
  UUID: string;

  constructor(private clipboard: Clipboard, private messageBus: MessageBus) {}

  ngOnInit() {
    this.messageBus$ = this.messageBus
      .on$('shellChannel', 'UUID')
      .subscribe(uuid => {
        this.UUID = uuid;
      });
  }

  copyClipboard() {
    this.clipboard.copy(this.UUID);
    // navigator.clipboard
    //   .writeText(uuid)
    //   .then()
    //   .catch(e => {
    //     document.addEventListener('copy', (e: ClipboardEvent) => {
    //       if (e.clipboardData) {
    //         e.clipboardData.setData('text/plain', uuid);
    //       }
    //       e.preventDefault();
    //       document.removeEventListener('copy', null);
    //     });
    //     document.execCommand('copy');
    //   });
  }

  ngOnDestroy() {
    this.messageBus$.unsubscribe();
  }
}
