import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})

export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  relatedProducts: Product[] = [];
  loading = true;
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private carritoService: CarritoService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const sku = params.get('sku');
        this.loading = true;
        return this.productService.getProducts();
      })
    ).subscribe({
      next: (data) => {
        const sku = this.route.snapshot.paramMap.get('sku');
        this.product = data.productos.find(p => p.sku === sku);
        // Productos relacionados
        this.relatedProducts = data.productos.filter(p => p.sku !== sku).slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de producto completa')
    });
  }

  agregarAlCarrito(): void {
    if (this.product) {
      this.carritoService.agregarCarrito(this.product, this.cantidad);
      alert('Producto agregado al carrito');
    }
  }

}