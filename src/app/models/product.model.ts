export class Product {
    id?: string;
    nombre: string;
    descripcionCorta: string;
    descripcion: string;
    precio: number;
    imagen: string;
    slug: string;
    sku: string;

    /**
     * Constructor de la clase Product.
     * @param id Identificador único del producto (opcional).
     * @param nombre Nombre del producto.
     * @param descripcionCorta Descripción breve del producto.
     * @param descripcion Descripción detallada del producto.
     * @param precio Precio del producto.
     * @param imagen URL de la imagen asociada al producto.
     * @param slug Slug del producto para SEO y rutas amigables.
     * @param sku Código SKU del producto.
     */
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
