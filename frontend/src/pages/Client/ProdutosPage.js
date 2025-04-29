// src/pages/Client/ProdutosPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { produtoService } from '../../api/api';
import ProdutoCard from '../../components/Client/ProdutoCard';
import Loading from '../../components/Common/Loading';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

const ProdutosContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #333;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
  max-width: 600px;
`;

const SearchButton = styled(Button)`
  margin-left: 8px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const PaginationButton = styled(Button)`
  margin: 0 4px;
  min-width: 40px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const fetchProdutos = async (page = 0, search = '') => {
    setLoading(true);
    try {
      let response;
      
      if (search) {
        response = await produtoService.search(search, page, 12);
      } else {
        response = await produtoService.getAll(page, 12);
      }
      
      setProdutos(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProdutos(0);
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProdutos(0, searchTerm);
  };
  
  const handlePageChange = (page) => {
    fetchProdutos(page, searchTerm);
  };
  
  return (
    <ProdutosContainer>
      <PageTitle>Nossos Produtos</PageTitle>
      
      <form onSubmit={handleSearch}>
        <SearchContainer>
          <Input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit" icon={<FaSearch />}>
            Buscar
          </SearchButton>
        </SearchContainer>
      </form>
      
      {loading ? (
        <Loading />
      ) : (
        <>
          {produtos.length > 0 ? (
            <ProductsGrid>
              {produtos.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </ProductsGrid>
          ) : (
            <NoResults>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente pesquisar com outros termos ou navegue por todas as categorias.</p>
            </NoResults>
          )}
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton 
                variant="secondary"
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </PaginationButton>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationButton 
                  key={index}
                  variant={currentPage === index ? 'primary' : 'secondary'}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </PaginationButton>
              ))}
              
              <PaginationButton 
                variant="secondary"
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Próximo
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </ProdutosContainer>
  );
};

export default ProdutosPage;