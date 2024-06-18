import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CarritoItem {
  producto: Product;
  cantidad: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CarritoComponent implements OnInit {
  carritoItems: CarritoItem[] = [];
  total: number = 0;

  constructor(private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.carritoItems = this.carritoService.obtenerItemsCarrito();
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carritoItems.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }

  eliminarItem(index: number): void {
    this.carritoService.eliminarDelCarrito(this.carritoItems[index].producto);
    this.carritoItems = this.carritoService.obtenerItemsCarrito();
    this.calcularTotal();
  }

  actualizarCantidad(index: number, cantidad: number): void {
    this.carritoService.actualizarCantidad(this.carritoItems[index].producto, cantidad);
    this.carritoItems = this.carritoService.obtenerItemsCarrito();
    this.calcularTotal();
  }
}
