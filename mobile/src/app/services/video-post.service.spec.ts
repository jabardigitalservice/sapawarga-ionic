import { TestBed } from '@angular/core/testing';

import { VideoPostService } from './video-post.service';

describe('VideoPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoPostService = TestBed.get(VideoPostService);
    expect(service).toBeTruthy();
  });
});
