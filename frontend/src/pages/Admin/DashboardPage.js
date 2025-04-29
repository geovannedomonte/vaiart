// src/pages/Admin/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingBag, FaClipboardList, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { produtoService, pedidoService, agendamentoService } from '../../api/api';
import Loading from '../../components/Common/Loading';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f5f7ff;
  color: #3f51b5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
`;

const StatTitle = styled.h3`
  font-size: 16px;
  color: #666;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-top: auto;
`;

const StatChange = styled.div`
  font-size: 14px;
  margin-top: 8px;
  color: ${props => props.positive ? '#43a047' : '#e53935'};
`;

const SectionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ViewAllLink = styled(Link)`
  font-size: 14px;
  color: #3f51b5;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RecentOrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderId = styled.div`
  font-weight: 500;
  color: #333;
`;

const OrderDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const OrderStatus = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'PENDENTE':
        return `background-color: #fff3e0; color: #f57c00;`;
      case 'PAGO':
        return `background-color: #e8f5e9; color: #43a047;`;
      case 'ENVIADO':
        return `background-color: #e3f2fd; color: #1e88e5;`;
      case 'ENTREGUE':
        return `background-color: #ede7f6; color: #3f51b5;`;
      case 'CANCELADO':
        return `background-color: #ffebee; color: #e53935;`;
      default:
        return `background-color: #f5f5f5; color: #333;`;
    }
  }}
`;

const UpcomingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AppointmentItem = styled.div`
  padding: 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
`;

const AppointmentDate = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const AppointmentClient = styled.div`
  font-size: 14px;
  color: #666;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: #666;
`;

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalPedidos: 0,
    totalAgendamentos: 0,
    valorTotal: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar estatísticas
        const produtosResponse = await produtoService.getAll(0, 1);
        const pedidosResponse = await pedidoService.getAll();
        
        // Data de hoje e data de 7 dias no futuro para agendamentos
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        
        const agendamentosResponse = await agendamentoService.getByPeriodo(
          today.toISOString(),
          nextWeek.toISOString()
        );
        
        // Calcular valor total de pedidos
        const valorTotal = pedidosResponse.data.reduce(
          (total, pedido) => total + (pedido.valorTotal || 0), 
          0
        );
        
        setStats({
          totalProdutos: produtosResponse.data.totalElements,
          totalPedidos: pedidosResponse.data.length,
          totalAgendamentos: agendamentosResponse.data.length,
          valorTotal
        });
        
        // Ordenar pedidos por data (mais recentes primeiro)
        const sortedOrders = [...pedidosResponse.data].sort(
          (a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)
        );
        
        setRecentOrders(sortedOrders.slice(0, 5));
        
        // Ordenar agendamentos por data (próximos primeiro)
        const sortedAppointments = [...agendamentosResponse.data].sort(
          (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
        );
        
        setUpcomingAppointments(sortedAppointments.slice(0, 5));
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageTitle>Dashboard</PageTitle>
        <Loading />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageTitle>Dashboard</PageTitle>
      
      <StatsContainer>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaShoppingBag />
            </StatIcon>
            <StatTitle>Total de Produtos</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalProdutos}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaClipboardList />
            </StatIcon>
            <StatTitle>Total de Pedidos</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalPedidos}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaCalendarAlt />
            </StatIcon>
            <StatTitle>Agendamentos (7 dias)</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalAgendamentos}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaChartLine />
            </StatIcon>
            <StatTitle>Valor Total</StatTitle>
          </StatHeader>
          <StatValue>{formatPrice(stats.valorTotal)}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <SectionsContainer>
        <Section>
          <SectionTitle>
            Pedidos Recentes
            <ViewAllLink to="/admin/pedidos">Ver todos</ViewAllLink>
          </SectionTitle>
          
          {recentOrders.length > 0 ? (
            <RecentOrdersList>
              {recentOrders.map(order => (
                <OrderItem key={order.id}>
                  <OrderInfo>
                    <OrderId>Pedido #{order.id}</OrderId>
                    <OrderDate>{formatDate(order.dataCriacao)}</OrderDate>
                  </OrderInfo>
                  <OrderStatus status={order.status}>
                    {order.status}
                  </OrderStatus>
                </OrderItem>
              ))}
            </RecentOrdersList>
          ) : (
            <NoDataMessage>Nenhum pedido recente</NoDataMessage>
          )}
        </Section>
        
        <Section>
          <SectionTitle>
            Próximos Agendamentos
            <ViewAllLink to="/admin/agendamentos">Ver todos</ViewAllLink>
          </SectionTitle>
          
          {upcomingAppointments.length > 0 ? (
            <UpcomingList>
              {upcomingAppointments.map(appointment => (
                <AppointmentItem key={appointment.id}>
                  <AppointmentDate>
                    {formatDateTime(appointment.dataHora)}
                  </AppointmentDate>
                  <AppointmentClient>
                    {appointment.nomeCliente}
                  </AppointmentClient>
                </AppointmentItem>
              ))}
            </UpcomingList>
          ) : (
            <NoDataMessage>Nenhum agendamento próximo</NoDataMessage>
          )}
        </Section>
      </SectionsContainer>
    </PageContainer>
  );
};

export default DashboardPage;