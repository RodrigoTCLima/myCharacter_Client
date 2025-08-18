import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './layout/home/home.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { publicGuard } from './core/guards/public.guard';

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
    }
];
