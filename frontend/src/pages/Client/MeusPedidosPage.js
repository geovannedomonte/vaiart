// src/pages/Client/MeusPedidosPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaCheckCircle, FaBox, FaTruck, FaMapMarkedAlt, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { pedidoService } from '../../api/api';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../components/Common/Loading';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
  
  ${props => props.highlight && `
    border: 2px solid #3f51b5;
    box-shadow: 0 4px 8px rgba(63, 81, 181, 0.2);
  `}
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
`;

const OrderNumber = styled.div`
  font-weight: 500;
  color: #333;
`;

const OrderDate = styled.div`
  font-size: 14px;
  color: #666;
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'PENDENTE':
        return `color: #f57c00;`;
      case 'PAGO':
        return `color: #43a047;`;
      case 'ENVIADO':
        return `color: #1e88e5;`;
      case 'ENTREGUE':
        return `color: #3f51b5;`;
      case 'CANCELADO':
        return `color: #e53935;`;
      default:
        return `color: #333;`;
    }
  }}
  
  svg {
    margin-right: 6px;
  }
`;

const OrderContent = styled.div`
  padding: 16px;
`;

const OrderItems = styled.div`
  margin-bottom: 16px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: #333;
`;

const ItemQuantity = styled.div`
  margin-left: 8px;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  color: #333;
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const OrderTotal = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const OrderPaymentMethod = styled.div`
  color: #666;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
`;

const EmptyStateText = styled.p`
  color: #666;
`;

const DeliveryInfo = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
`;

const NewOrderBanner = styled.div`
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  
  svg {
    color: #43a047;
    font-size: 24px;
    margin-right: 12px;
  }
`;

const NewOrderText = styled.div`
  flex: 1;
`;

const NewOrderTitle = styled.h3`
  color: #2e7d32;
  margin-bottom: 4px;
`;

const NewOrderMessage = styled.p`
  color: #43a047;
`;

const MeusPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  // Verificar se tem novo pedido na URL
  const query = new URLSearchParams(location.search);
  const newOrderId = query.get('new');
  
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (user?.email) {
          const response = await pedidoService.getByEmail(user.email);
          setPedidos(response.data);
        }
      } catch (error) {
        toast.error('Erro ao carregar pedidos');
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPedidos();
  }, [user]);
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDENTE':
        return <FaExclamationCircle />;
      case 'PAGO':
        return <FaCheckCircle />;
      case 'ENVIADO':
        return <FaTruck />;
      case 'ENTREGUE':
        return <FaMapMarkedAlt />;
      case 'CANCELADO':
        return <FaExclamationCircle />;
      default:
        return <FaBox />;
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageTitle>Meus Pedidos</PageTitle>
        <Loading />
      </PageContainer>
    );
  }
  
  if (pedidos.length === 0) {
    return (
      <PageContainer>
        <PageTitle>Meus Pedidos</PageTitle>
        <EmptyState>
          <EmptyStateTitle>Você ainda não possui pedidos</EmptyStateTitle>
          <EmptyStateText>
            Explore nossa loja e faça seu primeiro pedido!
          </EmptyStateText>
        </EmptyState>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageTitle>Meus Pedidos</PageTitle>
      
      {newOrderId && (
        <NewOrderBanner>
          <FaCheckCircle />
          <NewOrderText>
            <NewOrderTitle>Pedido realizado com sucesso!</NewOrderTitle>
            <NewOrderMessage>
              Seu pedido foi registrado e está sendo processado. Você receberá atualizações por email.
            </NewOrderMessage>
          </NewOrderText>
        </NewOrderBanner>
      )}
      
      <OrdersList>
        {pedidos.map(pedido => (
          <OrderCard 
            key={pedido.id} 
            highlight={pedido.id.toString() === newOrderId}
          >
            <OrderHeader>
              <OrderNumber>Pedido #{pedido.id}</OrderNumber>
              <OrderDate>{formatDate(pedido.dataCriacao)}</OrderDate>
              <OrderStatus status={pedido.status}>
                {getStatusIcon(pedido.status)} {pedido.status}
              </OrderStatus>
            </OrderHeader>
            
            <OrderContent>
              <OrderItems>
                {pedido.itens.map(item => (
                  <OrderItem key={item.id}>
                    <ItemInfo>
                      <ItemName>{item.produto.nome}</ItemName>
                      <ItemQuantity>x{item.quantidade}</ItemQuantity>
                    </ItemInfo>
                    <ItemPrice>
                      {formatPrice(item.produto.preco * item.quantidade)}
                    </ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>
              
              <OrderSummary>
                <OrderPaymentMethod>
                  Pagamento: {pedido.formaPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                </OrderPaymentMethod>
                <OrderTotal>
                  Total: {formatPrice(pedido.valorTotal)}
                </OrderTotal>
              </OrderSummary>
              
              <DeliveryInfo>
                Endereço de entrega: {pedido.enderecoEntrega}
              </DeliveryInfo>
            </OrderContent>
          </OrderCard>
        ))}
      </OrdersList>
    </PageContainer>
  );
};

export default MeusPedidosPage;