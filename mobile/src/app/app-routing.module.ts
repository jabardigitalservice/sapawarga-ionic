import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  {
    path: 'edit-profile',
    loadChildren:
      './pages/edit-profile/edit-profile.module#EditProfilePageModule'
  },
  {
    path: 'home-results',
    // canActivate: [AuthGuard],
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
    path: 'survey/:id',
    loadChildren:
      './pages/survey-detail/survey-detail.module#SurveyDetailPageModule'
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
    path: 'aspirasi-user',
    loadChildren:
      './pages/aspirasi-user/aspirasi-user.module#AspirasiUserPageModule'
  },
  {
    path: 'onboarding',
    loadChildren:
      './onboarding/onboarding.module#OnboardingPageModule'
  },
  {
    path: 'aspirasi-add',
    loadChildren:
      './pages/aspirasi-add/aspirasi-add.module#AspirasiAddPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
