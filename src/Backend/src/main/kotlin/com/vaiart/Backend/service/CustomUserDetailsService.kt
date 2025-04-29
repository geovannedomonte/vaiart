package com.vaiart.Backend.service

import com.vaiart.Backend.repository.UsuarioRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(private val usuarioRepository: UsuarioRepository) : UserDetailsService {

    override fun loadUserByUsername(email: String): UserDetails {
        val usuario = usuarioRepository.findByEmail(email)
            .orElseThrow { UsernameNotFoundException("Usuário não encontrado com o email: $email") }

        // Criando lista de privilégios - no nosso caso simplificado, apenas ROLE_USER
        val authorities = listOf(SimpleGrantedAuthority("ROLE_USER"))

        return User(
            usuario.email,
            usuario.password,
            authorities
        )
    }
}