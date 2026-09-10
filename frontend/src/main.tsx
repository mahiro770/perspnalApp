import React from 'react';
import ReactDOM from 'react-dom/client';
import { Providers } from './app/providers';
import { AppRoutes } from './app/routes';
import { PwaUpdater } from './app/PwaUpdater';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <PwaUpdater />
      <AppRoutes />
    </Providers>
  </React.StrictMode>,
);
