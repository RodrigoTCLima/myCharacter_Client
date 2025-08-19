import { Component } from '@angular/core';
import { CampaignListComponent } from "../../features/campaigns/campaign-list/campaign-list.component";

@Component({
  selector: 'app-private-dashboard',
  imports: [CampaignListComponent],
  templateUrl: './private-dashboard.component.html',
  styleUrl: './private-dashboard.component.scss'
})
export class PrivateDashboardComponent {

}
