/**
 * Configuración del entorno para la aplicación.
 */
export const environment = {
    /**
     * Indica si la aplicación está en producción.
     * @type {boolean}
     */
    production: false,

    /**
     * Configuración de Firebase para la integración con la aplicación.
     * Contiene las credenciales y configuraciones necesarias para Firebase.
     * @type {{ 
     *   apiKey: string,
     *   authDomain: string,
     *   projectId: string,
     *   storageBucket: string,
     *   messagingSenderId: string,
     *   appId: string,
     *   measurementId: string
     * }}
     */
    firebase: {
        apiKey: "AIzaSyBpHDL7bQ3XPTOtaClNjAjZyFtYwcl_gaY",
        authDomain: "carnescdpv2.firebaseapp.com",
        projectId: "carnescdpv2",
        storageBucket: "carnescdpv2.appspot.com",
        messagingSenderId: "432247060096",
        appId: "1:432247060096:web:840b61645de89b485e1865",
        measurementId: "G-X8NZ26BBRL"
    }
};
