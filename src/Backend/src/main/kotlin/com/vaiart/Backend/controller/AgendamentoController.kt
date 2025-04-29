package com.vaiart.Backend.controller

import com.vaiart.Backend.dto.AgendamentoDTO
import com.vaiart.Backend.dto.AgendamentoRequestDTO
import com.vaiart.Backend.service.AgendamentoService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = ["*"])
class AgendamentoController(private val agendamentoService: AgendamentoService) {

    @GetMapping
    fun findAll(): ResponseEntity<List<AgendamentoDTO>> {
        return ResponseEntity.ok(agendamentoService.findAll())
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<AgendamentoDTO> {
        return ResponseEntity.ok(agendamentoService.findById(id))
    }

    @GetMapping("/periodo")
    fun findByPeriodo(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) inicio: LocalDateTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) fim: LocalDateTime
    ): ResponseEntity<List<AgendamentoDTO>> {
        return ResponseEntity.ok(agendamentoService.findByPeriodo(inicio, fim))
    }

    @PostMapping
    fun save(@RequestBody dto: AgendamentoRequestDTO): ResponseEntity<AgendamentoDTO> {
        val agendamento = agendamentoService.save(dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamento)
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody dto: AgendamentoRequestDTO
    ): ResponseEntity<AgendamentoDTO> {
        return ResponseEntity.ok(agendamentoService.update(id, dto))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        agendamentoService.delete(id)
        return ResponseEntity.noContent().build()
    }
}