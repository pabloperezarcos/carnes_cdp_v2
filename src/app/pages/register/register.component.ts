// register.component.ts
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

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    // Aquí debes implementar la lógica para registrar un nuevo usuario
    // En este ejemplo, solo redirigimos al usuario a la página de inicio
    this.router.navigate(['/']);
  }
}
