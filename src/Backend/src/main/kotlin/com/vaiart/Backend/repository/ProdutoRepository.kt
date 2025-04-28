package com.vaiart.Backend.repository

import com.vaiart.Backend.model.Produto
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProdutoRepository : JpaRepository<Produto, Long> {
    fun findByNomeContainingIgnoreCase(nome: String, pageable: Pageable): Page<Produto>
    fun findByDisponivelTrue(pageable: Pageable): Page<Produto>
}