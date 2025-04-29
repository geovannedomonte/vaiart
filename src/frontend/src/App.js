// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppRoutes from './routes';
import Navbar from './components/Common/Navbar';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  background-color: #333;
  color: white;
  padding: 24px;
  text-align: center;
`;

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContainer>
            <Navbar />
            <MainContent>
              <AppRoutes />
            </MainContent>
            <Footer>
              <p>&copy; {new Date().getFullYear()} VaiArt Adesivos. Todos os direitos reservados.</p>
            </Footer>
            <ToastContainer position="top-right" autoClose={5000} />
          </AppContainer>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;