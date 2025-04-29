// src/pages/Client/CartPage.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import Cart from '../../components/Client/Cart';
import Button from '../../components/Common/Button';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #333;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    color: #333;
  }
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 60px 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyCartIcon = styled.div`
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
`;

const EmptyCartTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
`;

const EmptyCartText = styled.p`
  color: #666;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const CartPage = () => {
  const { cart } = useContext(CartContext);
  
  if (cart.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>Carrinho</PageTitle>
          <BackLink to="/produtos">
            <FaArrowLeft /> Continuar comprando
          </BackLink>
        </PageHeader>
        
        <EmptyCartContainer>
          <EmptyCartIcon>
            <FaShoppingBag />
          </EmptyCartIcon>
          <EmptyCartTitle>Seu carrinho está vazio</EmptyCartTitle>
          <EmptyCartText>
            Explore nossos produtos e adicione alguns itens ao seu carrinho!
          </EmptyCartText>
          <ButtonContainer>
            <Button as={Link} to="/produtos">
              Ver Produtos
            </Button>
          </ButtonContainer>
        </EmptyCartContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Meu Carrinho</PageTitle>
        <BackLink to="/produtos">
          <FaArrowLeft /> Continuar comprando
        </BackLink>
      </PageHeader>
      
      <Cart />
      
      <ButtonContainer>
        <Button 
          as={Link} 
          to="/checkout" 
          variant="primary"
          fullWidth
        >
          Finalizar Compra
        </Button>
      </ButtonContainer>
    </PageContainer>
  );
};

export default CartPage;