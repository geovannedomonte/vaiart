import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

// Páginas de cliente
import HomePage from './pages/Client/HomePage';
import ProdutosPage from './pages/Client/ProdutosPage';
import ProdutoDetailPage from './pages/Client/ProdutoDetailPage';
import CartPage from './pages/Client/CartPage';
import CheckoutPage from './pages/Client/CheckoutPage';
import AgendamentoPage from './pages/Client/AgendamentoPage';
import MeusPedidosPage from './pages/Client/MeusPedidosPage';
import LoginPage from './pages/Client/LoginPage';
import RegisterPage from './pages/Client/RegisterPage';

// Páginas de administração
import AdminDashboardPage from './pages/Admin/DashboardPage';
import AdminProdutosPage from './pages/Admin/ProdutosPage';
import AdminPedidosPage from './pages/Admin/PedidosPage';
import AdminAgendamentosPage from './pages/Admin/AgendamentosPage';
import AdminProdutoForm from './pages/Admin/ProdutoForm';

// Componente de rota protegida
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user?.email !== 'gmrdesign.rj@gmail.com') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/"element={<HomePage />} />
      <Route path="/produtos"element={<ProdutosPage />} />
      <Route path="/produtos/:id"element={<ProdutoDetailPage />} />
      <Route path="/agendamento"element={<AgendamentoPage />} />
      <Route path="/login"element={<LoginPage />} />
      <Route path="/register"element={<RegisterPage />} />

      {/* Rotas protegidas para clientes */}
      <Route 
        path="/cart" 
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/meus-pedidos" 
        element={
          <PrivateRoute>
            <MeusPedidosPage />
          </PrivateRoute>
        } 
      />

      {/* Rotas protegidas para administradores */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute adminOnly>
            <AdminDashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/produtos" 
        element={
          <PrivateRoute adminOnly>
            <AdminProdutosPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/produtos/novo" 
        element={
          <PrivateRoute adminOnly>
            <AdminProdutoForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/produtos/:id" 
        element={
          <PrivateRoute adminOnly>
            <AdminProdutoForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/pedidos" 
        element={
          <PrivateRoute adminOnly>
            <AdminPedidosPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/agendamentos" 
        element={
          <PrivateRoute adminOnly>
            <AdminAgendamentosPage />
          </PrivateRoute>
        } 
      />

      {/* Fallback para rotas inexistentes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
