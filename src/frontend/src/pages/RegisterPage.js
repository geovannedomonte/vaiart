// src/pages/RegisterPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Common/Button';

const RegisterContainer = styled.div`
  max-width: 500px;
  margin: 60px auto;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
  display: block;
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

const StyledErrorMessage = styled(ErrorMessage)`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
`;

const StyledLink = styled(Link)`
  color: #3f51b5;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const validationSchema = Yup.object({
  nome: Yup.string()
    .required('Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  telefone: Yup.string()
    .required('Telefone é obrigatório')
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Formato inválido. Use (99) 99999-9999'
    )
});

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const result = await register({
        nome: values.nome,
        email: values.email,
        senha: values.password,
        telefone: values.telefone
      });
      
      if (result.success) {
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <Title>Criar Conta</Title>
      
      <Formik
        initialValues={{ 
          nome: '', 
          email: '', 
          password: '', 
          confirmPassword: '',
          telefone: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <FormGroup>
              <Label htmlFor="nome">Nome completo</Label>
              <StyledField 
                type="text" 
                id="nome" 
                name="nome" 
                placeholder="Seu nome completo" 
              />
              <StyledErrorMessage name="nome" component="div" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <StyledField 
                type="email" 
                id="email" 
                name="email" 
                placeholder="seu@email.com" 
              />
              <StyledErrorMessage name="email" component="div" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="telefone">Telefone</Label>
              <StyledField 
                type="text" 
                id="telefone" 
                name="telefone" 
                placeholder="(99) 99999-9999" 
              />
              <StyledErrorMessage name="telefone" component="div" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Senha</Label>
              <StyledField 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Sua senha" 
              />
              <StyledErrorMessage name="password" component="div" />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <StyledField 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirme sua senha" 
              />
              <StyledErrorMessage name="confirmPassword" component="div" />
            </FormGroup>
            
            <Button 
              type="submit" 
              disabled={loading || isSubmitting}
              fullWidth
            >
              {loading ? 'Carregando...' : 'Cadastrar'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      
      <Footer>
        Já tem uma conta? <StyledLink to="/login">Faça login</StyledLink>
      </Footer>
    </RegisterContainer>
  );
};

export default RegisterPage;