import { Character } from "./character.model";

export interface Campaign {
    id: string;
    name: string;
    rpgSystemId: number;
}

export interface CampaignDetail {
    id: string;
    name: string;
    description: string | null;
    rpgSystemId: number;
    characters: Character[];
}

export interface CampaignCreateDto{
    name: string;
    description: string | null;
    rpgSystemId: number;
}