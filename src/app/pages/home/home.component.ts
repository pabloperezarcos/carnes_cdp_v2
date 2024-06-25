import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Definición de la interfaz para los testimonios
interface Testimonio {
  nombre: string;
  comentario: string;
  estrellas: number;
  imagen: string;
}

/**
 * HomeComponent maneja la visualización de la página principal, incluyendo una lista de productos destacados y testimonios.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  productos: Product[] = []; // Lista de productos
  loading = true; // Indicador de carga
  testimonios: Testimonio[] = []; // Lista de testimonios

  /**
   * Constructor que inyecta el servicio de productos y el cliente HTTP.
   * @param productService Servicio que proporciona operaciones relacionadas con los productos.
   * @param http Cliente HTTP para solicitudes a servicios externos.
   */
  constructor(private productService: ProductService, private http: HttpClient) { }

  /**
   * Inicializa el componente cargando la lista de productos y testimonios.
   */
  ngOnInit() {
    this.http.get<{ testimonios: Testimonio[] }>('app/data/testimonios.json').subscribe(data => {
      this.testimonios = data.testimonios;
    });
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa')
    });
  }

  /**
   * Genera un arreglo de números basado en la cantidad de estrellas, para mostrar las estrellas llenas.
   * @param estrellas Número de estrellas.
   * @returns Un arreglo de números con la longitud de las estrellas.
   */
  getEstrellas(estrellas: number): number[] {
    return new Array(estrellas);
  }

  /**
   * Genera un arreglo de números basado en la cantidad de estrellas vacías, para mostrar las estrellas vacías.
   * @param estrellas Número de estrellas llenas.
   * @returns Un arreglo de números con la longitud de las estrellas vacías.
   */
  getEmptyEstrellas(estrellas: number): number[] {
    return new Array(5 - estrellas);
  }
}
