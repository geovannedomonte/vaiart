package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Pedido
import com.vaiart.Backend.model.StatusPedido
import java.math.BigDecimal
import java.time.LocalDateTime

data class PedidoDTO(
    val id: Long = 0,
    val nomeCliente: String,
    val emailCliente: String,
    val dataPedido: LocalDateTime,
    val total: BigDecimal,
    val idTransacao: String? = null,
    val status: StatusPedido,
    val pedidos: List<ItemPedidoDTO> = listOf()
) {
    companion object {
        fun fromEntity(pedido: Pedido): PedidoDTO {
            return PedidoDTO(
                id = pedido.id,
                nomeCliente = pedido.nomeCliente,
                emailCliente = pedido.emailCliente,
                dataPedido = pedido.dataPedido,
                total = pedido.total,
                idTransacao = pedido.idTransacao,
                status = pedido.status,
                pedidos = pedido.pedidos.map { ItemPedidoDTO.fromEntity(it) }
            )
        }
    }
}

