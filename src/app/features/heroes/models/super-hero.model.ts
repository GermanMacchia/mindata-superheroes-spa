export interface SuperHero {
    id: string; // UUID, generado con crypto.randomUUID() al crear el héroe
    name: string;
    realName?: string;
    powers?: string[];
    universe?: 'Marvel' | 'DC' | 'Otro';
    history: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
