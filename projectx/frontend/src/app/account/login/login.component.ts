import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private router: Router, private authService: AuthenticationService) { }

  ngOnInit(): void {
    if(this.authService.isUserAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  login() {
    this.authService.login ('username', 'password')
    .subscribe(success => {
      if (success) {
        console.log('Successfully logged in');
        this.router.navigate(['/profile']);
      }
    });
  }

}
