import Modal from "antd/es/modal/Modal";
import { PropertyRequest } from "../services/properties";
import { useEffect, useState } from "react";
import { Select, InputNumber, Checkbox, Form, Row, Col, Button, Upload, message, Input } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { uploadPropertyImage } from '../services/properties';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Property, PropertyImage } from "../Models/Property";

const { TextArea } = Input;

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
    const [images, setImages] = useState<PropertyImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (values) {
            // Устанавливаем все значения формы
            form.setFieldsValue({
                title: values.title,
                type: values.type,
                price: values.price,
                address: values.address,
                area: values.area,
                rooms: values.rooms,
                description: values.description,
                isActive: values.isActive
            });
            setImages(values.images || []);
        } else {
            // Сбрасываем форму для создания нового объекта
            form.resetFields();
            form.setFieldsValue({
                price: 1,
                area: 1,
                rooms: 1,
                isActive: true
            });
            setImages([]);
        }
    }, [values, form]);

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
        try {
            // Получаем ВСЕ значения из формы
            const formValues = await form.validateFields();
            
            // Преобразуем images в формат для отправки
            const imageRequests = images.map(img => ({
                url: img.url,
                isMain: img.isMain
            }));

            const propertyRequest: PropertyRequest = {
                ...formValues, // Все значения из формы
                images: imageRequests
            };

            mode === Mode.Create 
                ? handleCreate(propertyRequest) 
                : handleUpdate(values.id, propertyRequest);
        } catch (error) {
            // Ошибки валидации будут показаны автоматически
            console.log('Validation failed:', error);
        }
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
            className="property-modal"
            title={mode === Mode.Create ? "Добавить объект недвижимости" : "Редактировать объект"}
            open={isModalOpen} 
            onOk={handleOnOk}
            onCancel={handleCancel}
            cancelText="Отмена"
            okText={mode === Mode.Create ? "Создать" : "Сохранить"}
        >
            <div className="property_modal" style={{ padding: '16px 0' }}>
                <Form 
                    form={form}
                    layout="vertical"
                    initialValues={{
                        price: 1,
                        area: 1,
                        rooms: 1,
                        isActive: true
                    }}
                >
                    {/* Название */}
                    <Form.Item 
                        name="title" 
                        label="Название объекта"
                        rules={[{ required: true, message: 'Пожалуйста, введите название объекта' }]}
                    >
                        <Input placeholder="Введите название объекта" />
                    </Form.Item>

                    {/* Тип недвижимости */}
                    <Form.Item 
                        name="type" 
                        label="Тип недвижимости"
                        rules={[{ required: true, message: 'Пожалуйста, выберите тип недвижимости' }]}
                    >
                        <Select
                            placeholder="Выберите тип недвижимости"
                            options={typeOptions}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        {/* Цена */}
                            <Col span={12}>
                                <Form.Item 
                                    name="price" 
                                    label="Цена"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите цену' }]}
                                >
                                    <InputNumber<number>
                                        placeholder="Цена"
                                        min={1}
                                        style={{ width: "100%" }}
                                        formatter={(value) => 
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                                        }
                                        parser={(value) => 
                                            parseInt(value?.replace(/\s/g, '') || '1', 10)
                                        }
                                    />
                                </Form.Item>
                            </Col>

                        {/* Площадь */}
                            <Col span={12}>
                                <Form.Item 
                                    name="area" 
                                    label="Площадь (м²)"
                                    rules={[{ required: true, message: 'Пожалуйста, укажите площадь' }]}
                                >
                                    <InputNumber<number>
                                        placeholder="Площадь"
                                        min={1}
                                        step={0.1}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                    </Row>

                    {/* Адрес */}
                    <Form.Item 
                        name="address" 
                        label="Адрес"
                        rules={[{ required: true, message: 'Пожалуйста, введите адрес' }]}
                    >
                        <Input placeholder="Введите полный адрес" />
                    </Form.Item>

                    {/* Количество комнат */}
                    <Form.Item 
                        name="rooms" 
                        label="Количество комнат"
                        rules={[{ required: true, message: 'Пожалуйста, укажите количество комнат' }]}
                    >
                        <InputNumber<number>
                            placeholder="Количество комнат"
                            min={1}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    {/* Описание с валидацией */}
                    <Form.Item 
                        name="description" 
                        label="Описание"
                        rules={[
                            { 
                                max: 2000, 
                                message: 'Описание не должно превышать 2000 символов' 
                            }
                        ]}
                    >
                        <TextArea
                            showCount 
                            maxLength={2000}
                            autoSize={{ minRows: 3, maxRows: 8 }}
                            placeholder="Подробное описание объекта (максимум 2000 символов)"
                        />
                    </Form.Item>

                    {/* Статус активности */}
                    <Form.Item name="isActive" valuePropName="checked">
                        <Checkbox>Активный объект</Checkbox>
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