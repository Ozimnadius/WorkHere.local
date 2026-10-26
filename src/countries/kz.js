// Данные страны для секции «Вся география вакансий на одной карте».
//
// В этом файле НЕ должно быть импортов картинок: его читает не только браузер,
// но и сборщик — из него генерируется статичная разметка пинов в index.html.
// Node такие импорты не поймёт. Картинки указываются именами файлов, а их адреса
// подставляет соседний файл kz.assets.js.
//
// Координаты пина — проценты от картинки карты, точка отсчёта — левый верхний
// угол кружка. Посчитаны из макета и сверены с рендером 1920.
//
// В отличие от России, в макете Казахстана вакансии расписаны по городам, а не
// общим пулом: у каждого города свой список. Город показывает столько карточек,
// сколько у него на бейдже, повторяя список по кругу.

export default {
  id: 'kz',
  // Карта уже сама вписана в холст 1920×1074 — в макете она занимает не всю
  // ширину секции, и поля вокруг неё входят в SVG. Так сцена остаётся обычной
  // картинкой, а пины — процентами от неё.
  map: {file: 'map-kazakhstan.svg', width: 1920, height: 1074},

  // Вертикальная раскладка из макета. Карта Казахстана ниже российской, и всё,
  // что лежит поверх сцены, в макете сдвинуто вместе с ней.
  layout: {
    // Отступы сверху для маскота и плашки с преимуществами, от начала блока.
    mascotTop: 267,
    featuresTop: 462,
    // Кнопка висит под нижним пином: его позицию сборщик берёт из списка
    // городов, а этот зазор — из макета.
    ctaGap: 80,
  },

  cities: [
    {
      id: 'aktobe',
      name: 'Актобе',
      x: 34.1146,
      y: 39.435,
      count: 5,
      vacancies: [
        {
          title: 'Инженер-механик (нефтегаз)',
          salary: 'от 550 000 ₸',
          avatars: ['person-32', 'person-10', 'person-34', 'person-20'],
          rest: 0,
        },
        {
          title: 'Руководитель склада',
          salary: 'от 380 000 ₸',
          avatars: ['person-14', 'person-27', 'person-6', 'person-3'],
          rest: 0,
        },
        {
          title: 'Бухгалтер по первичной документации',
          salary: 'от 300 000 ₸',
          avatars: ['person-1', 'person-8', 'person-31'],
          rest: 30,
        },
      ],
    },
    {
      id: 'astana',
      name: 'Астана',
      x: 55.625,
      y: 37.2004,
      count: 14,
      vacancies: [
        {
          title: 'Backend-разработчик (Go/Python)',
          salary: 'от 1 000 000 ₸',
          avatars: ['person-12', 'person-13', 'person-14', 'person-15'],
          rest: 0,
        },
        {
          title: 'Специалист по госзакупкам',
          salary: 'от 450 000 ₸',
          avatars: ['person-16', 'person-17', 'person-18'],
          rest: 28,
        },
        {
          title: 'UX/UI дизайнер',
          salary: 'от 700 000 ₸',
          avatars: ['person-19', 'person-20', 'person-21', 'person-22'],
          rest: 0,
        },
      ],
    },
    {
      id: 'karaganda',
      name: 'Караганда',
      x: 58.3333,
      y: 42.5076,
      count: 6,
      vacancies: [
        {
          title: 'Горный мастер участка',
          salary: 'от 600 000 ₸',
          avatars: ['person-17', 'person-21', 'person-2'],
          rest: 18,
        },
        {
          title: 'Маркетолог digital-проектов',
          salary: 'от 400 000 ₸',
          avatars: ['person-22', 'person-7', 'person-25', 'person-26'],
          rest: 0,
        },
        {
          title: 'Электромонтёр по ремонту оборудования',
          salary: 'от 380 000 ₸',
          avatars: ['person-19', 'person-5', 'person-30', 'person-23', 'person-12'],
          rest: 0,
        },
      ],
    },
    {
      id: 'shymkent',
      name: 'Шымкент',
      x: 53.5937,
      y: 74.7236,
      count: 7,
      vacancies: [
        {
          title: 'Менеджер по продажам B2B',
          salary: 'от 350 000 ₸',
          avatars: ['person-23', 'person-24', 'person-25', 'person-26'],
          rest: 26,
        },
        {
          title: 'Логист транспортной компании',
          salary: 'от 320 000 ₸',
          avatars: ['person-27', 'person-28', 'person-29', 'person-30'],
          rest: 30,
        },
        {
          title: 'Технолог пищевого производства',
          salary: 'от 400 000 ₸',
          avatars: ['person-31', 'person-32', 'person-33', 'person-34', 'person-9'],
          rest: 0,
        },
      ],
    },
    {
      id: 'almaty',
      name: 'Алматы',
      x: 66.0938,
      y: 68.9508,
      count: 18,
      vacancies: [
        {
          title: 'Senior Frontend Developer',
          salary: 'от 1 100 000 ₸',
          avatars: ['person-1', 'person-2', 'person-3', 'person-4'],
          rest: 0,
        },
        {
          title: 'Менеджер по работе с VIP клиентами',
          salary: 'от 650 000 ₸',
          avatars: ['person-5', 'person-6', 'person-7', 'person-8'],
          rest: 25,
        },
        {
          title: 'Data-аналитик (SQL/Python)',
          salary: 'от 800 000 ₸',
          avatars: ['person-9', 'person-10', 'person-11'],
          rest: 0,
        },
      ],
    },
  ],
};
