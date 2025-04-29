package com.vaiart.Backend.service

import com.vaiart.Backend.dto.AgendamentoDTO
import com.vaiart.Backend.dto.AgendamentoRequestDTO
import com.vaiart.Backend.repository.AgendamentoRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class AgendamentoService(private val agendamentoRepository: AgendamentoRepository) {

    @Transactional(readOnly = true)
    fun findAll(): List<AgendamentoDTO> {
        return agendamentoRepository.findAll().map { AgendamentoDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): AgendamentoDTO {
        val agendamento = agendamentoRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Agendamento não encontrado com ID: $id") }
        return AgendamentoDTO.fromEntity(agendamento)
    }

    @Transactional(readOnly = true)
    fun findByPeriodo(inicio: LocalDateTime, fim: LocalDateTime): List<AgendamentoDTO> {
        return agendamentoRepository.findByDataHoraBetween(inicio, fim)
            .map { AgendamentoDTO.fromEntity(it) }
    }

    @Transactional
    fun save(dto: AgendamentoRequestDTO): AgendamentoDTO {
        // Verificar se já existe agendamento no mesmo horário
        val horaInicio = dto.dataHora
        val horaFim = horaInicio.plusHours(1) // Assumindo que cada agendamento dura 1 hora

        val agendamentosExistentes = agendamentoRepository.findByDataHoraBetween(
            horaInicio.minusMinutes(59), horaFim
        )

        if (agendamentosExistentes.isNotEmpty()) {
            throw IllegalArgumentException("Já existe um agendamento neste horário")
        }

        val agendamento = dto.toEntity()
        val savedAgendamento = agendamentoRepository.save(agendamento)
        return AgendamentoDTO.fromEntity(savedAgendamento)
    }

    @Transactional
    fun update(id: Long, dto: AgendamentoRequestDTO): AgendamentoDTO {
        if (!agendamentoRepository.existsById(id)) {
            throw EntityNotFoundException("Agendamento não encontrado com ID: $id")
        }

        val agendamento = dto.toEntity().copy(id = id)
        val updatedAgendamento = agendamentoRepository.save(agendamento)
        return AgendamentoDTO.fromEntity(updatedAgendamento)
    }

    @Transactional
    fun delete(id: Long) {
        if (!agendamentoRepository.existsById(id)) {
            throw EntityNotFoundException("Agendamento não encontrado com ID: $id")
        }
        agendamentoRepository.deleteById(id)
    }
}