import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'https://firebasestorage.googleapis.com/v0/b/carnescdpv2.appspot.com/o/productos.json?alt=media&token=6808db40-2409-4d80-bd8a-a4dc0dfba038';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ productos: Product[] }>(this.dataUrl).pipe(
      map(response => response.productos)
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
