import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
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
      next: () => {
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
