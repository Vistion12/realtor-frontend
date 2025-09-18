"use client";

import  Button  from "antd/es/button/button";
import { Properties } from "../../components/Properties";
import { useEffect, useState } from "react";
import { createProperty, deleteProperty, getAllProperties, PropertyRequest, updateProperty } from "../../services/properties";
import Title from "antd/es/typography/Title";
import { CreateUpdateProperty, Mode } from "../../components/CreateUpdateProperty";
import { message } from "antd";
import { Property } from "../../Models/Property";

export default function PropertiesPage(){
    const defaultValues = {
        id: "",
        title: "",
        type: '',
        price: 1,
        address: "",
        area: 1,
        rooms: 1,
        description: "",
        isActive: true,
        createdAt: new Date(),
        images: []
    } as Property;

    const [values, setValues] = useState<Property>(defaultValues);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen]=useState(false);
    const [mode, setMode] = useState(Mode.Create);

    useEffect(() => {
        const getProperties = async () => {
            try {
                const propertiesData = await getAllProperties();
                setProperties(propertiesData);
            } catch (error) {
                message.error('Ошибка загрузки объектов');
            } finally {
                setLoading(false);
            }
        };

        getProperties();
    }, []);

        
    const handleCreateProperty = async (request: PropertyRequest) => {
        try {
            const propertyId = await createProperty(request);
            message.success('Объект создан успешно');
            closeModal();
            const propertiesData = await getAllProperties();
            setProperties(propertiesData);
        } catch (error) {
            message.error('Ошибка при создании объекта');
        }
    };

    const handleUpdateProperty = async (id: string, request: PropertyRequest) => {
        try {
            await updateProperty(id, request);
            message.success('Объект обновлен успешно');
            closeModal();
            const propertiesData = await getAllProperties();
            setProperties(propertiesData);
            message.success('Объект обновлен успешно');
        } catch (error) {
            message.error('Ошибка при обновлении объекта');
        }
    }

    const handleDeleteProperty= async (id: string) => {
        await deleteProperty(id);

        const propertiesData  = await getAllProperties();
        setProperties(propertiesData);
    }
 
    const openModal=()=>{
        setIsModalOpen(true);
    };

    const closeModal= ()=>{
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    const openEditModal = (property: Property) =>{
        setMode(Mode.Edit);
        setValues(property);
        setIsModalOpen(true);
    }   

    return (
        <div>
            <Button 
                type = "primary"
                style ={{marginTop: "30px"}}
                size="large"
                onClick={openModal}
            >
                Добавить недвижимость
            </Button>            
            <CreateUpdateProperty 
                mode={mode} 
                values={values} 
                isModalOpen={isModalOpen} 
                handleCreate={handleCreateProperty} 
                handleUpdate={handleUpdateProperty} 
                handleCancel={closeModal}
            />
            {loading ? (
                <Title>load....</Title>
                ) : (
                    <Properties 
                        properties={properties} 
                        handleOpen={openEditModal} 
                        handleDelete={handleDeleteProperty}
                    />
                )}            
        </div>
    );
}

