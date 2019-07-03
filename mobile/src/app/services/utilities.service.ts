import { Injectable } from '@angular/core';

// plugin moment js
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor() {}

  timeAgo(value: number) {
    moment.locale('id');
    return moment(value).fromNow();
  }
}
