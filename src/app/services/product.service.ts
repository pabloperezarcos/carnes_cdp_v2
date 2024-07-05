import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/carnescdpv2.appspot.com/o/productos.json?alt=media&token=7e185c71-ea77-4bcf-b557-48ba39e08ab6';

  constructor(private firestore: Firestore, private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'productos');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  addProduct(product: Product): Observable<void> {
    const productsRef = collection(this.firestore, 'productos');
    const newDocRef = doc(productsRef);
    return from(setDoc(newDocRef, { ...product })) as Observable<void>;
  }

  updateProduct(id: string, product: Product): Observable<void> {
    const productDoc = doc(this.firestore, `productos/${id}`);
    return from(updateDoc(productDoc, { ...product })) as Observable<void>;
  }

  deleteProduct(id: string): Observable<void> {
    const productDoc = doc(this.firestore, `productos/${id}`);
    return from(deleteDoc(productDoc)) as Observable<void>;
  }

  getProductsFromJson(): Observable<Product[]> {
    return this.http.get<{ productos: Product[] }>(this.jsonUrl).pipe(
      tap(response => console.log('JSON response:', response)), // Verificar respuesta
      map(response => response.productos),
      tap(products => console.log('Mapped products:', products)) // Verificar productos mapeados
    );
  }

  loadProductsToFirestore(): Observable<void> {
    return this.getProductsFromJson().pipe(
      map(products => {
        products.forEach(product => {
          const productsRef = collection(this.firestore, 'productos');
          const newDocRef = doc(productsRef);
          setDoc(newDocRef, { ...product });
        });
        return;
      })
    );
  }

  searchProducts(queryStr: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product =>
        product.nombre.toLowerCase().includes(queryStr.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(queryStr.toLowerCase())
      ))
    );
  }
}
