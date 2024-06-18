// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUrl = 'app/data/productos.json';  // Ruta correcta al archivo JSON

  constructor(private http: HttpClient) { }

  getProducts(): Observable<{ productos: Product[] }> {
    return this.http.get<{ productos: Product[] }>(this.dataUrl);
  }
}
