'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n/lang-context';
import { USFreightMap } from '@/components/domain/us-freight-map';

/* ── Types ─────────────────────────────────────────────────────────────────── */
type SectionId = 'abbr' | 'broker' | 'driver' | 'docs' | 'rates' | 'equipment' | 'states';

interface GlossaryTerm {
  term: string;
  termRu?: string;
  definition: string;
  definitionRu: string;
  example?: string;
  exampleRu?: string;
  section: SectionId;
}

/* ── Sections Config ────────────────────────────────────────────────────────── */
const SECTIONS: { id: SectionId; emoji: string; en: string; ru: string }[] = [
  { id: 'abbr',      emoji: '🔤', en: 'Abbreviations',   ru: 'Аббревиатуры'        },
  { id: 'broker',    emoji: '📞', en: 'Broker Terms',    ru: 'Слова брокеров'      },
  { id: 'driver',    emoji: '🚛', en: 'Driver Terms',    ru: 'Слова водителей'     },
  { id: 'docs',      emoji: '📄', en: 'Documents',       ru: 'Документы'           },
  { id: 'rates',     emoji: '💰', en: 'Rates & Finance', ru: 'Ставки и финансы'    },
  { id: 'equipment', emoji: '🔧', en: 'Equipment',       ru: 'Оборудование'        },
  { id: 'states',    emoji: '🗺️', en: 'US States',       ru: 'Штаты США'           },
];

