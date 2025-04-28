package com.vaiart.Backend.repository

import com.vaiart.Backend.model.Agendamento
import jakarta.websocket.ClientEndpoint
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface AgendamentoRepository: JpaRepository<Agendamento, Long{
    fun findByDataHoraBetween(inicio: LocalDateTime, fim: LocalDateTime):List<Agendamento>
    fun findByNomeClienteContainingIgnoreCase(nomeCliente: String): List<Agendamento>
}