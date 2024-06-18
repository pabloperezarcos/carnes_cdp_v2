// carrito.component.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface CarritoItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  total: number = 0;
  paymentMethod: string = '';
  paymentMessage: string = '';

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  removeItem(index: number): void {
    this.carritoService.removeFromCarrito(this.carritoItems[index].product);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

  updateQuantity(index: number, quantity: number): void {
    this.carritoService.updateQuantity(this.carritoItems[index].product, quantity);
    this.carritoItems = this.carritoService.getCarritoItems();
    this.calculateTotal();
  }

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
