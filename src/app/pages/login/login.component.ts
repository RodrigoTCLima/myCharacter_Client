import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }
  
  onLogin(): void {
    console.log("let's go to login");
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!');
        console.log('Se liga no token', response.token);
        localStorage.setItem('auth_token', response.token);
      },
      error: (err) => {
        console.error('Deu erro mano:', err);
      },
      complete: () => {
        console.log('acabou!');
      }
    })
  }
}
