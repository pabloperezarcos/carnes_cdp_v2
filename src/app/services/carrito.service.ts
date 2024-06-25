import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

// Definición de la interfaz para los ítems del carrito
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
 * CarritoService gestiona la lógica del carrito de compras, incluyendo la adición, eliminación y actualización de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  /** Lista de ítems en el carrito. */
  private carritoItems: CarritoItem[] = [];

  /** Sujeto para el estado del carrito. */
  private carritoSubject = new BehaviorSubject<CarritoItem[]>(this.carritoItems);

  /** Observable para los cambios en el carrito. */
  carritoActualizado = this.carritoSubject.asObservable();

  /**
   * Constructor que carga el carrito desde el almacenamiento local.
   */
  constructor() {
    this.loadCarrito();
  }

  /**
   * Guarda el carrito en el almacenamiento local.
   */
  private saveCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
      this.carritoSubject.next(this.carritoItems);
    }
  }

  /**
   * Carga el carrito desde el almacenamiento local.
   */
  private loadCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      const carritoSaved = localStorage.getItem('carrito');
      if (carritoSaved) {
        this.carritoItems = JSON.parse(carritoSaved);
        this.carritoSubject.next(this.carritoItems);
      }
    }
  }

  /**
   * Verifica si el almacenamiento local está disponible.
   * @returns `true` si el almacenamiento local está disponible, `false` en caso contrario.
   */
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

  /**
   * Obtiene los ítems en el carrito.
   * @returns Lista de ítems en el carrito.
   */
  getCarritoItems(): CarritoItem[] {
    return this.carritoItems;
  }

  /**
   * Obtiene la cantidad total de ítems en el carrito.
   * @returns Cantidad total de ítems en el carrito.
   */
  getItemCount(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Añade un producto al carrito o actualiza su cantidad si ya existe en el carrito.
   * @param product Producto a añadir.
   * @param quantity Cantidad del producto a añadir.
   */
  addToCarrito(product: Product, quantity: number): void {
    const existingProduct = this.carritoItems.find(item => item.product.sku === product.sku);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.carritoItems.push({ product, quantity });
    }
    this.saveCarrito();
  }

  /**
   * Elimina un producto del carrito.
   * @param product Producto a eliminar.
   */
  removeFromCarrito(product: Product): void {
    this.carritoItems = this.carritoItems.filter(item => item.product.sku !== product.sku);
    this.saveCarrito();
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param product Producto cuya cantidad se va a actualizar.
   * @param quantity Nueva cantidad del producto.
   */
  updateQuantity(product: Product, quantity: number): void {
    const existingItem = this.carritoItems.find(item => item.product.sku === product.sku);
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    this.saveCarrito();
  }

  /**
   * Vacía el carrito de compras.
   */
  clearCarrito(): void {
    this.carritoItems = [];
    this.saveCarrito();
  }
}
