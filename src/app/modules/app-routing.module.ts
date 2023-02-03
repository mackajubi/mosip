import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('../pages/home-page/home-page.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:service/:code/:day/:month/:yr/:rand',
    loadChildren: () => import('../pages/home-page/home-page.module').then(m => m.HomePageModule)
  },
  {
    path: 'home/:service/:code/:day/:month/:yr/:rand/:nin',
    loadChildren: () => import('../pages/home-page/home-page.module').then(m => m.HomePageModule)
  },
  {
    path: 'about-nira',
    loadChildren: () => import('../pages/about-nira/about-nira.module').then(m => m.AboutNIRAPageModule)
  },
  {
    path: 'services-and-forms',
    loadChildren: () => import('../pages/services-and-forms/services-and-forms.module').then(m => m.ServicesAndFormsPageModule)
  },  
  {
    path: 'fees',
    loadChildren: () => import('../pages/fees/fees.module').then(m => m.FeesPageModule)
  },
  {
    path: 'publications',
    loadChildren: () => import('../pages/Publications/publications.module').then(m => m.PublicationsPageModule)
  },
  {
    path: 'publications/:slug',
    loadChildren: () => import('../pages/Publications/publications.module').then(m => m.PublicationsPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('../pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'news/:slug',
    loadChildren: () => import('../pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'tenders',
    loadChildren: () => import('../pages/tenders/tenders.module').then(m => m.TendersPageModule)
  },
  {
    path: 'tenders/:slug',
    loadChildren: () => import('../pages/tenders/tenders.module').then(m => m.TendersPageModule)
  },
  {
    path: 'procedures',
    loadChildren: () => import('../pages/procedures/procedures.module').then(m => m.ProceduresPageModule)
  },
  {
    path: 'procedures/:slug',
    loadChildren: () => import('../pages/procedures/procedures.module').then(m => m.ProceduresPageModule)
  },
  {
    path: 'careers',
    loadChildren: () => import('../pages/careers/careers.module').then(m => m.CareersPageModule)
  },
  {
    path: 'careers/:slug',
    loadChildren: () => import('../pages/careers/careers.module').then(m => m.CareersPageModule)
  },
  {
    path: 'gallery-photos',
    loadChildren: () => import('../pages/gallery/photos/photos.module').then(m => m.PhotosPageModule)
  },
  {
    path: 'gallery-videos',
    loadChildren: () => import('../pages/gallery/videos/videos.module').then(m => m.VideosPageModule)
  },
  // {
  //   path: 'resources',
  //   loadChildren: () => import('../pages/resources/resources.module').then(m => m.ResourcesModule)
  // },
  // {
  //   path: 'faq',
  //   loadChildren: () => import('../pages/faqs/faqs.module').then(m => m.FAQsModule)
  // },
  {
    path: 'contact-us',
    loadChildren: () => import('../pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: '**',
    redirectTo: '/home',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
