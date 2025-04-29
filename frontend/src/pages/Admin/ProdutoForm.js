// src/pages/Admin/ProdutoForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaUndo, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { produtoService } from '../../api/api';
import Button from '../../components/Common/Button';
import Loading from '../../components/Common/Loading';

const PageContainer = styled.div`
  max-width: 800px;
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

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
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
  align-items: center;
  margin-top: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 8px;
  position: relative;
  width: 200px;
  height: 200px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const NoImageText = styled.div`
  color: #999;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  svg {
    font-size: 32px;
    margin-bottom: 8px;
  }
`;

const DeletionWarning = styled.div`
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  padding: 16px;
  margin-top: 24px;
  color: #b71c1c;
`;

const WarningTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

const ConfirmationContainer = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 12px;
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

const ProdutoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Valores iniciais do formulário
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
  
  // Carregar dados do produto se for edição
  useEffect(() => {
    const fetchProduto = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await produtoService.getById(id);
          setProduto(response.data);
        } catch (error) {
          toast.error('Erro ao carregar produto');
          console.error('Erro ao carregar produto:', error);
          navigate('/admin/produtos');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduto();
  }, [id, navigate]);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (id) {
        // Atualizar produto existente
        await produtoService.update(id, values);
        toast.success('Produto atualizado com sucesso');
      } else {
        // Criar novo produto
        await produtoService.create(values);
        toast.success('Produto criado com sucesso');
      }
      navigate('/admin/produtos');
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error('Erro ao salvar produto:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await produtoService.delete(id);
      toast.success('Produto excluído com sucesso');
      navigate('/admin/produtos');
    } catch (error) {
      toast.error('Erro ao excluir produto');
      console.error('Erro ao excluir produto:', error);
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          {id ? 'Editar Produto' : 'Novo Produto'}
        </PageTitle>
      </PageHeader>
      
      <FormContainer>
        <Formik
          initialValues={initialValues}
          validationSchema={produtoSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                
                <ImagePreviewContainer>
                  {values.urlImagem ? (
                    <ImagePreview 
                      src={values.urlImagem} 
                      alt="Prévia da imagem"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x200?text=Imagem+Inválida';
                      }}
                    />
                  ) : (
                    <NoImageText>
                      <FaImage />
                      <div>Sem imagem</div>
                    </NoImageText>
                  )}
                </ImagePreviewContainer>
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
                  onClick={() => navigate('/admin/produtos')}
                  icon={<FaUndo />}
                >
                  Cancelar
                </Button>
                
                <ActionButtons>
                  {id && (
                    <Button 
                      type="button" 
                      variant="danger" 
                      onClick={() => setShowDeleteConfirmation(true)}
                      icon={<FaTrash />}
                    >
                      Excluir
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    icon={<FaSave />}
                  >
                    {id ? 'Atualizar Produto' : 'Criar Produto'}
                  </Button>
                </ActionButtons>
              </ButtonsContainer>
            </Form>
          )}
        </Formik>
        
        {showDeleteConfirmation && (
          <DeletionWarning>
            <WarningTitle>Tem certeza que deseja excluir este produto?</WarningTitle>
            <p>Esta ação não pode ser desfeita. O produto será removido permanentemente.</p>
            <ConfirmationContainer>
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                Sim, excluir produto
              </Button>
            </ConfirmationContainer>
          </DeletionWarning>
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default ProdutoFormPage;