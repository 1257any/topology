import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Props } from './props.model';

@Component({
  selector: 'app-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.scss']
})
export class PropsComponent implements OnInit, OnChanges {
  @Input() props: Props = { type: '' };
  @Output() ok = new EventEmitter<any>();
  @Input() readonly = false;

  iconStr = '';

  drowdown = 0;
  constructor() {}

  ngOnInit() {
    if (!this.props.data) {
      this.props.data = {
        dash: 0,
        lineWidth: 1,
        strokeStyle: '#555',
        fillStyle: '',
        globalAlpha: 1,
        rotate: 0,
        font: {
          color: '#333',
          fontFamily: '"Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial',
          fontSize: 12,
          lineHeight: 1.5,
          textAlign: 'center',
          textBaseline: 'middle'
        }
      };
    }

    if (this.props.data.icon) {
      this.iconStr = this.unicodeToStr(this.props.data.icon);
    }
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['props']) {
      this.ngOnInit();
    }
  }

  getBackground(color: string) {
    return {
      'background-color': color
    };
  }

  onSubmitProps(invalid?: boolean) {
    if (invalid) {
      return;
    }

    if (this.iconStr) {
      this.props.data.icon = this.StrToUnicode(this.iconStr);
    }
    this.ok.emit(this.props);
  }

  onClickDash(dash: number) {
    this.props.data.dash = dash;
    this.drowdown = 0;
    this.onSubmitProps();
  }

  onClickFromArrow(arrow: string) {
    this.props.data.fromArrow = arrow;
    this.drowdown = 0;
    this.onSubmitProps();
  }

  onClickToArrow(arrow: string) {
    this.props.data.toArrow = arrow;
    this.drowdown = 0;
    this.onSubmitProps();
  }

  unicodeToStr(unicode: string) {
    const res = [];
    for (let i = 0; i < unicode.length; i++) {
      res[i] = ('00' + unicode.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + res.join('\\u');
  }

  StrToUnicode(str: string) {
    return unescape(str.replace(/\\/g, '%'));
  }
}
