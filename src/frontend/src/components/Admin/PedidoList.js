// src/components/Admin/PedidoList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaEye, FaCheckCircle, FaTruck, FaMapMarkedAlt, FaExclamationCircle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { pedidoService } from '../../api/api';
import Button from '../Common/Button';
import Loading from '../Common/Loading';

const ListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const ListTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #333;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
`;

const FilterLabel = styled.label`
  margin-right: 8px;
  font-size: 14px;
  color: #666;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 16px;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-weight: 500;
  color: #333;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
`;

const OrderStatus = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
  
  svg {
    margin-right: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
`;

const PageInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${props => props.active ? '#3f51b5' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3f51b5' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const OrderDetails = styled.div`
  margin-bottom: 24px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoItem = styled.div`
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await pedidoService.getAll();
      let filteredOrders = response.data;
      
      // Aplicar filtro por status
      if (filtroStatus) {
        filteredOrders = filteredOrders.filter(pedido => pedido.status === filtroStatus);
      }
      
      // Aplicar busca por nome/email do cliente
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(pedido => 
          pedido.nomeCliente.toLowerCase().includes(lowerSearchTerm) || 
          pedido.emailCliente.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // Ordenar por data (mais recentes primeiro)
      filteredOrders.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
      
      // Calcular paginação
      const totalItems = filteredOrders.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      // Pegar apenas os itens da página atual
      const startIndex = page * pageSize;
      const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);
      
      setPedidos(paginatedOrders);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPedidos();
  }, [filtroStatus, page]);
  
  const handleSearch = () => {
    setPage(0); // Resetar para a primeira página
    fetchPedidos();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  
  const handleChangeStatus = async (id, newStatus) => {
    try {
      await pedidoService.updateStatus(id, newStatus);
      toast.success('Status atualizado com sucesso');
      
      // Atualizar pedido no modal e na lista
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
      
      fetchPedidos();
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error('Erro ao atualizar status:', error);
    }
  };
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", {
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
        return null;
    }
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Lista de Pedidos</ListTitle>
        
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel htmlFor="statusFilter">Status:</FilterLabel>
            <FilterSelect 
              id="statusFilter"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGUE">Entregue</option>
              <option value="CANCELADO">Cancelado</option>
            </FilterSelect>
          </FilterGroup>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="secondary" 
              icon={<FaSearch />}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </SearchContainer>
        </FiltersContainer>
      </ListHeader>
      
      {loading ? (
        <Loading />
      ) : pedidos.length === 0 ? (
        <EmptyState>
          <p>Nenhum pedido encontrado.</p>
        </EmptyState>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Pedido #</Th>
                  <Th>Data</Th>
                  <Th>Cliente</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                  <Th>Ações</Th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map(pedido => (
                  <tr key={pedido.id}>
                    <Td>{pedido.id}</Td>
                    <Td>{formatDate(pedido.dataCriacao)}</Td>
                    <Td>{pedido.nomeCliente}</Td>
                    <Td>
                      <OrderStatus status={pedido.status}>
                        {getStatusIcon(pedido.status)} {pedido.status}
                      </OrderStatus>
                    </Td>
                    <Td>{formatPrice(pedido.valorTotal)}</Td>
                    <Td>
                      <ActionButtons>
                        <Button 
                          variant="secondary" 
                          icon={<FaEye />}
                          onClick={() => handleViewOrder(pedido)}
                        >
                          Detalhes
                        </Button>
                      </ActionButtons>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          <PaginationContainer>
            <PageInfo>
              Página {page + 1} de {totalPages || 1}
            </PageInfo>
            <PageButtons>
              <PageButton
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              >
                Anterior
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PageButton
                  key={i}
                  active={i === page}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </PageButton>
              )).filter((_, i) => 
                i === 0 || i === totalPages - 1 || 
                (i >= page - 1 && i <= page + 1)
              )}
              
              <PageButton
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
              >
                Próxima
              </PageButton>
            </PageButtons>
          </PaginationContainer>
        </>
      )}
      
      {modalOpen && selectedOrder && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle></ModalTitle>
              // src/components/Admin/PedidoList.js (continuação)
              <ModalTitle>
                Pedido #{selectedOrder.id}
              </ModalTitle>
              <CloseButton onClick={() => setModalOpen(false)}>
                &times;
              </CloseButton>
            </ModalHeader>
            
            <OrderDetails>
              <OrderInfo>
                <InfoItem>
                  <InfoLabel>Data do Pedido</InfoLabel>
                  <InfoValue>{formatDate(selectedOrder.dataCriacao)}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Status</InfoLabel>
                  <InfoValue>
                    <OrderStatus status={selectedOrder.status}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </OrderStatus>
                  </InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Cliente</InfoLabel>
                  <InfoValue>{selectedOrder.nomeCliente}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{selectedOrder.emailCliente}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue>{selectedOrder.telefoneCliente}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Forma de Pagamento</InfoLabel>
                  <InfoValue>
                    {selectedOrder.formaPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                  </InfoValue>
                </InfoItem>
              </OrderInfo>
              
              <InfoItem>
                <InfoLabel>Endereço de Entrega</InfoLabel>
                <InfoValue>{selectedOrder.enderecoEntrega}</InfoValue>
              </InfoItem>
              
              <h3 style={{ margin: '24px 0 16px' }}>Itens do Pedido</h3>
              
              <ProductsTable>
                <thead>
                  <tr>
                    <Th>Produto</Th>
                    <Th style={{ textAlign: 'center' }}>Quantidade</Th>
                    <Th style={{ textAlign: 'right' }}>Preço Unit.</Th>
                    <Th style={{ textAlign: 'right' }}>Subtotal</Th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.itens.map(item => (
                    <tr key={item.id}>
                      <Td>{item.produto.nome}</Td>
                      <Td style={{ textAlign: 'center' }}>{item.quantidade}</Td>
                      <Td style={{ textAlign: 'right' }}>
                        {formatPrice(item.produto.preco)}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        {formatPrice(item.produto.preco * item.quantidade)}
                      </Td>
                    </tr>
                  ))}
                  <tr>
                    <Td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total:
                    </Td>
                    <Td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {formatPrice(selectedOrder.valorTotal)}
                    </Td>
                  </tr>
                </tbody>
              </ProductsTable>
              
              <StatusButtons>
                {selectedOrder.status !== 'PAGO' && (
                  <Button 
                    onClick={() => handleChangeStatus(selectedOrder.id, 'PAGO')}
                    icon={<FaCheckCircle />}
                  >
                    Marcar como Pago
                  </Button>
                )}
                
                {(selectedOrder.status === 'PAGO' || selectedOrder.status === 'PENDENTE') && (
                  <Button 
                    onClick={() => handleChangeStatus(selectedOrder.id, 'ENVIADO')}
                    icon={<FaTruck />}
                  >
                    Marcar como Enviado
                  </Button>
                )}
                
                {selectedOrder.status === 'ENVIADO' && (
                  <Button 
                    onClick={() => handleChangeStatus(selectedOrder.id, 'ENTREGUE')}
                    icon={<FaMapMarkedAlt />}
                  >
                    Marcar como Entregue
                  </Button>
                )}
                
                {selectedOrder.status !== 'ENTREGUE' && selectedOrder.status !== 'CANCELADO' && (
                  <Button 
                    variant="danger"
                    onClick={() => handleChangeStatus(selectedOrder.id, 'CANCELADO')}
                    icon={<FaExclamationCircle />}
                  >
                    Cancelar Pedido
                  </Button>
                )}
              </StatusButtons>
            </OrderDetails>
          </ModalContent>
        </Modal>
      )}
    </ListContainer>
  );
};

export default PedidoList;