import { Component, NgModule, OnInit } from '@angular/core';
import { CampaignsService } from '../campaigns.service';
import { RpgSystemService } from '../../admin/rpg-systems/rpg-system.service';
import { CampaignCreateDto } from '../../../models/campaign.model';
import { RpgSystem } from '../../admin/rpg-systems/rpg-system.model';
import { QueryParameters } from '../../../models/query-parameters.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-campaign-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.scss'
})
export class CampaignFormComponent implements OnInit {
  public campaing: CampaignCreateDto = {
    name: '',
    description: null,
    rpgSystemId: 0
  }
  public rpgSystems: RpgSystem[] = [];

  constructor(
    private campaingsService: CampaignsService,
    private rpgSystemService: RpgSystemService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.rpgSystemService.getRpgSystems({
      pageNumber: 1,
      pageSize: 100,
      searchTerm: null,
      sortby: '',
      sortOrder: ''
    }).subscribe({
      next: (rpgSystemsData) => {
        this.rpgSystems = rpgSystemsData.items;
      },
      error: (err) => console.error('Erro ao carregar os sistemas de RPG:', err)
    })
  }

  onSubmit(): void {
    console.log(this.campaing);
    this.campaingsService.createCampaigns(this.campaing).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Erro ao criar campanha:', err)
    });
  }  
}
