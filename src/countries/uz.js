// Данные страны для секции «Вся география вакансий на одной карте».
//
// В этом файле НЕ должно быть импортов картинок: его читает не только браузер,
// но и сборщик — из него генерируется статичная разметка пинов в index.html.
// Node такие импорты не поймёт. Картинки указываются именами файлов, а их адреса
// подставляет соседний файл uz.assets.js.
//
// Координаты пина — проценты от картинки карты, точка отсчёта — левый верхний
// угол кружка. Посчитаны из макета и сверены с рендером 1920.
//
// Как и в Казахстане, вакансии в макете расписаны по городам, а не общим пулом:
// у каждого города свой список. Город показывает столько карточек, сколько
// у него на бейдже, повторяя список по кругу.

export default {
  id: 'uz',
  // Карта уже сама вписана в холст 1920×1074 — в макете она занимает не всю
  // ширину секции, и поля вокруг неё входят в SVG. Так сцена остаётся обычной
  // картинкой, а пины — процентами от неё.
  map: {file: 'map-uzbekistan.svg', width: 1920, height: 1074},

  // Вертикальная раскладка из макета.
  layout: {
    // Отступы сверху для маскота и плашки с преимуществами, от начала блока.
    mascotTop: 267,
    featuresTop: 462,
    // Кнопка висит под нижним пином: его позицию сборщик берёт из списка
    // городов, а этот зазор — из макета. У Узбекистана пины кончаются выше,
    // чем у соседей, поэтому зазор заметно больше.
    ctaGap: 173,
  },

  cities: [
    {
      id: 'nukus',
      name: 'Нукус',
      x: 31.8229,
      y: 42.9731,
      count: 4,
      vacancies: [
        {
          title: 'Инженер-химик производства',
          salary: 'от 8 500 000 сум',
          avatars: ['person-14', 'person-31', 'person-25', 'person-6', 'person-27'],
          rest: 30,
        },
        {
          title: 'Руководитель склада',
          salary: 'от 7 000 000 сум',
          avatars: ['person-9', 'person-2', 'person-20', 'person-29', 'person-34'],
          rest: 24,
        },
        {
          title: 'Оператор call-центра',
          salary: 'от 4 000 000 сум',
          avatars: ['person-18', 'person-17', 'person-22'],
          rest: 27,
        },
      ],
    },
    {
      id: 'bukhara',
      name: 'Бухара',
      x: 47.7604,
      y: 65.3195,
      count: 6,
      vacancies: [
        {
          title: 'Логист транспортной компании',
          salary: 'от 6 000 000 сум',
          avatars: ['person-31', 'person-7', 'person-3', 'person-32'],
          rest: 0,
        },
        {
          title: 'Шеф-повар ресторана',
          salary: 'от 9 000 000 сум',
          avatars: ['person-33', 'person-34', 'person-4'],
          rest: 0,
        },
        {
          title: 'Менеджер по туризму',
          salary: 'от 5 500 000 сум',
          avatars: ['person-23', 'person-3', 'person-12', 'person-8', 'person-32'],
          rest: 31,
        },
      ],
    },
    {
      id: 'samarkand',
      name: 'Самарканд',
      x: 56.5104,
      y: 66.0644,
      count: 8,
      vacancies: [
        {
          title: 'Администратор гостиницы',
          salary: 'от 5 500 000 сум',
          avatars: ['person-6', 'person-13', 'person-4', 'person-14', 'person-15'],
          rest: 9,
        },
        {
          title: 'Гид-экскурсовод (англ., франц.)',
          salary: 'от 6 000 000 сум',
          avatars: ['person-16', 'person-17', 'person-18', 'person-8', 'person-5'],
          rest: 17,
        },
        {
          title: 'Маркетолог digital-проектов',
          salary: 'от 8 000 000 сум',
          avatars: ['person-19', 'person-20', 'person-21', 'person-22'],
          rest: 0,
        },
      ],
    },
    {
      id: 'tashkent',
      name: 'Ташкент',
      x: 64.0062,
      y: 52.2841,
      count: 21,
      vacancies: [
        {
          title: 'Креативный продюсер спецпроектов',
          salary: 'от 15 000 000 сум',
          avatars: ['person-1', 'person-2', 'person-3', 'person-4', 'person-5'],
          rest: 14,
        },
        {
          title: 'Senior Frontend Developer',
          salary: 'от 28 000 000 сум',
          avatars: ['person-6', 'person-7', 'person-8'],
          rest: 8,
        },
        {
          title: 'Менеджер по работе с VIP клиентами',
          salary: 'от 12 000 000 сум',
          avatars: ['person-9', 'person-10', 'person-11', 'person-12'],
          rest: 0,
        },
      ],
    },
    {
      id: 'namangan',
      name: 'Наманган',
      x: 72.2917,
      y: 53.7739,
      count: 5,
      vacancies: [
        {
          title: 'Технолог швейного производства',
          salary: 'от 7 000 000 сум',
          avatars: ['person-23', 'person-24', 'person-25', 'person-26'],
          rest: 0,
        },
        {
          title: 'Менеджер по продажам B2B',
          salary: 'от 6 500 000 сум',
          avatars: ['person-27', 'person-28', 'person-29', 'person-30', 'person-9'],
          rest: 21,
        },
        {
          title: 'Бухгалтер',
          salary: 'от 5 000 000 сум',
          avatars: ['person-2', 'person-10', 'person-1'],
          rest: 0,
        },
      ],
    },
  ],
};
