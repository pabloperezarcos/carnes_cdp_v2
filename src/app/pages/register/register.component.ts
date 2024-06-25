import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  nombre: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  birthdate: string = '';
  address: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    const newUser = {
      id: 0,
      nombre: this.nombre,
      username: this.username,
      email: this.email,
      password: this.password,
      birthdate: this.birthdate,
      address: this.address,
      rol: 'cliente',
      imagen: '/assets/default-profile.png'
    };

    this.authService.addUser(newUser);
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
      this.showPassword = !this.showPassword;
    }
  }
}
