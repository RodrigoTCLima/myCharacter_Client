export interface TemplateSection {
  name: string;
  fields: TemplateField[];
}

export interface TemplateField {
  label: string;
  key: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'array';
  options?: string[]; // Para selects
  default?: any;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  calculation?: string;       // Fórmula JS (ex: "Math.floor((strength - 10) / 2)")
  dependencies?: string[];    // Keys que triggeram recalc

  // Para arrays: Tipo dos itens (simples por agora)
  itemType?: 'text' | 'number' | 'boolean' | 'select' | 'textarea';

  // Para expansão futura: Se itens forem objects, use template para sub-form
  itemTemplate?: any; // Optional: Para arrays complexos (ex: [{name: string, qty: number}])

  minItems?: number; // Min itens no array
  maxItems?: number; // Max itens no array

  // Para selects: Suporte a custom
  allowCustom?: boolean;
  customLabel?: string; // Label para input custom
}