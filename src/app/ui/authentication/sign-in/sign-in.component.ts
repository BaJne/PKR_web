import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  @ViewChild('loginForm', {static: true}) form: NgForm;

  private static ERROR_MSG = 'Kombinacija korisničkog imena i lozinke nije ispravna!';

  errorMessage: string = null;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.form.value.username ===  '' || this.form.value.password ===  '' ){
      this.form.form.get('username').markAsTouched();
      this.form.form.get('password').markAsTouched();
      return;
    }

    const isAuthenticated = this.authService.authenticate(
      this.form.value.username,
      this.form.value.password
    );

    if(isAuthenticated){
      this.authService.navigateToMainPage();
    } else {
      this.errorMessage = SignInComponent.ERROR_MSG;
    }
  }

}
