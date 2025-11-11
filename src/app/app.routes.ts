import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './layout/home/home.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { publicGuard } from './core/guards/public.guard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { RpgSystemFormComponent } from './features/rpg-systems/rpg-system-form/rpg-system-form.component';
import { CampaignFormComponent } from './features/campaigns/campaign-form/campaign-form.component';
import { CampaignDetailComponent } from './features/campaigns/campaign-detail/campaign-detail.component';
import { CharacterListComponent } from './features/characters/character-list/character-list.component';
import { CharacterFormComponent } from './features/characters/character-form/character-form.component';
import { RpgSystemListComponent } from './features/rpg-systems/rpg-system-list/rpg-system-list.component';
import { CampaignListComponent } from './features/campaigns/campaign-list/campaign-list.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [publicGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [publicGuard]
    },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/rpg-systems/new',
        component: RpgSystemFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/rpg-systems/edit/:id',
        component: RpgSystemFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'rpg-systems',
        component: RpgSystemListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'campaigns/new',
        component: CampaignFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'campaigns/:id',
        component: CampaignDetailComponent,
        canActivate: [authGuard]
    },
    {
        path: 'campaigns/edit/:id',
        component: CampaignFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'campaigns',
        component: CampaignListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'characters',
        component: CharacterListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'characters/new',
        component: CharacterFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'characters/edit/:id',
        component: CharacterFormComponent,
        canActivate: [authGuard]
    },
];
