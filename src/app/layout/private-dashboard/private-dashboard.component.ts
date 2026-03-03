import { Component } from '@angular/core';
import { CampaignListComponent } from "../../features/campaigns/campaign-list/campaign-list.component";
import { RouterLink } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-private-dashboard',
  imports: [CampaignListComponent, RouterLink],
  templateUrl: './private-dashboard.component.html',
  styleUrl: './private-dashboard.component.scss'
})
export class PrivateDashboardComponent {
  user: User | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {
    this.user = this.authService.currentUser();
    this.isAdmin = this.authService.isAdmin();
  }
}
