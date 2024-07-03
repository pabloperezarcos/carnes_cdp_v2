// src/app/services/product.service.ts
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
  /** URL para obtener los datos de productos desde Firebase Storage */
  private dataUrl = 'https://firebasestorage.googleapis.com/v0/b/carnescdp.appspot.com/o/productos.json?alt=media&token=35c23782-1f1c-48b2-a7df-3357c2baa54e';

  /**
   * Constructor que inyecta el cliente HTTP para realizar solicitudes.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de productos desde el archivo JSON en Firebase Storage.
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
