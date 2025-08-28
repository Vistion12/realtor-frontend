import Card from "antd/es/card/Card";
import { CatrdTitle } from "./Cardtitle";
import Button from "antd/es/button/button";
import { ImageCarousel } from "./ImageCarousel";

interface Props {
  properties: Property[];
  handleDelete: (id: string) => void;
  handleOpen: (property: Property) => void;
}

const getPropertyTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'novostroyki': 'Новостройки',
    'secondary': 'Вторичное жилье',
    'rent': 'Аренда',
    'countryside': 'Загородная недвижимость',
    'invest': 'Инвестиционная недвижимость'
  };
  
  return typeMap[type] || type;
};

export const Properties = ({ properties, handleDelete, handleOpen }: Props) => {
  return (
    <div className="cards">
      {properties.map((property: Property) => (
        <Card 
          key={property.id} 
          title={<CatrdTitle title={property.title} price={property.price} />}
          variant="borderless"
          cover={
            <ImageCarousel 
              images={property.images} 
              propertyTitle={property.title}
            />
          }
        >
          <p>Тип недвижимости: {getPropertyTypeLabel(property.type)}</p> 
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
      ))}
    </div>
  );
};