import Card from "antd/es/card/Card";
import { CatrdTitle } from "./Cardtitle";
import  Button  from "antd/es/button/button";
import { Flex } from "antd";

interface Props{
    properties: Property[];
    handleDelete: (id: string) => void;
    handleOpen: (property: Property) => void;
}

export const Properties = ({properties, handleDelete, handleOpen}: Props)=> {
    return (
        <div className="cards">
            {properties.map((property: Property)=>(
                <Card 
                    key={property.id} 
                    title = {<CatrdTitle title={property.title} price={property.price} />}
                    variant="borderless"
                >
                    <p>{property.description}</p>
                    <div className="card_buttons">
                        <Button 
                            onClick={()=> handleOpen(property)} 
                            style={{ flex: 1 }}
                        >
                            Редактировать
                        </Button>
                        <Button 
                            onClick={()=> handleDelete(property.id)} 
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