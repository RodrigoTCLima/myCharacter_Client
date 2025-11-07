export interface TemplateSection {
  name: string;
  fields: TemplateField[];
}

export interface TemplateField {
  label: string;
  key: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'array';
  options?: string[];
  default?: any;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
}
