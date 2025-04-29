package com.vaiart.Backend.service

import com.vaiart.Backend.dto.LoginRequestDTO
import com.vaiart.Backend.dto.TokenDTO
import com.vaiart.Backend.dto.UsuarioDTO
import com.vaiart.Backend.dto.UsuarioRequestDTO
import com.vaiart.Backend.model.Usuario
import com.vaiart.Backend.repository.UsuarioRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import com.vaiart.Backend.service.TokenService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val tokenService: TokenService
) {

    @Transactional(readOnly = true)
    fun findAll(): List<UsuarioDTO> {
        return usuarioRepository.findAll().map { UsuarioDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun findById(id: Long): UsuarioDTO {
        val usuario = usuarioRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Usuário não encontrado com ID: $id") }
        return UsuarioDTO.fromEntity(usuario)
    }

    @Transactional
    fun save(dto: UsuarioRequestDTO): UsuarioDTO {
        if (usuarioRepository.existsByEmail(dto.email)) {
            throw IllegalArgumentException("Email já cadastrado")
        }

        val encodedPassword = passwordEncoder.encode(dto.password)
        val usuario = Usuario(
            email = dto.email,
            password = encodedPassword
        )

        val savedUsuario = usuarioRepository.save(usuario)
        return UsuarioDTO.fromEntity(savedUsuario)
    }

    @Transactional
    fun login(dto: LoginRequestDTO): TokenDTO {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(dto.email, dto.password)
        )

        SecurityContextHolder.getContext().authentication = authentication
        val token = tokenService.generateToken(authentication)

        return TokenDTO(token)
    }

    @Transactional
    fun delete(id: Long) {
        if (!usuarioRepository.existsById(id)) {
            throw EntityNotFoundException("Usuário não encontrado com ID: $id")
        }
        usuarioRepository.deleteById(id)
    }
}