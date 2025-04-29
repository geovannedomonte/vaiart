package com.vaiart.Backend.controller

import com.vaiart.Backend.dto.ProdutoDTO
import com.vaiart.Backend.dto.ProdutoRequestDTO
import com.vaiart.Backend.service.ProdutoService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = ["*"])
class ProdutoController(private val produtoService: ProdutoService) {

    @GetMapping
    fun findAll(@PageableDefault(size = 12, sort = ["nome"]) pageable: Pageable): ResponseEntity<Page<ProdutoDTO>> {
        return ResponseEntity.ok(produtoService.findAll(pageable))
    }

    @GetMapping("/disponiveis")
    fun findAvailable(@PageableDefault(size = 12, sort = ["nome"]) pageable: Pageable): ResponseEntity<Page<ProdutoDTO>> {
        return ResponseEntity.ok(produtoService.findAvailable(pageable))
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<ProdutoDTO> {
        return ResponseEntity.ok(produtoService.findById(id))
    }

    @GetMapping("/buscar")
    fun findByNome(
        @RequestParam nome: String,
        @PageableDefault(size = 12, sort = ["nome"]) pageable: Pageable
    ): ResponseEntity<Page<ProdutoDTO>> {
        return ResponseEntity.ok(produtoService.findByNome(nome, pageable))
    }

    @PostMapping
    fun save(@RequestBody dto: ProdutoRequestDTO): ResponseEntity<ProdutoDTO> {
        val savedProduto = produtoService.save(dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduto)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody dto: ProdutoRequestDTO): ResponseEntity<ProdutoDTO> {
        return ResponseEntity.ok(produtoService.update(id, dto))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        produtoService.delete(id)
        return ResponseEntity.noContent().build()
    }
}