/* ── Glossary Data ──────────────────────────────────────────────────────────── */
const TERMS: GlossaryTerm[] = [
  // ── ABBREVIATIONS ────────────────────────────────────────────────────────────
  {
    term: 'MC#', section: 'abbr',
    definition: 'Motor Carrier number — federal operating authority number issued by FMCSA. Required to haul freight commercially.',
    definitionRu: 'Номер Motor Carrier — федеральный номер перевозчика, выданный FMCSA. Обязателен для коммерческих перевозок.',
    example: '"What\'s your MC number?" — broker asks before sending a rate confirmation.',
    exampleRu: '"Какой у вас MC номер?" — брокер спрашивает перед отправкой подтверждения ставки.',
  },
  {
    term: 'DOT#', section: 'abbr',
    definition: 'Department of Transportation number — identifies a commercial vehicle operator. Used for safety audits and inspections.',
    definitionRu: 'Номер Департамента транспорта США — идентифицирует оператора коммерческого транспорта. Используется для проверок безопасности.',
  },
  {
    term: 'FMCSA', section: 'abbr',
    definition: 'Federal Motor Carrier Safety Administration — the government agency that regulates trucking safety and issues MC/DOT numbers.',
    definitionRu: 'Федеральное управление безопасности автомобильных перевозчиков — регулирует безопасность перевозок, выдаёт MC/DOT номера.',
  },
  {
    term: 'ELD', section: 'abbr',
    definition: 'Electronic Logging Device — mandatory device in truck cabs that automatically records driver hours of service (HOS).',
    definitionRu: 'Электронный журнал учёта — обязательное устройство в кабине, автоматически записывающее часы работы водителя.',
    example: '"My ELD shows I only have 4 hours left." — driver tells dispatcher he can\'t go further.',
    exampleRu: '"ELD показывает, что у меня осталось только 4 часа." — водитель говорит диспетчеру, что не может ехать дальше.',
  },
  {
    term: 'HOS', section: 'abbr',
    definition: 'Hours of Service — federal regulations limiting how many hours a driver can drive and work per day and per week. 11 hours driving / 14 hours on duty per day.',
    definitionRu: 'Часы службы — федеральные правила, ограничивающие рабочее время водителя. 11 часов за рулём / 14 часов на смене в день.',
  },
  {
    term: 'BOL', section: 'abbr',
    definition: 'Bill of Lading — the main shipping document that serves as a receipt, contract, and title for the freight. Must accompany every load.',
    definitionRu: 'Коносамент — основной транспортный документ: квитанция, договор и право собственности на груз. Обязателен для каждой перевозки.',
  },
  {
    term: 'POD', section: 'abbr',
    definition: 'Proof of Delivery — signed document confirming the freight was delivered. Required to invoice the broker and get paid.',
    definitionRu: 'Подтверждение доставки — подписанный документ, подтверждающий получение груза. Нужен для выставления счёта брокеру.',
  },
  {
    term: 'RC / Rate Con', section: 'abbr',
    definition: 'Rate Confirmation — the contract between broker and carrier that specifies load details, rate, pickup/delivery dates, and terms.',
    definitionRu: 'Подтверждение ставки — контракт между брокером и перевозчиком с деталями груза, ставкой, датами и условиями.',
  },
  {
    term: 'RPM', section: 'abbr',
    definition: 'Rate Per Mile — how freight rates are quoted and compared. Total rate ÷ total miles = RPM.',
    definitionRu: 'Ставка за милю — способ расчёта стоимости перевозки. Общая ставка ÷ количество миль = RPM.',
    example: '"$2,000 load, 800 miles — that\'s $2.50 RPM."',
    exampleRu: '"Груз $2,000, 800 миль — это $2.50 за милю."',
  },
  {
    term: 'DH / Deadhead', section: 'abbr',
    definition: 'Miles driven empty (without freight). Deadhead costs money and time. Always factor DH into rate calculations.',
    definitionRu: 'Мили езды порожняком (без груза). Порожний пробег стоит денег и времени. Всегда учитывай DH при расчёте ставки.',
    example: '"100 miles deadhead to pickup, rate needs to be higher."',
    exampleRu: '"100 миль порожняком до погрузки — ставка должна быть выше."',
  },
  {
    term: 'TONU', section: 'abbr',
    definition: 'Truck Order Not Used — payment made to a carrier when a load is canceled after the truck was already dispatched. Usually $100–$200.',
    definitionRu: 'Компенсация за отмену — выплата перевозчику, если груз отменили после того, как машина уже выехала. Обычно $100–$200.',
  },
  {
    term: 'FCFS', section: 'abbr',
    definition: 'First Come, First Served — warehouse policy meaning trucks are unloaded in the order they arrive, not by appointment.',
    definitionRu: 'Обслуживание в порядке прибытия — политика склада: машины разгружают по порядку приезда, без записи.',
  },
  {
    term: 'LTL', section: 'abbr',
    definition: 'Less Than Truckload — a shipment that does not fill an entire trailer. Multiple shippers share the truck space.',
    definitionRu: 'Неполная загрузка грузовика — отправка, не заполняющая весь прицеп. Несколько грузоотправителей делят пространство.',
  },
  {
    term: 'FTL', section: 'abbr',
    definition: 'Full Truckload — a shipment that fills an entire truck. One shipper uses the whole trailer.',
    definitionRu: 'Полная загрузка грузовика — отправка, заполняющая весь прицеп. Один грузоотправитель использует всё пространство.',
  },
  {
    term: 'OTR', section: 'abbr',
    definition: 'Over The Road — long-haul trucking, typically runs across multiple states. Drivers are away from home for weeks.',
    definitionRu: 'Дальнобойные перевозки — длинные маршруты через несколько штатов. Водители не бывают дома неделями.',
  },
  {
    term: 'T/T or T-T', section: 'abbr',
    definition: 'Tractor-Trailer — a standard semi-truck with a separate cab (tractor) and a trailer.',
    definitionRu: 'Седельный тягач с прицепом — стандартный грузовик: отдельная кабина (тягач) и прицеп.',
  },
  {
    term: 'OS&D', section: 'abbr',
    definition: 'Over, Short & Damaged — discrepancy report filed when delivered freight has extra items, missing items, or damage.',
    definitionRu: 'Излишки, недостача и повреждения — акт о расхождениях при доставке: лишние, недостающие или повреждённые товары.',
  },
  {
    term: 'ETA', section: 'abbr',
    definition: 'Estimated Time of Arrival — when the driver is expected to arrive at pickup or delivery.',
    definitionRu: 'Расчётное время прибытия — когда водитель ожидается на погрузке или доставке.',
    example: '"What\'s your ETA to the shipper?"',
    exampleRu: '"Когда вы будете у грузоотправителя?"',
  },
  {
    term: 'ASAP', section: 'abbr',
    definition: 'As Soon As Possible — urgently needed. Brokers often use this for hot loads that must move immediately.',
    definitionRu: 'Как можно скорее — срочно нужно. Брокеры используют для горящих грузов, которые надо везти немедленно.',
  },
  {
    term: 'FSC', section: 'abbr',
    definition: 'Fuel Surcharge — additional charge added to the base rate to cover fluctuating fuel costs. Often listed separately on rate cons.',
    definitionRu: 'Топливная надбавка — дополнительная плата к базовой ставке для покрытия колебаний цен на топливо.',
  },
  {
    term: 'D&H / D/H', section: 'abbr',
    definition: 'Detention & Handling or Deadhead — context-dependent. D&H usually refers to extra charges; D/H usually means deadhead miles.',
    definitionRu: 'В зависимости от контекста: простой и обработка (дополнительные сборы) или порожний пробег.',
  },

  // ── BROKER TERMS ─────────────────────────────────────────────────────────────
  {
    term: 'All in', section: 'broker',
    definition: 'Total rate for the load including fuel surcharge, with no extra charges. "All in $2,500" means the carrier gets $2,500 total.',
    definitionRu: 'Итоговая ставка за груз, включая топливную надбавку, без дополнительных расходов. "All in $2,500" = перевозчик получает $2,500.',
    example: '"I can do $2,200 all in."',
    exampleRu: '"Могу сделать $2,200 всё включено."',
  },
  {
    term: 'Can you cover it?', section: 'broker',
    definition: 'Broker asking if you (dispatcher/carrier) can accept and transport this load.',
    definitionRu: 'Брокер спрашивает, можете ли вы (диспетчер/перевозчик) принять и перевезти этот груз.',
  },
  {
    term: 'What\'s the best you can do?', section: 'broker',
    definition: 'Broker negotiating — asking for your lowest rate. Don\'t give your real bottom rate immediately; leave room to negotiate.',
    definitionRu: 'Брокер торгуется — просит назвать минимальную ставку. Не называй реальный минимум сразу — оставь место для переговоров.',
  },
  {
    term: 'I\'ll check with my shipper', section: 'broker',
    definition: 'Broker stalling for time or genuinely verifying with the shipper. Often used to delay while shopping for a cheaper carrier.',
    definitionRu: 'Брокер тянет время или действительно проверяет у грузоотправителя. Часто используется, пока ищут более дешёвого перевозчика.',
  },
  {
    term: 'Covered', section: 'broker',
    definition: 'The load has been booked with a carrier. "Already covered" means the load is no longer available.',
    definitionRu: 'Груз забронирован с перевозчиком. "Already covered" = груз больше не доступен.',
  },
  {
    term: 'Willing to negotiate?', section: 'broker',
    definition: 'Broker asking if you\'ll accept a lower rate. Answer: "Yes, within reason — what do you have in mind?"',
    definitionRu: 'Брокер спрашивает, готов ли ты снизить ставку. Ответ: "Да, в разумных пределах — что вы предлагаете?"',
  },
  {
    term: 'This is the best I can do', section: 'broker',
    definition: 'Broker claiming their offer is final. Often not true — counter with your rate or ask for extras (detention, fuel escalation).',
    definitionRu: 'Брокер заявляет, что это его финальное предложение. Часто неправда — предложи свою ставку или попроси дополнительные условия.',
  },
  {
    term: 'Send your packet', section: 'broker',
    definition: 'Broker requesting the carrier\'s setup packet — MC certificate, insurance certificate, W-9, and carrier agreement.',
    definitionRu: 'Брокер запрашивает пакет документов перевозчика: MC сертификат, страховка, W-9 и договор перевозчика.',
  },
  {
    term: 'Quick pay', section: 'broker',
    definition: 'Accelerated payment option — broker pays within 1–3 days instead of standard 30 days, usually for a 2–5% fee.',
    definitionRu: 'Быстрая оплата — брокер платит за 1–3 дня вместо стандартных 30, обычно за комиссию 2–5%.',
  },
  {
    term: 'Standard pay', section: 'broker',
    definition: 'Normal payment terms — typically 30 days after delivery and submission of paperwork (BOL, invoice).',
    definitionRu: 'Стандартные условия оплаты — обычно 30 дней после доставки и подачи документов (BOL, счёт-фактура).',
  },
  {
    term: 'Factoring', section: 'broker',
    definition: 'A financial service where a third company buys the carrier\'s invoices at a discount and pays immediately. Common in trucking.',
    definitionRu: 'Факторинг — финансовая услуга: сторонняя компания покупает счета перевозчика со скидкой и платит сразу.',
  },
  {
    term: 'Load is hot', section: 'broker',
    definition: 'The load is urgent and must be picked up immediately. Brokers will often pay more for a hot load.',
    definitionRu: 'Груз срочный и должен быть забран немедленно. Брокеры часто платят больше за срочный груз.',
  },
  {
    term: 'Layover', section: 'broker',
    definition: 'When a driver must stay overnight at the shipper/receiver due to delays. Carriers should charge a layover fee ($200–$400).',
    definitionRu: 'Когда водитель вынужден ночевать у грузоотправителя/получателя из-за задержек. Перевозчик должен выставить счёт за простой ($200–$400).',
  },
  {
    term: 'Detention', section: 'broker',
    definition: 'Extra time spent waiting at shipper or receiver beyond the free time (usually 2 hours). Billed at $50–$100/hour.',
    definitionRu: 'Дополнительное время ожидания на погрузке/разгрузке сверх бесплатного времени (обычно 2 часа). Оплачивается $50–$100/час.',
    example: '"Driver has been waiting 4 hours — I need $200 detention on top of the rate."',
    exampleRu: '"Водитель ждёт 4 часа — мне нужно $200 за простой сверх ставки."',
  },
  {
    term: 'No touch freight', section: 'broker',
    definition: 'Freight that doesn\'t require the driver to load or unload. Driver only moves the trailer.',
    definitionRu: 'Груз, который водитель не грузит и не разгружает. Водитель только перемещает прицеп.',
  },
  {
    term: 'Touch freight', section: 'broker',
    definition: 'Freight the driver must handle — load, unload, or count. Requires extra effort; should command a higher rate.',
    definitionRu: 'Груз, который водитель должен обрабатывать — грузить, разгружать или пересчитывать. Требует доплаты.',
  },

  // ── DRIVER TERMS ─────────────────────────────────────────────────────────────
  {
    term: 'I\'m out of hours', section: 'driver',
    definition: 'Driver has used up their legal Hours of Service (HOS). They cannot legally drive until after their mandatory rest period (10 hours off).',
    definitionRu: 'Водитель исчерпал часы работы (HOS). Он не может законно ехать до обязательного отдыха (10 часов).',
    example: '"I\'m out of hours, I can\'t make it to delivery tonight."',
    exampleRu: '"У меня закончились часы, я не успею на доставку сегодня вечером."',
  },
  {
    term: '34-hour reset', section: 'driver',
    definition: 'Driver takes a 34-hour off-duty restart to reset their 70-hour weekly clock. Commonly called "doing a reset."',
    definitionRu: '34-часовой перезапуск — водитель берёт 34 часа отдыха для сброса 70-часового недельного лимита.',
  },
  {
    term: 'I\'m at the dock', section: 'driver',
    definition: 'Driver has arrived at the loading dock and is ready to be loaded or unloaded.',
    definitionRu: 'Водитель приехал к погрузочному доку и готов к загрузке или разгрузке.',
  },
  {
    term: 'I\'m loaded and ready to roll', section: 'driver',
    definition: 'Driver has finished loading and is departing toward the delivery. Dispatcher should note the actual pickup time.',
    definitionRu: 'Водитель закончил погрузку и отправляется к доставке. Диспетчер должен зафиксировать фактическое время погрузки.',
  },
  {
    term: 'They\'re making me live unload', section: 'driver',
    definition: 'The receiver requires the driver to stay and wait while freight is unloaded piece by piece (can take hours). Start tracking detention time immediately.',
    definitionRu: 'Получатель требует, чтобы водитель ждал пока груз разгружают по частям (может занять часы). Сразу начинай считать детеншн.',
  },
  {
    term: 'Drop and hook', section: 'driver',
    definition: 'Driver drops their loaded trailer at a location and hooks up to a pre-loaded trailer without waiting. Fast and efficient.',
    definitionRu: 'Водитель оставляет гружёный прицеп и цепляет уже загруженный прицеп без ожидания. Быстро и эффективно.',
  },
  {
    term: 'Live load', section: 'driver',
    definition: 'Driver must wait at the shipper while the freight is loaded onto their truck. Can take 30 minutes to several hours.',
    definitionRu: 'Водитель ждёт на складе, пока груз загружают в его машину. Может занять от 30 минут до нескольких часов.',
  },
  {
    term: 'Lumper', section: 'driver',
    definition: 'A hired worker who unloads freight at the receiver. Lumper fees ($100–$400) are usually reimbursed by the broker — always get a receipt.',
    definitionRu: 'Нанятый рабочий для разгрузки. Стоимость ($100–$400) обычно возмещает брокер — всегда бери чек.',
    example: '"They want me to use a lumper, it\'s $200. Can you get that approved?"',
    exampleRu: '"Они хотят, чтобы я нанял лампера, это $200. Можешь согласовать?"',
  },
  {
    term: 'Scale', section: 'driver',
    definition: 'Weigh station where trucks are checked for compliance with weight limits. Drivers must pull in if the scale is open.',
    definitionRu: 'Весовая станция для проверки перегрузки. Водители обязаны заезжать, если станция открыта.',
  },
  {
    term: 'Overweight', section: 'driver',
    definition: 'Truck exceeds legal weight limits (80,000 lbs gross for standard trucks). Can result in fines. Requires a permit for oversized loads.',
    definitionRu: 'Машина превышает допустимый вес (80 000 фунтов для стандартных грузовиков). Грозит штрафом. Нужен пермит для негабарита.',
  },
  {
    term: 'I got a flat', section: 'driver',
    definition: 'Driver has a flat tire. They need roadside assistance. Dispatcher should help coordinate a tire service and update the broker on delivery ETA.',
    definitionRu: 'У водителя спустило колесо. Нужна помощь на дороге. Диспетчер помогает вызвать шиномонтаж и сообщает брокеру новый ETA.',
  },
  {
    term: 'I\'m prepass', section: 'driver',
    definition: 'Driver has the PrePass transponder system, which allows some trucks to bypass weigh stations if they have a clean safety record.',
    definitionRu: 'У водителя система PrePass — позволяет пропускать весовые станции при хорошей репутации безопасности.',
  },
  {
    term: 'CB radio', section: 'driver',
    definition: 'Citizens Band radio — communication device used between truck drivers on the road. Less common now but still used for road condition info.',
    definitionRu: 'Гражданский диапазон радиосвязи — устройство для общения водителей в пути. Сейчас реже используется, но есть у многих.',
  },
  {
    term: 'Reefer', section: 'driver',
    definition: 'Refrigerated trailer — keeps cargo at specific temperatures. Used for food, pharmaceuticals, flowers. Has a diesel-powered cooling unit.',
    definitionRu: 'Рефрижераторный прицеп — поддерживает нужную температуру для продуктов, фармацевтики, цветов. Работает на дизеле.',
  },
  {
    term: 'Dry van', section: 'driver',
    definition: 'Standard enclosed trailer without temperature control. Most common type of trailer in US trucking.',
    definitionRu: 'Стандартный закрытый прицеп без температурного контроля. Самый распространённый тип прицепа в США.',
  },
  {
    term: 'Flatbed', section: 'driver',
    definition: 'Open trailer without walls or roof. Used for oversized, heavy, or oddly-shaped cargo like steel, lumber, machinery.',
    definitionRu: 'Открытый прицеп без стен и крыши. Используется для негабаритных, тяжёлых или нестандартных грузов: сталь, лес, оборудование.',
  },

  // ── DOCUMENTS ────────────────────────────────────────────────────────────────
  {
    term: 'Rate Confirmation (Rate Con)', section: 'docs',
    definition: 'The binding contract for a load. Contains: pickup/delivery addresses, dates, commodity, rate, and special instructions. Both broker and carrier sign it.',
    definitionRu: 'Обязательный контракт на перевозку. Содержит: адреса, даты, тип груза, ставку и особые инструкции. Подписывается обеими сторонами.',
    example: 'Always read the rate con carefully before signing — check for auto-detention clauses or exclusions.',
    exampleRu: 'Всегда внимательно читай rate con перед подписанием — проверяй условия детеншна и исключения.',
  },
  {
    term: 'Bill of Lading (BOL)', section: 'docs',
    definition: 'Shipping document generated by the shipper. Driver signs it at pickup. Receiver signs it at delivery. Proof the load was picked up and delivered.',
    definitionRu: 'Транспортный документ от грузоотправителя. Водитель подписывает при погрузке. Получатель — при доставке. Доказательство перевозки.',
  },
  {
    term: 'Proof of Delivery (POD)', section: 'docs',
    definition: 'Signed BOL or delivery receipt that proves the freight reached the destination. Must be sent to broker to trigger payment.',
    definitionRu: 'Подписанный BOL или квитанция о доставке — доказательство получения груза. Нужен для запуска оплаты от брокера.',
  },
  {
    term: 'W-9', section: 'docs',
    definition: 'IRS tax form providing carrier\'s Tax ID number (EIN or SSN) to the broker for payment processing. Required for new broker setups.',
    definitionRu: 'Налоговая форма IRS с номером налогоплательщика перевозчика. Нужна при регистрации с новым брокером.',
  },
  {
    term: 'Certificate of Insurance (COI)', section: 'docs',
    definition: 'Document from the carrier\'s insurance provider proving they have required coverage (general liability, cargo). Brokers require it before sending loads.',
    definitionRu: 'Документ от страховщика, подтверждающий наличие необходимого покрытия. Брокеры требуют его перед отправкой грузов.',
  },
  {
    term: 'Carrier Agreement', section: 'docs',
    definition: 'Contract between broker and carrier defining terms of business — payment, claims, dispute resolution. Sign before first load.',
    definitionRu: 'Договор между брокером и перевозчиком: условия работы, оплата, претензии, разрешение споров. Подписывается перед первым грузом.',
  },
  {
    term: 'Lumper Receipt', section: 'docs',
    definition: 'Receipt from the lumper service proving the amount paid. Dispatcher submits this to broker for reimbursement.',
    definitionRu: 'Чек от сервиса разгрузки, подтверждающий сумму оплаты. Диспетчер передаёт брокеру для возмещения.',
  },
  {
    term: 'Invoice', section: 'docs',
    definition: 'Billing document sent by the carrier to the broker after delivery, along with the POD. Triggers the payment process.',
    definitionRu: 'Счёт-фактура от перевозчика брокеру после доставки вместе с POD. Запускает процесс оплаты.',
  },

  // ── RATES & FINANCE ───────────────────────────────────────────────────────────
  {
    term: 'Linehaul rate', section: 'rates',
    definition: 'The base transportation rate for moving the freight, excluding fuel surcharge and accessorials.',
    definitionRu: 'Базовая транспортная ставка за перевозку груза, без топливной надбавки и дополнительных сборов.',
  },
  {
    term: 'Fuel surcharge (FSC)', section: 'rates',
    definition: 'Additional charge on top of linehaul rate to cover fuel costs. Calculated as a percentage of linehaul or a flat per-mile amount.',
    definitionRu: 'Надбавка к базовой ставке для покрытия топливных расходов. Считается как процент от ставки или фиксированная сумма за милю.',
  },
  {
    term: 'Accessorial charges', section: 'rates',
    definition: 'Extra fees beyond the base rate: detention, layover, lumper, liftgate, inside delivery, fuel stop, team driver, hazmat, etc.',
    definitionRu: 'Дополнительные сборы сверх базовой ставки: детеншн, простой, лампер, гидроборт, доставка внутрь, доп. водитель, опасные грузы и т.д.',
  },
  {
    term: 'Spot rate', section: 'rates',
    definition: 'Current market rate for a load booked right now (as opposed to contract rates). Spot rates fluctuate daily based on supply/demand.',
    definitionRu: 'Текущая рыночная ставка для груза, бронируемого прямо сейчас (в отличие от контрактных ставок). Меняется ежедневно.',
  },
  {
    term: 'Contract rate', section: 'rates',
    definition: 'Agreed rate between shipper and carrier for regular freight over a set period. Provides stability but less flexibility than spot market.',
    definitionRu: 'Согласованная ставка между грузоотправителем и перевозчиком на регулярные перевозки. Стабильнее, но менее гибко, чем спотовый рынок.',
  },
  {
    term: 'All-in rate', section: 'rates',
    definition: 'Total rate including fuel surcharge and all fees. What the carrier actually receives after all charges are included.',
    definitionRu: 'Итоговая ставка, включающая всё: топливную надбавку и все сборы. То, что перевозчик фактически получит.',
  },
  {
    term: 'Net rate', section: 'rates',
    definition: 'The amount the carrier receives after broker commission is deducted. Shippers pay brokers more than carriers see.',
    definitionRu: 'Сумма, которую получает перевозчик после вычета комиссии брокера. Грузоотправители платят брокерам больше, чем видят перевозчики.',
  },
  {
    term: 'DAT / Load Board rate', section: 'rates',
    definition: 'Market rate data from load board platforms (DAT, Truckstop.com) showing current average rates for specific lanes.',
    definitionRu: 'Данные о рыночных ставках с платформ Load Board (DAT, Truckstop.com) — текущие средние ставки для конкретных маршрутов.',
  },
  {
    term: 'Layover pay', section: 'rates',
    definition: 'Compensation paid when a driver must wait overnight due to shipper/receiver delays. Standard is $200–$400 per night.',
    definitionRu: 'Компенсация за ночёвку водителя из-за задержки на складе. Стандарт: $200–$400 за ночь.',
  },
  {
    term: 'TONU fee', section: 'rates',
    definition: 'Truck Order Not Used fee — paid when a load is canceled after the carrier was already dispatched. Usually $100–$200.',
    definitionRu: 'Компенсация за отменённый груз после выезда водителя. Обычно $100–$200.',
  },

  // ── EQUIPMENT ────────────────────────────────────────────────────────────────
  {
    term: 'Dry Van', section: 'equipment',
    definition: '53-foot enclosed trailer. Most common. Used for general freight: pallets, boxes, retail goods, non-perishable goods.',
    definitionRu: '53-футовый закрытый прицеп. Самый распространённый. Для общих грузов: поддоны, коробки, розничные товары.',
  },
  {
    term: 'Reefer (Refrigerated)', section: 'equipment',
    definition: 'Temperature-controlled trailer with a diesel cooling unit. Temp range: -20°F to +70°F. Used for food, pharma, flowers, chemicals.',
    definitionRu: 'Прицеп с дизельным охлаждением. Диапазон температур: -20°F до +70°F. Для продуктов, фармацевтики, цветов.',
  },
  {
    term: 'Flatbed', section: 'equipment',
    definition: 'Open flat trailer, 48 or 53 feet. No walls, no roof. Freight must be tarped/strapped. Used for steel, lumber, construction equipment, machinery.',
    definitionRu: 'Открытый прицеп, 48 или 53 фута. Без стен и крыши. Груз крепится и укрывается тентом. Для стали, леса, стройтехники.',
  },
  {
    term: 'Step Deck (Drop Deck)', section: 'equipment',
    definition: 'Flatbed with a lower rear section allowing taller freight (up to 10 feet). Used for heavy machinery and tall equipment.',
    definitionRu: 'Флэтбед с пониженной задней секцией для более высоких грузов (до 10 футов). Для тяжёлой техники.',
  },
  {
    term: 'Lowboy', section: 'equipment',
    definition: 'Extremely low-riding trailer for very tall or heavy freight (construction equipment, bulldozers, cranes). Often requires permits.',
    definitionRu: 'Низкорамный прицеп для очень высоких или тяжёлых грузов (бульдозеры, краны). Часто требует специальных разрешений.',
  },
  {
    term: 'Power only', section: 'equipment',
    definition: 'Carrier provides only the truck (power unit), not a trailer. They hook up to a shipper-owned or broker-provided trailer.',
    definitionRu: 'Перевозчик предоставляет только тягач без прицепа. Цепляет прицеп грузоотправителя или брокера.',
  },
  {
    term: 'Tanker', section: 'equipment',
    definition: 'Cylindrical trailer for liquids or gases (fuel, chemicals, food-grade liquids). Requires special endorsements (N or X on CDL).',
    definitionRu: 'Цистерна для жидкостей или газов (топливо, химикаты, пищевые жидкости). Требует специального endorsement в CDL.',
  },
  {
    term: 'Conestoga', section: 'equipment',
    definition: 'Flatbed with a retractable tarp system that slides over the freight. Best of both worlds — flatbed loading with dry van protection.',
    definitionRu: 'Флэтбед с выдвижной тент-системой. Сочетает погрузку как флэтбед и защиту как сухой фургон.',
  },
  {
    term: 'Intermodal', section: 'equipment',
    definition: 'Shipping container transported by multiple modes (ship, train, truck). Intermodal drayage = local trucking portion of the container movement.',
    definitionRu: 'Перевозка в контейнере несколькими видами транспорта (корабль, поезд, грузовик). Дрейдж = местный грузовой участок.',
  },
  {
    term: 'Hotshot', section: 'equipment',
    definition: 'Smaller truck (pickup or medium-duty) with a flatbed trailer. Used for expedited, smaller loads. Faster but more expensive per mile.',
    definitionRu: 'Малотоннажный грузовик с флэтбедом. Для срочных небольших грузов. Быстрее, но дороже за милю.',
  },

  // ── US STATES ────────────────────────────────────────────────────────────────
  { term: 'AL', section: 'states', definition: 'Alabama', definitionRu: 'Алабама' },
  { term: 'AK', section: 'states', definition: 'Alaska', definitionRu: 'Аляска' },
  { term: 'AZ', section: 'states', definition: 'Arizona', definitionRu: 'Аризона' },
  { term: 'AR', section: 'states', definition: 'Arkansas', definitionRu: 'Арканзас' },
  { term: 'CA', section: 'states', definition: 'California', definitionRu: 'Калифорния' },
  { term: 'CO', section: 'states', definition: 'Colorado', definitionRu: 'Колорадо' },
  { term: 'CT', section: 'states', definition: 'Connecticut', definitionRu: 'Коннектикут' },
  { term: 'DE', section: 'states', definition: 'Delaware', definitionRu: 'Делавэр' },
  { term: 'FL', section: 'states', definition: 'Florida', definitionRu: 'Флорида' },
  { term: 'GA', section: 'states', definition: 'Georgia', definitionRu: 'Джорджия' },
  { term: 'HI', section: 'states', definition: 'Hawaii', definitionRu: 'Гавайи' },
  { term: 'ID', section: 'states', definition: 'Idaho', definitionRu: 'Айдахо' },
  { term: 'IL', section: 'states', definition: 'Illinois', definitionRu: 'Иллинойс' },
  { term: 'IN', section: 'states', definition: 'Indiana', definitionRu: 'Индиана' },
  { term: 'IA', section: 'states', definition: 'Iowa', definitionRu: 'Айова' },
  { term: 'KS', section: 'states', definition: 'Kansas', definitionRu: 'Канзас' },
  { term: 'KY', section: 'states', definition: 'Kentucky', definitionRu: 'Кентукки' },
  { term: 'LA', section: 'states', definition: 'Louisiana', definitionRu: 'Луизиана' },
  { term: 'ME', section: 'states', definition: 'Maine', definitionRu: 'Мэн' },
  { term: 'MD', section: 'states', definition: 'Maryland', definitionRu: 'Мэриленд' },
  { term: 'MA', section: 'states', definition: 'Massachusetts', definitionRu: 'Массачусетс' },
  { term: 'MI', section: 'states', definition: 'Michigan', definitionRu: 'Мичиган' },
  { term: 'MN', section: 'states', definition: 'Minnesota', definitionRu: 'Миннесота' },
  { term: 'MS', section: 'states', definition: 'Mississippi', definitionRu: 'Миссисипи' },
  { term: 'MO', section: 'states', definition: 'Missouri', definitionRu: 'Миссури' },
  { term: 'MT', section: 'states', definition: 'Montana', definitionRu: 'Монтана' },
  { term: 'NE', section: 'states', definition: 'Nebraska', definitionRu: 'Небраска' },
  { term: 'NV', section: 'states', definition: 'Nevada', definitionRu: 'Невада' },
  { term: 'NH', section: 'states', definition: 'New Hampshire', definitionRu: 'Нью-Гэмпшир' },
  { term: 'NJ', section: 'states', definition: 'New Jersey', definitionRu: 'Нью-Джерси' },
  { term: 'NM', section: 'states', definition: 'New Mexico', definitionRu: 'Нью-Мексико' },
  { term: 'NY', section: 'states', definition: 'New York', definitionRu: 'Нью-Йорк' },
  { term: 'NC', section: 'states', definition: 'North Carolina', definitionRu: 'Северная Каролина' },
  { term: 'ND', section: 'states', definition: 'North Dakota', definitionRu: 'Северная Дакота' },
  { term: 'OH', section: 'states', definition: 'Ohio', definitionRu: 'Огайо' },
  { term: 'OK', section: 'states', definition: 'Oklahoma', definitionRu: 'Оклахома' },
  { term: 'OR', section: 'states', definition: 'Oregon', definitionRu: 'Орегон' },
  { term: 'PA', section: 'states', definition: 'Pennsylvania', definitionRu: 'Пенсильвания' },
  { term: 'RI', section: 'states', definition: 'Rhode Island', definitionRu: 'Род-Айленд' },
  { term: 'SC', section: 'states', definition: 'South Carolina', definitionRu: 'Южная Каролина' },
  { term: 'SD', section: 'states', definition: 'South Dakota', definitionRu: 'Южная Дакота' },
  { term: 'TN', section: 'states', definition: 'Tennessee', definitionRu: 'Теннесси' },
  { term: 'TX', section: 'states', definition: 'Texas', definitionRu: 'Техас' },
  { term: 'UT', section: 'states', definition: 'Utah', definitionRu: 'Юта' },
  { term: 'VT', section: 'states', definition: 'Vermont', definitionRu: 'Вермонт' },
  { term: 'VA', section: 'states', definition: 'Virginia', definitionRu: 'Вирджиния' },
  { term: 'WA', section: 'states', definition: 'Washington', definitionRu: 'Вашингтон' },
  { term: 'WV', section: 'states', definition: 'West Virginia', definitionRu: 'Западная Вирджиния' },
  { term: 'WI', section: 'states', definition: 'Wisconsin', definitionRu: 'Висконсин' },
  { term: 'WY', section: 'states', definition: 'Wyoming', definitionRu: 'Вайоминг' },
  { term: 'DC', section: 'states', definition: 'District of Columbia', definitionRu: 'Округ Колумбия' },
];

