import { Product } from './product.model';

describe('Product', () => {
  it('should create an instance of Product with correct properties', () => {
    const product = new Product(
      '1', // id
      'Nombre del producto', // nombre
      'Descripción corta del producto', // descripcionCorta
      'Descripción del producto', // descripcion
      100, // precio
      'imagen.png', // imagen
      'slug-del-producto', // slug
      'SKU12345' // sku
    );

    expect(product).toBeTruthy();
    expect(product.id).toBe('1');
    expect(product.nombre).toBe('Nombre del producto');
    expect(product.descripcionCorta).toBe('Descripción corta del producto');
    expect(product.descripcion).toBe('Descripción del producto');
    expect(product.precio).toBe(100);
    expect(product.imagen).toBe('imagen.png');
    expect(product.slug).toBe('slug-del-producto');
    expect(product.sku).toBe('SKU12345');
  });
});
