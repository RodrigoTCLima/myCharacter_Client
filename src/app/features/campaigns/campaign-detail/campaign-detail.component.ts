import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
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

  onDelete() {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;

    if (this.campaign?.id)
      this.campaignService.deleteCampaign(this.campaign.id).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Erro ao excluir campanha:', err)
      })
  }

  
}
