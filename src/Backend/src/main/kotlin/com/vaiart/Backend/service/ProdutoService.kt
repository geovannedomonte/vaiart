package com.vaiart.Backend.service

import com.vaiart.Backend.dto.ProdutoDTO
import com.vaiart.Backend.dto.ProdutoRequestDTO
import com.vaiart.Backend.model.Produto
import com.vaiart.Backend.repository.ProdutoRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProdutoService(private val produtoRepository: ProdutoRepository) {

    @Transactional(readOnly = true)
    fun findAll(pageable: Pageable): Page<ProdutoDTO> {
        return produtoRepository.findAll(pageable).map { ProdutoDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun findAvailable(pageable: Pageable): Page<ProdutoDTO> {
        return produtoRepository.findByDisponivelTrue(pageable).map { ProdutoDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): ProdutoDTO {
        val produto = produtoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Produto não encontrado com ID: $id") }
        return ProdutoDTO.fromEntity(produto)
    }

    @Transactional(readOnly = true)
    fun findByNome(nome: String, pageable: Pageable): Page<ProdutoDTO> {
        return produtoRepository.findByNomeContainingIgnoreCase(nome, pageable)
            .map { ProdutoDTO.fromEntity(it) }
    }

    @Transactional
    fun save(dto: ProdutoRequestDTO): ProdutoDTO {
        val produto = dto.toEntity()
        val savedProduto = produtoRepository.save(produto)
        return ProdutoDTO.fromEntity(savedProduto)
    }

    @Transactional
    fun update(id: Long, dto: ProdutoRequestDTO): ProdutoDTO {
        val existingProduto = produtoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Produto não encontrado com ID: $id") }

        existingProduto.nome = dto.nome
        existingProduto.descricao = dto.descricao
        existingProduto.preco = dto.preco
        existingProduto.urlImagem = dto.urlImagem
        existingProduto.disponivel = dto.disponivel

        val updatedProduto = produtoRepository.save(existingProduto)
        return ProdutoDTO.fromEntity(updatedProduto)
    }

    @Transactional
    fun delete(id: Long) {
        if (!produtoRepository.existsById(id)) {
            throw EntityNotFoundException("Produto não encontrado com ID: $id")
        }
        produtoRepository.deleteById(id)
    }
}