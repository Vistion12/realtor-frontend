export interface Property {
    id: string;
    title: string;
    type: string; 
    price: number;
    address: string;
    area: number;
    rooms: number;
    description: string;
    mainPhotoUrl?: string;
    isActive: boolean;
    createdAt: Date;
    images: PropertyImage[];
}

export interface PropertyImage {
    id: string;
    url: string;
    isMain: boolean;
    order: number;
}