// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'app/data/productos.json';  // Ruta correcta al archivo JSON

  constructor(private http: HttpClient) { }

/*   getProducts(): Observable<{ productos: Product[] }> {
    return this.http.get<{ productos: Product[] }>(this.dataUrl);
  } */

  getProducts(): Observable<Product[]> {
    return this.http.get<{ productos: Product[] }>(this.dataUrl).pipe(
      map(response => response.productos) // Asegúrate de que 'productos' es el array en el JSON
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product =>
        product.nombre.toLowerCase().includes(query.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
}
