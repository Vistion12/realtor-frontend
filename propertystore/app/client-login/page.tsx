'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { clientAuthService } from '../services/clientAuth';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { clientProfileService } from '@/app/services/clientProfile';

export default function ClientLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      // 1. Аутентификация
      const authResponse = await clientAuthService.login(values.login, values.password);
      
      // 2. Загрузка профиля клиента
      const clientProfile = await clientProfileService.getProfile(authResponse.token);
      
      // 3. Сохраняем в контекст
      login(authResponse.token, authResponse.clientName, 'client', clientProfile);
      
      message.success('Успешный вход в личный кабинет!');
      router.push('/client/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Ошибка входа. Проверьте логин и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      padding: '40px 0'
    }}>
      <Card 
        title="Вход в личный кабинет клиента" 
        style={{ width: 400 }}
        headStyle={{ textAlign: 'center', fontSize: '18px' }}
      >
        <Alert
          message="Для входа используйте email и временный пароль, выданный риелтором"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          name="client-login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="login"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="your@email.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Временный пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Войти в личный кабинет
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}