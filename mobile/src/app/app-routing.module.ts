import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  {
    path: 'edit-profile',
    loadChildren:
      './pages/edit-profile/edit-profile.module#EditProfilePageModule'
  },
  {
    path: 'home-results',
    loadChildren:
      './pages/home-results/home-results.module#HomeResultsPageModule'
  },
  {
    path: 'view-profile',
    loadChildren:
      './pages/view-profile/view-profile.module#ViewProfilePageModule'
  },
  {
    path: 'nomor-penting',
    loadChildren:
      './pages/nomor-penting/nomor-penting.module#NomorPentingPageModule'
  },
  {
    path: 'nomor-penting/:id',
    loadChildren:
      './pages/detail-nomor-penting/detail-nomor-penting.module#DetailNomorPentingPageModule'
  },
  {
    path: 'map-locations',
    loadChildren:
      './pages/map-locations/map-locations.module#MapLocationsPageModule'
  },
  { path: 'lapor', loadChildren: './pages/lapor/lapor.module#LaporPageModule' },
  {
    path: 'list-map-nomor-penting',
    loadChildren:
      './pages/list-map-nomor-penting/list-map-nomor-penting.module#ListMapNomorPentingPageModule'
  },
  {
    path: 'broadcast/:id',
    loadChildren:
      './pages/broadcast-detail/broadcast-detail.module#BroadcastDetailPageModule'
  },
  {
    path: 'aspirasi',
    loadChildren: './pages/aspirasi/aspirasi.module#AspirasiPageModule'
  },
  {
    path: 'aspirasi/:id',
    loadChildren:
      './pages/aspirasi-detail/aspirasi-detail.module#AspirasiDetailPageModule'
  },
  {
    path: 'administrasi',
    loadChildren:
      './pages/administrasi/administrasi.module#AdministrasiPageModule'
  },
  {
    path: 'survey',
    loadChildren: './pages/survey/survey.module#SurveyPageModule'
  },
  {
    path: 'polling',
    loadChildren: './pages/polling/polling.module#PollingPageModule'
  },
  {
    path: 'notifikasi',
    loadChildren: './pages/notifikasi/notifikasi.module#NotifikasiPageModule'
  },
  {
    path: 'polling/:id',
    loadChildren:
      './pages/polling-detail/polling-detail.module#PollingDetailPageModule'
  },
  {
    path: 'administrasi/:id',
    loadChildren:
      './pages/administrasi-detail/administrasi-detail.module#AdministrasiDetailPageModule'
  },
  {
    path: 'e-samsat',
    loadChildren: './pages/e-samsat/e-samsat.module#ESamsatPageModule'
  },
  {
    path: 'onboarding',
    loadChildren: './onboarding/onboarding.module#OnboardingPageModule'
  },
  {
    path: 'aspirasi-form',
    loadChildren:
      './pages/aspirasi-form/aspirasi-form.module#AspirasiFormPageModule'
  },
  { path: 'news', loadChildren: './pages/news/news.module#NewsPageModule' },
  {
    path: 'news/:id',
    loadChildren: './pages/news-detail/news-detail.module#NewsDetailPageModule'
  },
  {
    path: 'saber-hoax',
    loadChildren: './pages/saber-hoax/saber-hoax.module#SaberHoaxPageModule'
  },
  {
    path: 'saber-hoax/:id',
    loadChildren:
      './pages/saber-hoax-detail/saber-hoax-detail.module#SaberHoaxDetailPageModule'
  },
  {
    path: 'question-and-answer',
    loadChildren:
      './pages/question-and-answer/question-and-answer.module#QuestionAndAnswerPageModule'
  },
  {
    path: 'question-and-answer-detail',
    loadChildren:
      './pages/question-and-answer-detail/question-and-answer-detail.module#QuestionAndAnswerDetailPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
