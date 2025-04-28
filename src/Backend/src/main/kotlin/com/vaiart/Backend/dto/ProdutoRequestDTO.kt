package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Produto
import java.math.BigDecimal

data class ProdutoRequestDTO(
    val nome: String,
    val descricao: String? = null,
    val preco: BigDecimal,
    val urlImagem: String? = null,
    val disponivel: Boolean = true
) {
    fun toEntity(): Produto {
        return Produto(
            nome = nome,
            descricao = descricao,
            preco = preco,
            urlImagem = urlImagem,
            disponivel = disponivel
        )
    }
}
)
