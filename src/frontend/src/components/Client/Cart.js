// src/components/Client/Cart.js
import React, { useContext } from 'react';
import styled from 'styled-components';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import Button from '../Common/Button';

const CartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartHeader = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const CartTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const CartItems = styled.div`
  padding: 16px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 16px;
  margin: 0 0 8px;
  color: #333;
`;

const ItemPrice = styled.div`
  font-size: 16px;
  color: #3f51b5;
  font-weight: 500;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityText = styled.span`
  margin: 0 8px;
  min-width: 24px;
  text-align: center;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #f44336;
  background-color: #fff;
  color: #f44336;
  cursor: pointer;
  
  &:hover {
    background-color: #f44336;
    color: white;
  }
`;

const CartFooter = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const EmptyCart = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #666;
`;

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useContext(CartContext);
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  if (cart.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <CartTitle>Carrinho</CartTitle>
        </CartHeader>
        <EmptyCart>
          <p>Seu carrinho está vazio</p>
          <Button as="a" href="/produtos" variant="secondary">
            Continuar comprando
          </Button>
        </EmptyCart>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer>
      <CartHeader>
        <CartTitle>Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})</CartTitle>
      </CartHeader>
      
      <CartItems>
        {cart.map((item) => (
          <CartItem key={item.produto.id}>
            <ItemImage 
              src={item.produto.urlImagem || 'https://via.placeholder.com/80x80?text=Sem+Imagem'} 
              alt={item.produto.nome} 
            />
            
            <ItemInfo>
              <ItemName>{item.produto.nome}</ItemName>
              <ItemPrice>{formatPrice(item.produto.preco)}</ItemPrice>
            </ItemInfo>
            
            <ItemActions>
              <QuantityControl>
                <QuantityButton 
                  onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <FaMinus size={12} />
                </QuantityButton>
                <QuantityText>{item.quantidade}</QuantityText>
                <QuantityButton 
                  onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                >
                  <FaPlus size={12} />
                </QuantityButton>
              </QuantityControl>
              
              <RemoveButton onClick={() => removeFromCart(item.produto.id)}>
                <FaTrash size={14} />
              </RemoveButton>
            </ItemActions>
          </CartItem>
        ))}
      </CartItems>
      
      <CartFooter>
        <CartTotal>
          <span>Total:</span>
          <span>{formatPrice(getTotal())}</span>
        </CartTotal>
        <Button as="a" href="/checkout" fullWidth>
          Finalizar Compra
        </Button>
      </CartFooter>
    </CartContainer>
  );
};

export default Cart;