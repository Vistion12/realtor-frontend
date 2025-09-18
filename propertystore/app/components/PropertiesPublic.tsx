import Card from "antd/es/card/Card";
import { CatrdTitle } from "./Cardtitle";
import { ImageCarousel } from "./ImageCarousel";
import { ViewingForm } from "./ViewingForm";
import { Property } from "../Models/Property";
import { ExpandableText } from "./ExpandableText";

interface Props {
  properties: Property[];
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

export const PropertiesPublic = ({ properties }: Props) => {
  return (
    <div className="cards" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: '24px' 
    }}>
      {properties.map((property: Property) => (
        <Card 
          key={property.id}
          hoverable
          cover={
            <ImageCarousel 
              images={property.images} 
              propertyTitle={property.title}
            />
          }
          styles={{ 
            body: { padding: '16px' } 
          }}
        >
          {/* Заголовок с ценой */}
          <div style={{ 
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: '12px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              {property.title}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#1890ff'
            }}>
              {property.price.toLocaleString('ru-RU')} ₽
            </p>
          </div>

          {/* Характеристики */}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Тип:</strong> {getPropertyTypeLabel(property.type)}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Адрес:</strong> {property.address}
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Площадь:</strong> {property.area} м²
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>Комнат:</strong> {property.rooms}
            </p>
          </div>

          {/* Описание */}
          <div style={{ marginBottom: '16px' }}>
            <ExpandableText 
              text={property.description} 
              maxLength={100} 
            />
          </div>
          
          {/* Кнопка заявки на просмотр */}
          <ViewingForm property={property} />
        </Card> 
      ))}
    </div>
  );
};