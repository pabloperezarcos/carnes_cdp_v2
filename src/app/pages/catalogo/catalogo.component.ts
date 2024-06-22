import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})

export class CatalogoComponent implements OnInit {
  productos: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa')
    });
  }
}
