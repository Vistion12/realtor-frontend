"use client";

import { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { createClient, updateClient, ClientRequest, Client } from "../services/clients";
import { SourceType } from "../types";

interface Props {
  client?: Client; // для редактирования
  onSuccess: () => void;
  onCancel?: () => void;
}

export const ClientForm = ({ client, onSuccess, onCancel }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ClientRequest) => {
    setLoading(true);
    try {
      if (client) {
        // Редактирование существующего клиента
        await updateClient(client.id, values);
        message.success("Клиент обновлен");
      } else {
        // Создание нового клиента
        await createClient(values);
        message.success("Клиент добавлен");
      }
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error("Ошибка сохранения клиента");
    } finally {
      setLoading(false);
    }
  };

  const sourceOptions = [
    { value: "website", label: "Сайт" },
    { value: "telegram", label: "Telegram" },
    { value: "phone_call", label: "Телефонный звонок" },
    { value: "instagram_ads", label: "Instagram Реклама" },
    { value: "recommendation", label: "Рекомендация" },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={client ? {
        name: client.name,
        phone: client.phone,
        email: client.email,
        source: client.source,
        notes: client.notes
      } : {}}
    >
      <Form.Item 
        name="name" 
        label="Имя клиента"
        rules={[{ required: true, message: 'Введите имя клиента' }]}
      >
        <Input placeholder="Иван Иванов" />
      </Form.Item>

      <Form.Item 
        name="phone" 
        label="Телефон"
        rules={[{ required: true, message: 'Введите телефон' }]}
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
        name="source" 
        label="Источник"
        rules={[{ required: true, message: 'Выберите источник' }]}
      >
        <Select placeholder="Выберите источник" options={sourceOptions} />
      </Form.Item>

      <Form.Item 
        name="notes" 
        label="Заметки"
      >
        <Input.TextArea 
          placeholder="Дополнительная информация о клиенте..." 
          rows={3}
        />
      </Form.Item>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
        >
          {client ? 'Сохранить' : 'Добавить'}
        </Button>
      </div>
    </Form>
  );
};