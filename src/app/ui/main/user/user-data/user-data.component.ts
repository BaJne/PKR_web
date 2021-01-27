import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  isAutenticated: Subscription;
  user: User = null;
  phoneOldValue: string = '';
  errorMessage = null;

  signUpForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required]),
      address: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    }
  );

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAutenticated = this.authService.user.subscribe(user => {
      if (user === null || user === undefined) { return; }

      this.user = user;

      this.signUpForm.controls['username'].setValue(this.user.username);
      this.signUpForm.controls['address'].setValue(this.user.address);
      this.signUpForm.controls['name'].setValue(this.user.name);
      this.signUpForm.controls['surname'].setValue(this.user.surename);
      this.signUpForm.controls['phone'].setValue(this.user.phone);
    });
  }

  ngOnDestroy() {
    this.isAutenticated.unsubscribe();
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

  onSubmit() {
    if (!this.signUpForm.valid) { return; }

    let formData: {username? :string, name? :string, surename? :string, address? :string, phone? :string, } = {};

    if(this.signUpForm.value.address !== this.user.address)
      formData.address = this.signUpForm.value.address;

    if(this.signUpForm.value.name !== this.user.name)
      formData.name = this.signUpForm.value.name;

    if(this.signUpForm.value.surname !== this.user.surename)
      formData.surename = this.signUpForm.value.surname;

    if(this.signUpForm.value.phone !== this.user.phone)
      formData.phone = this.signUpForm.value.phone;

    if(this.signUpForm.value.username !== this.user.username)
      formData.username = this.signUpForm.value.username;

    if(Object.keys(formData).length === 0) return;

    this.authService.changeUserDetails(formData);
  }

}
