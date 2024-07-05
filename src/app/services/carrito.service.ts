import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

interface CarritoItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems: CarritoItem[] = [];
  private carritoSubject = new BehaviorSubject<CarritoItem[]>(this.carritoItems);
  carritoActualizado = this.carritoSubject.asObservable();
  private purchasedItems: CarritoItem[] = [];

  constructor() {
    this.loadCarrito();
  }

  private saveCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
      this.carritoSubject.next(this.carritoItems);
    }
  }

  private loadCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      const carritoSaved = localStorage.getItem('carrito');
      if (carritoSaved) {
        this.carritoItems = JSON.parse(carritoSaved);
        this.carritoSubject.next(this.carritoItems);
      }
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  getCarritoItems(): CarritoItem[] {
    return this.carritoItems;
  }

  getItemCount(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCarrito(product: Product, quantity: number): void {
    const existingProduct = this.carritoItems.find(item => item.product.sku === product.sku);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.carritoItems.push({ product, quantity });
    }
    this.saveCarrito();
  }

  removeFromCarrito(product: Product): void {
    this.carritoItems = this.carritoItems.filter(item => item.product.sku !== product.sku);
    this.saveCarrito();
  }

  updateQuantity(product: Product, quantity: number): void {
    const existingItem = this.carritoItems.find(item => item.product.sku === product.sku);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    this.saveCarrito();
  }

  clearCarrito(): void {
    this.carritoItems = [];
    this.saveCarrito();
  }

  savePurchasedItems(): void {
    this.purchasedItems = [...this.carritoItems];
  }

  getPurchasedItems(): CarritoItem[] {
    return this.purchasedItems;
  }
}
