"use client";

import { useState } from "react";
import { Modal, Form, Input, DatePicker, message } from "antd";
import { createRequest } from "../services/requests";
import { ViewingFormData } from "../types";
import { Property } from "../Models/Property";

interface Props {
  property: Property;
}

export const ViewingForm = ({ property }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ViewingFormData) => {
    setLoading(true);
    try {
      await createRequest({
        propertyId: property.id,
        type: "viewing",
        message: JSON.stringify({
          ...values,
          propertyTitle: property.title,
          propertyAddress: property.address
        }),
        clientName: values.name,
        clientPhone: values.phone,
        clientEmail: values.email,
        source: "website"
      });
      message.success("Заявка на просмотр отправлена!");
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error("Ошибка отправки заявки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Стилизованная кнопка открытия формы */}
      <button 
        className="motivation-card-button button transparent"
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
      >
        Заявка на просмотр
      </button>

      <Modal
        title={`Заявка на просмотр: ${property.title}`}
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        footer={null}
        width={500}
        styles={{
          body: { padding: '24px 0' },
          header: { borderBottom: '1px solid #d9d9d9', marginBottom: '0' }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item 
            name="name" 
            label="Ваше имя"
            rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
          >
            <Input 
              placeholder="Иван Иванов" 
              className="input"
            />
          </Form.Item>
          
          <Form.Item 
            name="phone" 
            label="Телефон"
            rules={[{ required: true, message: 'Пожалуйста, введите ваш телефон' }]}
          >
            <Input 
              placeholder="+7 (999) 123-45-67" 
              className="input"
            />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email"
            rules={[{ type: 'email', message: 'Введите корректный email' }]}
          >
            <Input 
              placeholder="ivan@example.com" 
              className="input"
            />
          </Form.Item>
          
          <Form.Item 
            name="preferredDate" 
            label="Предпочтительная дата"
          >
            <DatePicker 
              style={{ width: '100%' }}
              placeholder="Выберите дату"
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              className="input"
            />
          </Form.Item>
          
          <Form.Item 
            name="message" 
            label="Дополнительная информация"
          >
            <Input.TextArea 
              placeholder="Удобное время, особые пожелания..." 
              rows={3}
              className="input"
              style={{ resize: 'vertical' }}
            />
          </Form.Item>
          
          {/* Стилизованная кнопка отправки */}
          <button 
            className="motivation-card-button button transparent"
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              justifyContent: 'center',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </Form>
      </Modal>
    </>
  );
};