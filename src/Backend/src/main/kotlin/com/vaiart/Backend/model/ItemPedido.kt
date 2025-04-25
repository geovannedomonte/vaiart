package com.vaiart.Backend.model
import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "item_pedido")
data class ItemPedido(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    var pedido: Pedido,

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    var produto: Produto,

    @Column(nullable = false)
    var quantidade: Int,

    @Column(name = "preco_unitario", nullable = false, precision = 10, scale = 2)
    val precoUnitario: BigDecimal,

    @Column(nullable = false, precision = 10, scale = 2)
    val subTotal: BigDecimal
)
