// src/pages/Client/CheckoutPage.js
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
import Button from '../../components/Common/Button';

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

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const CheckoutForm = styled.div`
  flex: 2;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const OrderSummary = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
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

const FormSectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
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

// Schema de validação dos dados do cliente
const clienteSchema = Yup.object({
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
    ),
  enderecoEntrega: Yup.string()
    .required('Endereço de entrega é obrigatório')
    .min(10, 'Endereço muito curto')
});

const CheckoutPage = () => {
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('pix');
  
  // Redirecionar se o carrinho estiver vazio
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/produtos');
      toast.info('Seu carrinho está vazio');
    }
  }, [cart.length, navigate]);
  
  const handleSubmit = async (values) => {
    try {
      // Preparar dados do pedido
      const pedidoData = {
        nomeCliente: values.nomeCliente,
        emailCliente: values.emailCliente,
        telefoneCliente: values.telefoneCliente,
        enderecoEntrega: values.enderecoEntrega,
        formaPagamento: paymentMethod,
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
  
  return (
    <PageContainer>
      <PageTitle>Finalizar Compra</PageTitle>
      
      <CheckoutContainer>
        <CheckoutForm>
          <Formik
            initialValues={{
              nomeCliente: user?.nome || '',
              emailCliente: user?.email || '',
              telefoneCliente: '',
              enderecoEntrega: ''
            }}
            validationSchema={clienteSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormSectionTitle>Dados do Cliente</FormSectionTitle>
                
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
                
                <FormGroup>
                  <Label htmlFor="enderecoEntrega">Endereço completo</Label>
                  <StyledField 
                    as="textarea" 
                    id="enderecoEntrega" 
                    name="enderecoEntrega" 
                    placeholder="Rua, número, complemento, bairro, cidade, estado e CEP" 
                    rows={3}
                  />
                  <ErrorMessage name="enderecoEntrega" component={ErrorText} />
                </FormGroup>
                
                <FormSectionTitle>Forma de Pagamento</FormSectionTitle>
                
                <PaymentMethodContainer>
                  <PaymentOption 
                    selected={paymentMethod === 'pix'}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <PaymentOptionIcon selected={paymentMethod === 'pix'}>
                      <FaMoneyBill />
                    </PaymentOptionIcon>
                    <PaymentOptionInfo>
                      <PaymentOptionTitle>PIX</PaymentOptionTitle>
                      <PaymentOptionDescription>
                        Pagamento instantâneo via chave PIX
                      </PaymentOptionDescription>
                    </PaymentOptionInfo>
                    <PaymentOptionCheck selected={paymentMethod === 'pix'}>
                      <FaCheck />
                    </PaymentOptionCheck>
                  </PaymentOption>
                  
                  <PaymentOption 
                    selected={paymentMethod === 'cartao'}
                    onClick={() => setPaymentMethod('cartao')}
                  >
                    <PaymentOptionIcon selected={paymentMethod === 'cartao'}>
                      <FaCreditCard />
                    </PaymentOptionIcon>
                    <PaymentOptionInfo>
                      <PaymentOptionTitle>Cartão de Crédito</PaymentOptionTitle>
                      <PaymentOptionDescription>
                        Pagamento seguro com cartão de crédito
                      </PaymentOptionDescription>
                    </PaymentOptionInfo>
                    <PaymentOptionCheck selected={paymentMethod === 'cartao'}>
                      <FaCheck />
                    </PaymentOptionCheck>
                  </PaymentOption>
                </PaymentMethodContainer>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  fullWidth
                >
                  {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
              </Form>
            )}
          </Formik>
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
    </PageContainer>
  );
};

export default CheckoutPage;