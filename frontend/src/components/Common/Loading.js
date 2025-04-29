// src/components/Common/Loading.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3f51b5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 16px;
`;

const LogoAnimation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const LogoLetter = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #3f51b5;
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  margin: 0 2px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 8px;
`;

const Loading = ({ text = 'Carregando...' }) => {
  return (
    <LoadingContainer>
      <LogoAnimation>
        <LogoLetter delay="0s">V</LogoLetter>
        <LogoLetter delay="0.1s">a</LogoLetter>
        <LogoLetter delay="0.2s">i</LogoLetter>
        <LogoLetter delay="0.3s">A</LogoLetter>
        <LogoLetter delay="0.4s">r</LogoLetter>
        <LogoLetter delay="0.5s">t</LogoLetter>
      </LogoAnimation>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;