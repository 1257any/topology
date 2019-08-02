import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Props } from './props.model';

@Component({
  selector: 'app-props',
  templateUrl: './props.component.html',
  styleUrls: ['./props.component.scss'],
  host: {
    '(document:click)': 'onclickDocument()'
  }
})
export class PropsComponent implements OnInit, OnChanges {
  @Input() props: Props = { type: '' };
  @Output() ok = new EventEmitter<any>();
  @Input() readonly = false;

  icon;
  drowdown = 0;

  textAlignOptions = {
    id: 'id',
    name: 'name',
    list: [
      {
        id: 'left',
        name: '左对齐'
      },
      {
        id: 'center',
        name: '居中'
      },
      {
        id: 'right',
        name: '右对齐'
      }
    ],
    noDefaultOption: true
  };

  textBaselineOptions = {
    id: 'id',
    name: 'name',
    list: [
      {
        id: 'top',
        name: '顶部对齐'
      },
      {
        id: 'middle',
        name: '居中'
      },
      {
        id: 'bottom',
        name: '底部对齐'
      }
    ],
    noDefaultOption: true
  };

  cpPresetColors = [
    '#1890ff',
    '#096dd9',
    '#bae7ff',
    '#52c41a',
    '#3fad09',
    '#c6ebb4',
    '#faad14',
    '#d9a116',
    '#fff6dd',
    '#f50000',
    '#ff0000',
    '#ffc2c5',
    '#fa541c',
    '#531dab',
    '#314659',
    '#777777'
  ];

  icons: any[] = [
    { "class": "topology-upload", "unicode": "59295" },
    { "class": "topology-download", "unicode": "59292" },
    { "class": "topology-analytics", "unicode": "59045" },
    { "class": "topology-stop1", "unicode": "58914" },
    { "class": "topology-stop", "unicode": "58905" },
    { "class": "topology-kefu", "unicode": "58968" },
    { "class": "topology-exit1", "unicode": "59051" },
    { "class": "topology-exit", "unicode": "58945" },
    { "class": "topology-enter", "unicode": "58941" },
    { "class": "topology-share", "unicode": "58912" },
    { "class": "topology-message", "unicode": "59177" },
    { "class": "topology-weibo", "unicode": "58942" },
    { "class": "topology-pay3", "unicode": "59025" },
    { "class": "topology-pay6", "unicode": "59023" },
    { "class": "topology-wechat", "unicode": "58950" },
    { "class": "topology-app", "unicode": "58904" },
    { "class": "topology-shoppingcart", "unicode": "58926" },
    { "class": "topology-people4geren", "unicode": "59018" },
    { "class": "topology-people2geren", "unicode": "58995" },
    { "class": "topology-people", "unicode": "58961" },
    { "class": "topology-jiankong", "unicode": "58910" },
    { "class": "topology-cpu", "unicode": "58911" },
    { "class": "topology-iot2", "unicode": "58903" },
    { "class": "topology-iot1", "unicode": "58897" },
    { "class": "topology-iot", "unicode": "58919" },
    { "class": "topology-success", "unicode": "59059" },
    { "class": "topology-error", "unicode": "59057" },
    { "class": "topology-warning", "unicode": "59049" },
    { "class": "topology-list", "unicode": "58896" },
    { "class": "topology-folder", "unicode": "59150" },
    { "class": "topology-document", "unicode": "59143" },
    { "class": "topology-kaiguan", "unicode": "59007" },
    { "class": "topology-search", "unicode": "58895" },
    { "class": "topology-streamSQL", "unicode": "59091" },
    { "class": "topology-record", "unicode": "58893" },
    { "class": "topology-streaming", "unicode": "59641" },
    { "class": "topology-data-stream", "unicode": "60371" },
    { "class": "topology-sync", "unicode": "58967" },
    { "class": "topology-settings", "unicode": "58964" },
    { "class": "topology-dashboard", "unicode": "58963" },
    { "class": "topology-umbrella", "unicode": "58955" },
    { "class": "topology-link", "unicode": "58938" },
    { "class": "topology-sound", "unicode": "58929" },
    { "class": "topology-map", "unicode": "58909" },
    { "class": "topology-house", "unicode": "58908" },
    { "class": "topology-185055paintingpalletstreamline", "unicode": "58907" },
    { "class": "topology-browser", "unicode": "58891" },
    { "class": "topology-remote-control", "unicode": "58887" },
    { "class": "topology-locked", "unicode": "59281" },
    { "class": "topology-unlocked", "unicode": "59515" },
    { "class": "topology-api2", "unicode": "59229" },
    { "class": "topology-api1", "unicode": "58883" },
    { "class": "topology-apiassembly", "unicode": "59005" },
    { "class": "topology-email", "unicode": "59004" },
    { "class": "topology-api", "unicode": "58902" },
    { "class": "topology-ks", "unicode": "59013" },
    { "class": "topology-golang", "unicode": "58901" },
    { "class": "topology-docker", "unicode": "59017" },
    { "class": "topology-python", "unicode": "58894" },
    { "class": "topology-html", "unicode": "58886" },
    { "class": "topology-safe", "unicode": "59175" },
    { "class": "topology-java", "unicode": "59206" },
    { "class": "topology-nodejs", "unicode": "59785" },
    { "class": "topology-cloud-code", "unicode": "59024" },
    { "class": "topology-rabbitmq", "unicode": "58906" },
    { "class": "topology-fuwuqi", "unicode": "58900" },
    { "class": "topology-kafka", "unicode": "58884" },
    { "class": "topology-rocketmq", "unicode": "59050" },
    { "class": "topology-cassandra", "unicode": "58913" },
    { "class": "topology-pgsql", "unicode": "59142" },
    { "class": "topology-mysql", "unicode": "58962" },
    { "class": "topology-sql", "unicode": "59160" },
    { "class": "topology-redis", "unicode": "59010" },
    { "class": "topology-hbase", "unicode": "59003" },
    { "class": "topology-MongoDB", "unicode": "59120" },
    { "class": "topology-data", "unicode": "58953" },
    { "class": "topology-data2", "unicode": "58892" },
    { "class": "topology-data3", "unicode": "58889" },
    { "class": "topology-data1", "unicode": "59233" },
    { "class": "topology-db", "unicode": "58949" },
    { "class": "topology-parallel", "unicode": "59208" },
    { "class": "topology-bub", "unicode": "60531" },
    { "class": "topology-zuoji", "unicode": "59022" },
    { "class": "topology-earch", "unicode": "58888" },
    { "class": "topology-cloud-server", "unicode": "58981" },
    { "class": "topology-cloud-firewall", "unicode": "58923" },
    { "class": "topology-firewall", "unicode": "58928" },
    { "class": "topology-printer", "unicode": "59006" },
    { "class": "topology-satelite2", "unicode": "60743" },
    { "class": "topology-satelite", "unicode": "60744" },
    { "class": "topology-router2", "unicode": "58899" },
    { "class": "topology-router", "unicode": "58898" },
    { "class": "topology-antenna3", "unicode": "59028" },
    { "class": "topology-antenna2", "unicode": "59001" },
    { "class": "topology-antenna", "unicode": "58882" },
    { "class": "topology-building", "unicode": "58881" },
    { "class": "topology-office", "unicode": "58885" },
    { "class": "topology-ipad", "unicode": "58980" },
    { "class": "topology-wifi", "unicode": "58935" },
    { "class": "topology-network", "unicode": "58939" },
    { "class": "topology-network1", "unicode": "58957" },
    { "class": "topology-home", "unicode": "59052" },
    { "class": "topology-cloud", "unicode": "58890" },
    { "class": "topology-mobile", "unicode": "58940" },
    { "class": "topology-pc", "unicode": "58880" }
  ];
  showIcons = false;

