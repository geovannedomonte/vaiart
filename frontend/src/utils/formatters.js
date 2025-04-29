// src/utils/formatters.js
/**
 * Utilitários de formatação para a aplicação
 * Contém funções para formatar valores monetários, datas, telefones, etc.
 */

/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @param {boolean} showSymbol - Indica se deve mostrar o símbolo da moeda (R$)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, showSymbol = true) => {
    if (value === null || value === undefined) return '-';
    
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    const formatted = formatter.format(value);
    return showSymbol ? formatted : formatted.replace('R$', '').trim();
  };
  
  /**
   * Formata uma data para o formato brasileiro (dd/mm/yyyy)
   * @param {string|Date} date - Data a ser formatada
   * @returns {string} Data formatada
   */
  export const formatDate = (date) => {
    if (!date) return '-';
    
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };
  
  /**
   * Formata uma data e hora para o formato brasileiro (dd/mm/yyyy HH:MM)
   * @param {string|Date} dateTime - Data e hora a ser formatada
   * @returns {string} Data e hora formatada
   */
  export const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';
    
    let dateObj;
    if (typeof dateTime === 'string') {
      dateObj = new Date(dateTime);
    } else {
      dateObj = dateTime;
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };
  
  /**
   * Formata uma data para exibição por extenso
   * @param {string|Date} date - Data a ser formatada
   * @returns {string} Data formatada por extenso
   */
  export const formatDateExtended = (date) => {
    if (!date) return '-';
    
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };
  
  /**
   * Formata um número de telefone para o formato brasileiro
   * @param {string} phone - Número de telefone a ser formatado
   * @returns {string} Número de telefone formatado
   */
  export const formatPhone = (phone) => {
    if (!phone) return '-';
    
    // Remove caracteres não numéricos
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 11) {
      // Formato para celular: (99) 99999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      // Formato para telefone fixo: (99) 9999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    
    // Se não for um formato conhecido, retorna o original
    return phone;
  };
  
  /**
   * Formata um texto para exibição com limite de caracteres
   * @param {string} text - Texto a ser formatado
   * @param {number} maxLength - Número máximo de caracteres
   * @returns {string} Texto formatado
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.slice(0, maxLength) + '...';
  };
  
  /**
   * Formata um CPF para o formato brasileiro
   * @param {string} cpf - CPF a ser formatado
   * @returns {string} CPF formatado
   */
  export const formatCpf = (cpf) => {
    if (!cpf) return '-';
    
    // Remove caracteres não numéricos
    const digits = cpf.replace(/\D/g, '');
    
    if (digits.length !== 11) {
      return cpf;
    }
    
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };
  
  /**
   * Formata um CNPJ para o formato brasileiro
   * @param {string} cnpj - CNPJ a ser formatado
   * @returns {string} CNPJ formatado
   */
  export const formatCnpj = (cnpj) => {
    if (!cnpj) return '-';
    
    // Remove caracteres não numéricos
    const digits = cnpj.replace(/\D/g, '');
    
    if (digits.length !== 14) {
      return cnpj;
    }
    
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  };
  
  /**
   * Formata um CEP para o formato brasileiro
   * @param {string} cep - CEP a ser formatado
   * @returns {string} CEP formatado
   */
  export const formatCep = (cep) => {
    if (!cep) return '-';
    
    // Remove caracteres não numéricos
    const digits = cep.replace(/\D/g, '');
    
    if (digits.length !== 8) {
      return cep;
    }
    
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };
  
  /**
   * Capitaliza a primeira letra de cada palavra em um texto
   * @param {string} text - Texto a ser formatado
   * @returns {string} Texto com a primeira letra de cada palavra em maiúsculo
   */
  export const capitalizeWords = (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Formata um número com separador de milhares
   * @param {number} value - Número a ser formatado
   * @param {number} decimals - Número de casas decimais
   * @returns {string} Número formatado
   */
  export const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  /**
   * Formata uma data para um formato relativo (hoje, ontem, há X dias)
   * @param {string|Date} date - Data a ser formatada
   * @returns {string} Data em formato relativo
   */
  export const formatRelativeDate = (date) => {
    if (!date) return '-';
    
    let dateObj;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `Há ${diffDays} dias`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `Há ${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  };