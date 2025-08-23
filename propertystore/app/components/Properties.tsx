import Card from "antd/es/card/Card";
import { CatrdTitle } from "./Cardtitle";
import  Button  from "antd/es/button/button";
import Image from "antd/es/image";

interface Props{
    properties: Property[];
    handleDelete: (id: string) => void;
    handleOpen: (property: Property) => void;
}

export const Properties = ({ properties, handleDelete, handleOpen }: Props) => {
    return (
        <div className="cards">
            {properties.map((property: Property) => {
                const mainImage = property.images.find(img => img.isMain) || property.images[0];
                
                return (
                    <Card 
                        key={property.id} 
                        title={<CatrdTitle title={property.title} price={property.price} />}
                        variant="borderless"
                        cover={
                                mainImage && (
                                    <img
                                        alt={property.title}
                                        src={`http://localhost:5100${mainImage.url}`}
                                        style={{ 
                                            height: 200, 
                                            width: '100%', 
                                            objectFit: 'cover' 
                                        }}
                                    />
                                )
                            }
                    >
                        <p>Тип недвижимости: {property.type}</p>
                        <p>Адрес: {property.address}</p>
                        <p>Площадь: {property.area} м²</p>
                        <p>Комнат: {property.rooms}</p>
                        <p>Описание: {property.description}</p>
                        
                        <div className="card_buttons">
                            <Button 
                                onClick={() => handleOpen(property)} 
                                style={{ flex: 1 }}
                            >
                                Редактировать
                            </Button>
                            <Button 
                                onClick={() => handleDelete(property.id)} 
                                danger
                                style={{ flex: 1 }}
                            >
                                Удалить
                            </Button>
                        </div>
                    </Card> 
                );
            })}
        </div>
    );
};