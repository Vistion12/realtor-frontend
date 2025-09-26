import { authHeaders, authHeadersFormData } from '../utils/auth';

const BASE_URL = "http://localhost:5100/api";

export interface PropertyRequest{
    title: string;
    type: string;
    price: number;
    address: string;
    area: number;
    rooms: number;
    description: string;
    isActive: boolean;
    images?: PropertyImageRequest[];
}

export interface PropertyImageRequest {
    url: string;
    isMain: boolean;
}

export const getAllProperties = async () => {
    const response = await fetch(`${BASE_URL}/Properties`);
    return response.json();
};

export const createProperty = async (propertyRequest: PropertyRequest): Promise<string> => {
    const response = await fetch(`${BASE_URL}/Properties`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(propertyRequest),
    });

    if (!response.ok) {
        throw new Error("Ошибка при создании объекта");
    }
    
    const propertyId = await response.text();
    return propertyId;
};

export const updateProperty = async (id: string, propertyRequest: PropertyRequest) => {
    const response = await fetch(`${BASE_URL}/Properties/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(propertyRequest),
    });
    
    if (!response.ok) {
        throw new Error("Ошибка при обновлении объекта");
    }
};

export const deleteProperty = async (id: string) => {
    const response = await fetch(`${BASE_URL}/Properties/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    
    if (!response.ok) {
        throw new Error("Ошибка при удалении объекта");
    }
};

export const uploadPropertyImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/FileUpload/property-image`, {
        method: 'POST',
        headers: authHeadersFormData(),
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
    }
    
    const data = await response.json();
    return data.url;
};