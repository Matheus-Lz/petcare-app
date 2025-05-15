import React, { useState } from 'react';
import { Form, Input, Button, Tabs, message, Card } from 'antd';
import { loginUser, registerUser } from '../../../api/user/UserService';
import { notifySuccess, notifyError } from '../../../utils/notifications';
import styles from './AuthForm.module.scss';

const { TabPane } = Tabs;

type RegisterData = {
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
};

type LoginData = {
  email: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: RegisterData) => {
    setLoading(true);
    try {
      await registerUser(values);
      notifySuccess('Login realizado com sucesso!');
    } catch (error: any) {
      notifyError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (values: LoginData) => {
    setLoading(true);
    try {
      const { token } = await loginUser(values);
      localStorage.setItem('token', token);
      message.success('Login realizado com sucesso!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authForm}>
      <Card className={styles.card}>
        <Tabs
          defaultActiveKey="login"
          centered
          items={[
            {
              key: 'login',
              label: 'Login',
              children: (
                <Form layout="vertical" onFinish={handleLogin}>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Senha" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      Entrar
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: 'Registrar',
              children: (
                <Form layout="vertical" onFinish={handleRegister}>
                  <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="password" label="Senha" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="cpfCnpj" label="CPF/CNPJ" rules={[{ required: true, max: 14 }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      Registrar
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AuthForm;
