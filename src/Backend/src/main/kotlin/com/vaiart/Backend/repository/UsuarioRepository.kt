package com.vaiart.Backend.repository

import com.vaiart.Backend.model.Usuario
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UsuarioRepository: JpaRepository<Usuario, Long> {
    fun findByEmail(email: String): Optional<Usuario>
    fun existsByEmail(email: String): Boolean
}