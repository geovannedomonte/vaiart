// src/components/Client/Cart.js
import React, { useContext } from 'react';
import styled from 'styled-components';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../../contexts/CartContext';
import Button from '../Common/Button';

const CartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartHeader = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const CartTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  color: #333;
`;

const CartItems = styled.div`
  padding: 16px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px