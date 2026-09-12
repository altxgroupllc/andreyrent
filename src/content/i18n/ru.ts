/**
 * RU interface copy. Business FACTS never live here — they live in the typed content
 * modules (vehicles, pricing, rules, locations) and in display-policy.ts.
 * This file holds only labels and connective microcopy.
 */
export const ru = {
  locale: "ru",
  brandLine: "Паттайя · Пратумнак и Наклуа · 10:00–20:00",

  nav: {
    home: "Главная",
    find: "Подбор",
    booking: "Подобрать байк / авто",
    bikes: "Байки",
    cars: "Авто",
    bicycles: "Вело",
    prices: "Цены",
    howItWorks: "Условия",
    delivery: "Доставка",
    contacts: "Контакты",
    search: "Поиск",
    searchModel: "Поиск модели",
    menu: "Разделы",
    closeMenu: "Закрыть меню",
    whatsapp: "WhatsApp",
  },

  home: {
    title: "Транспорт в Паттайе\nза три шага",
    lede: "Джомтьен, Пратумнак, центр или Наклуа — скажите, что нужно и на сколько, и увидите реальную цену за ваш срок.",
    step1: "Что нужно",
    step2: "На сколько",
    step3: "Куда привезти",
    matches: "Подходит",
    of: "из",
    fromPerDay: "от",
    perDayOn: "฿ в день на",
  },

  results: {
    bikes: "Подходящие байки",
    cars: "Подходящие авто",
    bicycles: "Велосипеды",
    tariffOn: "тариф на",
    empty: "На этот запрос в выбранной категории ничего нет.",
    emptyHint: "Смените тип техники или сценарий.",
    all: "Весь парк",
  },

  vehicle: {
    quickView: "быстрый просмотр",
    choose: "Выбрать транспорт",
    details: "Подробнее",
    close: "Закрыть",
    specs: "Характеристики",
    pros: "Плюсы",
    cons: "Минусы",
    forWhom: "Кому подойдёт",
    deposit: "Залог",
    depositReturnable: "Залог, возвращается",
    delivery: "Доставка",
    rentalFor: "Аренда ×",
    dueNow: "К оплате сейчас",
    pickupOffice: "Забрать в офисе",
    write: "Забронировать",
    book: "Забронировать",
    prototypeNote: "Прототип — сообщение не отправляется",
    relatedTitle: "Похожие модели",
    tariffTable: "Тарифы",
    period: "Срок",
    price: "Стоимость",
  },

  duration: {
    less: "На день меньше",
    more: "На день больше",
    tariff: "тариф",
    quickPick: "Быстрый выбор срока",
  },

  included: {
    passport: "Паспорт остаётся у вас",
    deposit: "Залог",
    helmets: "Два шлема в цене",
    deliveryEta: "Привезём за",
    minutes: "мин",
  },

  footer: {
    rights: "Все права защищены",
    hours: "Ежедневно 10:00–20:00, без обеда",
  },
} as const;

export type Dictionary = typeof ru;
