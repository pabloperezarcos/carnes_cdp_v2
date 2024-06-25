import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Representa un ítem en el carrito de compras.
 */
interface CarritoItem {
  /** El producto del ítem del carrito. */
  product: Product;

  /** La cantidad del producto en el carrito. */
  quantity: number;
}

/**
 * CarritoComponent maneja la visualización y lógica del carrito de compras.
 * Permite agregar, actualizar y eliminar productos, así como proceder al pago.
 */
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe]
})
export class CarritoComponent implements OnInit {
  /** Lista de ítems en el carrito */
  carritoItems: CarritoItem[] = [];

  /** Total del carrito */
  total: number = 0;

  /** Método de pago seleccionado */
  paymentMethod: string = '';

  /** Mensaje de estado del pago */
  paymentMessage: string = '';

  /** Indica si el carrito está vacío */
  isCartEmpty: boolean = true;

  /**
   * Constructor que inyecta el servicio de carrito para gestionar los ítems del carrito.
   * @param carritoService Servicio que proporciona operaciones relacionadas con el carrito de compras.
   */
  constructor(private carritoService: CarritoService) { }

  /**
   * Inicializa el componente cargando los ítems del carrito y calculando el total.
   */
  ngOnInit(): void {
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  /**
   * Calcula el total del carrito sumando los precios de los productos por sus cantidades.
   */
  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  /**
   * Elimina un ítem del carrito basado en su índice y actualiza el total y el estado del carrito.
   * @param index Índice del ítem a eliminar.
   */
  removeItem(index: number): void {
    this.carritoService.removeFromCarrito(this.carritoItems[index].product);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  /**
   * Actualiza la cantidad de un ítem en el carrito y recalcula el total.
   * @param index Índice del ítem a actualizar.
   * @param quantity Nueva cantidad del ítem.
   */
  updateQuantity(index: number, quantity: number): void {
    this.carritoService.updateQuantity(this.carritoItems[index].product, quantity);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

  /**
   * Verifica si el carrito está vacío y actualiza el estado correspondiente.
   */
  checkIfCartIsEmpty(): void {
    this.isCartEmpty = this.carritoItems.length === 0;
  }

  /**
   * Procede al pago, mostrando mensajes según el estado del proceso de pago.
   */
  procederAlPago(): void {
    if (!this.paymentMethod) {
      this.paymentMessage = 'Seleccione un método de pago';
      return;
    }

    this.paymentMessage = `Accediendo a Plataforma ${this.paymentMethod}...`;

    setTimeout(() => {
      this.paymentMessage = 'Pago Exitoso';
    }, 3000);
  }
}
