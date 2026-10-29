// Налаштування магазину беруться з shop.config.json у корені проєкту
// (той самий файл читає бот). Порожні поля інтерфейс не показує.

import cfg from '../../shop.config.json';

export const shopConfig = {
  name: cfg.name,
  subtitle: cfg.subtitle,
  currency: '₴',
  isDemo: false,
  contacts: {
    phone: '' as string,
    /** Менеджер для замовлень у Telegram, напр. '@username'. */
    telegram: cfg.managerTelegram as string,
    email: '' as string,
    hours: '' as string,
  },
  reviewsUrl: cfg.reviewsUrl as string,
  /** Короткий рядок про доставку на сторінці товару. */
  deliveryNote: cfg.deliveryNote as string,
  hero: {
    eyebrow: cfg.hero.eyebrow,
    title: cfg.hero.title || cfg.name,
    text: cfg.hero.text,
    image: (cfg.hero.image || undefined) as string | undefined,
  },
  delivery: {
    /** Від якої суми доставка безкоштовна (для підказки в кошику). 0 — не показувати. */
    freeFrom: 0,
  },
};

/** Посилання на чат з менеджером. */
export const managerUrl = () => {
  const u = shopConfig.contacts.telegram.replace(/^@/, '');
  return u ? `https://t.me/${u}` : '';
};
