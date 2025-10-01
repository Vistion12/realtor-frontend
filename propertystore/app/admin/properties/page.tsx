"use client";

import { useEffect, useState, useMemo } from "react";
import { createProperty, deleteProperty, getAllProperties, PropertyRequest, updateProperty } from "../../services/properties";
import { message } from "antd";
import { Property } from "../../Models/Property";
import { useAuth } from "@/app/contexts/AuthContext";
import { CreateUpdateProperty, Mode } from "../../components/CreateUpdateProperty";
import { Properties } from "../../components/Properties";
import { PropertyFilters } from "../../components/PropertyFilters";

interface FilterState {
  types: string[];
  priceRange: [number, number];
  areaRange: [number, number];
  rooms: number[];
  searchQuery: string;
}

export default function AdminPropertiesPage(){
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
    
    const { checkAuthError } = useAuth();
    const [values, setValues] = useState<Property>(defaultValues);
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);
    const [filters, setFilters] = useState<FilterState>({
        types: [],
        priceRange: [0, 100000000],
        areaRange: [0, 500],
        rooms: [],
        searchQuery: ''
    });

    useEffect(() => {
        const getProperties = async () => {
            try {
                const propertiesData = await getAllProperties();
                setAllProperties(propertiesData);
            } catch (error) {
                message.error('Ошибка загрузки объектов');
            } finally {
                setLoading(false);
            }
        };

        getProperties();
    }, []);

    // Фильтрация объектов для админки
    const filteredProperties = useMemo(() => {
        return allProperties.filter(property => {
            // Фильтр по типу
            if (filters.types.length > 0 && !filters.types.includes(property.type)) {
                return false;
            }

            // Фильтр по цене
            if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
                return false;
            }

            // Фильтр по площади
            if (property.area < filters.areaRange[0] || property.area > filters.areaRange[1]) {
                return false;
            }

            // Фильтр по комнатам
            if (filters.rooms.length > 0 && !filters.rooms.includes(property.rooms)) {
                return false;
            }

            // Поиск по названию и адресу
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const matchesTitle = property.title.toLowerCase().includes(query);
                const matchesAddress = property.address.toLowerCase().includes(query);
                if (!matchesTitle && !matchesAddress) {
                    return false;
                }
            }

            return true;
        });
    }, [allProperties, filters]);

    const handleCreateProperty = async (request: PropertyRequest) => {
        try {
            const propertyId = await createProperty(request);
            message.success('Объект создан успешно');
            closeModal();
            const propertiesData = await getAllProperties();
            setAllProperties(propertiesData);
        } catch (error: any) {
            checkAuthError(error); 
            message.error('Ошибка при создании объекта');
        }
    };

    const handleUpdateProperty = async (id: string, request: PropertyRequest) => {
        try {
            await updateProperty(id, request);
            message.success('Объект обновлен успешно');
            closeModal();
            const propertiesData = await getAllProperties();
            setAllProperties(propertiesData);
        } catch (error: any) {
            checkAuthError(error);
            message.error('Ошибка при обновлении объекта');
        }
    }

    const handleDeleteProperty = async (id: string) => {
        try {
            await deleteProperty(id);
            message.success('Объект удален успешно'); 
            const propertiesData = await getAllProperties();
            setAllProperties(propertiesData);
        } catch (error: any) {
            checkAuthError(error); 
            message.error('Ошибка при удалении объекта');
        }
    }

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };
 
    const openModal = () => {
        setMode(Mode.Create);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    };

    const openEditModal = (property: Property) => {
        setMode(Mode.Edit);
        setValues(property);
        setIsModalOpen(true);
    }   

    return (
        <div className="catalog-page">
            {/* Заголовок и кнопка добавления */}
            <div className="catalog-header container">
                <div className="admin-header-content">
                    <div>
                        <h1 className="catalog-title">Управление объектами</h1>
                        <p className="catalog-subtitle">
                            Всего объектов: {allProperties.length} | Найдено: {filteredProperties.length}
                        </p>
                    </div>
                    <button 
                        className="motivation-card-button button transparent"
                        onClick={openModal}
                        style={{ height: '50px' }}
                    >
                        + Добавить объект
                    </button>
                </div>
            </div>

            {/* Основной контент с фильтрами */}
            <div className="catalog-layout container">
                {/* Боковая панель с фильтрами */}
                <aside className="filters-column">
                    <PropertyFilters onFiltersChange={handleFiltersChange} />
                </aside>
                
                {/* Основная сетка объектов */}
                <main className="properties-grid">
                    {loading ? (
                        <div className="loading-state">
                            <h3>Загрузка объектов...</h3>
                        </div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="empty-state">
                            <h3>Объекты не найдены</h3>
                            <p>Попробуйте изменить параметры фильтрации или добавьте новый объект</p>
                        </div>
                    ) : (
                        <div className="cards admin-cards">
                            <Properties 
                                properties={filteredProperties} 
                                handleOpen={openEditModal} 
                                handleDelete={handleDeleteProperty}
                            />
                        </div>
                    )}
                </main>
            </div>

            {/* Модальное окно создания/редактирования */}
            <CreateUpdateProperty 
                mode={mode} 
                values={values} 
                isModalOpen={isModalOpen} 
                handleCreate={handleCreateProperty} 
                handleUpdate={handleUpdateProperty} 
                handleCancel={closeModal}
            />
        </div>
    );
}