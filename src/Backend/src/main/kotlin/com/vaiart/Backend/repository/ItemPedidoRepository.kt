package com.vaiart.Backend.repository

import com.vaiart.Backend.model.ItemPedido
import com.vaiart.Backend.model.Pedido
import com.vaiart.Backend.model.Produto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ItemPedidoRepository : JpaRepository<ItemPedido, Long> {
    fun findByPedido(pedido: Pedido): List<ItemPedido>
    fun findByProduto(produto: Produto): List<ItemPedido>
}