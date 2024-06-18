import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

interface CarritoItem {
  producto: Product;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})

export class CarritoService {
  private carritoItems: CarritoItem[] = [];

  constructor() {
    this.cargarCarrito();
  }

  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
  }

  private cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.carritoItems = JSON.parse(carritoGuardado);
    }
  }

  obtenerItemsCarrito(): CarritoItem[] {
    return this.carritoItems;
  }

  agregarCarrito(producto: Product, cantidad: number): void {
    const productoExistente = this.carritoItems.find(item => item.producto.sku === producto.sku);
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      this.carritoItems.push({ producto, cantidad });
    }
    this.guardarCarrito();
  }

  eliminarDelCarrito(producto: Product): void {
    this.carritoItems = this.carritoItems.filter(item => item.producto.sku !== producto.sku);
    this.guardarCarrito();
  }

  actualizarCantidad(producto: Product, cantidad: number): void {
    const itemExistente = this.carritoItems.find(item => item.producto.sku === producto.sku);
    if (itemExistente) {
      itemExistente.cantidad = cantidad;
    }
    this.guardarCarrito();
  }

  limpiarCarrito(): void {
    this.carritoItems = [];
    this.guardarCarrito();
  }
}
