'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Alert, 
  Switch, 
  Divider, 
  message, 
  Spin,
  Descriptions,
  Modal,
  Tag
} from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { clientAuthService } from '../../services/clientAuth';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function ClientSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [consentLoading, setConsentLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [consentModalVisible, setConsentModalVisible] = useState(false); // ДОБАВЛЯЕМ СОСТОЯНИЕ ДЛЯ МОДАЛКИ
  const { client, updateClient } = useAuth();

  useEffect(() => {
    if (client) {
      form.setFieldsValue({
        name: client.name,
        phone: client.phone,
        email: client.email,
      });
    }
  }, [client, form]);

  const handleGiveConsent = async () => {
    console.log('🔴 TEST: handleGiveConsent called');
    setConsentModalVisible(true); // ОТКРЫВАЕМ МОДАЛКУ
  };

  const handleConsentConfirm = async () => {
    setConsentLoading(true);
    try {
      // Получаем IP адрес пользователя
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ipAddress = ipData.ip;

      await clientAuthService.giveConsent(ipAddress, navigator.userAgent);
      
      // Обновляем клиента в контексте
      if (client) {
        updateClient({ 
          ...client,
          consentToPersonalData: true,
        });
      }
      
      message.success('Согласие успешно предоставлено');
      setConsentModalVisible(false); // ЗАКРЫВАЕМ МОДАЛКУ
    } catch (error: any) {
      message.error(error.message || 'Ошибка при предоставлении согласия');
    } finally {
      setConsentLoading(false);
    }
  };

  const handleChangePassword = async (values: { newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Пароли не совпадают');
      return;
    }

    if (values.newPassword.length < 6) {
      message.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setPasswordLoading(true);
    try {
      await clientAuthService.changePassword(values.newPassword);
      message.success('Пароль успешно изменен');
      form.setFieldsValue({
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      message.error('Ошибка при изменении пароля');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!client) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Настройки профиля</h1>

      {/* Информация о профиле */}
      <Card title="Информация о профиле" style={{ marginBottom: 24 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="ФИО">{client.name}</Descriptions.Item>
          <Descriptions.Item label="Телефон">{client.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{client.email || 'Не указан'}</Descriptions.Item>
          <Descriptions.Item label="Статус аккаунта">
            <Tag color={client.isAccountActive ? 'green' : 'red'}>
              {client.isAccountActive ? 'Активен' : 'Неактивен'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Согласие на обработку данных */}
      <Card 
        title="Согласие на обработку персональных данных" 
        style={{ marginBottom: 24 }}
        extra={
          <Switch 
            checked={client.consentToPersonalData}
            disabled={client.consentToPersonalData}
            checkedChildren="Предоставлено"
            unCheckedChildren="Не предоставлено"
          />
        }
      >
        {!client.consentToPersonalData ? (
          <div>
            <Alert
              message="Требуется ваше согласие"
              description="Для полноценной работы с системой необходимо предоставить согласие на обработку персональных данных."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
              loading={consentLoading}
              onClick={handleGiveConsent}
            >
              Предоставить согласие
            </Button>
          </div>
        ) : (
          <Alert
            message="Согласие предоставлено"
            description="Вы уже предоставили согласие на обработку персональных данных."
            type="success"
            showIcon
          />
        )}
      </Card>

      <Divider />

      {/* Смена пароля */}
      <Card title="Смена пароля">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            name="newPassword"
            label="Новый пароль"
            rules={[
              { required: true, message: 'Введите новый пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
            ]}
          >
            <Input.Password placeholder="Введите новый пароль" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Подтверждение пароля"
            rules={[
              { required: true, message: 'Подтвердите пароль' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Подтвердите новый пароль" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={passwordLoading}
            >
              Сменить пароль
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* МОДАЛКА ДЛЯ СОГЛАСИЯ - ДОБАВЛЯЕМ В КОНЕЦ JSX */}
      <Modal
        title="Согласие на обработку персональных данных"
        open={consentModalVisible}
        onOk={handleConsentConfirm}
        onCancel={() => setConsentModalVisible(false)}
        okText="Дать согласие"
        cancelText="Отмена"
        confirmLoading={consentLoading}
      >
        <div>
          <p>Я даю согласие на обработку моих персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных».</p>
          <p>Согласие предоставляется для целей сопровождения сделок с недвижимостью и оказания риелторских услуг.</p>
        </div>
      </Modal>
    </div>
  );
}