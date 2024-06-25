import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

// Registra los datos de localización
registerLocaleData(localeEsCL);

/**
 * Configuración de la aplicación.
 * Proporciona configuraciones y proveedores necesarios para la aplicación Angular.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Proporciona detección de cambios de zona con coalescencia de eventos.
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Proporciona enrutamiento con las rutas definidas.
    provideRouter(routes),

    // Proporciona un cliente HTTP con soporte para fetch.
    provideHttpClient(withFetch()),

    // Importa los proveedores del módulo de formularios.
    importProvidersFrom(FormsModule),

    // Proporciona la configuración de localización.
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ]
};
