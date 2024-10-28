import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './MedTechSolutions/chat-service/components/chat/chat.component';
import {SignInComponent} from './MedTechSolutions/security-service/pages/sign-in/sign-in.component';
import {SignUpComponent} from './MedTechSolutions/security-service/pages/sign-up/sign-up.component';
import {authenticationGuard} from './MedTechSolutions/security-service/service/authentication.guard';
import {HomeComponent} from './public/pages/home/home.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'chat/:userId', component: ChatComponent, canActivate: [authenticationGuard] },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
