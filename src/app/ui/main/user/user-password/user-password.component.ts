import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { PasswordValidator } from '../../../authentication/validators.validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent implements OnInit {

  errorMessage = '';
  showErrors: boolean;

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required] ),
    password: new FormControl('', [Validators.required, Validators.minLength(6), PasswordValidator.strong] ),
    repeatPassword: new FormControl('', [Validators.required]),
  }, PasswordValidator.match);

  constructor(private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.showErrors = false;
  }

  onSubmit() {
    if (!this.changePasswordForm.valid) {
      this.showErrors = true;
      if(
        this.changePasswordForm.value.oldPassword !== '' &&
        this.changePasswordForm.value.password !== '' &&
        this.changePasswordForm.value.repeatPassword !== ''
      )
        this.errorMessage = 'Lozinke se ne poklapaju';
      return;
    }

    const passData = {
      old_password: this.changePasswordForm.value.oldPassword,
      new_password: this.changePasswordForm.value.password,
      new_password2: this.changePasswordForm.value.repeatPassword
    };

    const status = this.authService.changePassword(passData);
    this.errorMessage = '';
    if(status === 200){
      this.messageService.add(
        {
          severity:'success',
          summary:'Uspešno ste promenili lozinku',
        }
      );
      this.changePasswordForm.get('oldPassword').setValue('');
      this.changePasswordForm.get('password').setValue('');
      this.changePasswordForm.get('repeatPassword').setValue('');
    } else if(status === 300) {
      this.messageService.add(
        {
          severity:'error',
          summary:'Nova lozinka se mora razlikovati od stare.',
        }
      );
      this.errorMessage ='Nova lozinka se mora razlikovati od stare.';
    } else if(status === 400){
      this.messageService.add(
        {
          severity:'error',
          summary:'Stara lozinka nije ispravna.',
        }
      );
      this.errorMessage ='Stara lozinka nije ispravna.';
    }
  }
}
