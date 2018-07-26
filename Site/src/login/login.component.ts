import { Component, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthService, AuthResult } from 'auth/auth.service';
import { Credentials } from './credentials';
import { ForgotPasswordDialogService } from './forgot-password/dialog.service';
import { environment } from 'environments/environment';
import { SocialUser, ConfirmAccount } from './models';
import { ProgressColorService } from 'shared/services/progress-color.service';
import { IntercomProxyService } from 'shared/services/intercom-proxy.service';

import 'rxjs/add/operator/first';

@Component({
  selector: 'ij-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.less'],
  providers: [ForgotPasswordDialogService]
})
export class LoginComponent {
  credentials: Credentials = new Credentials();
  error: string;
  success: string;
  submitted: boolean;
  hideSocialLogin: boolean;
  accountVerifiedMsg: string;
  isEmailNotConfirmed: boolean = false;

  private socialUser: SocialUser;
  private loginWithFBWindow: Window;
  private confirmAccount: ConfirmAccount;

  constructor(
    private router: Router,
    private authService: AuthService,
    private forgotPwdSvc: ForgotPasswordDialogService,
    private activeRoute: ActivatedRoute,
    private progressSvc: ProgressColorService,
    private intercomSvc: IntercomProxyService,
    el: ElementRef
  ) {
    this.progressSvc.color = '#FFFFFF';
  }

  ngOnInit() {
    if (this.authService.socialUser) {
      this.credentials.email = this.authService.socialUser.email;
    }

    if (this.authService.isLoggedInWithIJ == 'initiate') {
      this.hideSocialLogin = true;
    }

    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.confirmAccount = new ConfirmAccount();
      this.confirmAccount.userId = params['userId'];
      this.confirmAccount.code = params['code'];
    });

    if (this.confirmAccount.userId && this.confirmAccount.code) {
      this.authService
        .confirmEmail(this.confirmAccount)
        .first()
        .subscribe
        (
        r => this.onAccountConfirmed(r),
        e => this.onAccountConfirmedError(e)
        );
    }
  }

  ngOnDestroy() {
    this.progressSvc.reset();
  }

  login(valid: boolean) {
    if (!valid) return;

    this.error = "";
    this.success = "";
    this.submitted = true;

    this.authService
      .login(this.credentials.email, this.credentials.password)
      .first()
      .subscribe(r => this.onLogin(r));
  }

  forgotPasswordPopUp() {
    this.forgotPwdSvc.showDialog();

    setTimeout(function () {
      let overlayWidget = document.querySelectorAll('div.ui-widget-overlay.ui-dialog-mask')[0];
      let bgElement = document.getElementsByClassName("upperlayer")[0];

      if (bgElement) {
        bgElement.classList.add("active");
      }
      if (overlayWidget) {
        overlayWidget.classList.remove("ui-widget-overlay");
      }
    }, 0);
  }

  loginWithFacebook() {
    let externalProviderUrl = environment.endpoints.auth.externalLogin('Facebook');

    this.loginWithFBWindow = window.open
      (
      externalProviderUrl,
      "Authenticate Account",
      "location=0,status=0,width=600,height=750"
      );

    setInterval(this.verifyWithFBHandler, 5000);
    window.addEventListener("message", this.verifyWithFBEventListner, false);
  }

  sendMail() {
    this.error = "";
    this.success = "";
    var mail = this.credentials.email;

    if (mail == "" || mail == undefined) {
      this.error = "Please enter an email address.";
    }
    else {
      this.authService.resendMail(this.credentials.email).subscribe(x => {
        this.success = "Thank you. We sent you an email to the address on file.";
      });
    }
  }

  private verifyWithFBHandler = () => {
    let message = "Hello!  The time is: " + (new Date().getTime());
    let domain = environment.endpoints.auth.siteApiUrl;
    //send the message and target URI
    this.loginWithFBWindow.postMessage(message, domain);
  }

  private verifyWithFBEventListner = (event: MessageEvent) => {
    if (event.origin !== environment.endpoints.auth.siteApiUrl) {
      return;
    }

    if (this.router.url != '/login') {
      return;
    }

    if (event.data != null) {
      this.getUserInfo(event.data.access_token);
    }

    this.loginWithFBWindow.close();
  }

  private onLogin(result: AuthResult): void {
    this.submitted = false;
    if (result == AuthResult.Success) {
      this.error = null;
      /* Newly added to find the profileUrl /profile/firstnamelastname of the user start*/
      let profile = environment.site.profileUrl(this.authService.fullName, this.authService.userPositionInList);
      this.router.navigate([profile], { queryParamsHandling: 'merge' });
      /* Newly added to find the profileUrl /profile/firstnamelastname of the user end*/
    }
    else if (result == AuthResult.ServerOffline) {
      this.error = "The server is offline. Please try again later.";
    }
    else if (result == AuthResult.InvalidCredentials) {
      this.error = "The username or password is incorrect.";
    }
    else if (result == AuthResult.EmailNotConfirmed) {
      this.isEmailNotConfirmed = true;
      this.error = "Please verify your email address.";
    }
  }

  private getUserInfo(access_token: string) {
    this.authService.externalUserInfo(access_token).first().subscribe(userInfo => {
      this.socialUser = new SocialUser();
      this.socialUser.firstName = userInfo.firstName;
      this.socialUser.lastName = userInfo.lastName;
      this.socialUser.email = userInfo.email;
      this.socialUser.gender = userInfo.gender;
      this.socialUser.imageUrl = userInfo.imageUrl;
      this.socialUser.loginProvider = userInfo.loginProvider;
      this.socialUser.city = userInfo.city;
      this.socialUser.state = userInfo.state;
      this.socialUser.userExists = userInfo.userExists;
      this.authService.saveSocialUserInfo(this.socialUser);

      if (!userInfo.userExists) {
        this.router.navigate(['/signup']);
      }
      else {
        this.router.navigate(['/login']);
      }
    }, e => this.onGetError());
  }

  private onGetError() {
    this.error = "The username or password is incorrect.";
  }

  private onAccountConfirmed(r: any) {
    this.accountVerifiedMsg = "Your account has now been verified.";
  }

  private onAccountConfirmedError(e: any) {
    this.error = "Invalid Token.";
  }
}
