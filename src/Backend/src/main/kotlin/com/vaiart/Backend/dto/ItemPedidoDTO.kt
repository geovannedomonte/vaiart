package com.vaiart.Backend.dto

import com.vaiart.Backend.model.ItemPedido
import java.math.BigDecimal

data class ItemPedidoDTO(
    val id: Long = 0,
    val produtoId: Long,
    val produtoNome: String,
    val quantidade: Int,
    val precoUnitario: BigDecimal,
    val subtotal: BigDecimal
) {
    companion object {
        fun fromEntity(itemPedido: ItemPedido): ItemPedidoDTO {
            return ItemPedidoDTO(
                id = itemPedido.id,
                produtoId = itemPedido.produto.id,
                produtoNome = itemPedido.produto.nome,
                quantidade = itemPedido.quantidade,
                precoUnitario = itemPedido.precoUnitario,
                subtotal = itemPedido.subTotal
            )
        }
    }
}
