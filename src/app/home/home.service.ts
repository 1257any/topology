import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/http/http.service';

@Injectable()
export class HomeService {
  constructor(protected http: HttpService) {}

  async Upload(blob: any) {
    const form = new FormData();
    form.append('file', blob);
    const ret = await this.http.Form('/api/file', form);
    if (ret.error) {
      return null;
    }

    return ret;
  }

  async Save(data: any) {
    let ret: any;
    if (!data.desc) {
      data.desc = `Created at ${new Date().toLocaleString()}.`;
    }
    if (data._id) {
      ret = await this.http.Put('/api/user/topology', data);
    } else {
      ret = await this.http.Post('/api/user/topology', data);
    }

    if (ret.error) {
      return null;
    }

    return ret;
  }
}
