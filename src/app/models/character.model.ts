export interface Character {
    id: string;
    name: string;
    race: string | null;
    class: string | null;
    level: number;
}

export interface CharacterDetail extends Character {
  systemSpecificData: string | null;
  characterSheetTemplate: string | null;
  rpgSystemId: number;
  campaignId: string | null;
}

export interface CharacterCreateDto  {
  name: string;
  race: string | null;
  class: string | null;
  level: number;
  systemSpecificData: string | null;
  rpgSystemId: number;
  campaignId: string | null;
}

export interface CharacterUpdateDto{
  name: string;
  race: string | null;
  class: string | null;
  level: number;
  systemSpecificData: string | null;
  campaignId: string | null;
}