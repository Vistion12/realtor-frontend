"use client";

import { useState } from "react";
import { Modal, Button, Form, Input, Select, message } from "antd";
import { createRequest } from "../services/requests";
import { ConsultationFormData, PurposeType } from "../types";

export const ConsultationForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ConsultationFormData) => {
    setLoading(true);
    try {
      await createRequest({
        type: "consultation",
        message: JSON.stringify(values),
        clientName: values.name,
        clientPhone: values.phone,
        clientEmail: values.email,
        source: "website"
      });
      message.success("Заявка отправлена!");
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
        size="large" 
        onClick={() => setIsModalOpen(true)}
        style={{ marginTop: '20px' }}
      >
        Получить консультацию
      </Button>

      <Modal
        title="Заявка на консультацию"
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
            name="purpose" 
            label="Цель обращения"
            rules={[{ required: true, message: 'Пожалуйста, выберите цель' }]}
          >
            <Select placeholder="Выберите цель">
              <Select.Option value="buy">Купить недвижимость</Select.Option>
              <Select.Option value="sell">Продать недвижимость</Select.Option>
              <Select.Option value="rent">Арендовать</Select.Option>
              <Select.Option value="other">Другое</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="message" 
            label="Сообщение"
          >
            <Input.TextArea 
              placeholder="Расскажите о ваших потребностях..." 
              rows={4}
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