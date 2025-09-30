"use client";

import { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
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
      {/* Кнопка открытия формы - стилизованная под ваш дизайн */}
      <button 
        className="motivation-card-button button transparent"
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        Получить консультацию
      </button>

      <Modal
        title="Заявка на консультацию"
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
            name="purpose" 
            label="Цель обращения"
            rules={[{ required: true, message: 'Пожалуйста, выберите цель' }]}
          >
            <Select 
              placeholder="Выберите цель"
              className="input"
            >
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