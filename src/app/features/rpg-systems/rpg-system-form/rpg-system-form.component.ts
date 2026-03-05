import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RpgSystemService } from '../rpg-system.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RpgSystemCreateDto } from '../../../models/rpg-system.model';
import { QueryParameters } from '../../../models/query-parameters.model';
import { TemplateSection, TemplateField } from '../../../core/schemas/character-sheet-schema.model'; // Importe o model

@Component({
  selector: 'app-rpg-system-form',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './rpg-system-form.component.html',
  styleUrl: './rpg-system-form.component.scss'
})
export class RpgSystemFormComponent implements OnInit {
  public rpgSystemCreateDto: RpgSystemCreateDto = {
    name: '',
    description: null,
    characterSheetTemplate: null
  };
  public isEditMode: boolean = false;
  public params = new QueryParameters();
  private systemId = 0;

  // Novo: Modo de edição do template (visual ou raw)
  public templateMode: 'visual' | 'raw' = 'visual';

  // Novo: FormGroup para o editor visual do schema
  public schemaForm: FormGroup = new FormGroup({
    sections: new FormArray([])
  });

  // Novo: JSON raw para o modo raw
  public rawTemplate: string = '';

  constructor(
    private rpgSystemService: RpgSystemService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.systemId = +idParam;
      this.rpgSystemService.getRpgSystemById(this.systemId).subscribe({
        next: (systemData) => {
          this.rpgSystemCreateDto = {
            name: systemData.name,
            description: systemData.description,
            characterSheetTemplate: systemData.characterSheetTemplate
          };
          this.loadTemplate(systemData.characterSheetTemplate);
        },
        error: (err) => {
          console.error('Erro ao carregar dados do sistema para edição:', err);
          this.router.navigate(['/admin']);
        }
      });
    } else {
      this.isEditMode = false;
      this.addSection(); // Adiciona uma seção vazia por default no visual
    }
  }

  // Novo: Carrega o template JSON e popula o form visual ou raw
  private loadTemplate(templateJson: string | null): void {
    this.rawTemplate = templateJson ?? '';
    if (templateJson) {
      try {
        const parsed = JSON.parse(templateJson);
        this.populateVisualForm(parsed.sections || []);
      } catch (err) {
        console.error('Template JSON inválido, usando raw mode:', err);
        this.templateMode = 'raw';
      }
    } else {
      this.addSection();
    }
  }

  // Novo: Popula o FormArray de sections com dados parsed
  private populateVisualForm(sections: TemplateSection[]): void {
    const sectionsArray = this.schemaForm.get('sections') as FormArray;
    sectionsArray.clear();
    sections.forEach(section => {
      const sectionGroup = this.createSectionGroup(section.name);
      const fieldsArray = sectionGroup.get('fields') as FormArray;
      section.fields.forEach(field => {
        fieldsArray.push(this.createFieldGroup(field));
      });
      sectionsArray.push(sectionGroup);
    });
  }

  // Novo: Cria FormGroup para uma seção
  private createSectionGroup(name: string = ''): FormGroup {
    return new FormGroup({
      name: new FormControl(name, Validators.required),
      fields: new FormArray([])
    });
  }

  // Novo: Cria FormGroup para um field
  private createFieldGroup(field: TemplateField = {} as TemplateField): FormGroup {
    const group = new FormGroup({
      label: new FormControl(field.label || '', Validators.required),
      key: new FormControl(field.key || '', Validators.required),
      type: new FormControl(field.type || 'text', Validators.required),
      required: new FormControl(!!field.required),
      default: new FormControl(field.default ?? null),
      min: new FormControl(field.min ?? null),
      max: new FormControl(field.max ?? null),
      disabled: new FormControl(!!field.disabled),
      calculation: new FormControl(field.calculation || ''),
      dependencies: new FormControl(field.dependencies?.join(',') || ''),
      allowCustom: new FormControl(!!field.allowCustom),
      customLabel: new FormControl(field.customLabel || ''),
      itemType: new FormControl(field.itemType || 'text'), // Para arrays
      minItems: new FormControl(field.minItems ?? 0),
      maxItems: new FormControl(field.maxItems ?? null),
      options: new FormArray([]) // Para selects
    });

    // Popula options se select
    const optionsArray = group.get('options') as FormArray;
    field.options?.forEach(opt => optionsArray.push(new FormControl(opt)));

    // Para itemTemplate object, mas simplificado por agora (expanda se preciso)
    if (field.itemTemplate) {
      console.warn('itemTemplate complexos não suportados ainda');
    }

    return group;
  }

  // Novo: Adiciona uma seção vazia
  addSection(): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    sections.push(this.createSectionGroup('Nova Seção'));
  }

  // Novo: Remove seção
  removeSection(index: number): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    sections.removeAt(index);
  }

  // Novo: Adiciona field em uma seção
  addField(sectionIndex: number): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    const fields = sections.at(sectionIndex).get('fields') as FormArray;
    fields.push(this.createFieldGroup());
  }

  // Novo: Remove field de uma seção
  removeField(sectionIndex: number, fieldIndex: number): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    const fields = sections.at(sectionIndex).get('fields') as FormArray;
    fields.removeAt(fieldIndex);
  }

  // Novo: Adiciona option em um field select
  addOption(sectionIndex: number, fieldIndex: number): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    const fields = sections.at(sectionIndex).get('fields') as FormArray;
    const options = fields.at(fieldIndex).get('options') as FormArray;
    options.push(new FormControl(''));
  }

  // Novo: Remove option
  removeOption(sectionIndex: number, fieldIndex: number, optIndex: number): void {
    const sections = this.schemaForm.get('sections') as FormArray;
    const fields = sections.at(sectionIndex).get('fields') as FormArray;
    const options = fields.at(fieldIndex).get('options') as FormArray;
    options.removeAt(optIndex);
  }

  // Novo: Toggle modo e sync dados
  toggleTemplateMode(): void {
    this.templateMode = this.templateMode === 'visual' ? 'raw' : 'visual';
    this.syncTemplateData();
  }

  // Novo: Sync entre visual e raw
  private syncTemplateData(): void {
    if (this.templateMode === 'raw') {
      this.rawTemplate = this.serializeSchema() || '';
    } else {
      this.loadTemplate(this.rawTemplate);
    }
  }

  // Novo: Serializa o form visual para JSON string
  private serializeSchema(): string {
    if (!this.schemaForm.valid) {
      console.warn('Schema form inválido, não serializando.');
      return '';
    }

    const sections: TemplateSection[] = this.schemaForm.value.sections.map((sec: any) => ({
      name: sec.name,
      fields: sec.fields.map((fld: any) => {
        const field: TemplateField = {
          label: fld.label,
          key: fld.key,
          type: fld.type,
          required: fld.required,
          default: fld.default,
          min: fld.min,
          max: fld.max,
          disabled: fld.disabled,
          calculation: fld.calculation || undefined,
          dependencies: fld.dependencies ? fld.dependencies.split(',').map((d: string) => d.trim()) : undefined,
          allowCustom: fld.allowCustom,
          customLabel: fld.customLabel || undefined,
          itemType: fld.itemType || undefined,
          minItems: fld.minItems,
          maxItems: fld.maxItems,
          options: fld.options?.filter((opt: string) => opt) || undefined,
          itemTemplate: null // Expanda se precisar de complexos
        };
        return field;
      })
    }));

    return JSON.stringify({ sections }, null, 2);
  }

  getSectionsControls(): AbstractControl[] {
    return (this.schemaForm.get('sections') as FormArray)?.controls || [];
  }

  getFieldsControls(sectionIndex: number): AbstractControl[] {
    const section = (this.schemaForm.get('sections') as FormArray).at(sectionIndex) as FormGroup;
    return (section.get('fields') as FormArray)?.controls || [];
  }

  getOptionsControls(sectionIndex: number, fieldIndex: number): AbstractControl[] {
    const section = (this.schemaForm.get('sections') as FormArray).at(sectionIndex) as FormGroup;
    const field = (section.get('fields') as FormArray).at(fieldIndex) as FormGroup;
    return (field.get('options') as FormArray)?.controls || [];
  }

  onSubmit() {
    // Novo: Setar o template no DTO baseado no modo
    this.rpgSystemCreateDto.characterSheetTemplate = this.templateMode === 'visual'
      ? this.serializeSchema()
      : this.rawTemplate;

    if (this.isEditMode && this.systemId) {
      this.rpgSystemService.updateRpgSystem(this.systemId, this.rpgSystemCreateDto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => console.error('Erro ao atualizar sistema:', err)
      });
    } else {
      this.rpgSystemService.createRpgSystem(this.rpgSystemCreateDto).subscribe({
        next: () => this.router.navigate(['/admin']),
        error: (err) => console.error('Erro ao criar sistema:', err)
      });
    }
  }
}