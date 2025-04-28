package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Agendamento
import java.time.LocalDateTime

data class AgendamentoDTO(
    val id: Long = 0,
    val nomeCliente: String,
    val telefoneCliente: String,
    val dataHora: LocalDateTime,
    val endereco: String,
    val observacoes: String? = null
) {
    companion object {
        fun fromEntity(agendamento: Agendamento): AgendamentoDTO {
            return AgendamentoDTO(
                id = agendamento.id,
                nomeCliente = agendamento.nomeCliente,
                telefoneCliente = agendamento.telefoneCliente,
                dataHora = agendamento.dataHora,
                endereco = agendamento.endereco,
                observacoes = agendamento.observacoes
            )
        }
    }
}
