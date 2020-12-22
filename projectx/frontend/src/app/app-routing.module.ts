import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: '/profile'
   },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    loadChildren: () => import('./account/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
