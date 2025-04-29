// src/components/Admin/ProdutoForm.js
import React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../Common/Button';

const FormContainer = styled.div`
  width: 100%;
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

const StyledTextArea = styled(Field)`
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckbox = styled(Field)`
  margin-right: 8px;
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

// Schema de validação do produto
const produtoSchema = Yup.object({
  nome: Yup.string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  descricao: Yup.string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  preco: Yup.number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser positivo')
    .test('is-decimal', 'O valor deve ter no máximo 2 casas decimais', 
      value => (value + "").match(/^\d+(\.\d{1,2})?$/)),
  urlImagem: Yup.string()
    .url('URL da imagem inválida'),
  disponivel: Yup.boolean()
});

const ProdutoForm = ({ produto, onSubmit, onCancel }) => {
  const initialValues = produto ? {
    nome: produto.nome,
    descricao: produto.descricao,
    preco: produto.preco,
    urlImagem: produto.urlImagem || '',
    disponivel: produto.disponivel
  } : {
    nome: '',
    descricao: '',
    preco: '',
    urlImagem: '',
    disponivel: true
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };
  
  return (
    <FormContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={produtoSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <FormGroup>
              <Label htmlFor="nome">Nome do Produto</Label>
              <StyledField 
                type="text" 
                id="nome" 
                name="nome" 
                placeholder="Nome do produto" 
              />
              <ErrorMessage name="nome" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="descricao">Descrição</Label>
              <StyledTextArea 
                as="textarea" 
                id="descricao" 
                name="descricao" 
                placeholder="Descrição detalhada do produto" 
              />
              <ErrorMessage name="descricao" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="preco">Preço (R$)</Label>
              <StyledField 
                type="number" 
                id="preco" 
                name="preco" 
                placeholder="0.00" 
                step="0.01" 
                min="0" 
              />
              <ErrorMessage name="preco" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="urlImagem">URL da Imagem</Label>
              <StyledField 
                type="text" 
                id="urlImagem" 
                name="urlImagem" 
                placeholder="https://exemplo.com/imagem.jpg" 
              />
              <ErrorMessage name="urlImagem" component={ErrorText} />
            </FormGroup>
            
            <FormGroup>
              <CheckboxContainer>
                <StyledCheckbox 
                  type="checkbox" 
                  id="disponivel" 
                  name="disponivel" 
                />
                <Label htmlFor="disponivel" style={{ display: 'inline', marginBottom: 0 }}>
                  Produto disponível para venda
                </Label>
              </CheckboxContainer>
            </FormGroup>
            
            <ButtonsContainer>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {produto ? 'Atualizar Produto' : 'Criar Produto'}
              </Button>
            </ButtonsContainer>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default ProdutoForm;