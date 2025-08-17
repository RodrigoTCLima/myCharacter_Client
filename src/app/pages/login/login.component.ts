import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  
  onLogin(): void {
    console.log("let's go to login");
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('auth_token', response.token);
        console.log('Login bem-sucedido, redirecionando para a homepage');

        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
      },
      complete: () => {
        console.log('Processo de login finalizado!');
      }
    })
  }
}
