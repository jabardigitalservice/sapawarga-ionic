import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class RssFeedService {
  constructor(private http: HttpClient) {}

  getFeedContent(url: string): Observable<any> {
    return this.http
      .get(url, { responseType: 'text' })
      .pipe(map(this.extractFeeds));
  }

  /**
   * Converts the feed response to json
   *
   * @private
   * @param {any} response
   * @returns {Feed}
   * @memberof FeedService
   */
  private extractFeeds(response: any): any {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true
    });
    let feed;
    parser.parseString(response, function(err, result) {
      if (err) {
        console.warn(err);
      }
      feed = result;
    });

    return feed || {};
  }
}
