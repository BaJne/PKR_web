import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  users: User[];

  constructor(private router: Router) {
    this.users = JSON.parse(localStorage.getItem('users'));
    if(this.users === null) {
      this.firstTimeInitialization();
    } else{
      this.refreshActiveUser();
    }
  }

  private firstTimeInitialization(){
    this.users = [];
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('activeUser', '-1');
  }

  private refreshActiveUser(){
    let index: number = +JSON.parse(localStorage.getItem('activeUser'));
    if(index === -1)
      return;
    this.user.next(this.users[index]);
  }

  private updateActiveUser(user: User, index: number){
    this.user.next(user);
    localStorage.setItem('activeUser', '' + index);
  }

  navigateToMainPage(){
    const user = this.user.getValue();

    if(user.myProduct !== undefined){
      this.router.navigate(['/main/my-products/']);
    }
    else {
      this.router.navigate(['/main/my-products/']);
    }
  }

  authenticate(username: string, password: string ): boolean{
    for (let index = 0; index < this.users.length; index++) {
      const element = this.users[index];
      if(element.username === username && element.password === password){
        this.updateActiveUser(element, index);
        return true;
      }
    }
    return false;
  }

  logout(){
    this.updateActiveUser(null, -1);
    if(!this.router.url.startsWith('/auth')){
      this.router.navigate(['/auth/sign-in']);
    }
  }

  register(user: User): boolean{
    if(this.isUsernameInUse(user)){
      return false;
    }
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  changeUserDetails(formData){
    const temp = JSON.parse(localStorage.getItem('activeUser'));
    if(temp === null) return;

    const index = +temp;
    const user = this.users[index];

    for(let key of Object.keys(formData)){
      user[key] = formData[key];
    }

    this.users[index] = user;

    localStorage.setItem('users', JSON.stringify(this.users));
    this.user.next(user);
  }

  changePassword(data){
    const temp = JSON.parse(localStorage.getItem('activeUser'));
    if(temp === null) return false;

    const index = +temp;
    const user = this.users[index];

    if(data.new_password === user.password){
      return 300;
    }

    if(user.password === data.old_password){
      user.password = data.new_password;
      return 200;
    }
    return 400;
  }

  private isUsernameInUse(user: User): boolean{
    for (let index = 0; index < this.users.length; index++) {
      const element = this.users[index];
      if(element.username === user.username)
        return true;
    }
    return false;
  }

}
