// src/pages/Admin/AgendamentosPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaTrash, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { agendamentoService } from '../../api/api';
import Button from '../../components/Common/Button';
import Loading from '../../components/Common/Loading';

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

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
`;

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
`;

const DateLabel = styled.span`
  margin-right: 8px;
  font-size: 14px;
  color: #666;
`;

const DateInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AppointmentsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const AppointmentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const AppointmentHeader = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppointmentDate = styled.div`
  font-weight: 500;
  color: #333;
`;

const AppointmentContent = styled.div`
  padding: 16px;
`;

const ClientName = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
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
  background-color: #f5f5f5;
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
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
`;

const EmptyStateTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
  color: #333;
`;

const EmptyStateText = styled.p`
  color: #666;
`;

const AgendamentosPage = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroInicio, setFiltroInicio] = useState('');
  const [filtroFim, setFiltroFim] = useState('');
  
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
      
      // Ordenar por data (mais próximos primeiro)
      const sortedAgendamentos = [...response.data].sort(
        (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
      );
      
      setAgendamentos(sortedAgendamentos);
    } catch (error) {
      toast.error('Erro ao carregar agendamentos');
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAgendamentos();
  }, []);
  
  const handleFiltrar = () => {
    fetchAgendamentos();
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
  
  if (loading) {
    return (
      <PageContainer>
        <PageTitle>Agendamentos</PageTitle>
        <Loading />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Agendamentos</PageTitle>
      </PageHeader>
      
      <FilterContainer>
        <DateFilter>
          <DateLabel>De:</DateLabel>
          <DateInput 
            type="date" 
            value={filtroInicio}
            onChange={(e) => setFiltroInicio(e.target.value)}
          />
        </DateFilter>
        
        <DateFilter>
          <DateLabel>Até:</DateLabel>
          <DateInput 
            type="date" 
            value={filtroFim}
            onChange={(e) => setFiltroFim(e.target.value)}
          />
        </DateFilter>
        
        <Button onClick={handleFiltrar}>
          Filtrar
        </Button>
      </FilterContainer>
      
      {agendamentos.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>Nenhum agendamento encontrado</EmptyStateTitle>
          <EmptyStateText>
            Nenhum agendamento foi encontrado para o período selecionado.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <AppointmentsContainer>
          {agendamentos.map(agendamento => (
            <AppointmentCard key={agendamento.id}>
              <AppointmentHeader>
                <AppointmentDate>
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
                
                <ActionButtons>
                  <Button 
                    variant="danger" 
                    icon={<FaTrash />}
                    onClick={() => handleDelete(agendamento.id)}
                  >
                    Excluir
                  </Button>
                </ActionButtons>
              </AppointmentContent>
            </AppointmentCard>
          ))}
        </AppointmentsContainer>
      )}
    </PageContainer>
  );
};

export default AgendamentosPage;