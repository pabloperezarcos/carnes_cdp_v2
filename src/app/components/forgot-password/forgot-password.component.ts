import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  message: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  // Getter para facilitar el acceso a los controles del formulario
  get f() { return this.resetForm.controls; }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.message = 'Su nueva contraseña temporal ha sido enviada a su correo';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
