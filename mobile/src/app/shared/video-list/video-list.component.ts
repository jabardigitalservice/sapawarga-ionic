import { Component, OnInit } from '@angular/core';
import { VideoPostService } from '../../services/video-post.service';
import { VideoPost } from 'src/app/interfaces/video-post';
import { Dictionary } from '../../helpers/dictionary';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  sliderConfigVideoPost = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    zoom: false
  };

  isLoading = {
    humas: false,
    news: false,
    videoPost: false
  };

  dataVideoPost: VideoPost[];
  VIDEO_POST = 'video-post';
  constructor(
    private videoPostService: VideoPostService,
    private youtube: YoutubeVideoPlayer
  ) {}

  ngOnInit() {
    this.getVideoPost();
  }

  getVideoPost() {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.videoPostService.getLocal(this.VIDEO_POST)) {
        this.dataVideoPost = JSON.parse(
          this.videoPostService.getLocal(this.VIDEO_POST)
        );
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    this.isLoading.videoPost = true;
    this.videoPostService.getListvideoPost('limit=5').subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          this.dataVideoPost = res['data']['items'];
          // save to local
          this.videoPostService.saveLocal(this.VIDEO_POST, this.dataVideoPost);
          this.isLoading.videoPost = false;
        }
      },
      err => {
        setTimeout(() => {
          // get local
          if (this.videoPostService.getLocal(this.VIDEO_POST)) {
            this.dataVideoPost = JSON.parse(
              this.videoPostService.getLocal(this.VIDEO_POST)
            );
            this.isLoading.videoPost = false;
          }
        }, 3000);
      }
    );
  }

  private parsingDataUrl(id: string) {
    return id.split('=')[1];
  }

  getThumbUrl(url: string) {
    return `https://img.youtube.com/vi/${this.parsingDataUrl(
      url
    )}/maxresdefault.jpg`;
  }

  openYoutube(url: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.youtube.openVideo(this.parsingDataUrl(url));
  }
}
