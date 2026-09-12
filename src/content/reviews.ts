// Verbatim Google review excerpts as published on the live homepage (/ru/).
// The aggregate rating is what the site displays; it is NOT independently verified here.
// Never fabricate additional reviews, counts, or ratings.

export interface Review {
  author: string;
  avatar: string | null;
  text: string;
  rating: number;
  source: string;
}

/** Displayed on /ru/ as "4.8". Treat as a claim sourced from the site, not a live feed. */
export const googleRating = { value: 4.8, scale: 5, label: "Google Reviews", source: "https://rentmotorbike.org/ru/" } as const;

export const reviews: Review[] = [
  {
    "author": "Антон Шук",
    "avatar": "/static/images/reviews-pattaya/customer1.jpg",
    "text": "🔥 Аренда мопеда в Паттайе: Andrey Rent — мой выбор! 🔥\n\nВзял Honda Click на 7 дней. Всё супер:\n\n✔️ оформили за 10 минут, нужен был паспорт (сняли копию) и депозит 2 000 бат наличными;\n✔️ мопед чистый, заводится с полпинка;\n✔️выдали с полным баком, проверили вместе — никаких царапин или повреждений;\n✔️дали два шлема и объяснили, как пользоваться;\n✔️передвигались мы по городу и покатались по окрестностям;\n✔️ вернули депозит сразу после сдачи.\n\nНикаких скрытых платежей, вежливые ребята, техника в порядке. Очень доволен!\nОднозначно рекомендую —…",
    "rating": 5,
    "source": "Google Reviews"
  },
  {
    "author": "Ilya",
    "avatar": "/static/images/reviews-pattaya/customer2.jpg",
    "text": "Снимал Honda Forza 350 2025 keyless на неделю. Как заехал в отель и написал в вотсап, ребята привезли байк уже через 5 минут. Процесс оформления очень быстрый, депозит был 5000 бат. Бак был почти пустой на 40 км, о чем написал менеджеру, так как в договоре прописан полный бак, все ок, вопросов не было. Байк свежий, классный, по одометру 3700 км, накатал 700 км. Сдача также прошла быстро, ребята подъехали к отелю, осмотрели, вернули депозит. Захотелось плакать от разлуки. Отличный сервис, в следующий раз в Паттайе обязательно вновь возьму…",
    "rating": 5,
    "source": "Google Reviews"
  },
  {
    "author": "Анна А",
    "avatar": "/static/images/reviews-pattaya/customer3.jpg",
    "text": "Беру здесь байк ежегодно каждый отпуск. Ребята-менеджеры русские очень отзывчивые и оперативные, все объясняют по транспорту доходчиво. Можно брать шлемы, сколько нужно. Пару раз случались проблемы (заблокировался дистанционный ключ, сел аккумулятор) - позвонила, сразу приехали, все решили. Цены средние, заключают договор, берут депозит, и всегда на связи. Большое спасибо за сервис, буду и дальше здесь брать байк.",
    "rating": 5,
    "source": "Google Reviews"
  },
  {
    "author": "Евгений Ячиков",
    "avatar": "/static/images/reviews-pattaya/customer4.jpg",
    "text": "Всё отлично, цены как на сайте, пришел за 10 минут оформил скутер и уехал, каски входят в стоимость аренды на 7 дней вышло 1120 бат. Залог 2000 бат, вернули сразу как сдал скутер. Скутер был в исправном состоянии, ребята работают хорошо, рекомендую!",
    "rating": 5,
    "source": "Google Reviews"
  },
  {
    "author": "GOOD LIKE",
    "avatar": "/static/images/reviews-pattaya/customer5.jpg",
    "text": "Все в целом как пишут остальные. Отличные ребята! Приехали под самое закрытие, быстро оформили документы и поехали. Проехали на этом мопеде 800км без единой проблемы и поломки. Никаких скрытых платежей и тому подобного. В залог оставил 100 баксов, их и вернули. В общем вернемся обязательно!",
    "rating": 5,
    "source": "Google Reviews"
  }
];
