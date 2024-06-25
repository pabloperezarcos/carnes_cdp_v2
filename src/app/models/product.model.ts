/**
 * Representa un producto en el sistema.
 */
export class Product {
    /** Nombre del producto. */
    nombre: string;

    /** Descripción corta del producto. */
    descripcionCorta: string;

    /** Descripción completa del producto. */
    descripcion: string;

    /** Precio del producto. */
    precio: number;

    /** URL de la imagen del producto. */
    imagen: string;

    /** Slug del producto para URLs amigables. */
    slug: string;

    /** Código SKU del producto. */
    sku: string;

    /**
     * Crea una nueva instancia de un producto.
     * @param nombre - Nombre del producto.
     * @param descripcionCorta - Descripción corta del producto.
     * @param descripcion - Descripción completa del producto.
     * @param precio - Precio del producto.
     * @param imagen - URL de la imagen del producto.
     * @param slug - Slug del producto para URLs amigables.
     * @param sku - Código SKU del producto.
     */
    constructor(
        nombre: string,
        descripcionCorta: string,
        descripcion: string,
        precio: number,
        imagen: string,
        slug: string,
        sku: string
    ) {
        this.nombre = nombre;
        this.descripcionCorta = descripcionCorta;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.slug = slug;
        this.sku = sku;
    }
}
