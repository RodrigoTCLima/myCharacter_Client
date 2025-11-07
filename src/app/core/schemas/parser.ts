import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TemplateSection, TemplateField } from './character-sheet-schema.model';

/**
 * Essa função é o coração do parser.
 * Ela recebe o JSON bruto (string) vindo do backend
 * e opcionalmente os dados de um personagem já existente.
 * Retorna o schema interpretado + o FormGroup reativo.
 */
export function buildCharacterForm(templateJson: string | null, characterData?: any): {
    schema: TemplateSection[];
    form: FormGroup;
} {
    let parsedTemplate: any;

    console.log("aqui está o json não parseado", templateJson);
    if(templateJson == null){
        console.error('Erro ao fazer parse do CharacterSheetTemplate, pois está nulo');
        throw new Error('O template de ficha está vazio.');
    }
    // 1️⃣ Tenta converter a string JSON em objeto JS
    try {
        parsedTemplate = JSON.parse(templateJson);
        console.log("aqui eles já parseado:", parsedTemplate);
    } catch (err) {
        console.error('Erro ao fazer parse do CharacterSheetTemplate:', err);
        throw new Error('O template de ficha está inválido ou corrompido.');
    }

    // 2️⃣ Valida estrutura mínima (precisa ter "sections")
    if (!parsedTemplate.sections || !Array.isArray(parsedTemplate.sections)) {
        throw new Error('O template de ficha precisa conter uma propriedade "sections".');
    }

    const sections: TemplateSection[] = parsedTemplate.sections;
    const formSections: Record<string, FormGroup> = {};

    // 3️⃣ Para cada seção do template (ex: Atributos, Perícias, etc.)
    for (const section of sections) {
        const sectionGroup: Record<string, FormControl> = {};

        // 4️⃣ Para cada campo dentro da seção
        for (const field of section.fields as TemplateField[]) {
            const value =
                (characterData && characterData[field.key] !== undefined)
                    ? characterData[field.key]
                    : field.default ?? getDefaultValueForType(field.type);

            // 5️⃣ Define as validações dinamicamente
            const validators = [];
            if (field.required) validators.push(Validators.required);
            if (typeof field.min === 'number') validators.push(Validators.min(field.min));
            if (typeof field.max === 'number') validators.push(Validators.max(field.max));

            // 6️⃣ Cria o FormControl
            sectionGroup[field.key] = new FormControl(
                { value, disabled: !!field.disabled },
                validators
            );
        }

        // 7️⃣ Cada seção vira um FormGroup
        formSections[section.name] = new FormGroup(sectionGroup);
    }

    // 8️⃣ Junta tudo em um FormGroup principal
    const form = new FormGroup(formSections);

    // 9️⃣ Retorna o schema e o formulário
    return { schema: sections, form };
}

/**
 * Retorna um valor padrão para cada tipo de campo
 * usado quando o campo não tem valor ou default definido.
 */
function getDefaultValueForType(type: string): any {
    switch (type) {
        case 'text':
        case 'textarea':
        case 'select':
            return '';
        case 'number':
            return 0;
        case 'boolean':
            return false;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}
