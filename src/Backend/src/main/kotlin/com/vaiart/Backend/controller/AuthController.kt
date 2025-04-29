package com.vaiart.Backend.controller

import com.vaiart.Backend.dto.LoginRequestDTO
import com.vaiart.Backend.dto.TokenDTO
import com.vaiart.Backend.dto.UsuarioDTO
import com.vaiart.Backend.dto.UsuarioRequestDTO
import com.vaiart.Backend.service.UsuarioService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = ["*"])
class AuthController(private val usuarioService: UsuarioService) {

    @PostMapping("/register")
    fun register(@RequestBody dto: UsuarioRequestDTO): ResponseEntity<UsuarioDTO> {
        val usuario = usuarioService.save(dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario)
    }

    @PostMapping("/login")
    fun login(@RequestBody dto: LoginRequestDTO): ResponseEntity<TokenDTO> {
        val token = usuarioService.login(dto)
        return ResponseEntity.ok(token)
    }
}