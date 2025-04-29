package com.vaiart.Backend.controller

import com.vaiart.Backend.dto.PedidoDTO
import com.vaiart.Backend.dto.PedidoRequestDTO
import com.vaiart.Backend.model.StatusPedido
import com.vaiart.Backend.service.PedidoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = ["*"])
class PedidoController(private val pedidoService: PedidoService) {

    @GetMapping
    fun findAll(): ResponseEntity<List<PedidoDTO>> {
        return ResponseEntity.ok(pedidoService.findAll())
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<PedidoDTO> {
        return ResponseEntity.ok(pedidoService.findById(id))
    }

    @GetMapping("/cliente/{email}")
    fun findByEmailCliente(@PathVariable email: String): ResponseEntity<List<PedidoDTO>> {
        return ResponseEntity.ok(pedidoService.findByEmailCliente(email))
    }

    @PostMapping
    fun createPedido(@RequestBody dto: PedidoRequestDTO): ResponseEntity<PedidoDTO> {
        val createdPedido = pedidoService.createPedido(dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPedido)
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestParam status: StatusPedido
    ): ResponseEntity<PedidoDTO> {
        return ResponseEntity.ok(pedidoService.updateStatus(id, status))
    }

    @PutMapping("/{id}/transaction")
    fun updateTransactionId(
        @PathVariable id: Long,
        @RequestParam transactionId: String
    ): ResponseEntity<PedidoDTO> {
        return ResponseEntity.ok(pedidoService.updateTransactionId(id, transactionId))
    }
}