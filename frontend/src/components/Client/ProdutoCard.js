// src/components/Client/ProdutoCard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaCartPlus } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import Button from '../Common/Button';

const Card = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: white;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled(Link)`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
  text-decoration: none;
  
  &:hover {
    color: #3f51b5;
  }
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #3f51b5;
  margin-bottom: 16px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProdutoCard = ({ produto }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = () => {
    addToCart(produto, 1);
  };
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  return (
    <Card>
      <ImageContainer>
        <img 
          src={produto.urlImagem || 'https://via.placeholder.com/300x200?text=Sem+Imagem'} 
          alt={produto.nome} 
        />
      </ImageContainer>
      
      <ProductInfo>
        <ProductName to={`/produtos/${produto.id}`}>
          {produto.nome}
        </ProductName>
        
        <ProductPrice>
          {formatPrice(produto.preco)}
        </ProductPrice>
        
        <ActionContainer>
          <Button as={Link} to={`/produtos/${produto.id}`} variant="secondary">
            Detalhes
          </Button>
          
          <Button 
            onClick={handleAddToCart} 
            icon={<FaCartPlus />}
            disabled={!produto.disponivel}
          >
            Adicionar
          </Button>
        </ActionContainer>
      </ProductInfo>
    </Card>
  );
};

export default ProdutoCard;