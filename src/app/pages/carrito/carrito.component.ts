import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/**
 * Interfaz que define la estructura de un item en el carrito de compras.
 */
interface CarritoItem {
  product: Product; // Producto en el carrito
  quantity: number; // Cantidad del producto en el carrito
}

/**
 * Componente que gestiona el carrito de compras.
 */
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true, // Indica que este componente no tiene dependencias específicas
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe] // Módulos importados necesarios para el componente
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = []; // Array que contiene los items del carrito
  total: number = 0; // Total de la compra
  paymentMethod: string = ''; // Método de pago seleccionado
  paymentMessage: string = ''; // Mensaje de estado del pago
  isCartEmpty: boolean = true; // Indica si el carrito está vacío

  constructor(private carritoService: CarritoService, private router: Router) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Carga los items del carrito y verifica si está vacío.
   */
  ngOnInit(): void {
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  /**
   * Calcula el total de la compra sumando el precio de cada item multiplicado por su cantidad.
   */
  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  /**
   * Remueve un item del carrito según su índice.
   * @param index Índice del item a remover.
   */
  removeItem(index: number): void {
    this.carritoService.removeFromCarrito(this.carritoItems[index].product);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param index Índice del item en el carrito.
   * @param quantity Nueva cantidad del producto.
   */
  updateQuantity(index: number, quantity: number): void {
    this.carritoService.updateQuantity(this.carritoItems[index].product, quantity);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

  /**
   * Verifica si el carrito está vacío.
   */
  checkIfCartIsEmpty(): void {
    this.isCartEmpty = this.carritoItems.length === 0;
  }

  /**
   * Procesa el pago de los productos en el carrito.
   * Valida el método de pago seleccionado y realiza la acción correspondiente.
   */
  procederAlPago(): void {
    if (!this.paymentMethod) {
      this.paymentMessage = 'Seleccione un método de pago';
      return;
    }

    this.paymentMessage = `Accediendo a Plataforma ${this.paymentMethod}...`;

    setTimeout(() => {
      this.paymentMessage = 'Pago Exitoso, estás siendo redireccionado al checkout...';
      this.carritoService.savePurchasedItems();

      setTimeout(() => {
        this.limpiarCarrito();
        this.router.navigate(['/checkout']);
      }, 4000);  // Esperar 4 segundos antes de redireccionar
    }, 3000);  // Esperar 3 segundos antes de mostrar el mensaje de pago exitoso
  }

  /**
   * Limpia el carrito de compras.
   * Remueve todos los items del carrito y actualiza el total.
   */
  limpiarCarrito(): void {
    this.carritoService.clearCarrito();
    this.carritoItems = [];
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }
}
