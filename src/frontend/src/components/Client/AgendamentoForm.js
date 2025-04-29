// src/components/Client/AgendamentoForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { agendamentoService } from '../../api/api';
import Button from '../Common/Button';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
`;

const StyledField = styled(Field)`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const StyledTextarea = styled(Field)`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  color: #2e7d32;
`;

// Schema de validação com Yup
const validationSchema = Yup.object({
  nomeCliente: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  telefoneCliente: Yup.string()
    .required('Telefone é obrigatório')
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Formato inválido. Use (99) 99999-9999'
    ),
  dataHora: Yup.date()
    .required('Data e hora são obrigatórios')
    .min(new Date(), 'Data deve ser futura'),
  endereco: Yup.string()
    .required('Endereço é obrigatório'),
  observacoes: Yup.string()
});

const AgendamentoForm = () => {
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Formatar a data e hora para o formato ISO
      const formattedValues = {
        ...values,
        dataHora: new Date(values.dataHora).toISOString()
      };
      
      await agendamentoService.create(formattedValues);
      setSuccess(true);
      resetForm();
      toast.success('Agendamento realizado com sucesso! Entraremos em contato para confirmar.');
    } catch (error) {
      toast.error('Erro ao realizar agendamento. Por favor, tente novamente.');
      console.error('Erro ao criar agendamento:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Calcular data mínima (hoje) e máxima (30 dias a partir de hoje) para o campo de data
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  
  const formatDate = (date) => {
    return date.toISOString().slice(0, 16);
  };
  
  return (
    <FormContainer>
      <FormTitle>Agendar Visita</FormTitle>
      
      {success && (
        <SuccessMessage>
          Agendamento realizado com sucesso! Entraremos em contato para confirmar os detalhes.
        </SuccessMessage>
      )}
      
      <Formik
        initialValues={{
          nomeCliente: '',
          telefoneCliente: '',
          dataHora: '',
          endereco: '',
          observacoes: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="nomeCliente">Nome completo</Label>
              <StyledField 
                type="text" 
                id="nomeCliente" 
                name="nomeCliente" 
                placeholder="Seu nome completo" 
              />
              <ErrorMessage name="nomeCliente" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="telefoneCliente">Telefone</Label>
              <StyledField 
                type="text" 
                id="telefoneCliente" 
                name="telefoneCliente" 
                placeholder="(99) 99999-9999" 
              />
              <ErrorMessage name="telefoneCliente" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="dataHora">Data e hora da visita</Label>
              <StyledField 
                type="datetime-local" 
                id="dataHora" 
                name="dataHora" 
                min={formatDate(today)}
                max={formatDate(maxDate)}
              />
              <ErrorMessage name="dataHora" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="endereco">Endereço completo</Label>
              <StyledField 
                type="text" 
                id="endereco" 
                name="endereco" 
                placeholder="Rua, número, complemento, bairro, cidade" 
              />
              <ErrorMessage name="endereco" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <StyledTextarea 
                as="textarea" 
                id="observacoes" 
                name="observacoes" 
                placeholder="Descreva aqui qualquer detalhe importante para a visita" 
              />
              <ErrorMessage name="observacoes" component={ErrorText} />
            </FormGroup>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Enviando...' : 'Agendar Visita'}
            </Button>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default AgendamentoForm;