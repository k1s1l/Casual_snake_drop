// КАТАЛОГ — перенесено з постів Telegram-каналу «Casual snake drop» (22–26.10.2026).
// Беремо лише те, що написано в постах і видно на фото. Чого немає — не вигадуємо.

import type { OptionGroup, OptionValue, Product } from '../types';

const sizes = (ids: string[], unavailable: string[] = []): OptionGroup => ({
  id: 'size',
  label: 'Розмір',
  values: ids.map((id) => ({ id, label: id, available: !unavailable.includes(id) })),
});

const SWATCH: Record<string, string> = {
  black: '#141414', grey: '#8d8f93', green: '#4f5a35', blue: '#2b4fa8', beige: '#c99a4b',
  red: '#b3262e', white: '#f1f1ee', pink: '#e0307a',
};
const LABEL: Record<string, string> = {
  black: 'Чорний', grey: 'Сірий', green: 'Зелений', blue: 'Синій', beige: 'Бежевий',
  red: 'Червоний', white: 'Білий', pink: 'Рожевий',
};
/** Кольори з поста; imageIndex — яке фото показати при виборі кольору. */
const colors = (list: [string, number?][]): OptionGroup => ({
  id: 'color',
  label: 'Колір',
  values: list.map(([id, imageIndex]): OptionValue => ({ id, label: LABEL[id], swatch: SWATCH[id], available: true, imageIndex })),
});

const BRAND_PACK = { label: 'Комплектація', value: 'Брендове упакування, усі бірки' };

type Draft = Omit<Product, 'popularity' | 'stock' | 'tags'> & Partial<Pick<Product, 'stock' | 'tags'>>;
const item = (p: Draft): Product => ({ stock: 'in_stock', tags: [], popularity: 0, ...p });

