package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Agendamento
import java.time.LocalDateTime

data class AgendamentoRequestDTO(
    val nomeCliente: String,
    val telefoneCliente: String,
    val dataHora: LocalDateTime,
    val endereco: String,
    val observacoes: String? = null
) {
    fun toEntity(): Agendamento {
        return Agendamento(
            nomeCliente = nomeCliente,
            telefoneCliente = telefoneCliente,
            dataHora = dataHora,
            endereco = endereco,
            observacoes = observacoes
        )
    }
}
