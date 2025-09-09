import { Component, OnInit } from '@angular/core';
import { CampaignsService } from '../campaigns.service';
import { RpgSystemService } from '../../admin/rpg-systems/rpg-system.service';
import { CampaignCreateDto } from '../../../models/campaign.model';
import { RpgSystem } from '../../admin/rpg-systems/rpg-system.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-campaign-form',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './campaign-form.component.html',
  styleUrl: './campaign-form.component.scss'
})
export class CampaignFormComponent implements OnInit {
  public campaing: CampaignCreateDto = {
    name: '',
    description: null,
    rpgSystemId: 0
  }

  public campaignForm: FormGroup;
  public rpgSystems: RpgSystem[] = [];
  public isEditMode: Boolean = false;
  public campaignId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private campaingsService: CampaignsService,
    private rpgSystemService: RpgSystemService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.campaignForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      rpgSystemId: [null, Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadRpgSystems();

    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.campaignId = params.get('id');
        if (this.campaignId) {
          this.isEditMode = true;
          this.campaignForm.get('rpgSystemId')?.disable();
          return this.campaingsService.getCampaignById(this.campaignId);
        }
        return of(null);
      })
    ).subscribe(camapignData => {
      if (camapignData) {
        this.campaignForm.patchValue(camapignData);
      }
    });
  }

  onSubmit(): void {
    console.log(this.campaignForm);
    if (this.campaignForm.invalid) return;
    console.log('To aqui')

    if (this.isEditMode && this.campaignId) {
      this.campaingsService.updateCampaign(this.campaignId, this.campaignForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/campaigns', this.campaignId]);
          },
          error: (err) => {
            console.error('Erro ao editar a Campanha:', err);
          }
        });
    }
    else {
      console.log(this.campaignForm);
      this.campaingsService.createCampaigns(this.campaignForm.value).subscribe({
        next: (newCampaign) => this.router.navigate(['/campaigns', newCampaign.id]),
        error: (err) => console.error('Erro ao criar campanha:', err)
      });
    }
  }

  loadRpgSystems(): void{
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
}
