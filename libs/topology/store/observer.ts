import { observers } from './data';

export class Observer {
  id: string;
  key = '';
  fn: (data: any) => void;
  constructor(id: string, key: string, fn: (data: any) => void) {
    this.id = id;
    this.key = key;
    this.fn = fn;
  }

  unsubcribe() {
    delete observers[this.id];
  }
}
