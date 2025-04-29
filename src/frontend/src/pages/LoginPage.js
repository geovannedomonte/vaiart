// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import Button from '../components/Common/Button';

const LoginContainer = styled.div`
  max-width: 400px;
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
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const result = await login(values);
      
      if (result.success) {
        toast.success('Login realizado com sucesso!');
        navigate('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <Title>Login</Title>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <StyledForm>
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
              <Label htmlFor="password">Senha</Label>
              <StyledField 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Sua senha" 
              />
              <StyledErrorMessage name="password" component="div" />
            </FormGroup>
            
            <Button 
              type="submit" 
              disabled={loading || isSubmitting}
              fullWidth
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      
      <Footer>
        Não tem uma conta? <StyledLink to="/register">Cadastre-se</StyledLink>
      </Footer>
    </LoginContainer>
  );
};

export default LoginPage;