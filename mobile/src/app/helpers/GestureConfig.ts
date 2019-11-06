import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class GestureConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const gestureEvent = new (<any>window).Hammer(element);

    for (const eventName in this.overrides) {
      if (eventName) {
        gestureEvent.get(eventName).set(this.overrides[eventName]);
      }
    }

    return gestureEvent;
  }
}
