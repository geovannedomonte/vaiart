package com.vaiart.Backend.dto

data class TokenDTO(
    val token: String,
    val tipo: String = "Bearer"
)
