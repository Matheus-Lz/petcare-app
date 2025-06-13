import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import App from './App';
import { ConfigProvider, message } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import dayjs from 'dayjs';

message.config({
  top: 80,
  duration: 3,
  maxCount: 1,
});

dayjs.locale('pt-br');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={ptBR}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
