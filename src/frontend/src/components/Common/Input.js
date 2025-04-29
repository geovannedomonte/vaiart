// src/components/Common/Input.js
import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
`;

const StyledInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  
  ${props => props.error && `
    border-color: #f44336;
  `}
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
`;

const Input = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  disabled = false, 
  error = null,
  ...rest 
}) => {
  return (
    <InputContainer>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      <StyledInput 
        id={id}
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={!!error}
        {...rest}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;