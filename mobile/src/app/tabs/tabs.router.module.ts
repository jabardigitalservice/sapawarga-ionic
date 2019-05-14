import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/home-results/home-results.module#HomeResultsPageModule'
          }
        ]
      },
      {
        path: 'broadcasts',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/broadcasts/broadcasts.module#BroadcastsPageModule'
          }
        ]
      },
      {
        path: 'akun',
        children: [
          {
            path: '',
            loadChildren:
              '../pages/view-profile/view-profile.module#ViewProfilePageModule'
          }
        ]
      },
      {
        path: 'bantuan',
        children: [
          {
            path: '',
            loadChildren: '../pages/bantuan/bantuan.module#BantuanPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
