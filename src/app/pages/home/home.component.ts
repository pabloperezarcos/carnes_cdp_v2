import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Testimonio {
  nombre: string;
  comentario: string;
  estrellas: number;
  imagen: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  productos: Product[] = [];
  loading = true;
  testimonios: Testimonio[] = [];

  constructor(private productService: ProductService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{ testimonios: Testimonio[] }>('app/data/testimonios.json').subscribe(data => {
      this.testimonios = data.testimonios;
    });
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa')
    });
  }

  getEstrellas(estrellas: number): number[] {
    return new Array(estrellas);
  }

  getEmptyEstrellas(estrellas: number): number[] {
    return new Array(5 - estrellas);
  }

}