package com.vaiart.Backend.dto

data class PedidoRequestDTO(
    val nomeCliente: String,
    val emailCliente: String,
    val pedidos: List<ItemPedidoRequestDTO>
)
