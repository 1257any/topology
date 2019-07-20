import { Injectable } from '@angular/core';

import { HttpService } from 'src/app/http/http.service';

@Injectable()
export class AppService {
  constructor(protected http: HttpService) {}

  async Topologies(params: any) {
    const ret = await this.http.QueryString(params).Get('/api/topologies');
    if (ret.error) {
      return {
        list: [],
        count: 0
      };
    }

    return ret;
  }

  async UserTopologies(params: any) {
    const ret = await this.http.QueryString(params).Get('/api/user/topologies');
    if (ret.error) {
      return {
        list: [],
        count: 0
      };
    }

    return ret;
  }
}
