import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { map, tap } from 'rxjs/operators';

/**
 * Servicio para la gestión de productos, incluyendo operaciones CRUD y carga desde JSON.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /** URL del archivo JSON con los datos de los productos. */
  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/carnescdpv2.appspot.com/o/productos.json?alt=media&token=7e185c71-ea77-4bcf-b557-48ba39e08ab6';

  /**
   * Constructor del servicio ProductService.
   * @param firestore Servicio Firestore para realizar operaciones en la base de datos.
   * @param http Servicio HttpClient para realizar solicitudes HTTP.
   */
  constructor(private firestore: Firestore, private http: HttpClient) { }

  /**
   * Obtiene todos los productos desde Firestore.
   * @returns Un Observable que emite un array de productos.
   */
  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'productos');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * Agrega un nuevo producto a Firestore.
   * @param product El producto a agregar.
   * @returns Un Observable que completa cuando se agrega el producto.
   */
  addProduct(product: Product): Observable<void> {
    const productsRef = collection(this.firestore, 'productos');
    const newDocRef = doc(productsRef);
    return from(setDoc(newDocRef, { ...product })) as Observable<void>;
  }

  /**
   * Actualiza un producto existente en Firestore.
   * @param id El ID del producto a actualizar.
   * @param product El producto actualizado.
   * @returns Un Observable que completa cuando se actualiza el producto.
   */
  updateProduct(id: string, product: Product): Observable<void> {
    const productDoc = doc(this.firestore, `productos/${id}`);
    return from(updateDoc(productDoc, { ...product })) as Observable<void>;
  }

  /**
   * Elimina un producto existente de Firestore.
   * @param id El ID del producto a eliminar.
   * @returns Un Observable que completa cuando se elimina el producto.
   */
  deleteProduct(id: string): Observable<void> {
    const productDoc = doc(this.firestore, `productos/${id}`);
    return from(deleteDoc(productDoc)) as Observable<void>;
  }

  /**
   * Obtiene los productos desde un archivo JSON externo mediante una solicitud HTTP.
   * @returns Un Observable que emite un array de productos desde el JSON.
   */
  getProductsFromJson(): Observable<Product[]> {
    return this.http.get<{ productos: Product[] }>(this.jsonUrl).pipe(
      tap(response => console.log('JSON response:', response)), // Verificar respuesta
      map(response => response.productos),
      tap(products => console.log('Mapped products:', products)) // Verificar productos mapeados
    );
  }

  /**
   * Carga los productos desde un archivo JSON externo a Firestore.
   * @returns Un Observable que completa cuando se cargan todos los productos.
   */
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

  /**
   * Busca productos en Firestore que coincidan con el término de búsqueda.
   * @param queryStr El término de búsqueda.
   * @returns Un Observable que emite un array de productos que coinciden con la búsqueda.
   */
  searchProducts(queryStr: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product =>
        product.nombre.toLowerCase().includes(queryStr.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(queryStr.toLowerCase())
      ))
    );
  }
}
