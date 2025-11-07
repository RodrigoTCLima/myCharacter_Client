import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CharactersService } from '../characters.service';
import { RpgSystemService } from '../../rpg-systems/rpg-system.service';
import { ActivatedRoute, Router } from '@angular/router';
import { buildCharacterForm } from '../../../core/schemas/parser';
import { TemplateSection } from '../../../core/schemas/character-sheet-schema.model';
import { RpgSystem } from '../../../models/rpg-system.model';
import { CharacterCreateDto, CharacterDetail } from '../../../models/character.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './character-form.component.html',
  styleUrls: ['./character-form.component.scss']
})
export class CharacterFormComponent implements OnInit {
  // 🧱 Estados internos
  formState: 'selectingSystem' | 'loadingSystem' | 'buildingForm' = 'selectingSystem';
  isEditMode = false;
  isSubmitting = false;

  // 📦 Dados e objetos principais
  rpgSystems: RpgSystem[] = [];
  selectedSystem: RpgSystem | null = null;
  characterForm!: FormGroup;
  schema: TemplateSection[] = [];

  // ✅ Se for edição, carregamos o personagem
  characterId: string | null = null;
  characterData: CharacterDetail | null = null;

  constructor(
    private charactersService: CharactersService,
    private RpgSystemService: RpgSystemService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // -------------------------------------------------------------
  // 🔹 Ciclo de vida
  // -------------------------------------------------------------
  ngOnInit(): void {
    this.characterId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.characterId;

    if (this.isEditMode) {
      this.loadCharacterForEdit();
    } else {
      this.loadRpgSystems();
    }
  }

  // -------------------------------------------------------------
  // 🔹 Fluxo de criação
  // -------------------------------------------------------------
  private loadRpgSystems(): void {
    this.formState = 'loadingSystem';
    this.RpgSystemService.getRpgSystems({
      pageNumber: 1,
      pageSize: 100,
      searchTerm: null,
      sortby: '',
      sortOrder: ''
    }).subscribe({
      next: (systems) => {
        this.rpgSystems = systems.items;
        this.formState = 'selectingSystem';
      },
      error: (err) => {
        console.error('Erro ao carregar sistemas:', err);
        this.formState = 'selectingSystem';
      }
    });
  }

  onSelectRpgSystem(system: RpgSystem): void {
    this.selectedSystem = system;
    this.formState = 'loadingSystem';

    this.RpgSystemService.getRpgSystemById(system.id).subscribe({
      next: (details) => {
        const template = details.characterSheetTemplate;
        const { schema, form } = buildCharacterForm(template);
        this.schema = schema;
        this.characterForm = form;
        this.formState = 'buildingForm';
      },
      error: (err) => {
        console.error('Erro ao carregar sistema:', err);
        this.formState = 'selectingSystem';
      }
    });
  }

  cleanRpgSystemSelection(): void {
    this.selectedSystem = null;
    this.characterForm = null as any;
    this.formState = 'selectingSystem';
  }

  // -------------------------------------------------------------
  // 🔹 Fluxo de edição
  // -------------------------------------------------------------
  private loadCharacterForEdit(): void {
    this.formState = 'loadingSystem';
    this.charactersService.getCharacterById(this.characterId!).subscribe({
      next: (character) => {
        this.characterData = character;
        this.selectedSystem = {
          id: character.rpgSystemId,
          name: '',
          description: '',
          characterSheetTemplate: character.characterSheetTemplate
        } as RpgSystem;

        const { schema, form } = buildCharacterForm(
          character.characterSheetTemplate!,
          JSON.parse(character.systemSpecificData || '{}')
        );
        this.schema = schema;
        this.characterForm = form;
        this.formState = 'buildingForm';
      },
      error: (err) => {
        console.error('Erro ao carregar personagem:', err);
        this.router.navigate(['/characters']);
      }
    });
  }

  // -------------------------------------------------------------
  // 🔹 Submissão (criação e edição)
  // -------------------------------------------------------------
  onSubmit(): void {
    if (!this.characterForm.valid || !this.selectedSystem) return;

    this.isSubmitting = true;

    const flatData = this.flattenFormValues(this.characterForm.value);

    const dto: CharacterCreateDto = {
      name: flatData['characterName'] || 'Sem nome',
      race: flatData['race'] || null,
      class: flatData['class'] || null,
      level: flatData['level'] || 1,
      systemSpecificData: JSON.stringify(flatData),
      rpgSystemId: this.selectedSystem.id,
      campaignId: null
    };

    const request$ = this.isEditMode
      ? this.charactersService.updateCharacter(this.characterId!, dto)
      : this.charactersService.createCharacter(dto);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/characters']);
      },
      error: (err) => {
        console.error('Erro ao salvar personagem:', err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Transforma o objeto nested do form (que contém seções)
   * em um único JSON plano com todos os campos.
   */
  private flattenFormValues(formValue: any): Record<string, any> {
    const flat: Record<string, any> = {};
    for (const sectionKey of Object.keys(formValue)) {
      const section = formValue[sectionKey];
      for (const fieldKey of Object.keys(section)) {
        flat[fieldKey] = section[fieldKey];
      }
    }
    return flat;
  }
}
