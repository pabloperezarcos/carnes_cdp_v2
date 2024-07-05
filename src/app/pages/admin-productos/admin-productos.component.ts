import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

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

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProductosFromJson(); // Cambia para cargar productos desde el JSON en lugar de Firestore
  }

  loadProductos(): void {
    this.productService.getProducts().subscribe(data => {
      this.productos = data;
      this.filteredProductos = data;
    });
  }

  loadProductosFromJson(): void {
    this.productService.getProductsFromJson().subscribe(data => {
      this.productos = data;
      this.filteredProductos = data;
      console.log('Productos obtenidos:', this.productos); // Verificación en consola
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
      this.productService.addProduct(this.selectedProduct!).subscribe(() => {
        this.loadProductos();
      });
    } else {
      const productId = this.selectedProduct?.id!;
      this.productService.updateProduct(productId, this.selectedProduct!).subscribe(() => {
        this.loadProductos();
      });
    }
    this.cancelEdit();
  }

  deleteProduct(product: Product): void {
    const productId = product.id!;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProductos();
    });
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  addProduct(): void {
    this.selectedProduct = new Product();
    this.isAdding = true;
    this.isEditing = true;
  }
}
