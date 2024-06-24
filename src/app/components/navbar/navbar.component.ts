import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';

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
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  currentUser: any = null;

  constructor(private router: Router, private carritoService: CarritoService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      this.isAdmin = this.authService.getCurrentUser()?.rol === 'admin';
    });
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
