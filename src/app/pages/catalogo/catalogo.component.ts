import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

/**
 * CatalogoComponent maneja la visualización del catálogo de productos.
 * Muestra una lista de productos obtenidos del servicio de productos.
 */
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent implements OnInit {
  /** Lista de productos */
  productos: Product[] = [];

  /** Indicador de carga */
  loading = true;

  /**
   * Constructor que inyecta el servicio de productos para obtener los datos de los productos.
   * @param productService Servicio que proporciona operaciones relacionadas con los productos.
   */
  constructor(private productService: ProductService) { }

  /**
   * Inicializa el componente cargando la lista de productos.
   */
  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa')
    });
  }
}
