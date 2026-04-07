'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';

/* ── Types ─────────────────────────────────────────────────────────────────── */
type Market = 'hot' | 'warm' | 'neutral' | 'cold';
type Region = 'West' | 'Midwest' | 'South' | 'Northeast';

interface StateData {
  abbr: string;
  name: string;
  nameRu: string;
  region: Region;
  freight: string[];
  freightRu: string[];
  rpmLow: number;
  rpmHigh: number;
  market: Market;
  hubs: string[];
  noteEn: string;
  noteRu: string;
}

/* ── Data: All 50 States ───────────────────────────────────────────────────── */
const STATES: StateData[] = [
  // ── WEST ────────────────────────────────────────────────────────────────────
  {
    abbr: 'CA', name: 'California', nameRu: 'Калифорния', region: 'West',
    freight: ['Electronics', 'Fresh produce', 'Wine & spirits', 'Apparel', 'Film equipment'],
    freightRu: ['Электроника', 'Свежие продукты', 'Вино и спиртное', 'Одежда', 'Кино-оборудование'],
    rpmLow: 2.10, rpmHigh: 2.90, market: 'hot',
    hubs: ['Los Angeles', 'San Francisco', 'Fresno', 'San Diego', 'Sacramento'],
    noteEn: 'Largest freight market in the US. LA port is #1 in the country. Extremely competitive — expect to negotiate hard.',
    noteRu: 'Крупнейший рынок грузов в США. Порт Лос-Анджелеса — №1 в стране. Очень конкурентный — торгуйтесь жёстко.',
  },
  {
    abbr: 'OR', name: 'Oregon', nameRu: 'Орегон', region: 'West',
    freight: ['Lumber', 'Potatoes', 'Electronics (Intel)', 'Hops & beer', 'Seafood'],
    freightRu: ['Пиломатериалы', 'Картофель', 'Электроника (Intel)', 'Хмель и пиво', 'Морепродукты'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Portland', 'Eugene', 'Salem', 'Medford'],
    noteEn: 'Portland is a solid outbound market. Strong lumber and agriculture lanes eastbound.',
    noteRu: 'Портленд — стабильный рынок отправки. Сильные восточные направления с лесом и сельхозпродукцией.',
  },
  {
    abbr: 'WA', name: 'Washington', nameRu: 'Вашингтон (штат)', region: 'West',
    freight: ['Aerospace parts (Boeing)', 'Apples & cherries', 'Seafood', 'Lumber', 'Tech equipment'],
    freightRu: ['Авиазапчасти (Boeing)', 'Яблоки и вишня', 'Морепродукты', 'Пиломатериалы', 'Тех. оборудование'],
    rpmLow: 2.00, rpmHigh: 2.75, market: 'warm',
    hubs: ['Seattle', 'Tacoma', 'Spokane', 'Yakima'],
    noteEn: 'Seattle/Tacoma port corridor is very active. Eastbound apple lanes from Yakima Valley are seasonal but consistent.',
    noteRu: 'Коридор портов Сиэтл/Такома очень активен. Восточные направления с яблоками из долины Якима — сезонные, но стабильные.',
  },
  {
    abbr: 'NV', name: 'Nevada', nameRu: 'Невада', region: 'West',
    freight: ['Distribution center goods', 'Mining equipment', 'Electronics', 'Construction materials', 'Casino goods'],
    freightRu: ['Товары из дистрибуционных центров', 'Горнодобывающее оборудование', 'Электроника', 'Стройматериалы', 'Казино-товары'],
    rpmLow: 2.25, rpmHigh: 3.05, market: 'hot',
    hubs: ['Las Vegas', 'Reno', 'Henderson', 'Sparks'],
    noteEn: 'Reno is a major distribution hub (Amazon, Tesla, Walmart). Strong inbound demand, high RPM due to challenging outbound.',
    noteRu: 'Рено — крупный дистрибуционный хаб (Amazon, Tesla, Walmart). Высокий входящий спрос, высокий RPM из-за сложного исходящего.',
  },
  {
    abbr: 'AZ', name: 'Arizona', nameRu: 'Аризона', region: 'West',
    freight: ['Semiconductors', 'Solar panels', 'Copper', 'Citrus', 'Construction materials'],
    freightRu: ['Полупроводники', 'Солнечные панели', 'Медь', 'Цитрусовые', 'Стройматериалы'],
    rpmLow: 2.35, rpmHigh: 3.15, market: 'hot',
    hubs: ['Phoenix', 'Tucson', 'Tempe', 'Mesa', 'Scottsdale'],
    noteEn: 'Phoenix metro is booming — massive semiconductor fab construction (TSMC, Intel). High demand for flatbed and specialized freight.',
    noteRu: 'Метро Феникса бурно растёт — масштабное строительство заводов полупроводников (TSMC, Intel). Высокий спрос на флэтбед и спецгрузы.',
  },
  {
    abbr: 'UT', name: 'Utah', nameRu: 'Юта', region: 'West',
    freight: ['Minerals & mining', 'Tech equipment', 'Distribution goods', 'Outdoor & ski gear', 'Steel'],
    freightRu: ['Полезные ископаемые', 'Тех. оборудование', 'Товары для дистрибуции', 'Горнолыжное снаряжение', 'Сталь'],
    rpmLow: 2.10, rpmHigh: 2.80, market: 'warm',
    hubs: ['Salt Lake City', 'Provo', 'Ogden', 'St. George'],
    noteEn: 'Salt Lake City is a growing logistics hub between Denver and the West Coast. Good balance of inbound/outbound.',
    noteRu: 'Солт-Лейк-Сити — растущий логистический хаб между Денвером и Западным побережьем. Хороший баланс входящих/исходящих.',
  },
  {
    abbr: 'ID', name: 'Idaho', nameRu: 'Айдахо', region: 'West',
    freight: ['Potatoes', 'Dairy', 'Lumber', 'Silver & mining', 'Electronics (Micron)'],
    freightRu: ['Картофель', 'Молочные продукты', 'Пиломатериалы', 'Серебро и горнодобыча', 'Электроника (Micron)'],
    rpmLow: 2.00, rpmHigh: 2.70, market: 'neutral',
    hubs: ['Boise', 'Nampa', 'Twin Falls', 'Pocatello'],
    noteEn: 'Potato season (Sept–Oct) spikes demand. Good reefer market. Limited backhaul options — build this into your rate.',
    noteRu: 'Сезон картофеля (сент–окт) резко повышает спрос. Хороший рефрижераторный рынок. Мало обратной загрузки — учитывайте в ставке.',
  },
  {
    abbr: 'MT', name: 'Montana', nameRu: 'Монтана', region: 'West',
    freight: ['Cattle', 'Wheat', 'Lumber', 'Copper', 'Coal'],
    freightRu: ['Скот', 'Пшеница', 'Пиломатериалы', 'Медь', 'Уголь'],
    rpmLow: 2.65, rpmHigh: 3.85, market: 'cold',
    hubs: ['Billings', 'Missoula', 'Great Falls', 'Bozeman'],
    noteEn: 'Very rural. Deadhead miles are high. Charge premium — $3.50+ RPM is common for loads coming out of here.',
    noteRu: 'Очень сельский. Много порожних миль. Берите премиум — $3.50+ RPM — обычная ставка для грузов отсюда.',
  },
  {
    abbr: 'WY', name: 'Wyoming', nameRu: 'Вайоминг', region: 'West',
    freight: ['Coal', 'Oil & gas', 'Trona (soda ash)', 'Cattle', 'Hay'],
    freightRu: ['Уголь', 'Нефть и газ', 'Трона (сода)', 'Скот', 'Сено'],
    rpmLow: 2.75, rpmHigh: 4.10, market: 'cold',
    hubs: ['Cheyenne', 'Casper', 'Gillette', 'Laramie'],
    noteEn: 'Least populated state. Extremely high deadhead. Loads pay $4+ RPM from remote areas. Flatbed dominant.',
    noteRu: 'Наименее населённый штат. Огромный пробег порожняком. Грузы платят $4+ RPM из отдалённых районов. Доминируют флэтбеды.',
  },
  {
    abbr: 'CO', name: 'Colorado', nameRu: 'Колорадо', region: 'West',
    freight: ['Aerospace parts', 'Craft beer & spirits', 'Tech equipment', 'Cattle', 'Ski equipment'],
    freightRu: ['Авиазапчасти', 'Крафтовое пиво', 'Тех. оборудование', 'Скот', 'Горнолыжное снаряжение'],
    rpmLow: 2.10, rpmHigh: 2.85, market: 'warm',
    hubs: ['Denver', 'Colorado Springs', 'Grand Junction', 'Fort Collins', 'Pueblo'],
    noteEn: 'Denver is a strong hub. I-70 through mountains can be risky in winter — always check road conditions.',
    noteRu: 'Денвер — сильный хаб. Трасса I-70 через горы опасна зимой — всегда проверяйте дорожные условия.',
  },
  {
    abbr: 'NM', name: 'New Mexico', nameRu: 'Нью-Мексико', region: 'West',
    freight: ['Oil & gas (Permian Basin)', 'Chili peppers', 'Potash', 'Military equipment', 'Copper'],
    freightRu: ['Нефть и газ (Пермский бассейн)', 'Перец чили', 'Поташ', 'Военное оборудование', 'Медь'],
    rpmLow: 2.35, rpmHigh: 3.25, market: 'neutral',
    hubs: ['Albuquerque', 'Santa Fe', 'Hobbs', 'Roswell', 'Las Cruces'],
    noteEn: 'Oil patch extends from Texas (Permian Basin). High flatbed demand for oilfield equipment.',
    noteRu: 'Нефтяные поля тянутся из Техаса (Пермский бассейн). Высокий спрос на флэтбеды для нефтепромыслового оборудования.',
  },
  {
    abbr: 'AK', name: 'Alaska', nameRu: 'Аляска', region: 'West',
    freight: ['Seafood (salmon, crab)', 'Oil equipment', 'Mining supplies', 'Food & consumer goods'],
    freightRu: ['Морепродукты (лосось, краб)', 'Нефтяное оборудование', 'Горнодобывающие материалы', 'Продукты питания'],
    rpmLow: 3.50, rpmHigh: 6.50, market: 'cold',
    hubs: ['Anchorage', 'Fairbanks', 'Juneau'],
    noteEn: 'Island logistics — primarily sea or air freight. Trucking is mainly within Alaska. Very high rates due to remoteness.',
    noteRu: 'Островная логистика — преимущественно морские или воздушные перевозки. Грузовики в основном внутри Аляски. Очень высокие ставки из-за удалённости.',
  },
  {
    abbr: 'HI', name: 'Hawaii', nameRu: 'Гавайи', region: 'West',
    freight: ['Pineapples', 'Coffee', 'Tourism goods', 'Electronics', 'Military supplies'],
    freightRu: ['Ананасы', 'Кофе', 'Туристические товары', 'Электроника', 'Военные поставки'],
    rpmLow: 4.00, rpmHigh: 7.00, market: 'cold',
    hubs: ['Honolulu', 'Hilo', 'Kahului'],
    noteEn: 'Island state — all freight arrives by sea or air. No interstate trucking. Rates extremely high due to island isolation.',
    noteRu: 'Островной штат — все грузы поступают морем или воздухом. Межштатные грузоперевозки отсутствуют. Ставки крайне высокие из-за изоляции.',
  },
  // ── MIDWEST ─────────────────────────────────────────────────────────────────
  {
    abbr: 'IL', name: 'Illinois', nameRu: 'Иллинойс', region: 'Midwest',
    freight: ['Consumer goods', 'Auto parts', 'Steel', 'Food products', 'Chemicals'],
    freightRu: ['Потребительские товары', 'Автозапчасти', 'Сталь', 'Продукты питания', 'Химикаты'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'hot',
    hubs: ['Chicago', 'Rockford', 'Peoria', 'Springfield', 'Joliet'],
    noteEn: 'Chicago is the #1 freight hub in the US. Crossroads of every major corridor. Expect high competition and tight windows.',
    noteRu: 'Чикаго — хаб грузов №1 в США. Пересечение всех крупных коридоров. Ожидайте высокую конкуренцию и жёсткие временные рамки.',
  },
  {
    abbr: 'IN', name: 'Indiana', nameRu: 'Индиана', region: 'Midwest',
    freight: ['Auto parts (Honda, Toyota, Subaru)', 'Steel', 'Pharmaceuticals', 'Corn & soybeans', 'RVs'],
    freightRu: ['Автозапчасти (Honda, Toyota, Subaru)', 'Сталь', 'Фармацевтика', 'Кукуруза и соя', 'Кемперы (RV)'],
    rpmLow: 1.85, rpmHigh: 2.50, market: 'warm',
    hubs: ['Indianapolis', 'Fort Wayne', 'South Bend', 'Evansville', 'Elkhart'],
    noteEn: 'Elkhart is the RV capital of the world. Indianapolis is a solid distribution hub. Auto freight is dominant.',
    noteRu: 'Элкхарт — мировая столица кемперов. Индианаполис — надёжный дистрибуционный хаб. Автомобильные грузы доминируют.',
  },
  {
    abbr: 'MI', name: 'Michigan', nameRu: 'Мичиган', region: 'Midwest',
    freight: ['Auto parts & vehicles', 'Auto tooling & dies', 'Furniture (western MI)', 'Cereals', 'Chemicals'],
    freightRu: ['Автозапчасти и автомобили', 'Автоинструменты и матрицы', 'Мебель (западный MI)', 'Злаки', 'Химикаты'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Detroit', 'Grand Rapids', 'Lansing', 'Flint', 'Ann Arbor'],
    noteEn: 'Detroit metro is auto country — Ford, GM, Stellantis all here. Very specialized freight. Automotive shutdowns affect market.',
    noteRu: 'Метро Детройта — автомобильная страна — Ford, GM, Stellantis все здесь. Очень специализированные грузы. Остановки заводов влияют на рынок.',
  },
  {
    abbr: 'OH', name: 'Ohio', nameRu: 'Огайо', region: 'Midwest',
    freight: ['Steel & metal', 'Auto parts (Honda, Jeep)', 'Rubber & plastics', 'Agricultural equipment', 'Chemicals'],
    freightRu: ['Сталь и металл', 'Автозапчасти (Honda, Jeep)', 'Резина и пластмассы', 'Сельхозтехника', 'Химикаты'],
    rpmLow: 1.90, rpmHigh: 2.55, market: 'warm',
    hubs: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Dayton'],
    noteEn: 'Ohio is a major manufacturing corridor. Columbus is one of the fastest-growing distribution hubs in the Midwest.',
    noteRu: 'Огайо — крупный производственный коридор. Колумбус — один из быстрорастущих дистрибуционных хабов на Среднем Западе.',
  },
  {
    abbr: 'WI', name: 'Wisconsin', nameRu: 'Висконсин', region: 'Midwest',
    freight: ['Dairy (cheese, milk)', 'Paper & printing', 'Machinery', 'Cranberries', 'Medical equipment'],
    freightRu: ['Молочные продукты (сыр, молоко)', 'Бумага и печать', 'Машины и оборудование', 'Клюква', 'Медицинское оборудование'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Milwaukee', 'Green Bay', 'Madison', 'Racine', 'Kenosha'],
    noteEn: 'Dairy capital of the US. Reefer freight is king here. Green Bay corridor connects to Chicago easily.',
    noteRu: 'Молочная столица США. Рефрижераторные грузы здесь в приоритете. Коридор Грин-Бэй легко соединяется с Чикаго.',
  },
  {
    abbr: 'MN', name: 'Minnesota', nameRu: 'Миннесота', region: 'Midwest',
    freight: ['Medical devices (Medtronic)', 'Food processing (General Mills, Cargill)', 'Machinery', 'Dairy', 'Grain'],
    freightRu: ['Медицинские устройства (Medtronic)', 'Переработка продуктов (General Mills, Cargill)', 'Машины', 'Молочные', 'Зерно'],
    rpmLow: 2.05, rpmHigh: 2.75, market: 'warm',
    hubs: ['Minneapolis', 'St. Paul', 'Duluth', 'Rochester', 'Bloomington'],
    noteEn: 'Minneapolis-St. Paul is a solid outbound market. Medical device freight requires special handling — higher rates.',
    noteRu: 'Миннеаполис-Сент-Пол — стабильный рынок отправки. Медицинские устройства требуют особого обращения — выше ставки.',
  },
  {
    abbr: 'IA', name: 'Iowa', nameRu: 'Айова', region: 'Midwest',
    freight: ['Pork & pork products', 'Corn', 'Soybeans', 'Agricultural equipment', 'Ethanol'],
    freightRu: ['Свинина и продукты из неё', 'Кукуруза', 'Соя', 'Сельхозтехника', 'Этанол'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'warm',
    hubs: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
    noteEn: 'Heavy agricultural state. Harvest season (Sept–Nov) dramatically increases load availability and rates.',
    noteRu: 'Преимущественно сельскохозяйственный штат. Сезон уборки урожая (сент–нояб) резко увеличивает количество грузов и ставки.',
  },
  {
    abbr: 'MO', name: 'Missouri', nameRu: 'Миссури', region: 'Midwest',
    freight: ['Auto assembly (Ford, GM)', 'Agricultural products', 'Chemicals', 'Beer (Anheuser-Busch)', 'Aerospace'],
    freightRu: ['Автосборка (Ford, GM)', 'Сельхозпродукция', 'Химикаты', 'Пиво (Anheuser-Busch)', 'Аэрокосмос'],
    rpmLow: 1.90, rpmHigh: 2.55, market: 'warm',
    hubs: ['St. Louis', 'Kansas City', 'Springfield', 'Columbia', 'Independence'],
    noteEn: 'St. Louis and Kansas City are both major crossroads hubs. Good inbound from all directions.',
    noteRu: 'Сент-Луис и Канзас-Сити — оба крупных перекрёстных хаба. Хорошие входящие потоки со всех направлений.',
  },
  {
    abbr: 'ND', name: 'North Dakota', nameRu: 'Северная Дакота', region: 'Midwest',
    freight: ['Oil (Bakken shale)', 'Wheat', 'Sunflowers', 'Sugar beets', 'Oilfield equipment'],
    freightRu: ['Нефть (сланец Баккен)', 'Пшеница', 'Подсолнечник', 'Сахарная свёкла', 'Нефтепромысловое оборудование'],
    rpmLow: 2.55, rpmHigh: 3.80, market: 'cold',
    hubs: ['Fargo', 'Bismarck', 'Minot', 'Grand Forks', 'Williston'],
    noteEn: 'Oil boom area around Williston. Extremely remote — budget for high deadhead when picking up loads here.',
    noteRu: 'Нефтяной бум в районе Уиллистона. Крайне отдалённый — закладывайте высокий пробег порожняком при работе отсюда.',
  },
  {
    abbr: 'SD', name: 'South Dakota', nameRu: 'Южная Дакота', region: 'Midwest',
    freight: ['Corn', 'Soybeans', 'Cattle', 'Pork (Smithfield, Tyson)', 'Tourism goods'],
    freightRu: ['Кукуруза', 'Соя', 'Скот', 'Свинина (Smithfield, Tyson)', 'Туристические товары'],
    rpmLow: 2.25, rpmHigh: 3.25, market: 'cold',
    hubs: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Watertown'],
    noteEn: 'Sioux Falls is a meat packing hub. High rates due to remoteness. Good reefer market in harvest season.',
    noteRu: 'Су-Фолс — хаб мясоперерабатывающей промышленности. Высокие ставки из-за удалённости. Хороший рефрижераторный рынок в сезон уборки.',
  },
  {
    abbr: 'NE', name: 'Nebraska', nameRu: 'Небраска', region: 'Midwest',
    freight: ['Corn', 'Soybeans', 'Beef & pork (Tyson, JBS, Cargill)', 'Ethanol', 'Agricultural equipment'],
    freightRu: ['Кукуруза', 'Соя', 'Говядина и свинина (Tyson, JBS, Cargill)', 'Этанол', 'Сельхозтехника'],
    rpmLow: 1.90, rpmHigh: 2.65, market: 'neutral',
    hubs: ['Omaha', 'Lincoln', 'Grand Island', 'Kearney', 'Fremont'],
    noteEn: 'Omaha is a major meat processing center. Strong reefer demand year-round for cold chain products.',
    noteRu: 'Омаха — крупный центр мясопереработки. Сильный круглогодичный спрос на рефрижераторы для холодовой цепи.',
  },
  {
    abbr: 'KS', name: 'Kansas', nameRu: 'Канзас', region: 'Midwest',
    freight: ['Wheat', 'Cattle & beef', 'Aviation parts (Cessna, Spirit AeroSystems)', 'Sunflowers', 'Ethanol'],
    freightRu: ['Пшеница', 'Скот и говядина', 'Авиазапчасти (Cessna, Spirit AeroSystems)', 'Подсолнечник', 'Этанол'],
    rpmLow: 1.90, rpmHigh: 2.65, market: 'neutral',
    hubs: ['Wichita', 'Kansas City (KS)', 'Topeka', 'Overland Park', 'Dodge City'],
    noteEn: 'Wichita is the aviation capital. Flatbed demand for oversized aerospace components is very specialized and pays premium.',
    noteRu: 'Уичита — авиационная столица. Спрос на флэтбед для крупногабаритных авиационных компонентов — высокоспециализированный и хорошо оплачиваемый.',
  },
  // ── SOUTH ────────────────────────────────────────────────────────────────────
  {
    abbr: 'TX', name: 'Texas', nameRu: 'Техас', region: 'South',
    freight: ['Oil & gas', 'Petrochemicals', 'Electronics (Samsung, Tesla)', 'Auto parts', 'Food & beverages'],
    freightRu: ['Нефть и газ', 'Нефтехимия', 'Электроника (Samsung, Tesla)', 'Автозапчасти', 'Продукты питания'],
    rpmLow: 1.90, rpmHigh: 2.70, market: 'hot',
    hubs: ['Dallas', 'Houston', 'San Antonio', 'Austin', 'El Paso', 'Fort Worth', 'Laredo'],
    noteEn: 'Largest state freight market after California. Laredo is the #1 US-Mexico border crossing. Enormous variety of freight.',
    noteRu: 'Крупнейший рынок грузов после Калифорнии. Ларедо — переход №1 на границе США-Мексика. Огромное разнообразие грузов.',
  },
  {
    abbr: 'FL', name: 'Florida', nameRu: 'Флорида', region: 'South',
    freight: ['Fresh produce (citrus, tomatoes)', 'Seafood', 'Construction materials', 'Tourism goods', 'Pharmaceuticals'],
    freightRu: ['Свежие продукты (цитрус, томаты)', 'Морепродукты', 'Стройматериалы', 'Туристические товары', 'Фармацевтика'],
    rpmLow: 2.20, rpmHigh: 2.95, market: 'hot',
    hubs: ['Miami', 'Tampa', 'Jacksonville', 'Orlando', 'Fort Lauderdale'],
    noteEn: 'Peninsula state — tough backhaul situation. Lots of inbound freight but limited outbound. Negotiate hard for outbound loads.',
    noteRu: 'Полуостровной штат — сложная ситуация с обратной загрузкой. Много входящих грузов, мало исходящих. Жёстко торгуйтесь за исходящие.',
  },
  {
    abbr: 'GA', name: 'Georgia', nameRu: 'Джорджия', region: 'South',
    freight: ['Distribution hub goods', 'Poultry (Tyson, Pilgrim\'s)', 'Peanuts', 'Automotive (Kia, Mercedes)', 'Carpet & flooring'],
    freightRu: ['Товары дистрибуционного хаба', 'Птица (Tyson, Pilgrim\'s)', 'Арахис', 'Автомобили (Kia, Mercedes)', 'Ковры и напольные покрытия'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'hot',
    hubs: ['Atlanta', 'Savannah', 'Columbus', 'Augusta', 'Macon'],
    noteEn: 'Atlanta is the logistics gateway to the Southeast. Savannah port is the fastest-growing port in the US — massive import volumes.',
    noteRu: 'Атланта — логистические ворота на Юго-восток. Порт Саванны — самый быстрорастущий порт в США — огромные объёмы импорта.',
  },
  {
    abbr: 'NC', name: 'North Carolina', nameRu: 'Северная Каролина', region: 'South',
    freight: ['Furniture (High Point)', 'Pharmaceuticals (Pfizer, Novo Nordisk)', 'Textiles', 'Poultry', 'Sweet potatoes'],
    freightRu: ['Мебель (Хай-Пойнт)', 'Фармацевтика (Pfizer, Novo Nordisk)', 'Текстиль', 'Птица', 'Сладкий картофель'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Charlotte', 'Greensboro', 'Raleigh', 'Durham', 'High Point', 'Wilmington'],
    noteEn: 'High Point furniture market (twice yearly) spikes flatbed demand. Charlotte is a growing logistics hub with good rates.',
    noteRu: 'Рынок мебели в Хай-Пойнте (дважды в год) резко увеличивает спрос на флэтбеды. Шарлотт — растущий логистический хаб с хорошими ставками.',
  },
  {
    abbr: 'SC', name: 'South Carolina', nameRu: 'Южная Каролина', region: 'South',
    freight: ['Auto parts (BMW Spartanburg)', 'Tires (Michelin)', 'Textiles', 'Port freight (Charleston)', 'Chemicals'],
    freightRu: ['Автозапчасти (BMW Спартанберг)', 'Шины (Michelin)', 'Текстиль', 'Портовые грузы (Чарлстон)', 'Химикаты'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Columbia', 'Greenville', 'Spartanburg', 'Charleston', 'Myrtle Beach'],
    noteEn: 'BMW\'s largest US plant is in Spartanburg. Charleston port is a major import/export hub for the Southeast.',
    noteRu: 'Крупнейший завод BMW в США находится в Спартанберге. Порт Чарлстона — крупный импортно-экспортный хаб на Юго-востоке.',
  },
  {
    abbr: 'VA', name: 'Virginia', nameRu: 'Вирджиния', region: 'South',
    freight: ['Government & military goods', 'Data center equipment', 'Tobacco', 'Seafood', 'Coal'],
    freightRu: ['Государственные и военные товары', 'Оборудование для дата-центров', 'Табак', 'Морепродукты', 'Уголь'],
    rpmLow: 2.00, rpmHigh: 2.70, market: 'warm',
    hubs: ['Richmond', 'Norfolk', 'Virginia Beach', 'Arlington', 'Roanoke'],
    noteEn: 'Northern Virginia is the data center capital of the world (Amazon Web Services, Microsoft). High-value, specialized freight.',
    noteRu: 'Северная Вирджиния — мировая столица дата-центров (Amazon Web Services, Microsoft). Высокоценные специализированные грузы.',
  },
  {
    abbr: 'TN', name: 'Tennessee', nameRu: 'Теннесси', region: 'South',
    freight: ['Auto parts (VW, GM, Nissan)', 'Logistics hub goods (FedEx Memphis)', 'Healthcare equipment', 'Whiskey', 'Food'],
    freightRu: ['Автозапчасти (VW, GM, Nissan)', 'Логистика хаба (FedEx Мемфис)', 'Медоборудование', 'Виски', 'Продукты'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'hot',
    hubs: ['Memphis', 'Nashville', 'Knoxville', 'Chattanooga', 'Clarksville'],
    noteEn: 'Memphis is the air cargo capital of the world (FedEx global hub). Nashville is booming. Excellent crossroads location.',
    noteRu: 'Мемфис — мировая столица авиагрузов (глобальный хаб FedEx). Нэшвилл бурно растёт. Отличное перекрёстное расположение.',
  },
  {
    abbr: 'AL', name: 'Alabama', nameRu: 'Алабама', region: 'South',
    freight: ['Auto parts (Mercedes, Honda, Toyota, Mazda)', 'Steel (US Steel, Nucor)', 'Chemicals', 'Aerospace (Boeing)', 'Timber'],
    freightRu: ['Автозапчасти (Mercedes, Honda, Toyota, Mazda)', 'Сталь (US Steel, Nucor)', 'Химикаты', 'Аэрокосмос (Boeing)', 'Лес'],
    rpmLow: 2.00, rpmHigh: 2.65, market: 'warm',
    hubs: ['Birmingham', 'Huntsville', 'Mobile', 'Montgomery', 'Tuscaloosa'],
    noteEn: 'Huntsville is a growing aerospace and defense hub. Birmingham is a major steel corridor. Good outbound market.',
    noteRu: 'Хантсвилл — растущий аэрокосмический и оборонный хаб. Бирмингем — крупный стальной коридор. Хороший рынок исходящих.',
  },
  {
    abbr: 'MS', name: 'Mississippi', nameRu: 'Миссисипи', region: 'South',
    freight: ['Poultry (Sanderson Farms)', 'Catfish', 'Chemicals', 'Timber', 'Auto parts (Nissan)'],
    freightRu: ['Птица (Sanderson Farms)', 'Сом', 'Химикаты', 'Лес', 'Автозапчасти (Nissan)'],
    rpmLow: 2.20, rpmHigh: 2.90, market: 'neutral',
    hubs: ['Jackson', 'Gulfport', 'Biloxi', 'Tupelo', 'Hattiesburg'],
    noteEn: 'Limited outbound freight — backhaul is a challenge. Reefer loads for poultry are consistent year-round.',
    noteRu: 'Ограниченные исходящие грузы — обратная загрузка является проблемой. Рефрижераторные грузы для птицы стабильны круглый год.',
  },
  {
    abbr: 'LA', name: 'Louisiana', nameRu: 'Луизиана', region: 'South',
    freight: ['Petrochemicals', 'Seafood (crawfish, shrimp)', 'Grain (Port of New Orleans)', 'Sugar', 'LNG equipment'],
    freightRu: ['Нефтехимия', 'Морепродукты (раки, креветки)', 'Зерно (порт Нового Орлеана)', 'Сахар', 'Оборудование для СПГ'],
    rpmLow: 2.15, rpmHigh: 2.85, market: 'warm',
    hubs: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
    noteEn: 'New Orleans port handles massive grain export volumes. Lake Charles is a major LNG and petrochemical hub.',
    noteRu: 'Порт Нового Орлеана обрабатывает огромные объёмы экспорта зерна. Лейк-Чарлз — крупный хаб СПГ и нефтехимии.',
  },
  {
    abbr: 'AR', name: 'Arkansas', nameRu: 'Арканзас', region: 'South',
    freight: ['Retail goods (Walmart HQ Bentonville)', 'Poultry (Tyson Foods HQ)', 'Rice', 'Timber', 'Steel'],
    freightRu: ['Розничные товары (штаб-квартира Walmart в Бентонвилле)', 'Птица (штаб-квартира Tyson Foods)', 'Рис', 'Лес', 'Сталь'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'warm',
    hubs: ['Little Rock', 'Fort Smith', 'Bentonville', 'Fayetteville', 'Jonesboro'],
    noteEn: 'Walmart HQ creates constant retail supply chain freight. Tyson Foods HQ means heavy poultry reefer loads.',
    noteRu: 'Штаб-квартира Walmart создаёт постоянный поток грузов розничной цепочки поставок. HQ Tyson Foods — тяжёлые рефрижераторные грузы с птицей.',
  },
  {
    abbr: 'OK', name: 'Oklahoma', nameRu: 'Оклахома', region: 'South',
    freight: ['Oil & gas', 'Cattle', 'Wheat', 'Aviation parts (Spirit AeroSystems)', 'Wind turbine components'],
    freightRu: ['Нефть и газ', 'Скот', 'Пшеница', 'Авиазапчасти (Spirit AeroSystems)', 'Компоненты ветровых турбин'],
    rpmLow: 2.00, rpmHigh: 2.75, market: 'neutral',
    hubs: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'],
    noteEn: 'Oklahoma is traversed by major east-west corridors (I-40). Good transit rates. Oil patch drives flatbed demand.',
    noteRu: 'Оклахому пересекают крупные широтные коридоры (I-40). Хорошие транзитные ставки. Нефтяной промысел стимулирует спрос на флэтбеды.',
  },
  {
    abbr: 'KY', name: 'Kentucky', nameRu: 'Кентукки', region: 'South',
    freight: ['Auto parts (Toyota, Ford, BMW)', 'Bourbon & spirits', 'Distribution (UPS World Hub Louisville)', 'Coal', 'Horses'],
    freightRu: ['Автозапчасти (Toyota, Ford, BMW)', 'Бурбон и спиртное', 'Дистрибуция (мировой хаб UPS в Луисвилле)', 'Уголь', 'Лошади'],
    rpmLow: 1.90, rpmHigh: 2.60, market: 'hot',
    hubs: ['Louisville', 'Lexington', 'Bowling Green', 'Covington', 'Elizabethtown'],
    noteEn: 'Louisville is home to the UPS World Hub — busiest package hub on Earth. Toyota largest US plant is in Georgetown, KY.',
    noteRu: 'Луисвилл — мировой хаб UPS — крупнейший посылочный хаб на Земле. Крупнейший завод Toyota в США находится в Джорджтауне, KY.',
  },
  {
    abbr: 'WV', name: 'West Virginia', nameRu: 'Западная Вирджиния', region: 'South',
    freight: ['Coal', 'Chemicals (Bayer, DuPont)', 'Natural gas', 'Steel', 'Timber'],
    freightRu: ['Уголь', 'Химикаты (Bayer, DuPont)', 'Природный газ', 'Сталь', 'Лес'],
    rpmLow: 2.45, rpmHigh: 3.30, market: 'cold',
    hubs: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
    noteEn: 'Mountainous terrain makes it challenging. Limited inbound freight. Rates are elevated due to limited access.',
    noteRu: 'Горный рельеф создаёт трудности. Ограниченные входящие грузы. Ставки повышены из-за ограниченного доступа.',
  },
  {
    abbr: 'MD', name: 'Maryland', nameRu: 'Мэриленд', region: 'South',
    freight: ['Biotech & pharma', 'Seafood (crabs, oysters)', 'Government goods', 'Construction materials', 'Food'],
    freightRu: ['Биотех и фармацевтика', 'Морепродукты (крабы, устрицы)', 'Государственные товары', 'Стройматериалы', 'Продукты питания'],
    rpmLow: 2.15, rpmHigh: 2.85, market: 'warm',
    hubs: ['Baltimore', 'Rockville', 'Gaithersburg', 'Frederick', 'Annapolis'],
    noteEn: 'Baltimore port is a major auto import hub (largest in US for vehicles). Strong biotech corridor between Baltimore and DC.',
    noteRu: 'Порт Балтимора — крупный хаб импорта автомобилей (крупнейший в США для ТС). Сильный коридор биотеха между Балтимором и Вашингтоном.',
  },
  {
    abbr: 'DE', name: 'Delaware', nameRu: 'Делавэр', region: 'South',
    freight: ['Chemicals (DuPont heritage)', 'Pharmaceuticals', 'Financial goods', 'Food processing', 'Auto parts'],
    freightRu: ['Химикаты (наследие DuPont)', 'Фармацевтика', 'Финансовые товары', 'Переработка продуктов', 'Автозапчасти'],
    rpmLow: 2.20, rpmHigh: 2.95, market: 'neutral',
    hubs: ['Wilmington', 'Dover', 'Newark', 'Middletown'],
    noteEn: 'Smallest state — most freight is pass-through. Wilmington port handles chemical tankers. Good proximity to I-95 corridor.',
    noteRu: 'Самый маленький штат — большинство грузов транзитные. Порт Уилмингтона обслуживает химические танкеры. Близость к коридору I-95.',
  },
  // ── NORTHEAST ────────────────────────────────────────────────────────────────
  {
    abbr: 'NY', name: 'New York', nameRu: 'Нью-Йорк', region: 'Northeast',
    freight: ['Consumer goods', 'Fashion & apparel', 'Food & perishables', 'Electronics', 'Construction materials'],
    freightRu: ['Потребительские товары', 'Мода и одежда', 'Продовольствие и скоропортящиеся', 'Электроника', 'Стройматериалы'],
    rpmLow: 2.35, rpmHigh: 3.15, market: 'hot',
    hubs: ['New York City', 'Buffalo', 'Albany', 'Rochester', 'Syracuse'],
    noteEn: 'NYC is one of the toughest delivery markets — congestion, permits, restricted hours. Very high rates. Patience required.',
    noteRu: 'Нью-Йорк — один из сложнейших рынков доставки — пробки, разрешения, ограниченные часы. Очень высокие ставки. Нужно терпение.',
  },
  {
    abbr: 'PA', name: 'Pennsylvania', nameRu: 'Пенсильвания', region: 'Northeast',
    freight: ['Steel & metal products', 'Food & beverages', 'Pharmaceuticals', 'Chemicals', 'Consumer goods'],
    freightRu: ['Сталь и металлоизделия', 'Продукты питания', 'Фармацевтика', 'Химикаты', 'Потребительские товары'],
    rpmLow: 2.00, rpmHigh: 2.70, market: 'warm',
    hubs: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Scranton'],
    noteEn: 'Philadelphia and Pittsburgh are major hubs. Pennsylvania Turnpike (I-76) is a key east-west corridor. High volume, consistent rates.',
    noteRu: 'Филадельфия и Питтсбург — крупные хабы. Turnpike Пенсильвании (I-76) — ключевой широтный коридор. Высокий объём, стабильные ставки.',
  },
  {
    abbr: 'NJ', name: 'New Jersey', nameRu: 'Нью-Джерси', region: 'Northeast',
    freight: ['Pharmaceuticals (J&J, Merck, Pfizer)', 'Chemicals', 'Distribution hub goods', 'Electronics', 'Food'],
    freightRu: ['Фармацевтика (J&J, Merck, Pfizer)', 'Химикаты', 'Товары дистрибуционного хаба', 'Электроника', 'Продукты'],
    rpmLow: 2.25, rpmHigh: 3.05, market: 'hot',
    hubs: ['Newark', 'Trenton', 'Camden', 'Elizabeth', 'Jersey City'],
    noteEn: 'Port Newark is one of the busiest on the East Coast. Pharma corridor (NJ "Medicine Chest of the World") pays premium.',
    noteRu: 'Порт Ньюарка — один из самых оживлённых на Восточном побережье. Фармацевтический коридор (NJ — "аптека мира") хорошо платит.',
  },
  {
    abbr: 'CT', name: 'Connecticut', nameRu: 'Коннектикут', region: 'Northeast',
    freight: ['Aerospace parts (Pratt & Whitney)', 'Firearms (Colt, Winchester)', 'Pharmaceuticals', 'Financial services goods', 'Defense electronics'],
    freightRu: ['Авиазапчасти (Pratt & Whitney)', 'Огнестрельное оружие (Colt, Winchester)', 'Фармацевтика', 'Финансовые товары', 'Оборонная электроника'],
    rpmLow: 2.35, rpmHigh: 3.05, market: 'warm',
    hubs: ['Bridgeport', 'Hartford', 'New Haven', 'Stamford', 'Waterbury'],
    noteEn: 'Small but high-value freight market. Premium aerospace and defense freight. Strong connections to Boston and New York.',
    noteRu: 'Небольшой, но высокоценный рынок грузов. Аэрокосмические и оборонные грузы премиум-класса. Хорошая связь с Бостоном и Нью-Йорком.',
  },
  {
    abbr: 'MA', name: 'Massachusetts', nameRu: 'Массачусетс', region: 'Northeast',
    freight: ['Biotech & life sciences', 'Electronics', 'Seafood (lobster)', 'Defense equipment (Raytheon)', 'Medical devices'],
    freightRu: ['Биотех и науки о жизни', 'Электроника', 'Морепродукты (лобстер)', 'Оборонное оборудование (Raytheon)', 'Медицинские устройства'],
    rpmLow: 2.35, rpmHigh: 3.25, market: 'hot',
    hubs: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge'],
    noteEn: 'Boston is a peninsula — limited truck access, but high demand and rates. Biotech corridor (Cambridge) is high-value freight.',
    noteRu: 'Бостон — полуостров с ограниченным доступом для грузовиков, но высоким спросом и ставками. Биотех-коридор (Кембридж) — высокоценные грузы.',
  },
  {
    abbr: 'NH', name: 'New Hampshire', nameRu: 'Нью-Гэмпшир', region: 'Northeast',
    freight: ['Electronics (BAE Systems)', 'Granite', 'Lumber', 'Tourism & ski goods', 'Retail (no sales tax)'],
    freightRu: ['Электроника (BAE Systems)', 'Гранит', 'Пиломатериалы', 'Туристика и горные лыжи', 'Розница (без налога с продаж)'],
    rpmLow: 2.45, rpmHigh: 3.25, market: 'neutral',
    hubs: ['Manchester', 'Concord', 'Nashua', 'Portsmouth'],
    noteEn: 'Small state, high per-mile rates due to remoteness. No sales tax drives retail traffic. Seasonal ski freight peaks Dec–Mar.',
    noteRu: 'Небольшой штат, высокие ставки за милю из-за удалённости. Отсутствие налога с продаж стимулирует розничный трафик. Сезонный пик горных лыж — декабрь–март.',
  },
  {
    abbr: 'VT', name: 'Vermont', nameRu: 'Вермонт', region: 'Northeast',
    freight: ['Dairy (Ben & Jerry\'s, Cabot)', 'Granite & marble', 'Maple syrup', 'Craft beer', 'Lumber'],
    freightRu: ['Молочные продукты (Ben & Jerry\'s, Cabot)', 'Гранит и мрамор', 'Кленовый сироп', 'Крафтовое пиво', 'Пиломатериалы'],
    rpmLow: 2.65, rpmHigh: 3.55, market: 'cold',
    hubs: ['Burlington', 'Montpelier', 'Brattleboro', 'Rutland'],
    noteEn: 'Very rural and remote. Very high rates to compensate for deadhead. Seasonal maple syrup surge (Feb–Apr). Winter chains required.',
    noteRu: 'Очень сельский и отдалённый. Очень высокие ставки для компенсации порожних миль. Сезонный пик кленового сиропа (февр–апр). Зимой нужны цепи.',
  },
  {
    abbr: 'ME', name: 'Maine', nameRu: 'Мэн', region: 'Northeast',
    freight: ['Seafood (lobster, scallops)', 'Lumber & paper', 'Potatoes', 'Tourism goods', 'Blueberries'],
    freightRu: ['Морепродукты (лобстер, гребешок)', 'Лес и бумага', 'Картофель', 'Туристические товары', 'Черника'],
    rpmLow: 2.65, rpmHigh: 3.85, market: 'cold',
    hubs: ['Portland', 'Bangor', 'Augusta', 'Lewiston', 'Presque Isle'],
    noteEn: 'Dead end state — very high rates but limited return freight. Lobster season (July–Aug) creates reefer demand spikes.',
    noteRu: 'Тупиковый штат — очень высокие ставки, но мало обратной загрузки. Сезон лобстера (июль–авг) создаёт скачки спроса на рефрижераторы.',
  },
  {
    abbr: 'RI', name: 'Rhode Island', nameRu: 'Род-Айленд', region: 'Northeast',
    freight: ['Jewelry & fine goods', 'Textiles', 'Medical devices', 'Defense electronics (General Dynamics)', 'Food'],
    freightRu: ['Ювелирные изделия', 'Текстиль', 'Медицинские устройства', 'Оборонная электроника (General Dynamics)', 'Продукты питания'],
    rpmLow: 2.45, rpmHigh: 3.25, market: 'neutral',
    hubs: ['Providence', 'Woonsocket', 'Pawtucket', 'Cranston'],
    noteEn: 'Smallest state by area. Mainly pass-through traffic. High-value specialty freight commands premium rates.',
    noteRu: 'Наименьший штат по площади. В основном транзитный трафик. Высокоценные специализированные грузы — премиальные ставки.',
  },
];

/* ── Constants ─────────────────────────────────────────────────────────────── */
const MARKET_CFG = {
  hot:     { en: 'Hot Market',     ru: 'Горячий рынок',   cardEn: 'Hot',     cardRu: 'Горячий',  color: 'bg-red-100 text-red-700 border-red-200',      dot: 'bg-red-500'    },
  warm:    { en: 'Warm Market',    ru: 'Тёплый рынок',    cardEn: 'Warm',    cardRu: 'Тёплый',   color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400'  },
  neutral: { en: 'Neutral Market', ru: 'Нейтральный',     cardEn: 'Neutral', cardRu: 'Нейтр.',   color: 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-[rgba(255,255,255,0.08)]',    dot: 'bg-gray-400'   },
  cold:    { en: 'Cold Market',    ru: 'Холодный рынок',  cardEn: 'Cold',    cardRu: 'Холодный', color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-500'   },
};

const REGION_CFG: Record<Region, { emoji: string; en: string; ru: string }> = {
  West:      { emoji: '🌵', en: 'West',      ru: 'Запад'          },
  Midwest:   { emoji: '🌾', en: 'Midwest',   ru: 'Средний Запад'  },
  South:     { emoji: '🌴', en: 'South',     ru: 'Юг'             },
  Northeast: { emoji: '🏙️', en: 'Northeast', ru: 'Северо-восток'  },
};

const REGIONS: Region[] = ['West', 'Midwest', 'South', 'Northeast'];

/* ── Component ─────────────────────────────────────────────────────────────── */
export function StateFreightDictionary() {
  const { lang } = useLang();
  const ru = lang === 'ru';

  const [search, setSearch]         = useState('');
  const [region, setRegion]         = useState<Region | 'All'>('All');
  const [market, setMarket]         = useState<Market | 'All'>('All');
  const [selected, setSelected]     = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATES.filter(s => {
      if (region !== 'All' && s.region !== region) return false;
      if (market !== 'All' && s.market !== market) return false;
      if (q) {
        const name = ru ? s.nameRu : s.name;
        const freightStr = (ru ? s.freightRu : s.freight).join(' ').toLowerCase();
        return (
          name.toLowerCase().includes(q) ||
          s.abbr.toLowerCase().includes(q) ||
          freightStr.includes(q)
        );
      }
      return true;
    });
  }, [search, region, market, ru]);

  const selectedState = STATES.find(s => s.abbr === selected);

  return (
    <div className="mt-8 mb-4 rounded-2xl border border-gray-100 dark:border-[rgba(255,255,255,0.06)] bg-white dark:bg-[#2c2c2e] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🗺️</span>
          <h3 className="text-white font-bold text-lg">
            {ru ? 'Словарь грузов по штатам США' : 'US State Freight Dictionary'}
          </h3>
        </div>
        <p className="text-slate-300 text-sm">
          {ru
            ? 'Актуальные данные рынка 2026 — какие грузы есть в каждом штате и по каким ценам'
            : '2026 market data — what freight is in each state and at what rates'}
        </p>
      </div>

      {/* Filters */}
      <div className="px-4 py-4 lg:px-6 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#636366] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={ru ? 'Поиск по штату или грузу...' : 'Search state or freight...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-gray-50 dark:bg-[#1c1c1e] text-gray-800 dark:text-[#f5f5f7] placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:hover:text-[#f5f5f7] text-xs">✕</button>
          )}
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRegion('All')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              region === 'All' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-slate-400'
            )}
          >
            {ru ? '🌎 Все регионы' : '🌎 All Regions'}
          </button>
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                region === r ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-slate-400'
              )}
            >
              {REGION_CFG[r].emoji} {ru ? REGION_CFG[r].ru : REGION_CFG[r].en}
            </button>
          ))}
        </div>

        {/* Market filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMarket('All')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              market === 'All' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-slate-400'
            )}
          >
            {ru ? 'Все рынки' : 'All Markets'}
          </button>
          {(['hot', 'warm', 'neutral', 'cold'] as Market[]).map(m => (
            <button
              key={m}
              onClick={() => setMarket(m)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                market === m ? MARKET_CFG[m].color + ' font-bold' : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-[rgba(255,255,255,0.08)] hover:border-gray-400 dark:hover:border-[#636366]'
              )}
            >
              <span className={cn('inline-block w-2 h-2 rounded-full mr-1.5', MARKET_CFG[m].dot)} />
              {ru ? MARKET_CFG[m].ru : MARKET_CFG[m].en}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 dark:text-[#636366]">
          {ru ? `Найдено штатов: ${filtered.length}` : `States found: ${filtered.length}`}
        </p>
      </div>

      {/* Detail panel */}
      {selectedState && (
        <div className="mx-4 my-4 lg:mx-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 lg:p-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-3xl font-black text-slate-800">{selectedState.abbr}</span>
                <h4 className="text-xl font-bold text-slate-700">
                  {ru ? selectedState.nameRu : selectedState.name}
                </h4>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', MARKET_CFG[selectedState.market].color)}>
                  <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1', MARKET_CFG[selectedState.market].dot)} />
                  {ru ? MARKET_CFG[selectedState.market].ru : MARKET_CFG[selectedState.market].en}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {REGION_CFG[selectedState.region].emoji} {ru ? REGION_CFG[selectedState.region].ru : REGION_CFG[selectedState.region].en}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 dark:text-[#636366] hover:text-gray-700 dark:hover:text-[#f5f5f7] text-xl font-bold shrink-0"
            >✕</button>
          </div>

          {/* RPM highlight */}
          <div className="bg-white dark:bg-[#2c2c2e] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.08)] px-4 py-3 mb-4 flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mb-0.5">{ru ? 'Диапазон RPM (2026)' : 'RPM Range (2026)'}</p>
              <p className="text-2xl font-black text-slate-800">
                ${selectedState.rpmLow.toFixed(2)} – ${selectedState.rpmHigh.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 dark:text-[#a1a1a6] ml-1">/mi</span>
              </p>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-[#3a3a3c]" />
            <div>
              <p className="text-xs text-gray-500 dark:text-[#a1a1a6] mb-0.5">{ru ? 'Средний RPM' : 'Avg RPM'}</p>
              <p className="text-2xl font-black text-slate-600">
                ${((selectedState.rpmLow + selectedState.rpmHigh) / 2).toFixed(2)}
                <span className="text-sm font-normal text-gray-500 dark:text-[#a1a1a6] ml-1">/mi</span>
              </p>
            </div>
          </div>

          {/* Freight types */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wider mb-2">
              {ru ? 'Основные грузы' : 'Main Freight Types'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(ru ? selectedState.freightRu : selectedState.freight).map((f, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[rgba(255,255,255,0.08)] text-xs text-gray-700 dark:text-[#a1a1a6] font-medium">
                  📦 {f}
                </span>
              ))}
            </div>
          </div>

          {/* Hubs */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-[#a1a1a6] uppercase tracking-wider mb-2">
              {ru ? 'Ключевые города' : 'Key Freight Hubs'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedState.hubs.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-700">
                  📍 {h}
                </span>
              ))}
            </div>
          </div>

          {/* Dispatcher note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">
              💡 {ru ? 'Совет диспетчера' : 'Dispatcher Note'}
            </p>
            <p className="text-sm text-amber-900">
              {ru ? selectedState.noteRu : selectedState.noteEn}
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="px-4 pb-4 lg:px-6 lg:pb-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-[#636366]">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">{ru ? 'Ничего не найдено' : 'Nothing found'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mt-4">
            {filtered.map(s => {
              const isSelected = selected === s.abbr;
              const mc = MARKET_CFG[s.market];
              return (
                <button
                  key={s.abbr}
                  onClick={() => setSelected(isSelected ? null : s.abbr)}
                  className={cn(
                    'text-left rounded-xl border p-3 transition-all hover:shadow-md active:scale-95',
                    isSelected
                      ? 'border-slate-500 bg-slate-50 shadow-md ring-2 ring-slate-300'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e] hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg font-black text-slate-800">{s.abbr}</span>
                    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border', mc.color)}>
                      <span className={cn('w-1.5 h-1.5 shrink-0 rounded-full', mc.dot)} />
                      {ru ? mc.cardRu : mc.cardEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-[#a1a1a6] font-medium leading-tight mb-2">
                    {ru ? s.nameRu : s.name}
                  </p>
                  <p className="text-[11px] font-bold text-slate-700">
                    ${s.rpmLow.toFixed(2)}–${s.rpmHigh.toFixed(2)}/mi
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-[#636366] mt-1 leading-tight truncate">
                    {(ru ? s.freightRu : s.freight)[0]}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-[rgba(255,255,255,0.06)] px-4 py-3 lg:px-6 bg-gray-50 dark:bg-[#1c1c1e]">
        <p className="text-xs text-gray-400 dark:text-[#636366] text-center">
          {ru
            ? '📊 Данные по ставкам актуальны для рынка грузовых перевозок США 2026 года. RPM = rate per mile (ставка за милю). Реальные ставки могут варьироваться в зависимости от сезона и спроса.'
            : '📊 Rate data reflects the 2026 US trucking market. RPM = rate per mile. Actual rates vary by season and demand.'}
        </p>
      </div>
    </div>
  );
}
