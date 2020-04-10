import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { HomeComponent } from './home/home.component';
import { QuestionFrameComponent } from './question-frame/question-frame.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,MatMenuModule, MatInputModule, MatRippleModule, MatSelectModule, MatCommonModule, MatCheckboxModule, MatSidenavModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CookieService } from 'ngx-cookie-service';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { ManageUserQuestionComponent } from './manage-user-question/manage-user-question.component';
import { BlockUIModule } from 'ng-block-ui';
import * as $ from 'jquery';
import { PostQuestionComponent } from './post-question/post-question.component';

const modules = [
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatSidenavModule,
  MatCheckboxModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserInfoComponent,
    HomeComponent,
    QuestionFrameComponent,
    QuestionListComponent,
    QuestionDetailComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    AsideNavComponent,
    ManageUserQuestionComponent,
    PostQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatCommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    ...modules,
    MatMenuModule,
    MatSelectModule,
    NgbModule,
    BlockUIModule.forRoot(),
    ReactiveFormsModule

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
