import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * SearchResultsComponent maneja la lógica y visualización de los resultados de búsqueda de productos.
 * Se suscribe a los parámetros de la ruta para obtener el término de búsqueda y solicita los datos correspondientes.
 */
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SearchResultsComponent implements OnInit {
  // El término de búsqueda ingresado por el usuario
  query: string = '';
  // Lista de productos que coinciden con la búsqueda
  results: Product[] = [];

  /**
   * Constructor que inyecta las dependencias necesarias para la manipulación de rutas y servicios de productos.
   * @param route Servicio que permite acceder a los parámetros de la ruta actual.
   * @param productService Servicio que proporciona acceso a las operaciones del API de productos.
   */
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  /**
   * Se inicializa el componente y se suscribe a los cambios de los parámetros de consulta de la ruta para realizar la búsqueda.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.searchProducts();
    });
  }

  /**
   * Realiza la búsqueda de productos utilizando el término de búsqueda actual.
   * Actualiza la lista de resultados con los productos encontrados.
   */
  searchProducts(): void {
    if (this.query) {
      this.productService.searchProducts(this.query).subscribe(products => {
        this.results = products;
      });
    }
  }
}
