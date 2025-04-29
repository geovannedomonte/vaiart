// src/components/Client/Checkout.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaCheck, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { pedidoService } from '../../api/api';
import Button from '../Common/Button';

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 24px;
  }
`;

const CheckoutForm = styled.div`
  flex: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const OrderSummary = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: fit-content;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
`;

const SummaryItemList = styled.div`
  margin-bottom: 24px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-size: 14px;
  color: #333;
`;

const ItemQuantity = styled.div`
  font-size: 14px;
  color: #666;
  margin-left: 8px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
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

const ErrorText = styled.div`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

const PaymentMethodContainer = styled.div`
  margin-bottom: 24px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.selected && `
    border-color: #3f51b5;
    background-color: #f5f7ff;
  `}
  
  &:hover {
    border-color: #3f51b5;
  }
`;

const PaymentOptionIcon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  color: ${props => props.selected ? '#3f51b5' : '#666'};
`;

const PaymentOptionInfo = styled.div`
  flex: 1;
`;

const PaymentOptionTitle = styled.div`
  font-weight: 500;
  color: #333;
`;

const PaymentOptionDescription = styled.div`
  font-size: 14px;
  color: #666;
`;

const PaymentOptionCheck = styled.div`
  color: #3f51b5;
  visibility: ${props => props.selected ? 'visible' : 'hidden'};
`;

const StepsContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${props => props.active || props.completed ? '#3f51b5' : '#ddd'};
    z-index: 1;
  }
  
  &:first-child:before {
    left: 50%;
  }
  
  &:last-child:before {
    right: 50%;
  }
`;

const StepNumber = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3f51b5' : props.completed ? '#4caf50' : '#f5f5f5'};
  color: ${props => props.active || props.completed ? 'white' : '#999'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  position: relative;
  z-index: 2;
  border: 2px solid ${props => props.active ? '#3f51b5' : props.completed ? '#4caf50' : '#ddd'};
`;

