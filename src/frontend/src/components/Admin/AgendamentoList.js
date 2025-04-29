// src/components/Admin/AgendamentoList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaTrash, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { agendamentoService } from '../../api/api';
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
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const DateFilterGroup = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const FilterLabel = styled.label`
  margin-right: 8px;
  font-size: 14px;
  color: #666;
  
  @media (max-width: 768px) {
    margin-bottom: 4px;
  }
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 8px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 8px;
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
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const AppointmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const AppointmentCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const AppointmentHeader = styled.div`
  padding: 12px 16px;
  background-color: #3f51b5;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppointmentDate = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const AppointmentContent = styled.div`
  padding: 16px;
`;

const ClientName = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  
  svg {
    margin-right: 8px;
    color: #3f51b5;
  }
`;

const Address = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  
  svg {
    margin-right: 8px;
    margin-top: 3px;
    color: #3f51b5;
  }
`;

const Notes = styled.div`
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  margin-top: 12px;
`;

const NotesTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`;

const ActionButtons = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eee;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const AgendamentoList = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroInicio, setFiltroInicio] = useState('');
  const [filtroFim, setFiltroFim] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6; // Número de agendamentos por página
  
  const fetchAgendamentos = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filtroInicio && filtroFim) {
        // Converter para formato ISO
        const inicio = new Date(filtroInicio + 'T00:00:00');
        const fim = new Date(filtroFim + 'T23:59:59');
        
        response = await agendamentoService.getByPeriodo(
          inicio.toISOString(),
          fim.toISOString()
        );
      } else {
        response = await agendamentoService.getAll();
      }
      
      let filteredAgendamentos = response.data;
      
      // Aplicar busca por nome do cliente ou telefone
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredAgendamentos = filteredAgendamentos.filter(agendamento => 
          agendamento.nomeCliente.toLowerCase().includes(lowerSearchTerm) || 
          agendamento.telefoneCliente.toLowerCase().includes(lowerSearchTerm) ||
          agendamento.endereco.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // Ordenar por data (mais próximos primeiro)
      filteredAgendamentos.sort(
        (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
      );
      
      // Calcular paginação
      const totalItems = filteredAgendamentos.length;
      const calculatedTotalPages = Math.ceil(totalItems / pageSize);
      setTotalPages(calculatedTotalPages);
      
      // Pegar apenas os itens da página atual
      const startIndex = page * pageSize;
      const paginatedAgendamentos = filteredAgendamentos.slice(startIndex, startIndex + pageSize);
      
      setAgendamentos(paginatedAgendamentos);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAgendamentos();
  }, [page]);
  
  const handleFiltrar = () => {
    setPage(0); // Resetar para a primeira página
    fetchAgendamentos();
  };
  
  const handleSearch = () => {
    setPage(0); // Resetar para a primeira página
    fetchAgendamentos();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await agendamentoService.delete(id);
        toast.success('Agendamento excluído com sucesso');
        fetchAgendamentos();
      } catch (error) {
        toast.error('Erro ao excluir agendamento');
        console.error('Erro ao excluir agendamento:', error);
      }
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };
  
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isTomorrow = (dateString) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();
  };
  
  const getDateHighlight = (dateString) => {
    if (isToday(dateString)) {
      return 'rgba(63, 81, 181, 0.9)'; // Destaque para hoje
    } else if (isTomorrow(dateString)) {
      return 'rgba(63, 81, 181, 0.7)'; // Destaque para amanhã
    }
    return '#3f51b5'; // Cor padrão
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Lista de Agendamentos</ListTitle>
        
        <FiltersContainer>
          <DateFilterGroup>
            <FilterLabel htmlFor="dataInicio">De:</FilterLabel>
            <DateInput 
              id="dataInicio"
              type="date" 
              value={filtroInicio}
              onChange={(e) => setFiltroInicio(e.target.value)}
            />
          </DateFilterGroup>
          
          <DateFilterGroup>
            <FilterLabel htmlFor="dataFim">Até:</FilterLabel>
            <DateInput 
              id="dataFim"
              type="date" 
              value={filtroFim}
              onChange={(e) => setFiltroFim(e.target.value)}
            />
          </DateFilterGroup>
          
          <Button onClick={handleFiltrar}>
            Filtrar
          </Button>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar por cliente ou endereço..."
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
      ) : agendamentos.length === 0 ? (
        <EmptyState>
          <p>Nenhum agendamento encontrado.</p>
        </EmptyState>
      ) : (
        <>
          <AppointmentsGrid>
            {agendamentos.map(agendamento => (
              <AppointmentCard key={agendamento.id}>
                <AppointmentHeader style={{ backgroundColor: getDateHighlight(agendamento.dataHora) }}>
                  <AppointmentDate>
                    <FaCalendarAlt />
                    {formatDateTime(agendamento.dataHora)}
                  </AppointmentDate>
                </AppointmentHeader>
                
                <AppointmentContent>
                  <ClientName>{agendamento.nomeCliente}</ClientName>
                  
                  <ContactInfo>
                    <FaPhone />
                    {agendamento.telefoneCliente}
                  </ContactInfo>
                  
                  <Address>
                    <FaMapMarkerAlt />
                    <div>{agendamento.endereco}</div>
                  </Address>
                  
                  {agendamento.observacoes && (
                    <Notes>
                      <NotesTitle>Observações:</NotesTitle>
                      {agendamento.observacoes}
                    </Notes>
                  )}
                </AppointmentContent>
                
                <ActionButtons>
                  <Button 
                    variant="danger" 
                    icon={<FaTrash />}
                    onClick={() => handleDelete(agendamento.id)}
                  >
                    Excluir
                  </Button>
                </ActionButtons>
              </AppointmentCard>
            ))}
          </AppointmentsGrid>
          
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
    </ListContainer>
  );
};

export default AgendamentoList;