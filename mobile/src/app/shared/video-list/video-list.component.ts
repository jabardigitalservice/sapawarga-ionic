import { Component, OnInit, ViewChild } from '@angular/core';
import { Dictionary } from 'src/app/helpers/dictionary';
import { VideoPost } from '../../interfaces/video-post';
import { VideoPostService } from '../../services/video-post.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../interfaces/profile';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Constants } from '../../helpers/constants';
import { UtilitiesService } from '../../services/utilities.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  dataVideoPost: VideoPost[];
  dataVideoPostKabkota: VideoPost[];
  data_profile: Profile;

  sliderConfigVideoPost = {
    slidesPerView: 1.2,
    spaceBetween: 5,
    zoom: false
  };

  isLoading = {
    videoPost: false,
    videoPostKabkota: false
  };

  msgResponse = {
    type: '',
    msg: ''
  };

  VIDEO_POST = 'video-post';
  VIDEO_POST_KABKOTA = 'video-post-kabkota';
  constructor(
    private videoPostService: VideoPostService,
    private profileService: ProfileService,
    private constants: Constants,
    private youtube: YoutubeVideoPlayer,
    private util: UtilitiesService
  ) {}

  ngOnInit() {
    // get video list jabar
    this.getVideoPost();

    // get video list kab/kota
    // get data user using BehaviorSubject
    this.profileService.currentUser.subscribe((state: Profile) => {
      this.data_profile = state;
      this.getVideoPost(this.data_profile.kabkota_id);
    });
  }

  getVideoPost(idkabkota?: number) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (idkabkota) {
      this.isLoading.videoPostKabkota = true;
    } else {
      this.isLoading.videoPost = true;
    }

    this.videoPostService.getListvideoPost(5, idkabkota).subscribe(
      res => {
        if (res['status'] === 200 && res['data']['items'].length) {
          if (idkabkota) {
            this.dataVideoPostKabkota = res['data']['items'];
            this.isLoading.videoPostKabkota = false;
          } else {
            this.dataVideoPost = res['data']['items'];
            this.isLoading.videoPost = false;
          }
        } else {
          if (idkabkota) {
            this.dataVideoPostKabkota = null;
          } else {
            this.dataVideoPost = null;
          }
        }
      },
      err => {
        if (err.name === 'TimeoutError') {
          this.msgResponse = {
            type: 'offline',
            msg: Dictionary.offline
          };
        } else {
          this.msgResponse = {
            type: 'server-error',
            msg: Dictionary.internalError
          };
        }

        if (idkabkota) {
          this.isLoading.videoPostKabkota = false;
        } else {
          this.isLoading.videoPost = false;
        }
      }
    );
  }

  private parsingDataUrl(id: string) {
    return id.split('=')[1];
  }

  getThumbUrl(url: string) {
    return `https://img.youtube.com/vi/${this.parsingDataUrl(
      url
    )}/mqdefault.jpg`;
  }

  openYoutube(url: string, title?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }
    this.youtube.openVideo(this.parsingDataUrl(url));

    // google event analytics
    this.util.trackEvent(
      this.constants.pageName.videoList,
      'view_detail_videos',
      title,
      1
    );

    this.util.trackEvent(
      this.constants.pageName.home_pages,
      'tapped_videos',
      title,
      1
    );
  }

  swipeSlide(name: string) {
    const action = 'swipe_videos';

    this.slides.getActiveIndex().then(_ => {
      // google event analytics
      this.util.trackEvent(this.constants.pageName.home_pages, action, '', 1);
    });
  }
}
