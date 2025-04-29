// src/components/Common/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';

const NavbarContainer = styled.header`
  background-color: #3f51b5;
  color: white;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-left: 24px;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-right: 6px;
  }
`;

const CartBadge = styled.span`
  background-color: #ff4081;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 2px 6px;
  margin-left: 4px;
`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantidade, 0);
  
  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">VaiArt Adesivos</Logo>
        <NavLinks>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/agendamento">Agendamento</NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/cart">
                <FaShoppingCart />
                Carrinho
                {cartItemsCount > 0 && <CartBadge>{cartItemsCount}</CartBadge>}
              </NavLink>
              <NavLink to="/meus-pedidos">
                <FaUser />
                Meus Pedidos
              </NavLink>
              {user?.email === 'admin@vaiart.com' && (
                <NavLink to="/admin">Admin</NavLink>
              )}
              <NavLink to="#" onClick={handleLogout}>
                <FaSignOutAlt />
                Sair
              </NavLink>
            </>
          ) : (
            <NavLink to="/login">
              <FaSignInAlt />
              Entrar
            </NavLink>
          )}
        </NavLinks>
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;