import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { HomeComponent } from './home/home.component';
import { QuestionFrameComponent } from './question-frame/question-frame.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { AuthGuard } from './auth.guard';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { ManageUserQuestionComponent } from './manage-user-question/manage-user-question.component';
import { PostQuestionComponent } from './post-question/post-question.component';
import { RoleGuardService } from './role-guard.service';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },//set default url start with /home
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  //manage user dashboard
  {
    path:'dashboard',
    canActivate: [AuthGuard],
    children: [{
      path: '',
      component: AsideNavComponent,
      children: [{
        path: '',
        component: UserInfoComponent
      }]
    }]
  },
  //manage admin dashboard
  {
    path:'admin-dashboard',
    canActivate: [RoleGuardService], 
    data: { 
      expectedRole: 'admin'
    },
    children: [{
      path: '',
      component: AsideNavComponent,
      children: [{
        path: '',
        component: AdminDashboardComponent
      }]
    }]
  },
  
  {
    path:'post_question',
    canActivate: [AuthGuard],
    children: [{
      path: '',
      component: AsideNavComponent,
      children: [{
        path: '',
        component: PostQuestionComponent
      }]
    }]
  },
  {
    path:'manage_question',
    canActivate: [AuthGuard],
    children: [{
      path: '',
      component: AsideNavComponent,
      children: [{
        path: '',
        component: ManageUserQuestionComponent
      }]
    }]
  },

  //end manage user
  {
    path: 'question',
    component: QuestionFrameComponent
  },
  {
    path: 'category/:category_type/:category_id/questions',
    component: QuestionListComponent
  },
  {
    path: 'question/:question_id',
    component: QuestionDetailComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
