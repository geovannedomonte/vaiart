// src/utils/validators.js
/**
 * Utilitários de validação para a aplicação
 * Contém funções para validar emails, CPFs, telefones, senhas, etc.
 */

/**
 * Valida se um endereço de email é válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} Indica se o email é válido
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    // Expressão regular para validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Valida se um CPF é válido
   * @param {string} cpf - CPF a ser validado
   * @returns {boolean} Indica se o CPF é válido
   */
  export const isValidCPF = (cpf) => {
    if (!cpf) return false;
    
    // Remove caracteres não numéricos
    const strCPF = cpf.replace(/\D/g, '');
    
    if (strCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(strCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;
    
    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(strCPF.substring(9, 10))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(strCPF.substring(10, 11))) return false;
    
    return true;
  };
  
  /**
   * Valida se um CNPJ é válido
   * @param {string} cnpj - CNPJ a ser validado
   * @returns {boolean} Indica se o CNPJ é válido
   */
  export const isValidCNPJ = (cnpj) => {
    if (!cnpj) return false;
    
    // Remove caracteres não numéricos
    const strCNPJ = cnpj.replace(/\D/g, '');
    
    if (strCNPJ.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(strCNPJ)) return false;
    
    // Validação dos dígitos verificadores
    let size = strCNPJ.length - 2;
    let numbers = strCNPJ.substring(0, size);
    const digits = strCNPJ.substring(size);
    
    let sum = 0;
    let pos = size - 7;
    
    // Validação do primeiro dígito verificador
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    // Validação do segundo dígito verificador
    size = size + 1;
    numbers = strCNPJ.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  };
  
  /**
   * Valida se um número de telefone é válido
   * @param {string} phone - Telefone a ser validado
   * @returns {boolean} Indica se o telefone é válido
   */
  export const isValidPhone = (phone) => {
    if (!phone) return false;
    
    // Remove caracteres não numéricos
    const digits = phone.replace(/\D/g, '');
    
    // Verifica se o telefone tem 10 ou 11 dígitos (com DDD)
    return digits.length === 10 || digits.length === 11;
  };
  
  /**
   * Valida se um CEP é válido
   * @param {string} cep - CEP a ser validado
   * @returns {boolean} Indica se o CEP é válido
   */
  export const isValidCEP = (cep) => {
    if (!cep) return false;
    
    // Remove caracteres não numéricos
    const digits = cep.replace(/\D/g, '');
    
    // CEP deve ter 8 dígitos
    return digits.length === 8;
  };
  
  /**
   * Valida se uma senha atende aos requisitos mínimos de segurança
   * @param {string} password - Senha a ser validada
   * @param {number} minLength - Comprimento mínimo da senha (padrão: 6)
   * @returns {boolean} Indica se a senha é válida
   */
  export const isValidPassword = (password, minLength = 6) => {
    if (!password) return false;
    
    // Verifica o comprimento mínimo
    return password.length >= minLength;
  };
  
  /**
   * Validação mais rigorosa de senha com requisitos específicos
   * @param {string} password - Senha a ser validada
   * @returns {object} Objeto contendo resultado de validação e mensagens
   */
  export const validateStrongPassword = (password) => {
    const result = {
      isValid: true,
      errors: []
    };
    
    if (!password) {
      result.isValid = false;
      result.errors.push('A senha é obrigatória');
      return result;
    }
    
    // Verifica o comprimento mínimo
    if (password.length < 8) {
      result.isValid = false;
      result.errors.push('A senha deve ter pelo menos 8 caracteres');
    }
    
    // Verifica se contém pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }
    
    // Verifica se contém pelo menos uma letra minúscula
    if (!/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos uma letra minúscula');
    }
    
    // Verifica se contém pelo menos um número
    if (!/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos um número');
    }
    
    // Verifica se contém pelo menos um caractere especial
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos um caractere especial');
    }
    
    return result;
  };
  
  /**
   * Valida se uma data está em um formato válido
   * @param {string} date - Data a ser validada (formato: YYYY-MM-DD)
   * @returns {boolean} Indica se a data é válida
   */
  export const isValidDate = (date) => {
    if (!date) return false;
    
    // Verifica se a data é válida
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  };
  
  /**
   * Valida se uma URL é válida
   * @param {string} url - URL a ser validada
   * @returns {boolean} Indica se a URL é válida
   */
  export const isValidURL = (url) => {
    if (!url) return false;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Verifica se um valor é um número válido
   * @param {any} value - Valor a ser verificado
   * @returns {boolean} Indica se é um número válido
   */
  export const isValidNumber = (value) => {
    if (value === null || value === undefined || value === '') return false;
    
    // Verifica se é um número ou se pode ser convertido para número
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  
  /**
   * Verifica se um valor está dentro de um intervalo
   * @param {number} value - Valor a ser verificado
   * @param {number} min - Valor mínimo do intervalo
   * @param {number} max - Valor máximo do intervalo
   * @returns {boolean} Indica se o valor está dentro do intervalo
   */
  export const isInRange = (value, min, max) => {
    if (!isValidNumber(value)) return false;
    
    const numValue = parseFloat(value);
    return numValue >= min && numValue <= max;
  };
  
  /**
   * Valida se um texto excede o comprimento máximo
   * @param {string} text - Texto a ser validado
   * @param {number} maxLength - Comprimento máximo permitido
   * @returns {boolean} Indica se o texto é válido
   */
  export const isValidLength = (text, maxLength) => {
    if (!text) return true; // Texto vazio é considerado válido
    
    return text.length <= maxLength;
  };
  
  /**
   * Verifica se um valor está presente em uma lista de valores permitidos
   * @param {any} value - Valor a ser verificado
   * @param {Array} allowedValues - Lista de valores permitidos
   * @returns {boolean} Indica se o valor é permitido
   */
  export const isAllowedValue = (value, allowedValues) => {
    if (!Array.isArray(allowedValues)) return false;
    
    return allowedValues.includes(value);
  };