export class Product {
    nombre: string;
    descripcionCorta: string;
    descripcion: String
    precio: number;
    imagen: string;
    slug: string;
    sku: string

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
        this.descripcion = descripcion;
        this.descripcionCorta = descripcionCorta;
        this.precio = precio;
        this.imagen = imagen;
        this.slug = slug;
        this.sku = sku
    }
}