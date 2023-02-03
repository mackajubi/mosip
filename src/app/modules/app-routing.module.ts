import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/services-and-forms',
    pathMatch: 'full',
  },
  {
    path: 'services-and-forms',
    loadChildren: () => import('../pages/services-and-forms/services-and-forms.module').then(m => m.ServicesAndFormsPageModule)
  },  
  {
    path: 'contact-us',
    loadChildren: () => import('../pages/contact-us/contact-us.module').then(m => m.ContactUsPageModule)
  },
  {
    path: '**',
    redirectTo: '/services-and-forms',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
