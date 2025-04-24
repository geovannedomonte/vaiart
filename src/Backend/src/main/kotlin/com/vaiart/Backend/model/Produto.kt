package com.vaiart.Backend.model

import jakarta.persistence.*
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "produto")
data class Produto (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var nome: String,

    @Column(columnDefinition = "TEXT")
    var descricao: String? = null,

    @Column(nullable = false, precision = 10, scale = 2)
    var preco: BigDecimal,

    @Column(name = "url_imagem")
    var urlImagem: String? = null,

    @Column(name = "data_criacao")
    val dataCriacao: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var disponivel: Boolean = true,




)
