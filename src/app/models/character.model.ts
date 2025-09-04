export interface Character {
    id: string;
    name: string;
    race: string | null;
    class: string | null;
    level: number;
}

export interface CharacterDetail extends Character {
  systemSpecificData: string | null;
  rpgSystemId: number;
  campaignId: string | null;
}