const StepLabel = styled.div`
  font-size: 14px;
  color: ${props => props.active ? '#333' : '#666'};
  font-weight: ${props => props.active ? '500' : 'normal'};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

// Schema de validação para etapa de dados pessoais
const pessoalSchema = Yup.object({
  nomeCliente: Yup.string()
    .required('Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  emailCliente: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefoneCliente: Yup.string()
    .required('Telefone é obrigatório')
    .matches(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Formato inválido. Use (99) 99999-9999'
    )
});

// Schema de validação para etapa de endereço
const enderecoSchema = Yup.object({
  enderecoEntrega: Yup.string()
    .required('Endereço de entrega é obrigatório')
    .min(10, 'Endereço muito curto')
});

// Schema de validação para etapa de pagamento
const pagamentoSchema = Yup.object({
  formaPagamento: Yup.string()
    .required('Forma de pagamento é obrigatória')
});

const Checkout = () => {
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nomeCliente: user?.nome || '',
    emailCliente: user?.email || '',
    telefoneCliente: '',
    enderecoEntrega: '',
    formaPagamento: 'pix'
  });
  
  // Redirecionar se o carrinho estiver vazio
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/produtos');
      toast.info('Seu carrinho está vazio');
    }
  }, [cart.length, navigate]);
  
  const handleNext = (values) => {
    setFormData(prev => ({ ...prev, ...values }));
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async () => {
    try {
      // Preparar dados do pedido
      const pedidoData = {
        ...formData,
        itens: cart.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      };
      
      // Enviar pedido para a API
      const response = await pedidoService.create(pedidoData);
      
      // Limpar carrinho
      clearCart();
      
      // Redirecionar para página de sucesso
      toast.success('Pedido realizado com sucesso!');
      navigate(`/meus-pedidos?new=${response.data.id}`);
    } catch (error) {
      toast.error('Erro ao processar pedido. Por favor, tente novamente.');
      console.error('Erro ao criar pedido:', error);
    }
  };
  
  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: // Informações pessoais
        return (
          <Formik
            initialValues={{
              nomeCliente: formData.nomeCliente,
              emailCliente: formData.emailCliente,
              telefoneCliente: formData.telefoneCliente
            }}
            validationSchema={pessoalSchema}
            onSubmit={handleNext}
          >
            {({ isSubmitting }) => (
              <Form>
                <SectionTitle>Dados Pessoais</SectionTitle>
                
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
                  <Label htmlFor="emailCliente">Email</Label>
                  <StyledField 
                    type="email" 
                    id="emailCliente" 
                    name="emailCliente" 
                    placeholder="seu@email.com" 
                  />
                  <ErrorMessage name="emailCliente" component={ErrorText} />
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
                
                <NavigationButtons>
                  <div></div> {/* Espaço para manter o layout */}
                  <Button type="submit" disabled={isSubmitting}>
                    Próximo
                  </Button>
                </NavigationButtons>
              </Form>
            )}
          </Formik>
        );
        
      case 2: // Endereço de entrega
        return (
          <Formik
            initialValues={{
              enderecoEntrega: formData.enderecoEntrega
            }}
            validationSchema={enderecoSchema}
            onSubmit={handleNext}
          >
            {({ isSubmitting }) => (
              <Form>
                <SectionTitle>Endereço de Entrega</SectionTitle>
                
                <FormGroup>
                  <Label htmlFor="enderecoEntrega">Endereço completo</Label>
                  <StyledField 
                    as="textarea" 
                    id="enderecoEntrega" 
                    name="enderecoEntrega" 
                    placeholder="Rua, número, complemento, bairro, cidade, estado e CEP" 
                    rows={4}
                  />
                  <ErrorMessage name="enderecoEntrega" component={ErrorText} />
                </FormGroup>
                
                <NavigationButtons>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleBack}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Próximo
                  </Button>
                </NavigationButtons>
              </Form>
            )}
          </Formik>
        );
        
      case 3: // Forma de pagamento
        return (
          <Formik
            initialValues={{
              formaPagamento: formData.formaPagamento
            }}
            validationSchema={pagamentoSchema}
            onSubmit={(values) => {
              setFormData(prev => ({ ...prev, ...values }));
              handleSubmit();
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <SectionTitle>Forma de Pagamento</SectionTitle>
                
                <PaymentMethodContainer>
                  <PaymentOption 
                    selected={values.formaPagamento === 'pix'}
                    onClick={() => setFieldValue('formaPagamento', 'pix')}
                  >
                    <PaymentOptionIcon selected={values.formaPagamento === 'pix'}>
                      <FaMoneyBill />
                    </PaymentOptionIcon>
                    <PaymentOptionInfo>
                      <PaymentOptionTitle>PIX</PaymentOptionTitle>
                      <PaymentOptionDescription>
                        Pagamento instantâneo via chave PIX
                      </PaymentOptionDescription>
                    </PaymentOptionInfo>
                    <PaymentOptionCheck selected={values.formaPagamento === 'pix'}>
                      <FaCheck />
                    </PaymentOptionCheck>
                  </PaymentOption>
                  
                  <PaymentOption 
                    selected={values.formaPagamento === 'cartao'}
                    onClick={() => setFieldValue('formaPagamento', 'cartao')}
                  >
                    <PaymentOptionIcon selected={values.formaPagamento === 'cartao'}>
                      <FaCreditCard />
                    </PaymentOptionIcon>
                    <PaymentOptionInfo>
                      <PaymentOptionTitle>Cartão de Crédito</PaymentOptionTitle>
                      <PaymentOptionDescription>
                        Pagamento seguro com cartão de crédito
                      </PaymentOptionDescription>
                    </PaymentOptionInfo>
                    <PaymentOptionCheck selected={values.formaPagamento === 'cartao'}>
                      <FaCheck />
                    </PaymentOptionCheck>
                  </PaymentOption>
                  
                  <ErrorMessage name="formaPagamento" component={ErrorText} />
                </PaymentMethodContainer>
                
                <NavigationButtons>
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleBack}
                  >
                    Voltar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    Finalizar Pedido
                  </Button>
                </NavigationButtons>
              </Form>
            )}
          </Formik>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <StepsContainer>
        <Step active={currentStep === 1} completed={currentStep > 1}>
          <StepNumber active={currentStep === 1} completed={currentStep > 1}>
            {currentStep > 1 ? <FaCheck /> : 1}
          </StepNumber>
          <StepLabel active={currentStep === 1}>Dados Pessoais</StepLabel>
        </Step>
        
        <Step active={currentStep === 2} completed={currentStep > 2}>
          <StepNumber active={currentStep === 2} completed={currentStep > 2}>
            {currentStep > 2 ? <FaCheck /> : 2}
          </StepNumber>
          <StepLabel active={currentStep === 2}>Endereço</StepLabel>
        </Step>
        
        <Step active={currentStep === 3}>
          <StepNumber active={currentStep === 3}>3</StepNumber>
          <StepLabel active={currentStep === 3}>Pagamento</StepLabel>
        </Step>
      </StepsContainer>
      
      <CheckoutContainer>
        <CheckoutForm>
          {renderStep()}
        </CheckoutForm>
        
        <OrderSummary>
          <SummaryTitle>Resumo do Pedido</SummaryTitle>
          
          <SummaryItemList>
            {cart.map(item => (
              <SummaryItem key={item.produto.id}>
                <div style={{ display: 'flex' }}>
                  <ItemName>{item.produto.nome}</ItemName>
                  <ItemQuantity>x{item.quantidade}</ItemQuantity>
                </div>
                <ItemPrice>
                  {formatPrice(item.produto.preco * item.quantidade)}
                </ItemPrice>
              </SummaryItem>
            ))}
          </SummaryItemList>
          
          <SummaryTotal>
            <span>Total:</span>
            <span>{formatPrice(getTotal())}</span>
          </SummaryTotal>
        </OrderSummary>
      </CheckoutContainer>
    </div>
  );
};

export default Checkout;