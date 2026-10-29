// Джерело каталогу. Зараз — локальний файл з товарами з Telegram-каналу.
// Щоб підключити сервер, замініть тіло loadCatalog на запит до API
// (наприклад, fetch(`${API_URL}/catalog`)), який повертає об'єкт типу Catalog.

import type { Catalog, Category, Product } from '../data/types';
import { categories } from '../data/categories';
import { catalogProducts } from '../data/catalog/products';
import { shopConfig } from '../config/shop';

/** Прибирає категорії й підкатегорії, у яких немає жодного товару. */
export function visibleCategories(list: Category[], products: Product[]): Category[] {
  return list
    .map((c) => {
      const own = products.filter((p) => p.categoryId === c.id);
      if (!own.length) return null;
      return {
        ...c,
        image: c.image || own.find((p) => p.images[0])?.images[0] || '',
        subcategories: c.subcategories.filter((s) =>
          own.some((p) => (s.byTag ? p.tags.includes(s.byTag) : p.subcategoryIds.includes(s.id))),
        ),
      };
    })
    .filter((c): c is Category => c !== null);
}

export async function loadCatalog(): Promise<Catalog> {
  const products = catalogProducts;
  return { categories: visibleCategories(categories, products), products, isDemo: shopConfig.isDemo };
}
