package com.vaiart.Backend.model

import  jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "agendamento")
data class Agendamento(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "nome_cliente", nullable = false)
    val nomeCliente: String,

    @Column(name = "telefone_cliente", nullable = false)
    val telefoneCliente: String,

    @Column(name = "data_hora", nullable = false)
    val dataHora: LocalDateTime,

    @Column(nullable = false)
    val endereco: String,

    @Column
    val observacoes: String? = null
)
