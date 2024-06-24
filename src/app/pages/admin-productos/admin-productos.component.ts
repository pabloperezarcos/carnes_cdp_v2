// admin-productos.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  nombre: string;
  descripcionCorta: string;
  descripcion: string;
  precio: number;
  imagen: string;
  slug: string;
  sku: string;
  estado: string;
}

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  productos: Product[] = [];
  filteredProductos: Product[] = [];
  selectedProduct: Product | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchQuery: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.http.get<{ productos: Product[] }>('app/data/productos.json').subscribe(data => {
      this.productos = data.productos;
      this.filteredProductos = data.productos;
    });
  }

  filterProductos(): void {
    if (this.searchQuery) {
      this.filteredProductos = this.productos.filter(product =>
        product.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.descripcionCorta.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProductos = this.productos;
    }
  }

  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
    this.isAdding = false;
  }

  saveProduct(): void {
    if (this.isAdding) {
      this.productos.push(this.selectedProduct!);
    } else {
      const index = this.productos.findIndex(p => p.id === this.selectedProduct!.id);
      if (index !== -1) {
        this.productos[index] = this.selectedProduct!;
      }
    }
    this.filteredProductos = this.productos;
    this.cancelEdit();
  }

  deleteProduct(product: Product): void {
    this.productos = this.productos.filter(p => p.id !== product.id);
    this.filteredProductos = this.productos;
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  addProduct(): void {
    this.selectedProduct = {
      id: this.productos.length + 1,
      nombre: '',
      descripcionCorta: '',
      descripcion: '',
      precio: 0,
      imagen: '',
      slug: '',
      sku: '',
      estado: 'disponible'
    };
    this.isAdding = true;
    this.isEditing = true;
  }
}