  constructor() {}

  ngOnInit() {
    if (!this.props.data) {
      this.props.data = {
        name: 'curve',
        dash: 0,
        lineWidth: 1,
        strokeStyle: '',
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
        },
        animateColor: '#52c41a',
        animateSpeed: 1
      };
    }

    if (this.props.data.icon) {
      if (this.icon) {
        this.icon.checked = false;
      }
      for (const item of this.icons) {
        if (String.fromCharCode(+item.unicode) === this.props.data.icon) {
          item.checked = true;
          this.icon = item;
          break;
        }
      }
    } else {
      this.icon = null;
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

    this.ok.emit(this.props);
  }

  onClickName(name: string) {
    this.props.data.name = name;
    this.drowdown = 0;
    this.onSubmitProps();
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

  onKeyText(key: KeyboardEvent, invalid: boolean) {
    switch (key.keyCode) {
      case 13:
        if (key.ctrlKey) {
          this.props.data.text += '\n';
        } else {
          key.preventDefault();
          this.onSubmitProps(invalid);
        }
        break;
    }
  }

  onclickDocument() {
    this.drowdown = 0;
  }

  onClickIcon(item?: any) {
    if (this.icon) {
      this.icon.checked = false;
    }

    if (item) {
      item.checked = true;
      this.props.data.iconFamily = 'topology';
      this.props.data.icon = String.fromCharCode(+item.unicode);
    } else {
      this.props.data.icon = '';
    }

    this.icon = item;
    this.ok.emit(this.props);
    this.showIcons = false;
  }
}
