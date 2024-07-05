import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface CarritoItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe]
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  total: number = 0;
  paymentMethod: string = '';
  paymentMessage: string = '';
  isCartEmpty: boolean = true;

  constructor(private carritoService: CarritoService, private router: Router) { }

  ngOnInit(): void {
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  removeItem(index: number): void {
    this.carritoService.removeFromCarrito(this.carritoItems[index].product);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }

  updateQuantity(index: number, quantity: number): void {
    this.carritoService.updateQuantity(this.carritoItems[index].product, quantity);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

  checkIfCartIsEmpty(): void {
    this.isCartEmpty = this.carritoItems.length === 0;
  }

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
      }, 4000);  // Esperar 3 segundos antes de redireccionar
    }, 3000);
  }

  limpiarCarrito(): void {
    this.carritoService.clearCarrito();
    this.carritoItems = [];
    this.calculateTotal();
    this.checkIfCartIsEmpty();
  }
}
