import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';

interface CarritoItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CheckoutComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  orderNumber: string = '';
  total: number = 0;

  constructor(private router: Router, private carritoService: CarritoService) {
    this.orderNumber = this.generateOrderNumber();
  }

  ngOnInit(): void {
    this.carritoItems = this.carritoService.getPurchasedItems();
    this.calculateTotal();
  }

  generateOrderNumber(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  calculateTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + (item.product?.precio ?? 0) * (item.quantity ?? 0), 0);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
