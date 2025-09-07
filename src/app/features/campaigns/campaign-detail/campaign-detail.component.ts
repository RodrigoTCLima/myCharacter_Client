import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';

import { CampaignsService } from '../campaigns.service';
import { CampaignDetail } from '../../../models/campaign.model';

@Component({
  selector: 'app-campaign-detail',
  imports: [RouterLink],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.scss'
})
export class CampaignDetailComponent implements OnInit{
  public campaign: CampaignDetail | null = null;

  constructor(
    private campaignService: CampaignsService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) return this.campaignService.getCampaignById(id);
        return of(null);
      })
    ).subscribe({
      next: (campaignData) => {
        this.campaign = campaignData;
        console.log('Campanha carregada:', this.campaign);
      },
      error: (err) => {
        console.error('Erro ao buscar Campanha:', err);
      }
    });
  }

  
}
