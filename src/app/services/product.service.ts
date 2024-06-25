import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

/**
 * ProductService gestiona las operaciones relacionadas con los productos, incluyendo la obtención y búsqueda de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'app/data/productos.json'; 

  /**
   * Constructor que inyecta el cliente HTTP para realizar solicitudes.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de productos desde el archivo JSON.
   * @returns Observable que emite una lista de productos.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<{ productos: Product[] }>(this.dataUrl).pipe(
      map(response => response.productos)
    );
  }

  /**
   * Busca productos que coincidan con una consulta dada en el nombre o descripción del producto.
   * @param query La consulta de búsqueda.
   * @returns Observable que emite una lista de productos que coinciden con la consulta.
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product =>
        product.nombre.toLowerCase().includes(query.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
}
