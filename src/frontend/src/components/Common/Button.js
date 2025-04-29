// src/components/Common/Button.js
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 10px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.variant === 'primary' && `
    background-color: #3f51b5;
    color: white;
    border: none;
    
    &:hover {
      background-color: #303f9f;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #e0e0e0;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: #f44336;
    color: white;
    border: none;
    
    &:hover {
      background-color: #d32f2f;
    }
  `}
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.children ? '8px' : '0'};
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  onClick, 
  disabled = false, 
  fullWidth = false,
  icon = null,
  ...rest 
}) => {
  return (
    <StyledButton 
      type={type} 
      variant={variant} 
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      {...rest}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

export default Button;