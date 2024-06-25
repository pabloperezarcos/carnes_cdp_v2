import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definición de la interfaz para los usuarios
interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  address: string;
  rol: string;
  imagen: string;
}

/**
 * PerfilComponent maneja la visualización y edición del perfil de usuario.
 * Permite a los usuarios ver y actualizar su información de perfil.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: User | null = null; // Usuario actual
  editMode: boolean = false; // Indica si el modo de edición está activado

  /**
   * Constructor que inyecta el servicio de autenticación para obtener y actualizar el perfil de usuario.
   * @param authService Servicio de autenticación para gestionar el perfil de usuario.
   */
  constructor(private authService: AuthService) { }

  /**
   * Inicializa el componente obteniendo el usuario actual desde el servicio de autenticación.
   */
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  /**
   * Alterna el modo de edición del perfil.
   */
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  /**
   * Guarda los cambios realizados en el perfil de usuario utilizando el servicio de autenticación.
   * Desactiva el modo de edición después de guardar.
   */
  saveProfile(): void {
    if (this.user) {
      this.authService.updateUserProfile(this.user);
      this.editMode = false;
    }
  }
}
