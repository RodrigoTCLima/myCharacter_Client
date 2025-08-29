import { Component } from '@angular/core';
import { RpgSystemListComponent } from "../rpg-systems/rpg-system-list/rpg-system-list.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [RpgSystemListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
