package com.vaiart.Backend.repository

import com.vaiart.Backend.model.Pedido
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface PedidoRepository: JpaRepository<Pedido, Long> {
    fun ffindByEmailCliente(emailCliente: String): List<Pedido>
    fun findByDataPedidoBetween(inicio: LocalDateTime, fim: LocalDateTime): List<Pedido>
}