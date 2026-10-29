import type { Category } from './types';

// Категорії магазину. Порожні категорії й підкатегорії приховуються автоматично.
export const categories: Category[] = [
  {
    id: 'clothing',
    name: 'Одяг',
    tagline: 'Пуховики, куртки, худі, штани',
    image: '',
    filterOptions: ['size', 'color'],
    subcategories: [
      { id: 'jackets', name: 'Пуховики та куртки' },
      { id: 'hoodies', name: 'Худі' },
      { id: 'suits', name: 'Костюми' },
      { id: 'pants', name: 'Штани' },
    ],
  },
  {
    id: 'sneakers',
    name: 'Взуття',
    tagline: 'Timberland',
    image: '',
    filterOptions: ['size', 'color'],
    subcategories: [],
  },
  {
    id: 'accessories',
    name: 'Аксесуари',
    tagline: 'Шапки та балаклави',
    image: '',
    filterOptions: ['color'],
    subcategories: [{ id: 'hats', name: 'Шапки та балаклави' }],
  },
];
