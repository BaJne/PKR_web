import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidator } from '../validators.validator';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth.service';
import { User } from 'src/app/model/user';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
@Component({
  selector: 'app-sign-vendor',
  templateUrl: './sign-in-user.component.html',
  styleUrls: ['./sign-in-user.component.css']
})
export class SignInUserComponent implements OnInit {

  isLoading = false;
  isAccountCreated = false;
  errorMessage = null;

  headerTitle: string;
  registrationType: string;

  phoneOldValue: string = '';

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), PasswordValidator.strong] ),
    repeatPassword: new FormControl('', [Validators.required]),
    address: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    surname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
  }, PasswordValidator.match
  );

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.registrationType = this.route.snapshot.url[1].path;

    if(this.registrationType === 'vendor') {
      this.headerTitle = 'Registracija prodavca';
    } else {
      this.headerTitle = 'Registracija kupca';
    }
  }

  onPhoneInput(){
    const phoneValue = this.signUpForm.get('phone').value;

    if(/^\d*$/.test(phoneValue)){
      this.phoneOldValue = phoneValue;
    }
    else {
      this.signUpForm.get('phone').setValue(this.phoneOldValue);
    }
  }

  onSubmit(){

    let user: User = new User(
      this.signUpForm.get('username').value,
      this.signUpForm.get('name').value,
      this.signUpForm.get('surname').value,
      this.signUpForm.get('address').value,
      this.signUpForm.get('phone').value,
      this.signUpForm.get('password').value
    );

    if(this.registrationType === 'vendor'){
      user.myProduct = [];
    }

    const isRegistered = this.authService.register(user);

    if(isRegistered){
      this.router.navigate(['/auth/sign-up/200']);
    } else {
      this.errorMessage = ["Korisničko ime je već u upotrebi."];
    }
  }

}
