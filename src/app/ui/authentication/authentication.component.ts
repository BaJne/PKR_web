import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.user.value !== null){
      this.authService.navigateToMainPage();
    }
  }

}
