import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TemplateSection, TemplateField } from './character-sheet-schema.model';

/**
 * Resultado com subs para cleanup
 */
export interface CharacterFormResult {
  schema: TemplateSection[];
  form: FormGroup;
  subscriptions: Subscription[];
}

export function buildCharacterForm(templateJson: string | null, characterData?: any): CharacterFormResult {
  let parsedTemplate: any;

  if (templateJson == null) {
    throw new Error('Template vazio.');
  }

  try {
    parsedTemplate = JSON.parse(templateJson);
  } catch (err) {
    throw new Error('Template inválido.');
  }

  if (!parsedTemplate.sections || !Array.isArray(parsedTemplate.sections)) {
    throw new Error('Precisa de "sections".');
  }

  const sections: TemplateSection[] = parsedTemplate.sections;
  const formSections: Record<string, FormGroup> = {};
  const subscriptions: Subscription[] = [];

  // Cria form base
  for (const section of sections) {
    const sectionGroup: Record<string, AbstractControl> = {};

    for (const field of section.fields) {
      const validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.min != null) validators.push(Validators.min(field.min));
      if (field.max != null) validators.push(Validators.max(field.max));

      let control: AbstractControl;

      if (field.type === 'array') {
        // Novo: Cria FormArray tipado para arrays
        const itemValues = characterData?.[field.key] ?? []; // Dados salvos ou vazio
        const array = new FormArray<FormControl<any>>([]); // Tipagem corrigida para evitar 'never'
        const minItems = field.minItems ?? 0;

        // Popula com dados salvos ou defaults
        const initialCount = Math.max(minItems, itemValues.length);
        for (let i = 0; i < initialCount; i++) {
          const itemValue = itemValues[i] ?? getDefaultValueForType(field.itemType ?? 'text');
          array.push(new FormControl(itemValue));
        }

        control = array;
      } else {
        const value = characterData?.[field.key] ?? field.default ?? getDefaultValueForType(field.type);
        control = new FormControl(
          { value, disabled: !!field.disabled },
          validators
        );
      }

      // Novo: Para selects com allowCustom, adiciona control extra
      if (field.type === 'select' && field.allowCustom) {
        const customValue = characterData?.[field.key] !== field.options?.includes(characterData?.[field.key]) ? characterData?.[field.key] : '';
        sectionGroup[field.key + '_custom'] = new FormControl(customValue);
      }

      sectionGroup[field.key] = control;
    }

    formSections[section.name] = new FormGroup(sectionGroup);
  }

  const form = new FormGroup(formSections);

  // Configura cálculos dinâmicos
  setupCalculations(form, sections, subscriptions);

  return { schema: sections, form, subscriptions };
}

export function getDefaultValueForType(type: string): any {
  switch (type) {
    case 'text': case 'textarea': case 'select': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'array': return [];
    default: return null;
  }
}

/**
 * Configura subs e calcs para todos fields com calculation
 */
function setupCalculations(form: FormGroup, sections: TemplateSection[], subs: Subscription[]): void {
  sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.calculation && field.dependencies?.length) {
        const derivedPath = `${section.name}.${field.key}`;
        const derivedControl = form.get(derivedPath);
        if (!derivedControl) return;

        const depPaths = field.dependencies.map(dep => `${findSectionForKey(dep, sections)}.${dep}`);
        const depControls = depPaths.map(path => form.get(path)).filter(c => c) as FormControl[];

        if (depControls.length !== field.dependencies.length) return;

        // Calc inicial
        updateDerived(derivedControl, field.calculation, field.dependencies, form, sections);

        // Subs em changes
        depControls.forEach(ctrl => {
          const sub = ctrl.valueChanges.subscribe(() => {
            updateDerived(derivedControl, field.calculation!, field.dependencies!, form, sections);
          });
          subs.push(sub);
        });
      }
    });
  });
}

/**
 * Atualiza field derivado com eval da formula
 */
function updateDerived(
  control: AbstractControl,
  formula: string,
  deps: string[],
  form: FormGroup,
  sections: TemplateSection[]
): void {
  const values: Record<string, any> = {};
  deps.forEach(dep => {
    const depPath = `${findSectionForKey(dep, sections)}.${dep}`;
    values[dep] = form.get(depPath)?.value ?? 0;
  });

  try {
    const calcFn = new Function(...deps, `return ${formula};`);
    const newValue = calcFn(...deps.map(d => values[d]));
    control.setValue(newValue, { emitEvent: true });
  } catch (err) {
    console.error('Erro na fórmula:', formula, err);
  }
}

/**
 * Encontra seção de um key (cacheável se performance issue)
 */
function findSectionForKey(key: string, sections: TemplateSection[]): string {
  for (const sec of sections) {
    if (sec.fields.some(f => f.key === key)) {
      return sec.name;
    }
  }
  console.warn(`Seção não encontrada para key: ${key}`);
  return '';
}