package com.vaiart.Backend.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Service
import java.util.*

@Service
class TokenService {

    @Value("\${jwt.secret:chaveSecretaPadrao}")
    private lateinit var jwtSecret: String

    @Value("\${jwt.expiration:86400000}")
    private var jwtExpirationMs: Long = 0 // Padrão é 24 horas

    fun generateToken(authentication: Authentication): String {
        val userPrincipal = authentication.principal as User
        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationMs)

        val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

        return Jwts.builder()
            .setSubject(userPrincipal.username)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
    }

    fun getUsernameFromToken(token: String): String {
        val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

        val claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

        return claims.subject
    }

    fun validateToken(token: String): Boolean {
        try {
            val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray())
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)
            return true
        } catch (e: Exception) {
            return false
        }
    }
}