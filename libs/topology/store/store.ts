import { data, observers } from './data';
import { Observer } from './observer';
import { s8 } from '../uuid/uuid';

export class Store {
  static get(key?: string) {
    if (!key && key === undefined) {
      return data;
    }

    const props = key.split('.');
    let val = data;
    for (const prop of props) {
      val = val[prop];
      if (val === undefined) {
        return undefined;
      }
    }

    return val;
  }

  static set(key: string, value: any) {
    const props = key.split('.');
    let val = data;
    for (let i = 0; i < props.length - 1; ++i) {
      if (!val[props[i]]) {
        val[props[i]] = {};
      }
      val = val[props[i]];
    }
    val[props[props.length - 1]] = value;

    // tslint:disable-next-line:forin
    for (const id in observers) {
      if (key === observers[id].key) {
        observers[id].fn(value);
      } else if (key.indexOf(observers[id].key) === 0) {
        observers[id].fn(Store.get(observers[id].key));
      }
    }
  }

  static updated(key: string) {
    for (const id in observers) {
      if (key.indexOf(observers[id].key) === 0) {
        observers[id].fn(Store.get(observers[id].key));
      }
    }
  }

  static subcribe(key: string, fn: (data: any) => void) {
    const id = s8();
    const observer = new Observer(id, key, fn);
    observers[id] = observer;

    fn(Store.get(key));

    return observer;
  }
}
