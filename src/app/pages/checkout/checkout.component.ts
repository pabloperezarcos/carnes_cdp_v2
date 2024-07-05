import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

/**
 * Interfaz que define la estructura de un item en el carrito para el checkout.
 */
interface CarritoItem {
  product: Product; // Producto en el carrito
  quantity: number; // Cantidad del producto en el carrito
}

/**
 * Componente para gestionar el proceso de checkout de compras.
 */
@Component({
  selector: 'app-checkout',
  standalone: true, // Indica que este componente es independiente (no tiene dependencias)
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule] // Módulos importados necesarios para el componente
})
export class CheckoutComponent implements OnInit {
  carritoItems: CarritoItem[] = []; // Array que contiene los items del carrito
  orderNumber: string = ''; // Número de orden generado
  total: number = 0; // Total de la compra

  constructor(private router: Router, private carritoService: CarritoService) {
    this.orderNumber = this.generateOrderNumber(); // Genera un número de orden al inicializar el componente
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga los items comprados del carrito y calcula el total de la compra.
   */
  ngOnInit(): void {
    this.carritoItems = this.carritoService.getPurchasedItems();
    this.calculateTotal();
  }

  /**
   * Genera un número de orden aleatorio.
   * @returns El número de orden generado.
   */
  generateOrderNumber(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  /**
   * Calcula el total de la compra sumando el precio de cada item en el carrito multiplicado por su cantidad.
   */
  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  /**
   * Navega de regreso a la página de inicio.
   */
  goHome() {
    this.router.navigate(['/']);
  }
}
