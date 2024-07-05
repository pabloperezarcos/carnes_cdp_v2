import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'https://firebasestorage.googleapis.com/v0/b/carnescdpv2.appspot.com/o/productos.json?alt=media&token=6808db40-2409-4d80-bd8a-a4dc0dfba038';
  private storagePath = 'productos.json';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

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

  addProduct(newProduct: Product): Observable<void> {
    return this.getProducts().pipe(
      switchMap(products => {
        newProduct.id = products.length + 1;
        products.push(newProduct);
        return this.updateProducts(products);
      })
    );
  }

  updateProduct(updatedProduct: Product): Observable<void> {
    return this.getProducts().pipe(
      switchMap(products => {
        const index = products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          products[index] = updatedProduct;
        }
        return this.updateProducts(products);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.getProducts().pipe(
      switchMap(products => {
        const updatedProducts = products.filter(p => p.id !== id);
        return this.updateProducts(updatedProducts);
      })
    );
  }

  private updateProducts(products: Product[]): Observable<void> {
    const productsJson = JSON.stringify({ productos: products });

    // Upload the updated JSON to Firebase Storage
    return from(this.http.put(this.dataUrl, productsJson, { headers: this.headers })).pipe(
      switchMap(() => this.http.get<void>(this.dataUrl))
    );
  }
}
