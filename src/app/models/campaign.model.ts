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
}

export interface CampaignCreateDto{
    name: string;
    description: string | null;
    rpgSystemId: number;
}