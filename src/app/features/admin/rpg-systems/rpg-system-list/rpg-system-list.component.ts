import { Component, OnInit } from '@angular/core';
import { RpgSystemService } from '../rpg-system.service';
import { PagedResult } from '../../../../models/paged-result.model';
import { RpgSystem } from '../rpg-system.model';
import { QueryParameters } from '../../../../models/query-parameters.model';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-rpg-system-list',
  imports: [RouterLink],
  templateUrl: './rpg-system-list.component.html',
  styleUrl: './rpg-system-list.component.scss'
})
export class RpgSystemListComponent implements OnInit {
  public pagedRpgSystem: PagedResult<RpgSystem> | null = null;
  public params = new QueryParameters();

  constructor(private rpgSystemService: RpgSystemService) { }
  
  ngOnInit(): void {
    this.loadRpgSystems();
  }

  loadRpgSystems(): void {
    this.rpgSystemService.getRpgSystems(this.params).subscribe({
      next: (response) => {
        this.pagedRpgSystem = response;
        console.log("Tudo Certo no loadRpgSystems");
      },
      error: (err) => {
        console.error("Error no loadRpgSystems:", err);
      }
    })
  }

  deleteRpgSystems(id: number): void {
    if (confirm('Tem certeza que deseja excluir este sistema?')){
      this.rpgSystemService.deleteRpgSystem(id).subscribe({
        next: () => {
          console.log('Sistema excluído com suscesso');
          this.loadRpgSystems();
        },
        error: (err) => console.error('Erro ao excluir sistema:', err)
      });
    }
  }

  goToPage(page: number): void {
    this.params.pageNumber = page;
    this.loadRpgSystems();
  }
}