/* ── Component ─────────────────────────────────────────────────────────────── */
export function DispatchGlossary() {
  const { lang } = useLang();
  const ru = lang === 'ru';

  const [activeSection, setActiveSection] = useState<SectionId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [hoveredState, setHoveredState] = useState<string | undefined>(undefined);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return TERMS.filter(term => {
      if (activeSection !== 'all' && term.section !== activeSection) return false;
      if (!q) return true;
      const text = [
        term.term,
        term.termRu ?? '',
        term.definition,
        term.definitionRu,
      ].join(' ').toLowerCase();
      return text.includes(q);
    });
  }, [activeSection, search]);

  // Group filtered terms by section for rendering
  const grouped = useMemo(() => {
    if (activeSection !== 'all') {
      return { [activeSection]: filtered };
    }
    const g: Partial<Record<SectionId, GlossaryTerm[]>> = {};
    for (const term of filtered) {
      if (!g[term.section]) g[term.section] = [];
      g[term.section]!.push(term);
    }
    return g;
  }, [filtered, activeSection]);

  const sectionOrder: SectionId[] = ['abbr', 'broker', 'driver', 'docs', 'rates', 'equipment', 'states'];

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f7]">
          {ru ? '📖 Словарь диспетчера' : '📖 Dispatcher Glossary'}
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#636366] mt-1">
          {ru
            ? 'Термины, аббревиатуры и профессиональный язык рынка грузоперевозок США'
            : 'Terms, abbreviations and professional language of the US freight market'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#636366] text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={ru ? 'Поиск по термину...' : 'Search terms...'}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 bg-gray-50 dark:bg-[#1c1c1e] text-gray-800 dark:text-[#f5f5f7] placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#636366] hover:text-gray-600 dark:text-[#a1a1a6] text-xs"
          >✕</button>
        )}
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveSection('all')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            activeSection === 'all'
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-white/[0.08] hover:border-gray-400'
          )}
        >
          {ru ? 'Все разделы' : 'All'}
          <span className="ml-1.5 text-[10px] opacity-60">{TERMS.length}</span>
        </button>
        {SECTIONS.map(s => {
          const count = TERMS.filter(t => t.section === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                activeSection === s.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white dark:bg-[#2c2c2e] text-gray-600 dark:text-[#a1a1a6] border-gray-200 dark:border-white/[0.08] hover:border-gray-400'
              )}
            >
              {s.emoji} {ru ? s.ru : s.en}
              <span className="ml-1.5 text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-gray-400 dark:text-[#636366] mb-3">
          {ru ? `Найдено: ${filtered.length}` : `Found: ${filtered.length}`}
        </p>
      )}

      {/* Terms */}
      <div className="space-y-6">
        {sectionOrder.map(sectionId => {
          const terms = grouped[sectionId];
          if (!terms || terms.length === 0) return null;
          const sectionCfg = SECTIONS.find(s => s.id === sectionId)!;

          return (
            <div key={sectionId}>
              {/* Section heading (only when showing all) */}
              {activeSection === 'all' && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{sectionCfg.emoji}</span>
                  <h2 className="text-sm font-bold text-gray-700 dark:text-[#f5f5f7] uppercase tracking-wider">
                    {ru ? sectionCfg.ru : sectionCfg.en}
                  </h2>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-[#2c2c2e]" />
                </div>
              )}

              {sectionId === 'states' ? (
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Map — фиксированная левая колонка */}
                  <div className="w-full lg:w-[70%] shrink-0">
                    <USFreightMap hoveredState={hoveredState} labelSize={9} />
                  </div>

                  {/* State list — независимо скроллируемая правая колонка */}
                  <div className="w-full lg:w-[30%] lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                      {terms.map(term => (
                        <div
                          key={term.term}
                          onMouseEnter={() => setHoveredState(term.term)}
                          onMouseLeave={() => setHoveredState(undefined)}
                          className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 cursor-default transition-colors ${
                            hoveredState === term.term
                              ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                              : 'border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#2c2c2e] hover:border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          <span className={`text-sm font-bold shrink-0 w-8 ${hoveredState === term.term ? 'text-emerald-600' : 'text-emerald-700'}`}>
                            {term.term}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-800 dark:text-[#f5f5f7] truncate">{term.definition}</p>
                            <p className="text-[10px] text-gray-400 dark:text-[#636366] truncate">{term.definitionRu}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {terms.map(term => {
                    const definition = ru ? term.definitionRu : term.definition;
                    const example = ru ? term.exampleRu : term.example;
                    return (
                      <div
                        key={`${sectionId}-${term.term}`}
                        className="bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-white/[0.08] rounded-xl p-4 hover:border-emerald-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-sm font-bold px-2.5 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                            {term.term}
                          </span>
                          {term.termRu && (
                            <span className="text-xs text-gray-400 dark:text-[#636366] mt-1">{term.termRu}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-[#f5f5f7] leading-relaxed">{definition}</p>
                        {example && (
                          <div className="mt-2.5 bg-gray-50 dark:bg-[#1c1c1e] border border-gray-100 dark:border-white/[0.06] rounded-lg px-3 py-2">
                            <p className="text-[10px] font-semibold text-gray-400 dark:text-[#636366] uppercase tracking-wide mb-1">
                              {ru ? 'Пример' : 'Example'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-[#a1a1a6] italic">{example}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-[#636366]">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">{ru ? 'Ничего не найдено' : 'Nothing found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
