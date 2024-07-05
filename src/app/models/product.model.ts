export class Product {
    id?: string;
    nombre: string;
    descripcionCorta: string;
    descripcion: string;
    precio: number;
    imagen: string;
    slug: string;
    sku: string;

    constructor(
        id: string = '',
        nombre: string = '',
        descripcionCorta: string = '',
        descripcion: string = '',
        precio: number = 0,
        imagen: string = '',
        slug: string = '',
        sku: string = ''
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcionCorta = descripcionCorta;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.slug = slug;
        this.sku = sku;
    }
}
