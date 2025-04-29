package com.vaiart.Backend.service

import com.vaiart.Backend.dto.PedidoDTO
import com.vaiart.Backend.dto.PedidoRequestDTO
import com.vaiart.Backend.model.ItemPedido
import com.vaiart.Backend.model.Pedido
import com.vaiart.Backend.model.StatusPedido
import com.vaiart.Backend.repository.ItemPedidoRepository
import com.vaiart.Backend.repository.PedidoRepository
import com.vaiart.Backend.repository.ProdutoRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
class PedidoService(
    private val pedidoRepository: PedidoRepository,
    private val produtoRepository: ProdutoRepository,
    private val itemPedidoRepository: ItemPedidoRepository
) {

    @Transactional(readOnly = true)
    fun findAll(): List<PedidoDTO> {
        return pedidoRepository.findAll().map { PedidoDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): PedidoDTO {
        val pedido = pedidoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Pedido não encontrado com ID: $id") }
        return PedidoDTO.fromEntity(pedido)
    }

    @Transactional(readOnly = true)
    fun findByEmailCliente(email: String): List<PedidoDTO> {
        return pedidoRepository.ffindByEmailCliente(email).map { PedidoDTO.fromEntity(it) }
    }

    @Transactional
    fun createPedido(dto: PedidoRequestDTO): PedidoDTO {
        if (dto.pedidos.isEmpty()) {
            throw IllegalArgumentException("O pedido deve conter pelo menos um item")
        }

        // Calcular total e criar o pedido
        var total = BigDecimal.ZERO
        val pedido = Pedido(
            nomeCliente = dto.nomeCliente,
            emailCliente = dto.emailCliente,
            total = total,  // Será atualizado depois
            status = StatusPedido.AGUARDANDO_PAGAMENTO
        )

        val savedPedido = pedidoRepository.save(pedido)

        // Criar itens do pedido
        dto.pedidos.forEach { itemDto ->
            val produto = produtoRepository.findById(itemDto.produtoId)
                .orElseThrow { EntityNotFoundException("Produto não encontrado com ID: ${itemDto.produtoId}") }

            if (!produto.disponivel) {
                throw IllegalArgumentException("O produto ${produto.nome} não está disponível")
            }

            val precoUnitario = produto.preco
            val subtotal = precoUnitario.multiply(BigDecimal(itemDto.quantidade))
            total = total.add(subtotal)

            val itemPedido = ItemPedido(
                pedido = savedPedido,
                produto = produto,
                quantidade = itemDto.quantidade,
                precoUnitario = precoUnitario,
                subTotal = subtotal
            )

            itemPedidoRepository.save(itemPedido)
        }

        // Atualizar o total do pedido
        savedPedido.total = total
        pedidoRepository.save(savedPedido)

        return PedidoDTO.fromEntity(savedPedido)
    }

    @Transactional
    fun updateStatus(id: Long, status: StatusPedido): PedidoDTO {
        val pedido = pedidoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Pedido não encontrado com ID: $id") }

        pedido.status = status
        val updatedPedido = pedidoRepository.save(pedido)

        return PedidoDTO.fromEntity(updatedPedido)
    }

    @Transactional
    fun updateTransactionId(id: Long, transactionId: String): PedidoDTO {
        val pedido = pedidoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Pedido não encontrado com ID: $id") }

        pedido.idTransacao = transactionId
        pedido.status = StatusPedido.PAGO

        val updatedPedido = pedidoRepository.save(pedido)
        return PedidoDTO.fromEntity(updatedPedido)
    }
}