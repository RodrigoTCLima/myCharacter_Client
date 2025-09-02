import { Component, OnInit } from '@angular/core';
import { CampaignsService } from '../campaigns.service';
import { PagedResult } from '../../../models/paged-result.model';
import { Campaign } from '../../../models/campaign.model';
import { QueryParameters } from '../../../models/query-parameters.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  imports: [RouterLink],
  templateUrl: './campaign-list.component.html',
  styleUrl: './campaign-list.component.scss'
})
export class CampaignListComponent implements OnInit {
  public pagedCampaigns: PagedResult<Campaign> | null = null;
  public params = new QueryParameters();

  constructor(private campaignsService: CampaignsService) { }
  
  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaignsService.getCampaigns(this.params).subscribe({
      next: (response) => {
        this.pagedCampaigns = response;
        console.log("Tudo certo no loadCampaigns");
      },
      error: (err) => {
        console.error("Error no loadCampaigns:", err);
      }
    })
  }

  goToPage(page: number): void {
    this.params.pageNumber = page;
    this.loadCampaigns();
  }
}
