import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = "";
  password: string = "";
  email: string = "";

  constructor(private authService: AuthService, private router: Router)
  {}

  onRegister() {
    this.authService.register(this.username, this.password, this.email).pipe(
      switchMap(() => {
        return this.authService.login(this.username, this.password);
      })
    ).subscribe({
        next: (loginResponse) => {
          localStorage.setItem('auth_token', loginResponse.token);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Ocorreu um erro no processo:', err);
        }
      }
    );
  }
}