export const catalogProducts: Product[] = [
  item({
    id: 'timberland-6-inch',
    categoryId: 'sneakers',
    subcategoryIds: [],
    brand: 'Timberland',
    name: 'Черевики Timberland 6 Inch',
    shortDescription: 'Брендове упакування, усі бірки',
    description: 'Черевики Timberland 6 Inch. Брендове упакування, присутні всі бірки.',
    price: 4099,
    images: ['timberland-6inch', 'timberland-6inch-2', 'timberland-6inch-black'],
    attributes: [BRAND_PACK],
    options: [colors([['black', 2], ['beige', 0]]), sizes(['38', '39', '40', '41', '42', '43', '44', '45'])],
    addedAt: '2026-10-22T13:59',
  }),
  item({
    // Два пости з балаклавою (22.10 — чорна, 24.10 — чорна, біла, рожева) об'єднано в один товар.
    id: 'nike-balaclava',
    categoryId: 'accessories',
    subcategoryIds: ['hats'],
    brand: 'Nike',
    name: 'Балаклава Nike',
    shortDescription: 'Поліестер, зберігає тепло',
    description: 'Балаклава Nike з прогумованим логотипом. Зберігає тепло. Брендове упакування, присутні всі бірки.',
    price: 749,
    images: ['nike-balaclava'],
    attributes: [
      { label: 'Матеріал', value: 'Поліестер' },
      { label: 'Логотип', value: 'Прогумований' },
      { label: 'Розмір', value: 'Універсальний' },
      BRAND_PACK,
    ],
    options: [colors([['black'], ['white'], ['pink']])],
    addedAt: '2026-10-24T13:59',
  }),
  item({
    id: 'cp-company-palace-puffer',
    categoryId: 'clothing',
    subcategoryIds: ['jackets'],
    brand: 'C.P. Company × Palace',
    name: 'Пуховик C.P. Company x Palace',
    shortDescription: 'Матеріал відштовхує воду та сніг',
    description: 'Пуховик C.P. Company x Palace. Матеріал відштовхує воду та сніг. Брендове упакування, присутні всі бірки.',
    price: 3299,
    images: ['cp-palace-puffer', 'cp-palace-puffer-2'],
    attributes: [{ label: 'Матеріал', value: 'Відштовхує воду та сніг' }, BRAND_PACK],
    options: [colors([['black'], ['grey'], ['green'], ['blue']]), sizes(['S', 'M', 'L', 'XL', 'XXL'])],
    addedAt: '2026-10-23T14:53',
  }),
  item({
    id: 'marcelo-burlon-puffer',
    categoryId: 'clothing',
    subcategoryIds: ['jackets'],
    brand: 'Marcelo Burlon',
    name: 'Пуховик Marcelo Burlon',
    shortDescription: 'Наповнювач — штучний пух',
    description: 'Пуховик Marcelo Burlon з пробрендованою фурнітурою. Наповнювач — штучний пух. Брендове упакування, присутні всі бірки.',
    price: 3149,
    images: ['marcelo-burlon-red', 'marcelo-burlon-blue'],
    attributes: [
      { label: 'Наповнювач', value: 'Штучний пух' },
      { label: 'Фурнітура', value: 'Пробрендована' },
      BRAND_PACK,
    ],
    options: [colors([['red', 0], ['blue', 1]]), sizes(['S', 'M', 'L'])],
    // З поста: червоний — S, M, L; синій — лише S.
    soldOutCombos: [{ color: 'blue', size: 'M' }, { color: 'blue', size: 'L' }],
    addedAt: '2026-10-23T16:10',
  }),
  item({
    id: 'corteiz-zip-hoodie',
    categoryId: 'clothing',
    subcategoryIds: ['hoodies'],
    brand: 'Corteiz',
    name: 'Зіп-худі Corteiz',
    shortDescription: 'Брендове упакування, усі бірки',
    description: 'Зіп-худі Corteiz. Брендове упакування, присутні всі бірки.',
    price: 1899,
    images: ['corteiz-zip-hoodie'],
    attributes: [BRAND_PACK],
    options: [colors([['black']]), sizes(['S', 'M', 'L', 'XL'])],
    addedAt: '2026-10-23T17:13',
  }),
  item({
    id: 'cp-company-jacket',
    categoryId: 'clothing',
    subcategoryIds: ['jackets'],
    brand: 'C.P. Company',
    name: 'Куртка C.P. Company',
    shortDescription: 'Фірмова фурнітура, три кольори',
    description: 'Куртка C.P. Company з фірмовою фурнітурою. Брендове упакування, присутні всі бірки.',
    price: 3499,
    images: ['cp-jacket'],
    attributes: [{ label: 'Фурнітура', value: 'Фірмова' }, BRAND_PACK],
    options: [colors([['black'], ['grey'], ['green']]), sizes(['S', 'M', 'L', 'XL'])],
    addedAt: '2026-10-24T12:58',
  }),
  item({
    id: 'nike-supreme-suit',
    categoryId: 'clothing',
    subcategoryIds: ['suits', 'hoodies', 'pants'],
    brand: 'Nike × Supreme',
    name: 'Костюм Nike x Supreme',
    shortDescription: 'Костюм, або окремо зіп-худі чи штани',
    description: 'Костюм Nike x Supreme з фірмовою фурнітурою. Можна взяти комплектом або окремо зіп-худі чи штани. Брендове упакування, присутні всі бірки.',
    price: 3499,
    images: ['nike-supreme-suit'],
    attributes: [{ label: 'Фурнітура', value: 'Фірмова' }, BRAND_PACK],
    options: [
      {
        id: 'set',
        label: 'Комплект',
        values: [
          { id: 'suit', label: 'Костюм', price: 3499, available: true },
          { id: 'hoodie', label: 'Зіп-худі', price: 2099, available: true },
          { id: 'pants', label: 'Штани', price: 1699, available: true },
        ],
      },
      colors([['black'], ['grey']]),
      sizes(['M', 'L', 'XL', 'XXL']),
    ],
    addedAt: '2026-10-24T14:59',
  }),
  item({
    id: 'burberry-winter-pants',
    categoryId: 'clothing',
    subcategoryIds: ['pants'],
    brand: 'Burberry',
    name: 'Зимові штани Burberry на флісі',
    shortDescription: '100% бавовна, на флісі, на утяжках',
    description: 'Зимові штани Burberry на флісі, на утяжках, з вишитим логотипом. Присутні всі бірки.',
    price: 1499,
    images: ['burberry-pants', 'burberry-pants-black', 'burberry-pants-grey'],
    attributes: [
      { label: 'Матеріал', value: '100% бавовна, фліс' },
      { label: 'Логотип', value: 'Вишитий' },
      { label: 'Низ', value: 'На утяжках' },
    ],
    options: [colors([['black', 1], ['grey', 2]]), sizes(['S', 'M', 'L', 'XL'])],
    addedAt: '2026-10-24T17:59',
  }),
  item({
    id: 'corteiz-beanie',
    categoryId: 'accessories',
    subcategoryIds: ['hats'],
    brand: 'Corteiz',
    name: 'Шапка Corteiz',
    shortDescription: '100% акрил, тягнеться',
    description: 'Шапка Corteiz зі 100% акрилу, добре тягнеться. Брендове упакування, присутні всі бірки.',
    price: 499,
    images: ['corteiz-beanie'],
    attributes: [
      { label: 'Розмір', value: 'Висота 22 см, ширина 21 см' },
      { label: 'Матеріал', value: '100% акрил, тягнеться' },
      BRAND_PACK,
    ],
    options: [colors([['black'], ['white'], ['grey']])],
    addedAt: '2026-10-25T17:57',
  }),
  item({
    id: 'polo-ralph-lauren-puffer',
    categoryId: 'clothing',
    subcategoryIds: ['jackets'],
    brand: 'Polo Ralph Lauren',
    name: 'Пуховик Polo Ralph Lauren',
    shortDescription: 'Знімний капюшон, утяжки, вишитий логотип',
    description:
      'Пуховик Polo Ralph Lauren з вишитим логотипом і фірмовою фурнітурою. Утяжки знизу та на капюшоні, капюшон знімається. Брендове упакування, присутні всі бірки.',
    price: 2699,
    images: ['polo-rl-puffer'],
    attributes: [
      { label: 'Капюшон', value: 'Знімний, з утяжкою' },
      { label: 'Логотип', value: 'Вишитий' },
      { label: 'Фурнітура', value: 'Фірмова' },
      BRAND_PACK,
    ],
    options: [colors([['black']]), sizes(['S', 'M', 'L', 'XL'])],
    addedAt: '2026-10-26T18:28',
  }),
];
