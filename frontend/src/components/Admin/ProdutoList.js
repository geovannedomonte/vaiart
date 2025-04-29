// src/components/Admin/ProdutoList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { produtoService } from '../../api/api';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import ProdutoForm from './ProdutoForm';

const ListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const ListTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
`;

const PageInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${props => props.active ? '#3f51b5' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#3f51b5' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  margin: 0;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

const ProdutoList = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProduto, setCurrentProduto] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  
  const fetchProdutos = async (pageNumber = 0, search = '') => {
    setLoading(true);
    try {
      let response;
      
      if (search) {
        response = await produtoService.search(search, pageNumber, pageSize);
      } else {
        response = await produtoService.getAll(pageNumber, pageSize);
      }
      
      setProdutos(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setPage(pageNumber);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProdutos(0, searchTerm);
  }, []);
  
  const handleSearch = () => {
    fetchProdutos(0, searchTerm);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handlePageChange = (newPage) => {
    fetchProdutos(newPage, searchTerm);
  };
  
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
        fetchProdutos(page, searchTerm);
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
      fetchProdutos(page, searchTerm);
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
  
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(0, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 0) {
      buttons.push(
        <PageButton 
          key="first" 
          onClick={() => handlePageChange(0)}
        >
          &laquo;
        </PageButton>
      );
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PageButton 
          key={i} 
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </PageButton>
      );
    }
    
    if (endPage < totalPages - 1) {
      buttons.push(
        <PageButton 
          key="last" 
          onClick={() => handlePageChange(totalPages - 1)}
        >
          &raquo;
        </PageButton>
      );
    }
    
    return buttons;
  };
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Lista de Produtos</ListTitle>
        <ActionBar>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="secondary" 
              icon={<FaSearch />}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </SearchContainer>
          <Button 
            onClick={handleAddClick} 
            icon={<FaPlus />}
          >
            Novo Produto
          </Button>
        </ActionBar>
      </ListHeader>
      
      {loading ? (
        <Loading />
      ) : produtos.length === 0 ? (
        <EmptyState>
          <p>Nenhum produto encontrado.</p>
        </EmptyState>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
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
          </div>
          
          <PaginationContainer>
            <PageInfo>
              Exibindo {Math.min(pageSize, produtos.length)} de {totalElements} produtos
            </PageInfo>
            <PageButtons>
              <PageButton
                disabled={page === 0}
                onClick={() => handlePageChange(page - 1)}
              >
                Anterior
              </PageButton>
              
              {renderPageButtons()}
              
              <PageButton
                disabled={page >= totalPages - 1}
                onClick={() => handlePageChange(page + 1)}
              >
                Próxima
              </PageButton>
            </PageButtons>
          </PaginationContainer>
        </>
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
    </ListContainer>
  );
};

export default ProdutoList;