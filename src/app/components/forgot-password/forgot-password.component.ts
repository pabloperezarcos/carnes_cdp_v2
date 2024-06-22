import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    this.message = 'Su nueva contraseña temporal ha sido enviada a su correo';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
