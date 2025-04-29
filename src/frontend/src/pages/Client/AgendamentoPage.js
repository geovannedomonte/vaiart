// src/pages/Client/AgendamentoPage.js
import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import AgendamentoForm from '../../components/Client/AgendamentoForm';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
  color: #333;
  text-align: center;
`;

const PageDescription = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FormSection = styled.div`
  flex: 1;
`;

const InfoSection = styled.div`
  flex: 1;
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const InfoTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: #3f51b5;
  }
`;

const InfoText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoListItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    margin-right: 8px;
    color: #3f51b5;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const AgendamentoPage = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>Agendar Visita - VaiArt Adesivos</title>
        <meta name="description" content="Agende uma visita para conhecer nossos produtos e serviços personalizados." />
      </Helmet>
      
      <PageTitle>Agende uma Visita</PageTitle>
      <PageDescription>
        Temos o prazer de atender você em sua casa ou estabelecimento para apresentar nossos 
        produtos e serviços personalizados. Preencha o formulário abaixo para agendar uma 
        visita com nossos consultores.
      </PageDescription>
      
      <ContentContainer>
        <FormSection>
          <AgendamentoForm />
        </FormSection>
        
        <InfoSection>
          <InfoCard>
            <InfoTitle>
              <FaClock /> Horários de Atendimento
            </InfoTitle>
            <InfoList>
              <InfoListItem>
                <FaCalendarAlt /> Segunda a Sexta: 10h às 17h
              </InfoListItem>
              <InfoListItem>
                <FaCalendarAlt /> Sábados: 9h às 11h
              </InfoListItem>
              <InfoListItem>
                <FaCalendarAlt /> Domingos e Feriados: Fechado
              </InfoListItem>
            </InfoList>
          </InfoCard>
          
          <InfoCard>
            <InfoTitle>
              <FaMapMarkerAlt /> Nosso Endereço
            </InfoTitle>
            <InfoText>
              Fazemos Entregas
              ou Instalação no Local.
              - Ilha do Governador<br />
              - Maria da Graça<br />
              Rio de Janeiro - RJ<br />
            
            </InfoText>
            
            <MapContainer>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235203.81500692177!2d-43.58841988251077!3d-22.9111720903467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bde559108a05b%3A0x50dc426c672fd24e!2sRio%20de%20Janeiro%2C%20RJ!5e0!3m2!1spt-BR!2sbr!4v1650034696461!5m2!1spt-BR!2sbr" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da VaiArt"
              ></iframe>
            </MapContainer>
          </InfoCard>
          
          <InfoCard>
            <InfoTitle>
              <FaPhone /> Contato
            </InfoTitle>
            <InfoList>
              <InfoListItem>
                <FaPhone /> Telefone: (21) 3333-4444
              </InfoListItem>
              <InfoListItem>
                <FaPhone /> WhatsApp: (21) 99999-8888
              </InfoListItem>
              <InfoListItem>
                <FaPhone /> Email: contato@vaiart.com
              </InfoListItem>
            </InfoList>
          </InfoCard>
        </InfoSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default AgendamentoPage;