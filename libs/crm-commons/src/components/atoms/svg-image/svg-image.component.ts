import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ISvgImageProps } from './svg-image.interface';
import { getSvgImage } from './svg-images';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'crm-svg-image',
  templateUrl: './svg-image.component.html',
  styleUrls: ['./svg-image.component.scss'],
})
export class SvgImageComponent implements OnInit, OnChanges {
  @Input() name = 'crm-user';
  @Input() width: string;
  @Input() height: string;
  propsImage: ISvgImageProps;
  svgImage: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  ngOnChanges() {
    this.setProps();
    const svgText: string = getSvgImage(this.propsImage);
    this.svgImage = this.sanitizer.bypassSecurityTrustHtml(svgText);
  }

  setProps() {
    this.propsImage = {
      name: this.name,
      width: this.width,
      height: this.height,
    };
  }
}
