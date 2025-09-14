import Modal from "antd/es/modal/Modal";
import { PropertyRequest } from "../services/properties";
import Input from "antd/es/input/Input";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { Select, InputNumber, Checkbox, Form, Row, Col, Button, Upload, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadPropertyImage } from '../services/properties';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Property, PropertyImage } from "../Models/Property";

interface Props {
    mode: Mode;
    values: Property;
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: PropertyRequest) => void;
    handleUpdate: (id: string, request: PropertyRequest) => void;
}

export enum Mode {
    Create,
    Edit,
}

export const CreateUpdateProperty = ({
    mode,
    values,
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate,
}: Props) => {
    const [title, setTitle] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [price, setPrice] = useState<number>(1);
    const [address, setAddress] = useState<string>("");
    const [area, setArea] = useState<number>(1);
    const [rooms, setRooms] = useState<number>(1);
    const [description, setDescription] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(true);
    const [images, setImages] = useState<PropertyImage[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (values) {
            setTitle(values.title);
            setType(values.type);
            setPrice(values.price);
            setAddress(values.address);
            setArea(values.area);
            setRooms(values.rooms);
            setDescription(values.description);
            setIsActive(values.isActive);
            setImages(values.images || []);
        }
    }, [values]);

        // В handleImageUpload добавьте валидацию
    const handleImageUpload = async (file: File) => {
    // Валидация размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
        message.error('Размер файла не должен превышать 5MB');
        return false;
    }

    // Валидация типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        message.error('Разрешены только JPG, PNG, WEBP и GIF изображения');
        return false;
    }

    setUploading(true);
    try {
        const imageUrl = await uploadPropertyImage(file);
        const newImage: PropertyImage = {
        id: Date.now().toString(),
        url: imageUrl,
        isMain: images.length === 0, // Первое изображение становится главным
        order: images.length
        };
        
        setImages([...images, newImage]);
        message.success('Изображение загружено');
    } catch (error) {
        message.error('Ошибка загрузки изображения');
    } finally {
        setUploading(false);
    }
    };

    const handleSetMainImage = (imageId: string) => {
        setImages(images.map(img => ({
            ...img,
            isMain: img.id === imageId
        })));
    };

    const handleRemoveImage = (imageId: string) => {
        setImages(images.filter(img => img.id !== imageId));
    };

    const handleOnOk = async () => {
    // Преобразуем images в формат для отправки
    const imageRequests = images.map(img => ({
        url: img.url,
        isMain: img.isMain
    }));

    const propertyRequest: PropertyRequest = {
        title,
        type,
        price,
        address,
        area,
        rooms,
        description,
        isActive,
        images: imageRequests // Добавляем изображения
    };

    mode === Mode.Create 
        ? handleCreate(propertyRequest) 
        : handleUpdate(values.id, propertyRequest);
};

    const typeOptions = [
        { value: "novostroyki", label: "Новостройки" },
        { value: "secondary", label: "Вторичное жилье" },
        { value: "rent", label: "Аренда" },
        { value: "countryside", label: "Загородная" },
        { value: "invest", label: "Инвестиционная" },
    ];

    return (
        <Modal 
            title={mode === Mode.Create ? "Добавить объект недвижимости" : "Редактировать объект"}
            open={isModalOpen} 
            onOk={handleOnOk}
            onCancel={handleCancel}
            cancelText="Отмена"
            okText={mode === Mode.Create ? "Создать" : "Сохранить"}
            width={600}
        >
            <div className="property_modal" style={{ padding: '16px 0' }}>
                <Form layout="vertical">
                    {/* Название */}
                    <Form.Item label="Название объекта" required>
                        <Input
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            placeholder="Введите название объекта"
                        />
                    </Form.Item>

                    {/* Тип недвижимости */}
                    <Form.Item label="Тип недвижимости" required>
                        <Select
                            value={type}
                            onChange={(value: string) => setType(value)}
                            placeholder="Выберите тип недвижимости"
                            options={typeOptions}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        {/* Цена */}
                        <Col span={12}>
                            <Form.Item label="Цена" required>
                                <InputNumber
                                    value={price}
                                    onChange={(value: string | number | null) => setPrice(Number(value) || 1)}
                                    placeholder="Цена"
                                    min={1}
                                    style={{ width: "100%" }}
                                    formatter={(value) => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                                    }
                                    parser={(value) => 
                                        parseInt(value?.replace(/\s/g, '') || '1')
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Площадь */}
                        <Col span={12}>
                            <Form.Item label="Площадь (м²)" required>
                                <InputNumber
                                    value={area}
                                    onChange={(value: string | number | null) => setArea(Number(value) || 1)}
                                    placeholder="Площадь"
                                    min={1}
                                    step={0.1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Адрес */}
                    <Form.Item label="Адрес" required>
                        <Input
                            value={address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                            placeholder="Введите полный адрес"
                        />
                    </Form.Item>

                    {/* Количество комнат */}
                    <Form.Item label="Количество комнат" required>
                        <InputNumber
                            value={rooms}
                            onChange={(value: string | number | null) => setRooms(Number(value) || 1)}
                            placeholder="Количество комнат"
                            min={1}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    {/* Описание */}
                    <Form.Item label="Описание">
                        <TextArea
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            placeholder="Подробное описание объекта"
                        />
                    </Form.Item>

                    {/* Статус активности */}
                    <Form.Item>
                        <Checkbox
                            checked={isActive}
                            onChange={(e: CheckboxChangeEvent) => setIsActive(e.target.checked)}
                        >
                            Активный объект
                        </Checkbox>
                    </Form.Item>
                    
                    {/* Изображения */}
                    <Form.Item label="Изображения">
                        <Upload
                            beforeUpload={(file: File) => {
                            handleImageUpload(file);
                            return false;
                            }}
                            showUploadList={false}
                            multiple
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} loading={uploading}>
                            Загрузить изображения
                            </Button>
                        </Upload>
                        
                        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {images.map((image) => (
                            <div key={image.id} style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                src={`http://localhost:5100${image.url}`}
                                alt="Property"
                                width={80}
                                height={80}
                                style={{ 
                                    objectFit: 'cover',
                                    border: image.isMain ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                    borderRadius: '4px'
                                }}                                    
                                />
                                
                                <div style={{ 
                                position: 'absolute', 
                                top: 2, 
                                right: 2,
                                display: 'flex',
                                gap: '2px'
                                }}>
                                <Button
                                    size="small"
                                    type={image.isMain ? "primary" : "default"}
                                    onClick={() => handleSetMainImage(image.id)}
                                    style={{ 
                                    minWidth: '20px', 
                                    width: '20px', 
                                    height: '20px',
                                    fontSize: '10px',
                                    padding: 0
                                    }}
                                >
                                    {image.isMain ? '✓' : '☆'}
                                </Button>
                                
                                <Button
                                    size="small"
                                    danger
                                    onClick={() => handleRemoveImage(image.id)}
                                    style={{ 
                                    minWidth: '20px', 
                                    width: '20px', 
                                    height: '20px',
                                    fontSize: '10px',
                                    padding: 0
                                    }}
                                >
                                    ×
                                </Button>
                                </div>
                                
                                {image.isMain && (
                                <div style={{ 
                                    textAlign: 'center', 
                                    fontSize: '10px',
                                    marginTop: '2px'
                                }}>
                                    Главное
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                    </Form.Item>
                    
                </Form>
            </div>
        </Modal>
    );
};