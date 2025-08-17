import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PrivateDashboardComponent } from "../private-dashboard/private-dashboard.component";
import { NgIf } from "@angular/common";
import { PublicLandingComponent } from "../public-landing/public-landing.component";

@Component({
  selector: 'app-home',
  imports: [PrivateDashboardComponent, NgIf, PublicLandingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isUserLoggedIn = false;

  constructor(private authService: AuthService) { }
  
  ngOnInit(): void{
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

}
