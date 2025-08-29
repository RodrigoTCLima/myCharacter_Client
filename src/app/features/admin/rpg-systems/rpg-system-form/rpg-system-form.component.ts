import { Component, OnInit } from '@angular/core';
import { RpgSystemService } from '../rpg-system.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QueryParameters } from '../../../../models/query-parameters.model';
import { FormsModule } from '@angular/forms';
import { RpgSystemCreateDto } from '../rpg-system.model';

@Component({
  selector: 'app-rpg-system-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './rpg-system-form.component.html',
  styleUrl: './rpg-system-form.component.scss'
})
export class RpgSystemFormComponent implements OnInit{
  public rpgSystemCreateDto: RpgSystemCreateDto = {
    name: '',
    description: null,
    characterSheetTemplate: null
  };
  public isEditMode: boolean = false;
  public params = new QueryParameters();
  private systemId = 0;

  constructor(
    private rpgSystemService: RpgSystemService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }
  
  ngOnInit(): void{
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam)
    {
      this.isEditMode = true;
      this.systemId = +idParam;
      console.log(`Modo de Edição: Carregando dados para o ID ${this.systemId}`);
      this.rpgSystemService.getRpgSystemById(this.systemId).subscribe({
        next: (systemData) => {
          this.rpgSystemCreateDto = {
            name: systemData.name,
            description: systemData.description,
            characterSheetTemplate: systemData.characterSheetTemplate
          };
        },
        error: (err) => {
          console.error('Erro ao carregar dados do sistema para edição:', err);
          this.router.navigate(['/admin']);
        }
      });
    }
    else
    {
      this.isEditMode = false;
      console.log('Modo de Criação');
    }
  }

  onSubmit() {
    if (this.isEditMode && this.systemId)
    {
      this.rpgSystemService.updateRpgSystem(this.systemId, this.rpgSystemCreateDto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => console.error('Erro ao atualizar sistema:', err)
      });
    }
    else {
      this.rpgSystemService.createRpgSystem(this.rpgSystemCreateDto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => console.error('Erro ao criar sistema:', err)
      });
    }
  }
  
}
