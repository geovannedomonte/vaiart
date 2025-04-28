package com.vaiart.Backend.dto

import com.vaiart.Backend.model.Usuario

data class UsuarioDTO(
    val id: Long = 0,
    val email: String
) {
    companion object {
        fun fromEntity(usuario: Usuario): UsuarioDTO {
            return UsuarioDTO(
                id = usuario.id,
                email = usuario.email
            )
        }
    }
}
