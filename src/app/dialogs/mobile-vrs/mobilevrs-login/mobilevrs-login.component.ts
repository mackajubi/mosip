import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiEndpointsService } from 'src/app/services/api-endpoints.service';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';

interface HTTPRequest {
  error?: string;
  // user?: UserData;
  code?: number;
}

@Component({
  selector: 'app-mobilevrs-login',
  templateUrl: './mobilevrs-login.component.html',
  styleUrls: ['./mobilevrs-login.component.scss']
})
export class MobilevrsLoginComponent implements OnInit {
  hide = false;
  passwordReset = false;
  processing = false;

  userEmail = new FormControl('', [
    Validators.required,
  ]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private dialogRef: MatDialogRef<MobilevrsLoginComponent>,
    private endpoints: ApiEndpointsService,
    private http: HttpClient,
    private service: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.service.onLogOut();

    // setTimeout(() => {
    //   this.onLogin();
    // }, 2000);
  }

  onCloseDialog(): void {
    this.dialogRef.close();
  }  

  getEmailErrorMessage() {
    return this.userEmail.hasError('pattern') || this.userEmail.hasError('email') ? 'not a valid email' :
    this.userEmail.hasError('required') ? 'please enter a value' : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'please enter a value' : '';
  }

  onLogin() {
    this.processing = true;
    this.router.navigate(['/mobilevrs']);
    this.onCloseDialog();
    this.service.isLoggedIn.next(true);

    // const formData = new FormData();
    // formData.append('c', btoa(this.userEmail.value));
    // formData.append('r', btoa(this.password.value));

    // this.http.post<HTTPRequest>(this.endpoints.getLoginEndpoint(), formData)
    // .pipe(catchError(this.endpoints.handleError))
    // .subscribe(data => {
    //   this.processing = false;

    //   if (data.error) {
    //     this.service.openSnackBar(data.error, 'err-lg');
    //   } else if (data.code === 200) {
    //     this.service.onLogIn({
    //       loggedIn: true,
    //       token: data.user.token,
    //       wsl: data.user.wsl,
    //       img: data.user.img,
    //       name: data.user.name,
    //       email: data.user.email,
    //       role: data.user.role,
    //       dir: data.user.dir,
    //       rbs: data.user.rbs,
    //       rbsc: data.user.rbsc,
    //     });

    //     this.router.navigate(['home']);
    //   }
    // }, (error: { error: string }) => {
    //   this.processing = false;
    //   this.endpoints.determineErrorResponse(error);
    // });
  }

  onPasswordReset() {
    this.processing = true;
    const formData = new FormData();
    formData.append('i', btoa(this.userEmail.value));

    // this.http.post<HTTPRequest>(this.endpoints.getRequestPasswordResetEndpoint(), formData)
    // .pipe(catchError(this.endpoints.handleError))
    // .subscribe(data => {
    //   if (data.error) {
    //     this.processing = false;
    //     this.service.openSnackBar(data.error, 'err');
    //   } else if (data.code === 200) {
    //     setTimeout(() => {
    //       this.processing = false;
    //       this.service.openSnackBar('Operation Successful. Please check your email to reset your password', 'suc-lg');
    //     }, 3000);
    //   }
    // }, (error: { error: string }) => {
    //   this.processing = false;
    //   this.endpoints.determineErrorResponse(error);
    // });
  }
}
