// src/pages/Client/ProdutoDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { produtoService } from '../../api/api';
import { CartContext } from '../../contexts/CartContext';
import Button from '../../components/Common/Button';
import Loading from '../../components/Common/Loading';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
  cursor: pointer;
  
  &:hover {
    color: #333;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImageContainer = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductHeader = styled.div`
  margin-bottom: 16px;
`;

const ProductName = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  color: #333;
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #3f51b5;
  margin-bottom: 16px;
`;

const ProductDescription = styled.div`
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ProductAvailability = styled.div`
  font-weight: 500;
  margin-bottom: 24px;
  color: ${props => props.available ? '#2e7d32' : '#c62828'};
`;

const AddToCartContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
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
  width: 40px;
  height: 40px;
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
  margin: 0 12px;
  min-width: 30px;
  text-align: center;
  font-size: 16px;
`;

const ProdutoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await produtoService.getById(id);
        setProduto(response.data);
      } catch (error) {
        toast.error('Erro ao carregar detalhes do produto');
        console.error('Erro ao carregar produto:', error);
        navigate('/produtos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduto();
  }, [id, navigate]);
  
  const handleAddToCart = () => {
    addToCart(produto, quantidade);
    toast.success('Produto adicionado ao carrinho!');
  };
  
  const handleIncreaseQuantity = () => {
    setQuantidade(prev => prev + 1);
  };
  
  const handleDecreaseQuantity = () => {
    if (quantidade > 1) {
      setQuantidade(prev => prev - 1);
    }
  };
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/produtos')}>
        <FaArrowLeft /> Voltar para produtos
      </BackButton>
      
      <ProductContainer>
        <ProductImageContainer>
          <img 
            src={produto.urlImagem || 'https://via.placeholder.com/500x500?text=Sem+Imagem'} 
            alt={produto.nome} 
          />
        </ProductImageContainer>
        
        <ProductInfo>
          <ProductHeader>
            <ProductName>{produto.nome}</ProductName>
            <ProductPrice>{formatPrice(produto.preco)}</ProductPrice>
          </ProductHeader>
          
          <ProductDescription>
            {produto.descricao}
          </ProductDescription>
          
          <ProductAvailability available={produto.disponivel}>
            {produto.disponivel 
              ? 'Produto disponível para compra' 
              : 'Produto indisponível no momento'}
          </ProductAvailability>
          
          {produto.disponivel && (
            <AddToCartContainer>
              <QuantityControl>
                <QuantityButton 
                  onClick={handleDecreaseQuantity}
                  disabled={quantidade <= 1}
                >
                  <FaMinus />
                </QuantityButton>
                <QuantityText>{quantidade}</QuantityText>
                <QuantityButton onClick={handleIncreaseQuantity}>
                  <FaPlus />
                </QuantityButton>
              </QuantityControl>
              
              <Button 
                onClick={handleAddToCart} 
                icon={<FaShoppingCart />}
              >
                Adicionar ao Carrinho
              </Button>
            </AddToCartContainer>
          )}
        </ProductInfo>
      </ProductContainer>
    </PageContainer>
  );
};

export default ProdutoDetailPage;