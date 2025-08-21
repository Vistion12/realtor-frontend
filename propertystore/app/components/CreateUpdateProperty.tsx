import Modal from "antd/es/modal/Modal";
import { PropertyRequest } from "../services/properties";
import Input from "antd/es/input/Input";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { Select, InputNumber, Checkbox, Form, Row, Col } from "antd";

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
        }
    }, [values]);

    const handleOnOk = async () => {
        const propertyRequest: PropertyRequest = {
            title,
            type,
            price,
            address,
            area,
            rooms,
            description,
            isActive
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
                                    onChange={(value: number | null) => setPrice(value || 1)}
                                    placeholder="Цена"
                                    min={1}
                                    style={{ width: "100%" }}
                                    formatter = {(value: string | number | undefined) => 
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                                    }
                                    parser={(value: string | undefined) => 
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
                                    onChange={(value: number | null) => setArea(value || 1)}
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
                            onChange={(value: number | null) => setRooms(value || 1)}
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsActive(e.target.checked)}
                        >
                            Активный объект
                        </Checkbox>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};