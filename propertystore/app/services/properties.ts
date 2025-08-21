export interface PropertyRequest{
    title: string;
    type: string; // novostroyki, secondary, rent, countryside, invest
    price: number;
    address: string;
    area: number;
    rooms: number;
    description: string;
    mainPhotoUrl?: string; // опциональное поле, так как в бэкенде есть геттер
    isActive: boolean;
}

export const getAllProperties = async ()=>{
    const response = await fetch("http://localhost:5100/Properties");
    return response.json();
};

export const createProperty = async (propertyRequest: PropertyRequest) => {
    await fetch("http://localhost:5100/Properties", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(propertyRequest),
    });
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