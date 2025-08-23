export interface PropertyRequest{
    title: string;
    type: string; // novostroyki, secondary, rent, countryside, invest
    price: number;
    address: string;
    area: number;
    rooms: number;
    description: string;
    isActive: boolean;
}

export const getAllProperties = async ()=>{
    const response = await fetch("http://localhost:5100/Properties");
    return response.json();
};

export const createProperty = async (propertyRequest: PropertyRequest): Promise<string> => {
    const response = await fetch("http://localhost:5100/Properties", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(propertyRequest),
    });
    
    // Бекенд возвращает GUID созданного объекта
    const propertyId = await response.text();
    return propertyId;
};

export const updateProperty = async (id: string, propertyRequest: PropertyRequest) => {
    await fetch(`http://localhost:5100/Properties/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(propertyRequest),
    });
};

export const deleteProperty = async (id: string) => {
    await fetch (`http://localhost:5100/Properties/${id}`, {
        method: "DELETE",
    });
};

// Добавляем методы для работы с изображениями
export const addImageToProperty = async (propertyId: string, imageUrl: string, isMain: boolean = false) => {
    await fetch(`http://localhost:5100/Properties/${propertyId}/images`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl, isMain }),
    });
};

export const removeImageFromProperty = async (propertyId: string, imageId: string) => {
    await fetch(`http://localhost:5100/Properties/${propertyId}/images/${imageId}`, {
        method: "DELETE",
    });
};

export const setMainImage = async (propertyId: string, imageId: string) => {
    await fetch(`http://localhost:5100/Properties/${propertyId}/images/${imageId}/main`, {
        method: "PUT",
    });
};

// Добавляем загрузку файлов
export const uploadPropertyImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:5100/api/FileUpload/property-image', {
        method: 'POST',
        body: formData,
    });
    
    const data = await response.json();
    return data.url;
};