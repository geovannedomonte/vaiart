package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Produto
import java.math.BigDecimal
import java.time.LocalDateTime

data class ProdutoDTO(
    val id: Long = 0,
    val nome: String,
    val descricao: String? = null,
    val preco: BigDecimal,
    val urlImagem: String? = null,
    val disponivel: Boolean = true,
    val dataCriacao: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        fun fromEntity(produto: Produto): ProdutoDTO {
            return ProdutoDTO(
                id = produto.id,
                nome = produto.nome,
                descricao = produto.descricao,
                preco = produto.preco,
                urlImagem = produto.urlImagem,
                disponivel = produto.disponivel,
                dataCriacao = produto.dataCriacao
            )
        }
    }
}
