// src/pages/Client/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { produtoService } from '../../api/api';
import ProdutoCard from '../../components/Client/ProdutoCard';
import Button from '../../components/Common/Button';
import Loading from '../../components/Common/Loading';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 40px;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 16px;
  color: #333;
`;

const HeroDescription = styled.p`
  font-size: 18px;
  margin-bottom: 24px;
  max-width: 600px;
  color: #666;
`;

const ProductsSection = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HomePage = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await produtoService.getAll(0, 4);
        setProdutos(response.data.content);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProdutos();
  }, []);
  
  return (
    <HomeContainer>
      <Hero>
        <HeroTitle>Adesivos personalizados para seu negócio</HeroTitle>
        <HeroDescription>
          Transforme seu ambiente com adesivos de alta qualidade. 
          Ideal para decoração, identificação e marketing.
        </HeroDescription>
        <Button as={Link} to="/produtos">
          Ver todos os produtos
        </Button>
      </Hero>
      
      <ProductsSection>
        <SectionTitle>Produtos em Destaque</SectionTitle>
        
        {loading ? (
          <Loading />
        ) : (
          <>
            <ProductsGrid>
              {produtos.map(produto => (
                <ProdutoCard key={produto.id} produto={produto} />
              ))}
            </ProductsGrid>
            
            <ButtonContainer>
              <Button 
                as={Link} 
                to="/produtos"
                variant="secondary"
              >
                Ver todos os produtos
              </Button>
            </ButtonContainer>
          </>
        )}
      </ProductsSection>
    </HomeContainer>
  );
};

export default HomePage;