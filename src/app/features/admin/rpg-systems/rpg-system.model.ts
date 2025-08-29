export interface RpgSystem {
  id: number;
  name: string;
  description: string | null;
}

export interface RpgSystemDetail extends RpgSystem {
  characterSheetTemplate: string | null;
}

export interface RpgSystemCreateDto {
  name: string;
  description: string | null;
  characterSheetTemplate: string | null;
}
