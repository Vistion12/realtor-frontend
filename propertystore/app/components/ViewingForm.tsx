"use client";

import { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, message } from "antd";
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
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)}
        style={{ marginTop: '8px', width: '100%' }}
      >
        Заявка на просмотр
      </Button>

      <Modal
        title={`Заявка на просмотр: ${property.title}`}
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        footer={null}
        width={500}
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
            <Input placeholder="Иван Иванов" />
          </Form.Item>
          
          <Form.Item 
            name="phone" 
            label="Телефон"
            rules={[{ required: true, message: 'Пожалуйста, введите ваш телефон' }]}
          >
            <Input placeholder="+7 (999) 123-45-67" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email"
            rules={[{ type: 'email', message: 'Введите корректный email' }]}
          >
            <Input placeholder="ivan@example.com" />
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
            />
          </Form.Item>
          
          <Form.Item 
            name="message" 
            label="Дополнительная информация"
          >
            <Input.TextArea 
              placeholder="Удобное время, особые пожелания..." 
              rows={3}
            />
          </Form.Item>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ width: '100%' }}
          >
            Отправить заявку
          </Button>
        </Form>
      </Modal>
    </>
  );
};