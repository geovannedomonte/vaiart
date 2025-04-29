// src/pages/Admin/ProdutosPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { produtoService } from '../../api/api';
import Button from '../../components/Common/Button';
import ProdutoForm from '../../components/Admin/ProdutoForm';
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-weight: 500;
  color: #333;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductName = styled.div`
  font-weight: 500;
  color: #333;
`;

const ProductPrice = styled.div`
  font-weight: 500;
  color: #3f51b5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => props.available ? `
    background-color: #e8f5e9;
    color: #2e7d32;
  ` : `
    background-color: #ffebee;
    color: #c62828;
  `}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduto, setCurrentProduto] = useState(null);
  
  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await produtoService.getAll(0, 100);
      setProdutos(response.data.content);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProdutos();
  }, []);
  
  const handleAddClick = () => {
    setCurrentProduto(null);
    setShowModal(true);
  };
  
  const handleEditClick = (produto) => {
    setCurrentProduto(produto);
    setShowModal(true);
  };
  
  const handleDeleteClick = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtoService.delete(id);
        toast.success('Produto excluído com sucesso');
        fetchProdutos();
      } catch (error) {
        toast.error('Erro ao excluir produto');
        console.error('Erro ao excluir produto:', error);
      }
    }
  };
  
  const handleFormSubmit = async (values) => {
    try {
      if (currentProduto) {
        await produtoService.update(currentProduto.id, values);
        toast.success('Produto atualizado com sucesso');
      } else {
        await produtoService.create(values);
        toast.success('Produto criado com sucesso');
      }
      setShowModal(false);
      fetchProdutos();
    } catch (error) {
      toast.error('Erro ao salvar produto');
      console.error('Erro ao salvar produto:', error);
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
      <PageHeader>
        <PageTitle>Gerenciar Produtos</PageTitle>
        <Button onClick={handleAddClick} icon={<FaPlus />}>
          Novo Produto
        </Button>
      </PageHeader>
      
      {loading ? (
        <Loading />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Imagem</Th>
              <Th>Nome</Th>
              <Th>Preço</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id}>
                <Td>
                  <ProductImage 
                    src={produto.urlImagem || 'https://via.placeholder.com/60x60?text=Sem+Imagem'} 
                    alt={produto.nome} 
                  />
                </Td>
                <Td>
                  <ProductName>{produto.nome}</ProductName>
                </Td>
                <Td>
                  <ProductPrice>{formatPrice(produto.preco)}</ProductPrice>
                </Td>
                <Td>
                  <StatusBadge available={produto.disponivel}>
                    {produto.disponivel ? 'Disponível' : 'Indisponível'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButtons>
                    <Button 
                      variant="secondary" 
                      icon={<FaEdit />}
                      onClick={() => handleEditClick(produto)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      icon={<FaTrash />}
                      onClick={() => handleDeleteClick(produto.id)}
                    >
                      Excluir
                    </Button>
                  </ActionButtons>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {currentProduto ? 'Editar Produto' : 'Novo Produto'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ProdutoForm 
              produto={currentProduto} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setShowModal(false)}
            />
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ProdutosPage;