package com.vaiart.Backend.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

data class Pedido(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "nome_cliente", nullable = false)
    var nomeCliente: String,

    @Column(name = "email_cliente", nullable = false)
    var emailCliente: String,

    @Column(name = "data_pedido")
    var dataPedido: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false, precision = 10, scale = 2)
    var total: BigDecimal,

    @Column(name = "id_transacao")
    var idTransacao: String? = null,


)
