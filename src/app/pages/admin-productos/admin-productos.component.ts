import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Representa un producto en el sistema.
 */
interface Product {
  /** Identificador único del producto. */
  id: number;

  /** Nombre del producto. */
  nombre: string;

  /** Descripción corta del producto. */
  descripcionCorta: string;

  /** Descripción completa del producto. */
  descripcion: string;

  /** Precio del producto. */
  precio: number;

  /** URL de la imagen del producto. */
  imagen: string;

  /** Slug del producto para URLs amigables. */
  slug: string;

  /** Código SKU del producto. */
  sku: string;

  /** Estado del producto (e.g., disponible, agotado). */
  estado: string;
}

/**
 * AdminProductosComponent gestiona la administración de productos, permitiendo agregar, editar y eliminar productos.
 * Incluye funcionalidades de filtrado y selección de productos.
 */
@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.scss']
})
export class AdminProductosComponent implements OnInit {
  /** Lista de todos los productos */
  productos: Product[] = [];

  /** Lista de productos filtrados */
  filteredProductos: Product[] = [];

  /** Producto seleccionado para editar */
  selectedProduct: Product | null = null;

  /** Indica si se está en modo edición */
  isEditing: boolean = false;

  /** Indica si se está añadiendo un nuevo producto */
  isAdding: boolean = false;

  /** Consulta de búsqueda para filtrar productos */
  searchQuery: string = '';

  /**
   * Constructor que inyecta HttpClient para realizar solicitudes HTTP.
   * @param http Cliente HTTP para solicitudes a servicios externos.
   */
  constructor(private http: HttpClient) { }

  /**
   * Inicializa el componente cargando la lista de productos.
   */
  ngOnInit(): void {
    this.loadProductos();
  }

  /**
   * Carga los productos desde un archivo JSON externo y actualiza las listas de productos y productos filtrados.
   */
  loadProductos(): void {
    this.http.get<{ productos: Product[] }>('app/data/productos.json').subscribe(data => {
      this.productos = data.productos;
      this.filteredProductos = data.productos;
    });
  }

  /**
   * Filtra los productos basándose en el nombre o la descripción corta según la consulta de búsqueda.
   */
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

  /**
   * Selecciona un producto para editar y ajusta los modos de edición y agregación.
   * @param product Producto a editar.
   */
  selectProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
    this.isAdding = false;
  }

  /**
   * Guarda los cambios realizados a un producto existente o añade un nuevo producto a la lista.
   */
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

  /**
   * Elimina un producto de la lista.
   * @param product Producto a eliminar.
   */
  deleteProduct(product: Product): void {
    this.productos = this.productos.filter(p => p.id !== product.id);
    this.filteredProductos = this.productos;
  }

  /**
   * Cancela el modo de edición o agregación y limpia el producto seleccionado.
   */
  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.isAdding = false;
  }

  /**
   * Prepara un nuevo producto para ser añadido a la lista y activa los modos de edición y agregación.
   */
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
