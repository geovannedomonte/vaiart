package com.vaiart.Backend.model

import jakarta.persistence.*

@Entity
@Table(name = "usuario")
data class Usuario(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    val password: String
)
