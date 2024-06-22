import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  cartItemCount: number = 0;

  constructor(private router: Router, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.cartItemCount = this.carritoService.getItemCount();
    this.carritoService.carritoActualizado.subscribe(() => {
      this.cartItemCount = this.carritoService.getItemCount();
    });
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
}
