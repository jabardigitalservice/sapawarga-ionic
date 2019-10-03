import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Dictionary } from 'src/app/helpers/dictionary';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Platform, IonSlides } from '@ionic/angular';
import { HumasJabar } from 'src/app/interfaces/humas-jabar';
import { Constants } from 'src/app/helpers/constants';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-humas-jabar',
  templateUrl: './humas-jabar.component.html',
  styleUrls: ['./humas-jabar.component.scss']
})
export class HumasJabarComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  dataHumas: HumasJabar[];

  sliderConfigHumas = {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 10,
    zoom: false
  };

  isLoading = {
    humas: false
  };

  humas_URL = 'http://humas.jabarprov.go.id/terkini';

  // name local storage
  HUMAS = 'humas-headlines';
  constructor(
    private newsService: NewsService,
    private util: UtilitiesService,
    private platform: Platform,
    private constants: Constants,
    private inAppBrowser: InAppBrowser
  ) {}

  ngOnInit() {
    // get data humas
    this.getDataHumas();
  }

  getDataHumas() {
    // check internet
    if (!navigator.onLine) {
      // get local
      if (this.newsService.getLocal(this.HUMAS)) {
        this.dataHumas = JSON.parse(this.newsService.getLocal(this.HUMAS));
      } else {
        alert(Dictionary.offline);
      }
      return;
    }

    this.isLoading.humas = true;
    this.newsService
      .getDataNativeHttp()
      .then(res => {
        if (res) {
          const respon = JSON.parse(res.data);
          this.dataHumas = Object.values(respon);
          // save to local
          this.newsService.saveLocal(this.HUMAS, this.dataHumas);
          this.isLoading.humas = false;
        }
      })
      .catch(err => {
        // get local
        if (this.newsService.getLocal(this.HUMAS)) {
          this.dataHumas = JSON.parse(this.newsService.getLocal(this.HUMAS));
          this.isLoading.humas = false;
        }
      });
  }

  goTohumas(url: string, type?: string) {
    // check internet
    if (!navigator.onLine) {
      alert(Dictionary.offline);
      return;
    }

    if (this.isLoading.humas) {
      alert(Dictionary.terjadi_kesalahan);
      return;
    }

    this.launchweb(url);

    if (type) {
      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.humas,
        'view_list_humas_jabar',
        '',
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_view_all_humas_jabar',
        '',
        1
      );
    } else {
      // get title humas
      const getTitle = this.dataHumas.find(x => x.slug === url).post_title;

      // google event analytics
      this.util.trackEvent(
        this.constants.pageName.humas,
        'view_detail_humas_jabar',
        getTitle,
        1
      );

      this.util.trackEvent(
        this.constants.pageName.home_pages,
        'tapped_humas_jabar',
        getTitle,
        1
      );
    }
  }

  // open browser in app
  private launchweb(webUrl: string) {
    // check if the platform is ios or android, else open the web url
    this.platform.ready().then(() => {
      const target = '_self';
      this.inAppBrowser.create(
        webUrl,
        target,
        this.constants.inAppBrowserOptions
      );
    });
  }

  swipeSlide() {
    const action = 'swipe_humas_jabar';

    this.slides.getActiveIndex().then(_ => {
      // google event analytics
      this.util.trackEvent(this.constants.pageName.home_pages, action, '', 1);
    });
  }
}
