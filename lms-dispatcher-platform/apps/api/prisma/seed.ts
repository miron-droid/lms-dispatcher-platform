import { PrismaClient, UserRole, ContentStatus, LessonType, ProgressStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getContent(chapter: number, lesson: number): object {
  const contents: Record<string, object> = {
    '1-1': {
      type: 'text',
      bodyRu: `
        <h2>Введение в грузоперевозки США</h2>
        <blockquote>
          <strong>Запомните:</strong> Это ВЫСОКОКОНКУРЕНТНЫЙ бизнес на каждом этапе — ВОДИТЕЛЬ, БРОКЕР, ПЕРЕВОЗЧИК. Это необходимо понимать.
        </blockquote>

        <h3>Три главных участника</h3>
        <p><strong>Shipper</strong> (грузоотправитель) — компания с товаром для доставки. <strong>Broker</strong> (брокер) — посредник, публикующий груз на <strong>load boards</strong> (биржах грузов: Truckstop и др.). <strong>Carrier</strong> (перевозчик) — владелец грузовиков, нанимающий водителей.</p>
        <p><strong>Цепочка движения груза:</strong> Shipper → Broker → Диспетчер бронирует → Водитель везёт → Consignee принимает. Брокер зарабатывает <strong>маржу</strong> — разницу между оплатой shipper'а и выплатой carrier'у.</p>

        <h3>Ключевые термины</h3>
        <blockquote>
          <strong>Load</strong> — груз или заявка на перевозку.<br/>
          <strong>Lane</strong> — маршрут, например California → Texas.<br/>
          <strong>Rate</strong> — оплата за перевозку.<br/>
          <strong>RPM (rate per mile)</strong> — ставка за милю; например $2 000 ÷ 1 500 миль = $1,33 RPM. Главный показатель выгодности груза.<br/>
          <strong>Deadhead</strong> — порожние мили без груза (нет дохода — минимизировать всегда).<br/>
          <strong>ETA</strong> — ожидаемое время прибытия.<br/>
          <strong>Check call</strong> — звонок для подтверждения местоположения водителя и статуса груза.<br/>
          <strong>Book a load</strong> — забронировать груз, взять в работу.<br/>
          <strong>PU / DEL</strong> — точка загрузки / точка доставки.
        </blockquote>

        <h3>Ежедневные задачи диспетчера</h3>
        <ul>
          <li>Искать грузы на load boards, оценивать lane по RPM, <strong>бронировать грузы</strong></li>
          <li>Звонить брокерам, <strong>вести переговоры о ставке</strong> (никогда не принимать первое предложение)</li>
          <li>Планировать маршруты — минимизировать deadhead, заранее искать следующий груз</li>
          <li>Делать <strong>check calls</strong> каждые 4–6 часов, обновлять брокера по ETA</li>
          <li>Решать проблемы: задержки, отмены, поломки, detention</li>
        </ul>

        <h3>Типы рынков</h3>
        <p><strong>Spot market</strong> (спотовый рынок) — разовые грузы; цены меняются по спросу и предложению. Основная среда для большинства новых диспетчеров. <strong>Contract/dedicated freight</strong> — долгосрочные соглашения с фиксированными ставками, более характерны для крупных carrier'ов.</p>

        <h3>Что определяет ставку</h3>
        <p>Факторы ставки: <strong>расстояние</strong>, <strong>направление (lane)</strong> (одни коридоры высококонкурентны, другие перенасыщены), <strong>сезонность</strong>, <strong>рыночная конъюнктура</strong> (соотношение грузов и грузовиков), <strong>срочность</strong> — <strong>hot load</strong> требует немедленных действий и оплачивается по премиальной ставке.</p>
      `,
      quizRu: {
        questions: [
          {
            id: 'q1',
            text: 'Кто инициирует грузоперевозку, имея товары для доставки?',
            options: ['Брокер', 'Перевозчик', 'Грузоотправитель (Shipper)', 'Диспетчер'],
            correctIndex: 2,
          },
          {
            id: 'q2',
            text: 'Кто зарабатывает маржу — разницу между тем, что платит грузоотправитель, и тем, что получает перевозчик?',
            options: ['Диспетчер', 'Водитель', 'Брокер', 'Грузополучатель (Consignee)'],
            correctIndex: 2,
          },
          {
            id: 'q3',
            text: 'Что означает термин "Load" в американских грузоперевозках?',
            options: ['Конкретный маршрут доставки', 'Груз или заявка на перевозку', 'Ставка за перевозку', 'Тип грузовика'],
            correctIndex: 1,
          },
          {
            id: 'q4',
            text: 'Какова основная ежедневная задача диспетчера?',
            options: ['Управлять складскими запасами', 'Искать грузы и вести переговоры о ставках с брокерами', 'Доставлять товары клиентам', 'Оплачивать счета перевозчиков'],
            correctIndex: 1,
          },
          {
            id: 'q5',
            text: 'Что измеряет показатель RPM (Rate per Mile)?',
            options: ['Общую стоимость груза', 'Количество пройденных миль', 'Заработок за милю на конкретном грузе', 'Процент комиссии брокера'],
            correctIndex: 2,
          },
          {
            id: 'q6',
            text: 'Что означает термин "deadhead" в грузоперевозках?',
            options: ['Отменённый груз', 'Езда порожним рейсом без груза', 'Ошибка в документации', 'Перегруженный автомобиль'],
            correctIndex: 1,
          },
          {
            id: 'q7',
            text: 'Что такое "spot market" в грузовой логистике?',
            options: ['Долгосрочный контракт с фиксированными ставками', 'Рынок разовых грузов, где цены меняются в зависимости от спроса и предложения', 'Государственная программа грузоперевозок', 'Платформа с фиксированными тарифами'],
            correctIndex: 1,
          },
          {
            id: 'q8',
            text: 'Что означает аббревиатура "ETA" и почему она важна?',
            options: ['Estimated Total Amount — итоговый счёт', 'Engine Temperature Alert — система безопасности грузовика', 'Estimated Time of Arrival — ожидаемое время прибытия для информирования брокеров', 'Electronic Transfer Authorization — для обработки платежей'],
            correctIndex: 2,
          },
          {
            id: 'q9',
            text: 'Что включает в себя "check call"?',
            options: [
              'Звонок грузоотправителю для подтверждения цены перед бронированием',
              'Звонок для проверки текущего местоположения водителя и статуса груза',
              'Звонок для верификации платежа с перевозчиком',
              'Звонок для оспаривания предложенной брокером ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'q10',
            text: 'Какова роль consignee в цепочке грузоперевозок?',
            options: [
              'Компания, владеющая грузовиками и нанимающая водителей',
              'Посредник, связывающий грузоотправителей и перевозчиков',
              'Сторона, получающая груз в конечном пункте назначения',
              'Непосредственный руководитель диспетчера',
            ],
            correctIndex: 2,
          },
          {
            id: 'q11',
            text: 'Мини-кейс: Брокер предлагает $1 100 за рейс 900 миль. Вы знаете, что средний RPM для этого направления — $1,50. Что делать?',
            options: [
              'Принять немедленно — любой груз лучше, чем порожний рейс',
              'Отказать и молча ждать лучшего предложения',
              'Рассчитать RPM ($1,22/миля) и вести переговоры к рыночной ставке',
              'Спросить водителя — это его расходы на топливо',
            ],
            correctIndex: 2,
          },
          {
            id: 'q12',
            text: 'Мини-кейс: Ваш водитель опаздывает на 2 часа из-за пробок и не успевает к временному окну доставки. Что делаете в первую очередь?',
            options: [
              'Ждёте — может, наверстает на трассе',
              'Немедленно связываетесь с брокером, объясняете ситуацию и сообщаете обновлённый ETA',
              'Отменяете груз, чтобы избежать провала по сервису',
              'Звоните напрямую consignee, не уведомляя брокера',
            ],
            correctIndex: 1,
          },
        ],
      },
      body: `
        <h2>Introduction to US Trucking</h2>
        <blockquote>
          <strong>Remember:</strong> This is a HIGHLY COMPETITIVE business at every stage — DRIVER, BROKER, CARRIER. This is essential to understand.
        </blockquote>

        <h3>The Three Main Players</h3>
        <p>The <strong>shipper</strong> has goods that need to move. The <strong>broker</strong> is an intermediary who finds a carrier for the load — posting it on <strong>load boards</strong> (e.g. Truckstop). The <strong>carrier</strong> owns trucks and employs drivers who perform the actual transport.</p>
        <p><strong>Load flow:</strong> Shipper → Broker → Dispatcher books the load → Driver picks up and delivers → Consignee receives. The broker earns a <strong>margin</strong> — the difference between what the shipper pays and what the carrier receives.</p>

        <h3>Key Industry Terms</h3>
        <blockquote>
          <strong>Load</strong> — the freight or order to be transported.<br/>
          <strong>Lane</strong> — the route, e.g., California → Texas.<br/>
          <strong>Rate</strong> — payment for transporting the load.<br/>
          <strong>RPM (rate per mile)</strong> — earnings per mile; e.g., $2,000 ÷ 1,500 mi = $1.33 RPM. Key metric for load evaluation.<br/>
          <strong>Deadhead</strong> — empty miles driven without a load (no revenue — minimize always).<br/>
          <strong>ETA</strong> — estimated time of arrival.<br/>
          <strong>Check call</strong> — a call to confirm driver location and load status.<br/>
          <strong>Book a load</strong> — to confirm and take a load into work.<br/>
          <strong>PU / DEL</strong> — pickup / delivery points.
        </blockquote>

        <h3>The Dispatcher's Daily Tasks</h3>
        <ul>
          <li>Search load boards, evaluate lanes by RPM, and <strong>book loads</strong></li>
          <li>Call brokers, <strong>negotiate rates</strong> (never accept the first offer)</li>
          <li>Plan routes — minimize deadhead, pre-find next load before delivery</li>
          <li>Make <strong>check calls</strong> every 4–6 hours, provide ETA updates to brokers</li>
          <li>Solve problems: delays, cancellations, breakdowns, detention</li>
        </ul>

        <h3>Types of Markets</h3>
        <p><strong>Spot market</strong> — one-time loads; prices fluctuate with supply and demand. Where most new dispatchers work daily. <strong>Contract/dedicated freight</strong> — long-term agreements with fixed rates, more common among large carriers.</p>

        <h3>What Determines the Rate</h3>
        <p>Rate factors: <strong>distance</strong>, <strong>lane direction</strong> (some corridors high-demand, others oversupplied), <strong>seasonality</strong>, <strong>market conditions</strong> (loads vs. trucks available), and <strong>urgency</strong> — a <strong>hot load</strong> commands premium rates but requires immediate action.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'q1',
            text: 'Who initiates a freight shipment by having goods that need to be transported?',
            options: ['Broker', 'Carrier', 'Shipper', 'Dispatcher'],
            correctIndex: 2,
          },
          {
            id: 'q2',
            text: 'Who earns the margin — the difference between what the shipper pays and what the carrier receives?',
            options: ['Dispatcher', 'Driver', 'Broker', 'Consignee'],
            correctIndex: 2,
          },
          {
            id: 'q3',
            text: 'What does the term "Load" mean in US trucking?',
            options: ['A specific delivery route', 'A freight shipment or order to be transported', 'The rate for transportation', 'A type of truck'],
            correctIndex: 1,
          },
          {
            id: 'q4',
            text: 'What is the dispatcher\'s primary daily task?',
            options: ['Manage warehouse inventory', 'Find loads and negotiate rates with brokers', 'Deliver goods to customers', 'Pay carrier invoices'],
            correctIndex: 1,
          },
          {
            id: 'q5',
            text: 'What does RPM (Rate per Mile) measure?',
            options: ['The total cost of a load', 'The number of miles driven', 'The earnings per mile on a given load', 'The broker\'s commission percentage'],
            correctIndex: 2,
          },
          {
            id: 'q6',
            text: 'What does "deadhead" mean in trucking?',
            options: ['A cancelled load', 'Driving empty miles without freight', 'A documentation error', 'An overweight load'],
            correctIndex: 1,
          },
          {
            id: 'q7',
            text: 'What is the "spot market" in freight logistics?',
            options: ['A long-term freight contract with fixed rates', 'A one-time load market where prices fluctuate with supply and demand', 'A government-regulated shipping program', 'A fixed-rate delivery platform'],
            correctIndex: 1,
          },
          {
            id: 'q8',
            text: 'What does "ETA" stand for and why does it matter?',
            options: ['Estimated Total Amount — the final invoice', 'Engine Temperature Alert — a truck safety system', 'Estimated Time of Arrival — used to keep brokers updated on delivery timing', 'Electronic Transfer Authorization — for payment processing'],
            correctIndex: 2,
          },
          {
            id: 'q9',
            text: 'What does a "check call" involve?',
            options: [
              'A call to a shipper to confirm pricing before booking',
              'A call to verify the driver\'s current location and load status',
              'A payment verification call with the carrier',
              'A call to dispute a broker\'s offered rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'q10',
            text: 'What is the role of a consignee in the freight chain?',
            options: [
              'The company that owns the truck and employs drivers',
              'The intermediary who connects shippers and carriers',
              'The party that receives the freight at the final destination',
              'The dispatcher\'s direct supervisor',
            ],
            correctIndex: 2,
          },
          {
            id: 'q11',
            text: 'Mini-case: A broker offers $1,100 for a 900-mile haul. You know the average RPM for this lane is $1.50. What is the right move?',
            options: [
              'Accept immediately — any load is better than deadhead',
              'Reject it and wait for a better offer without responding',
              'Calculate the RPM ($1.22/mile), then negotiate toward the market rate',
              'Ask the driver to decide since it\'s their fuel cost',
            ],
            correctIndex: 2,
          },
          {
            id: 'q12',
            text: 'Mini-case: Your driver is running 2 hours late due to traffic and will miss the delivery window. What do you do first?',
            options: [
              'Wait and see — maybe they\'ll make up time on the highway',
              'Contact the broker immediately, explain the situation, and provide an updated ETA',
              'Cancel the load to avoid a service failure',
              'Call the consignee directly without notifying the broker',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '1-2': {
      type: 'text',
      body: `
        <h2>How the US Logistics System Really Works</h2>
        <blockquote>
          <strong>Key principle:</strong> No participant works in isolation. If the driver is late — the broker suffers. If the broker gives wrong info — the carrier suffers. If the dispatcher plans poorly — everyone loses money.
        </blockquote>

        <h2>Shipper — Where the Goods Are</h2>
        <p>The <strong>shipper</strong> is the physical origin point — a warehouse, factory, or distribution center where the freight is stored. The shipper prepares the cargo for pickup (packaging, labels, documentation).</p>
        <blockquote>
          <strong>Important distinction from customer:</strong> The <strong>shipper</strong> is just the physical location. The <strong>customer</strong> is whoever pays for the transportation — usually a broker, a third-party logistics company, or sometimes the shipper themselves. As a dispatcher, you communicate with brokers (customers), but the driver interacts with shippers (warehouses).
        </blockquote>
        <h3>Shipper Problems for Dispatchers</h3>
        <ul>
          <li><strong>Wrong weight</strong> — driver hits DOT scale overweight → fines and delays</li>
          <li><strong>Unrealistic appointment windows</strong> — 6 AM delivery forces midnight departure, straining HOS</li>
          <li><strong>Last-minute cancellations</strong> — dispatcher must immediately find a replacement or driver deadheads</li>
        </ul>

        <h2>Broker — The Business Connector</h2>
        <p>The broker connects shippers with carriers — owning no trucks. Posts loads on <strong>load boards</strong> such as <strong>Truckstop (ITS)</strong>, negotiates rates, issues the <strong>rate confirmation (rate con)</strong> — a binding written agreement both parties sign before the truck moves.</p>
        <blockquote>
          <strong>Broker economics:</strong> Shipper pays broker: <strong>$3,000</strong> | Carrier receives: <strong>$2,400</strong> | Broker margin: <strong>$600 (20%)</strong><br/>
          The dispatcher's job is to push that margin down — negotiating higher carrier pay.
        </blockquote>
        <h3>Broker Problems</h3>
        <ul>
          <li><strong>Low-balling</strong> — offering below-market rates; counter confidently or walk away</li>
          <li><strong>Double booking</strong> — when a broker first books a load as a carrier (directly from the shipper), then re-sells it to another carrier at a markup, acting as both carrier and broker on the same load</li>
          <li><strong>Rate renegotiation after signing</strong> — signed rate con is legally binding; hold the rate firmly</li>
        </ul>

        <h2>Carrier — The Business of Movement</h2>
        <p>The carrier owns trucks, hires drivers, and moves freight. Types: <strong>owner-operator</strong> (single driver/owner), <strong>small fleet</strong> (2–10 trucks), <strong>large fleet</strong> (50–500+ trucks). The dispatcher is the carrier's revenue engine.</p>
        <blockquote>
          <strong>Carrier cost structure (1,200 mi, CA → TX):</strong> Revenue: <strong>$2,400</strong> | Fuel: <strong>$720</strong> (~$0.60/mi) | Driver pay: <strong>$480</strong> (~$0.40/mi) | Insurance/maintenance: <strong>$300</strong> | Net profit: <strong>~$900</strong><br/>
          Every dollar negotiated above $2,400 goes straight to profit.
        </blockquote>

        <h2>Dispatcher — The Center of the System</h2>
        <p>The dispatcher controls decisions that determine whether everyone gets paid. Core responsibilities:</p>
        <ul>
          <li><strong>Load search:</strong> Evaluate by RPM, lane direction, HOS fit — find the <em>right</em> load, not just any load</li>
          <li><strong>Negotiation:</strong> Always counter the first price; know the load board market rate before calling</li>
          <li><strong>Deadhead minimization:</strong> Think multiple moves ahead — pre-book backhaul before driver arrives</li>
          <li><strong>Check calls:</strong> Every 4–6 hours; track ETA, update broker proactively</li>
          <li><strong>Problem solving:</strong> Cancellations, rate disputes, driver issues — respond under 20 minutes</li>
        </ul>

        <h2>Driver — The Execution Point</h2>
        <p>At <strong>pickup</strong>: the <strong>shipper signs the BOL (Bill of Lading)</strong>. The driver receives a copy and verifies piece count, weight, and condition before signing an acknowledgment. At <strong>delivery</strong>: the driver collects the signed <strong>POD (Proof of Delivery)</strong> from the consignee confirming acceptable receipt.</p>
        <h3>HOS — Hours of Service</h3>
        <blockquote>
          Max <strong>11 hours driving</strong> per day | <strong>10-hour rest</strong> mandatory before next drive | <strong>70-hour</strong> on-duty limit per 8-day rolling period.<br/>
          A driver with 4 hours available cannot legally take a 6-hour load. Track HOS at all times.
        </blockquote>
        <p><strong>Detention:</strong> Driver held at facility beyond the 2-hour free window — document arrival time, claim detention pay from broker immediately.</p>

        <h2>Consignee — The Final Link</h2>
        <p>The <strong>consignee</strong> receives freight at the destination and signs the POD. A delayed consignee causes driver detention. A refused delivery opens a freight claim — dispatcher manages fallout for both broker and carrier.</p>
      `,
      bodyRu: `
        <h2>Как реально работает логистическая система США</h2>
        <blockquote>
          <strong>Ключевой принцип:</strong> Ни один участник не работает изолированно. Водитель опоздал — страдает брокер. Брокер дал неверную информацию — страдает перевозчик. Диспетчер неправильно спланировал — все теряют деньги.
        </blockquote>

        <h2>Shipper (Грузоотправитель) — Где находится груз</h2>
        <p><strong>Shipper</strong> — это физическая точка отправления: склад, завод или дистрибуционный центр, где хранится груз. Shipper готовит груз к отправке (упаковка, маркировка, документы).</p>
        <blockquote>
          <strong>Важное отличие от customer (заказчика):</strong> <strong>Shipper</strong> — это просто физическое место. <strong>Customer (заказчик)</strong> — тот, кто платит за перевозку: обычно брокер, 3PL-компания, а иногда и сам shipper. Диспетчер общается с брокерами (customers), а водитель взаимодействует с shippers (складами).
        </blockquote>
        <h3>Проблемы от Shipper'а</h3>
        <ul>
          <li><strong>Неверный вес</strong> — водитель едет на весовую DOT с перегрузом → штрафы и задержки</li>
          <li><strong>Нереалистичные окна</strong> — доставка в 6:00 → выезд в полночь, давление на HOS</li>
          <li><strong>Отмена в последний момент</strong> — диспетчер срочно ищет замену, иначе водитель едет порожним</li>
        </ul>

        <h2>Broker (Брокер) — Связующее звено</h2>
        <p>Брокер соединяет shippers с carriers, не владея транспортом. Публикует грузы на <strong>load boards</strong>, таких как <strong>Truckstop (ITS)</strong>, оформляет <strong>rate con</strong> — обязывающий документ, который обе стороны подписывают до начала перевозки.</p>
        <blockquote>
          <strong>Экономика брокера:</strong> Shipper платит: <strong>$3 000</strong> | Carrier получает: <strong>$2 400</strong> | Маржа брокера: <strong>$600 (20%)</strong><br/>
          Задача диспетчера — выторговать более высокую ставку для carrier'а, сократив маржу.
        </blockquote>
        <h3>Проблемы с брокерами</h3>
        <ul>
          <li><strong>Low-balling</strong> — заниженные ставки; торговаться уверенно или уходить</li>
          <li><strong>Double booking</strong> — ситуация, когда брокер сначала берёт груз как carrier (напрямую у shipper'а), а затем перепродаёт его другому carrier'у с наценкой, выступая одновременно и carrier'ом, и брокером на одном и том же грузе</li>
          <li><strong>Renegotiation после подписания rate con</strong> — подписанный rate con юридически обязателен; держать позицию твёрдо</li>
        </ul>

        <h2>Carrier (Перевозчик) — Бизнес на движении</h2>
        <p>Carrier владеет грузовиками и нанимает водителей. Типы: <strong>owner-operator</strong> (один водитель/владелец), <strong>small fleet</strong> (2–10 машин), <strong>large fleet</strong> (50–500+ машин). Диспетчер — двигатель выручки carrier'а.</p>
        <blockquote>
          <strong>Структура затрат (1 200 миль, CA → TX):</strong> Выручка: <strong>$2 400</strong> | Топливо: <strong>$720</strong> (~$0,60/миля) | Водитель: <strong>$480</strong> (~$0,40/миля) | Страховка/техобслуж.: <strong>$300</strong> | Чистая прибыль: <strong>~$900</strong><br/>
          Каждый доллар сверх $2 400 — прямая прибыль. Вот почему переговоры критичны.
        </blockquote>

        <h2>Dispatcher (Диспетчер) — Центр системы</h2>
        <p>Диспетчер принимает решения, от которых зависит, получат ли все остальные свои деньги. Ключевые обязанности:</p>
        <ul>
          <li><strong>Поиск груза:</strong> Оценивать по RPM, направлению, соответствию HOS — искать <em>правильный</em> груз, а не любой</li>
          <li><strong>Переговоры:</strong> Всегда делать контрпредложение; знать ставку load board до звонка</li>
          <li><strong>Минимизация deadhead:</strong> Думать на несколько ходов вперёд, бронировать backhaul до прибытия водителя</li>
          <li><strong>Check calls:</strong> Каждые 4–6 часов; обновлять ETA брокеру проактивно</li>
          <li><strong>Решение проблем:</strong> Отмены, споры по ставке, проблемы с водителем — реагировать в течение 20 минут</li>
        </ul>

        <h2>Driver (Водитель) — Точка исполнения</h2>
        <p>На <strong>pickup</strong>: <strong>BOL (Bill of Lading) подписывает shipper</strong>. Водитель получает копию, проверяет количество мест, вес и состояние груза, после чего ставит подпись-подтверждение. На <strong>delivery</strong>: водитель получает подписанный <strong>POD (Proof of Delivery)</strong> от consignee — подтверждение, что груз принят в надлежащем состоянии.</p>
        <h3>HOS — Hours of Service</h3>
        <blockquote>
          Макс. <strong>11 часов вождения</strong> в сутки | <strong>10 часов отдыха</strong> обязательно до следующей смены | <strong>70 часов</strong> on-duty за любые 8 дней.<br/>
          Водитель с остатком 4 часа не может взять 6-часовой рейс. HOS необходимо отслеживать всегда.
        </blockquote>
        <p><strong>Detention:</strong> Водитель ждёт сверх 2 часов бесплатного времени — фиксировать время прибытия и немедленно требовать detention pay от брокера.</p>

        <h2>Consignee (Грузополучатель) — Финальное звено</h2>
        <p><strong>Consignee</strong> принимает груз и подписывает POD. Задержка consignee вызывает detention. Отказ от груза открывает freight claim — диспетчер управляет последствиями для брокера и carrier'а одновременно.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'th-q1',
            text: 'What is the shipper in US trucking terminology?',
            options: [
              'The company that owns trucks and hires drivers',
              'The physical origin — warehouse or facility where the freight is stored and prepared for pickup',
              'The person or company that pays for the transportation',
              'The driver who transports the freight',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q2',
            text: 'What does "broker margin" represent in US trucking?',
            options: [
              'The total amount the shipper pays for transportation',
              'The dispatcher\'s commission on each booked load',
              'The difference between what the shipper pays the broker and what the carrier receives',
              'The fee charged by load boards for posting freight',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q3',
            text: 'What is a rate confirmation (rate con) and why does it matter?',
            options: [
              'A verbal agreement between dispatcher and driver about their pay',
              'A binding written document confirming the agreed rate and load details — both parties sign before the truck moves',
              'A receipt the consignee signs upon delivery',
              'The broker\'s internal pricing guide for common lanes',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q4',
            text: 'Under US HOS (Hours of Service) rules, what is the maximum driving time a driver can accumulate within the 14-hour on-duty window?',
            options: [
              '10 hours of driving',
              '11 hours of driving',
              '12 hours of driving',
              '14 hours of driving',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q5',
            text: 'What is "detention" in trucking and who should compensate for it?',
            options: [
              'A DOT fine for regulatory violations, paid by the carrier',
              'Waiting time beyond the free-time limit at a shipper or consignee facility — compensated by the broker/shipper',
              'The cost of fuel when driving through toll roads',
              'A penalty charged to the broker for posting inaccurate load data',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q6',
            text: 'How is an independent dispatcher typically compensated when working with a carrier in the US sprinter-van segment?',
            options: [
              'The dispatcher receives a percentage of the margin between what the broker pays the carrier and what is actually paid out to the driver/truck — not a percentage of the gross load revenue',
              'A flat monthly retainer paid by the broker regardless of load volume',
              'A fixed 10% of the gross load revenue paid directly by the shipper',
              'Nothing — dispatchers are considered part of the broker\'s office and are compensated by the brokerage',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q7',
            text: 'What does "double booking" actually mean in US freight brokerage?',
            options: [
              'When a broker first books a load as a carrier directly from the shipper, then re-sells that same load to another carrier at a markup — acting as both carrier and broker on the same load',
              'Booking two separate loads for the same driver on the same day to maximize miles',
              'Posting the same truck on two different load boards at the same time',
              'A dispatcher accidentally accepting two rate confirmations for conflicting pickup times',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q8',
            text: 'What is the POD (Proof of Delivery) and when is it collected?',
            options: [
              'A document the driver signs before picking up freight to confirm the planned route',
              'A broker authorization form that releases payment to the carrier',
              'A signed document collected at delivery confirming the freight arrived in acceptable condition',
              'A federal inspection certificate issued at DOT weigh stations',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q9',
            text: 'A broker calls after the rate con is signed, asking to reduce the agreed rate because "the market dropped." What is the correct dispatcher response?',
            options: [
              'Agree — keeping the broker relationship is more important than a few hundred dollars',
              'Ignore the call and proceed with the original rate',
              'Politely but firmly decline — the signed rate con is a legally binding document and the rate stands as agreed',
              'Offer a partial concession of 10% to maintain goodwill',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q10',
            text: 'What distinguishes an owner-operator from a large fleet carrier, and how does this affect dispatching?',
            options: [
              'An owner-operator drives for a large company; a fleet carrier is independent',
              'An owner-operator is a single driver running their own business — they benefit most from external dispatching because they lack the bandwidth for load searching and negotiation',
              'Owner-operators only handle dedicated contract freight; fleet carriers work the spot market exclusively',
              'Owner-operators are not permitted to work with independent dispatchers under federal law',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q11',
            text: 'Mini-case (sprinter van): Your driver just finished delivery in Phoenix, AZ — the truck is empty and ready. The load board shows:\n\nOption A: PHX → Los Angeles, CA | 380 mi | $1,200 | RPM $3.16\nOption B: PHX → Denver, CO | 830 mi | $2,600 | RPM $3.13\nOption C: Wait 24 hours in Phoenix for "better rates"\nOption D: Deadhead 1,000 mi to Dallas, TX for a "better market"\n\nWhat is the strongest move for a sprinter van?',
            options: [
              'Option A — PHX → LA: fast turnover, solid $3.16/mi RPM, and LA is a strong sprinter market where the next load is easy to find',
              'Option B — PHX → Denver: highest gross dollars, Denver is always a strong return market',
              'Option C — Wait 24 hours — rates from Phoenix almost always rise overnight',
              'Option D — Deadhead 1,000 mi to Dallas for a better market, absorb the fuel cost, book a big load there',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q12',
            text: 'Mini-case: Tuesday 2:00 PM. Your driver is 200 miles from delivering in Atlanta when the broker calls: the consignee rescheduled — they cannot receive until Thursday morning. Your driver has a confirmed load starting Wednesday 8:00 AM from a city 150 miles north of Atlanta. The broker asks if the driver can wait. What do you do?',
            options: [
              'Agree immediately — maintaining broker relationships is the top priority',
              'Explain the scheduling conflict clearly: accepting the delay breaks the Wednesday commitment. Ask the broker for an alternative Wednesday appointment time, or whether they can source a different carrier for the delayed delivery',
              'Have the driver deliver anyway and let the consignee deal with the appointment issue',
              'Cancel both loads to avoid any scheduling conflict',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'th-q1',
            text: 'Что такое shipper в терминологии грузоперевозок США?',
            options: [
              'Компания, владеющая грузовиками и нанимающая водителей',
              'Физическая точка отправления — склад или объект, где хранится и готовится к отправке груз',
              'Человек или компания, оплачивающая перевозку',
              'Водитель, который везёт груз',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q2',
            text: 'Что означает "broker margin" в грузоперевозках США?',
            options: [
              'Общая сумма, которую shipper платит за перевозку',
              'Комиссия диспетчера с каждого забронированного груза',
              'Разница между тем, что shipper платит брокеру, и тем, что получает carrier',
              'Плата, взимаемая биржами грузов за размещение заявок',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q3',
            text: 'Что такое rate confirmation (rate con) и почему он важен?',
            options: [
              'Устное соглашение между диспетчером и водителем об их оплате',
              'Обязывающий письменный документ с согласованной ставкой и деталями груза — обе стороны подписывают до начала перевозки',
              'Квитанция, которую consignee подписывает при получении груза',
              'Внутренний прайс-лист брокера для типовых направлений',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q4',
            text: 'Согласно правилам HOS (Hours of Service) в США, сколько максимум часов водитель может проехать за 14-часовое рабочее окно?',
            options: [
              '10 часов за рулём',
              '11 часов за рулём',
              '12 часов за рулём',
              '14 часов за рулём',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q5',
            text: 'Что такое detention в грузоперевозках и кто должен его компенсировать?',
            options: [
              'Штраф DOT за нарушения, оплачиваемый carrier\'ом',
              'Время ожидания водителя сверх бесплатного лимита у shipper\'а или consignee — компенсируется брокером/shipper\'ом',
              'Стоимость топлива на платных дорогах',
              'Штраф за размещение неточных данных о грузе',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q6',
            text: 'Как обычно оплачивается работа независимого диспетчера, работающего с carrier\'ом в сегменте sprinter van в США?',
            options: [
              'Диспетчер получает процент от маржи между тем, что брокер платит carrier\'у, и тем, что фактически выплачивается водителю/машине, — не процент от валовой стоимости груза',
              'Фиксированный ежемесячный retainer от брокера вне зависимости от объёма грузов',
              'Фиксированные 10% от валовой стоимости груза, оплачиваемые напрямую shipper\'ом',
              'Ничего — диспетчеры считаются сотрудниками офиса брокера и оплачиваются брокерской компанией',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q7',
            text: 'Что на самом деле означает "double booking" в американском брокерском бизнесе?',
            options: [
              'Ситуация, когда брокер сначала берёт груз как carrier напрямую у shipper\'а, а затем перепродаёт его другому carrier\'у с наценкой, выступая одновременно и carrier\'ом, и брокером на одном и том же грузе',
              'Бронирование двух разных грузов для одного водителя в один день ради увеличения миль',
              'Размещение одного и того же грузовика одновременно на двух разных load board\'ах',
              'Случайное подписание двух rate con с пересекающимся временем pickup',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q8',
            text: 'Что такое POD (Proof of Delivery) и когда он оформляется?',
            options: [
              'Документ, который водитель подписывает перед забором груза для подтверждения маршрута',
              'Форма брокера, разрешающая выплату carrier\'у',
              'Подписанный при доставке документ, подтверждающий, что груз принят в надлежащем состоянии',
              'Федеральное инспекционное свидетельство с весовой станции DOT',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q9',
            text: 'Брокер звонит уже после подписания rate con с просьбой снизить согласованную ставку — "рынок упал". Какова правильная реакция диспетчера?',
            options: [
              'Согласиться — отношения с брокером важнее нескольких сотен долларов',
              'Игнорировать звонок и продолжить по оригинальной ставке',
              'Вежливо, но твёрдо отказать — подписанный rate con является юридически обязывающим документом, ставка остаётся как договорились',
              'Предложить частичную скидку 10% ради поддержания отношений',
            ],
            correctIndex: 2,
          },
          {
            id: 'th-q10',
            text: 'Чем owner-operator отличается от крупного fleet carrier и как это влияет на диспетчеризацию?',
            options: [
              'Owner-operator работает на крупную компанию; fleet carrier — самостоятельный бизнес',
              'Owner-operator — одиночный водитель, ведущий собственный бизнес: он больше всех выигрывает от внешней диспетчеризации, так как не имеет ресурсов на поиск грузов и переговоры',
              'Owner-operators работают только на контрактных направлениях; fleet carriers — исключительно на спотовом рынке',
              'Федеральный закон запрещает owner-operators работать с независимыми диспетчерами',
            ],
            correctIndex: 1,
          },
          {
            id: 'th-q11',
            text: 'Мини-кейс (sprinter van): Водитель только что сдал груз в Phoenix, AZ — машина пустая, готов брать следующий. На load board:\n\nВариант A: PHX → Лос-Анджелес, CA | 380 миль | $1 200 | RPM $3,16\nВариант B: PHX → Денвер, CO | 830 миль | $2 600 | RPM $3,13\nВариант C: Подождать 24 часа в Фениксе "лучших ставок"\nВариант D: Deadhead 1 000 миль в Даллас, TX ради "более сильного рынка"\n\nКакое решение сильнее всего для sprinter van?',
            options: [
              'Вариант A — PHX → LA: быстрый оборот, уверенные $3,16/миля, и LA — сильный рынок для sprinter van, где следующий груз найти легко',
              'Вариант B — PHX → Денвер: максимальная общая сумма, Денвер всегда сильный обратный рынок',
              'Вариант C — Подождать 24 часа: ставки из Феникса почти всегда вырастают за ночь',
              'Вариант D — Deadhead 1 000 миль в Даллас: стоимость топлива отобьётся крупным грузом на сильном рынке',
            ],
            correctIndex: 0,
          },
          {
            id: 'th-q12',
            text: 'Мини-кейс: Вторник, 14:00. Вашему водителю 200 миль до доставки в Атланте, когда брокер звонит: consignee перенёс приём — не может принять до четверга утром. У вашего водителя уже подтверждён груз на среду в 08:00 из города в 150 милях к северу от Атланты. Брокер спрашивает, может ли водитель подождать. Что делаете?',
            options: [
              'Сразу соглашаетесь — поддержание отношений с брокером является главным приоритетом',
              'Чётко объясняете конфликт расписания: принятие задержки срывает обязательство на среду. Просите брокера найти альтернативный слот в среду или передать отложенную доставку другому carrier\'у',
              'Водитель едет на доставку в любом случае, пусть consignee разбирается с appointment\'ом',
              'Отменяете оба груза, чтобы избежать любого конфликта',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '1-3': {
      type: 'text',
      dispatcherDay: true,
      body: `
        <h2>A Dispatcher's Workday — From First Call to Last Load</h2>
        <blockquote>
          <strong>The dispatcher's day is a continuous cycle:</strong> Search → Negotiate → Book → Monitor → Solve → Repeat
        </blockquote>

        <h2>7:00 AM — Morning Status Check</h2>
        <p>Before any broker call: check <strong>driver positions and HOS</strong> (who can take long vs. short runs), <strong>active loads</strong> (on schedule? broker needs ETA update?), and <strong>overnight messages</strong> (driver problems, appointment changes).</p>
        <blockquote>
          Driver messaged at 2 AM: "Stuck at shipper — running 6 hours behind." → Call the broker immediately, provide updated ETA, ask to push the delivery appointment. Get ahead of the problem before the broker finds out on their own.
        </blockquote>

        <h2>8:00 AM — Load Search + RPM Calculation</h2>
        <p>Search load boards (Truckstop) filtered by driver's pickup location. Evaluate by lane direction (strong outbound market at destination?) and always calculate RPM — not just total dollars.</p>
        <blockquote>
          Load A: $1,800 / 1,100 mi = <strong>$1.64 RPM</strong> | Load B: $2,400 / 1,800 mi = <strong>$1.33 RPM</strong><br/>
          Load B pays $600 more total — but Load A earns $0.31 more per mile. Always run the math.
        </blockquote>

        <h2>9:15 AM — Broker Call + Negotiation</h2>
        <blockquote>
          Broker posts $1,400. You: <em>"Truck in Atlanta today, clean carrier. I need $1,700 to make the numbers work."</em> Broker: <em>"Best I can do is $1,550."</em> You: <em>"Split it — $1,625?"</em> Broker: <em>"Done. Sending rate con."</em><br/>
          Result: +$225 above posted rate. Check load board rate history before calling. Never accept the first price.
        </blockquote>

        <h2>10:00 AM — Booking Checklist</h2>
        <ul>
          <li>Verify rate con: addresses, rate, appointment times, weight/commodity match</li>
          <li><strong>Never move the driver before both parties sign the rate con</strong></li>
          <li>Brief driver: address, appointment time, weight, trailer type, delivery details</li>
          <li>Confirm HOS — driver must have enough hours to complete the run legally</li>
        </ul>

        <h2>12:30 PM — Pickup + Detention Clock</h2>
        <p>Standard free time: 2 hours. After that, detention pay applies ($25–75/hr). Document check-in time, notify broker at the 2-hour mark, and follow up for payment. Detention does not happen automatically — you must claim it.</p>

        <h2>2:45 PM — Driver Moving + Check Calls</h2>
        <p>Check calls: first at 2–3 hrs after departure, then every <strong>4–6 hours</strong>, evening before delivery, and 1–2 hrs out from destination. While driver moves — <strong>search for next load immediately</strong>. By delivery time, the next run should already be confirmed. Zero deadhead.</p>

        <h2>5:00 PM — Problem: Consignee Reschedule</h2>
        <p>Broker calls: consignee can't receive Thursday — earliest Friday afternoon. Options: (1) Accept delay and claim detention; (2) negotiate Thursday evening window; (3) find drop yard near destination, release driver. <strong>Never react emotionally — work the problem.</strong></p>

        <h2>Delivery Complete + Daily Metrics</h2>
        <blockquote>
          <strong>Full cycle result:</strong> Negotiated $1,400 → $1,625 | Zero deadhead | POD collected | Next load already confirmed<br/><br/>
          <strong>Key daily metrics:</strong><br/>
          <strong>RPM target (Sprinter / Cargo Van, 2026 market)</strong> — realistic range is $1.20–$1.80/mi on average lanes, $1.80–$2.50/mi on hot lanes / high-demand corridors, and $0.90–$1.30/mi in slow markets. Short runs (under 300 mi) can reach $1.80+/mi.<br/>
          <strong>Deadhead %</strong> — target below 10–15%<br/>
          <strong>Detention claims</strong> — claim every incident; unclaimed detention is lost revenue<br/>
          <strong>On-time delivery rate</strong> — brokers track this; high rate = preferred carrier status
        </blockquote>
      `,
      bodyRu: `
        <h2>Рабочий день диспетчера — от первого звонка до последнего груза</h2>
        <blockquote>
          <strong>День диспетчера — непрерывный цикл:</strong> Поиск → Переговоры → Бронирование → Мониторинг → Решение → Снова поиск
        </blockquote>

        <h2>7:00 — Утренняя проверка статуса</h2>
        <p>До первого звонка брокеру: проверить <strong>позиции водителей и остаток HOS</strong> (кто может взять длинный/короткий рейс), <strong>активные грузы</strong> (идут по плану? нужно обновить ETA?), <strong>ночные сообщения</strong> (проблемы водителей, изменения appointment).</p>
        <blockquote>
          Водитель написал в 2:00 ночи: "Застрял у shipper'а — опаздываю на 6 часов." → Немедленно звоним брокеру, даём обновлённый ETA, просим сдвинуть appointment. Опережаем проблему — не даём брокеру узнать самому.
        </blockquote>

        <h2>8:00 — Поиск груза + расчёт RPM</h2>
        <p>Ищем на load board/Truckstop с фильтром по позиции водителя. Оцениваем lane (сильный ли рынок в точке доставки?) и всегда считаем RPM — не только итоговую сумму.</p>
        <blockquote>
          Груз A: $1 800 / 1 100 миль = <strong>$1,64 RPM</strong> | Груз B: $2 400 / 1 800 миль = <strong>$1,33 RPM</strong><br/>
          Груз B платит на $600 больше — но Груз A выгоднее на $0,31 за каждую милю. Всегда считайте математику.
        </blockquote>

        <h2>9:15 — Звонок брокеру + переговоры</h2>
        <blockquote>
          Брокер выставляет $1 400. Вы: <em>"Машина в Атланте сегодня, надёжный carrier. Мне нужно $1 700."</em> Брокер: <em>"Лучшее — $1 550."</em> Вы: <em>"Поделим — $1 625?"</em> Брокер: <em>"Договорились."</em><br/>
          Результат: +$225 сверх выставленной ставки. Проверьте историю load board до звонка. Никогда не принимайте первую цену.
        </blockquote>

        <h2>10:00 — Чеклист бронирования</h2>
        <ul>
          <li>Проверьте rate con: адреса, ставка, времена appointment, вес и тип груза</li>
          <li><strong>Водитель не выезжает до подписания rate con обеими сторонами</strong></li>
          <li>Инструктаж водителя: адрес, время, вес, тип прицепа, детали доставки</li>
          <li>Проверить HOS — водитель должен успеть завершить рейс в рамках закона</li>
        </ul>

        <h2>12:30 — Pickup + отсчёт detention</h2>
        <p>Бесплатное время: 2 часа. После — detention pay ($25–75/час). Зафиксировать время check-in, уведомить брокера ровно на отметке 2 часов, требовать оплату. Detention не происходит автоматически — нужно заявлять и документировать.</p>

        <h2>14:45 — Водитель в пути + check calls</h2>
        <p>Первый check call через 2–3 часа, затем каждые <strong>4–6 часов</strong>, вечером накануне доставки, за 1–2 часа до пункта назначения. Пока водитель едет — <strong>искать следующий груз немедленно</strong>. К моменту доставки следующий рейс должен быть подтверждён. Нулевой deadhead.</p>

        <h2>17:00 — Проблема: перенос consignee</h2>
        <p>Брокер звонит: consignee не может принять в четверг — ближайший слот пятница днём. Варианты: (1) принять задержку и заявить detention; (2) договориться о доставке в четверг вечером; (3) найти drop yard рядом, освободить водителя. <strong>Не реагировать эмоционально — работать с проблемой.</strong></p>

        <h2>Доставка завершена + ключевые метрики</h2>
        <blockquote>
          <strong>Итог полного цикла:</strong> Выторговано $1 400 → $1 625 | Нулевой deadhead | POD получен | Следующий груз подтверждён<br/><br/>
          <strong>Ключевые ежедневные метрики:</strong><br/>
          <strong>Целевой RPM (Sprinter / Cargo Van, рынок 2026)</strong> — реалистичный диапазон: $1,20–$1,80/миля на средних рейсах, $1,80–$2,50/миля на популярных направлениях/hot lanes, $0,90–$1,30/миля на слабом рынке. Короткие рейсы (до 300 миль) могут доходить до $1,80+/миля.<br/>
          <strong>% deadhead</strong> — цель ниже 10–15%<br/>
          <strong>Заявки на detention</strong> — требовать при каждом инциденте; незаявленный detention — потерянная выручка<br/>
          <strong>Процент своевременных доставок</strong> — брокеры отслеживают; высокий показатель = статус предпочтительного carrier'а
        </blockquote>
      `,
      quiz: {
        questions: [
          {
            id: 'dm-q1',
            text: 'What is the primary purpose of the morning status check at the start of a dispatcher\'s day?',
            options: [
              'To update personal earnings tracking and invoice records',
              'To review driver positions, HOS availability, active load status, and any overnight messages before making any new decisions',
              'To post available trucks on load boards for brokers to see',
              'To schedule check calls for the entire week in advance',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q2',
            text: 'A load pays $2,400 for 1,800 miles. Another load pays $1,800 for 1,100 miles. Which has the better RPM and what does that mean?',
            options: [
              'The $2,400 load — higher total pay always means better profitability',
              'The $1,800 load — its RPM is $1.64/mile vs $1.33/mile, meaning it generates more profit per mile after costs',
              'They are equal — total pay and RPM are the same metric',
              'RPM only matters for loads over 1,500 miles',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q3',
            text: 'Before negotiating a rate with a broker, what should a dispatcher do first?',
            options: [
              'Accept the posted rate to secure the load quickly before competitors',
              'Check the load board rate history for this lane to understand what the market is currently paying',
              'Call the driver to confirm they want the load',
              'Email the broker their carrier\'s safety rating and insurance documents',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q4',
            text: 'What is a check call and how often should they typically be made during a long-haul trip?',
            options: [
              'A call to the broker to check if the rate can be increased mid-trip — once per day',
              'A brief call to the driver confirming location and status — every 4–6 hours, with extra calls before and near delivery',
              'A call to the consignee to verify the delivery appointment — once at the start of the trip',
              'A call to DOT to report driver compliance — only when issues arise',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q5',
            text: 'The driver arrives at the shipper at 12:30 PM but is not loaded until 4:00 PM. What should the dispatcher do?',
            options: [
              'Nothing — waiting at the shipper is a normal part of trucking with no compensation',
              'Document the driver\'s arrival time, notify the broker that detention is accruing from the 2-hour mark, and submit a detention claim on the invoice',
              'Cancel the load — excessive waiting time is grounds for terminating the agreement',
              'Contact the consignee to warn them of a potential late delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q6',
            text: 'When should a dispatcher start searching for the next load after booking the current one?',
            options: [
              'After the current delivery is confirmed complete and the POD is received',
              'The morning of the delivery day',
              'While the driver is in transit — ideally finding the next load the day before delivery so there is zero downtime',
              'Only after the driver requests a new assignment',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q7',
            text: 'Why should a dispatcher never let the driver move before the rate confirmation is signed?',
            options: [
              'Federal law requires a signed rate con before any truck can legally depart',
              'The signed rate con is the legal document protecting the agreed rate — without it, the broker can change terms or deny payment in a dispute',
              'Insurance coverage does not activate until the rate con is signed',
              'The driver needs the rate con to know which highway route to take',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q8',
            text: 'What does "deadhead" mean and why does minimizing it matter?',
            options: [
              'A cancelled load — minimizing it means fewer lost bookings',
              'Miles driven with an empty trailer generating zero revenue — it costs fuel and driver time with no income, directly reducing profitability',
              'Time spent waiting at a shipper or consignee — minimizing it reduces driver fatigue',
              'A broker who does not respond after booking — avoiding them improves reliability',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q9',
            text: 'A broker posts a load at $1,900. You call and say you need $2,200. The broker says their ceiling is $2,050. What is the best next move?',
            options: [
              'Accept $2,050 — the broker has stated their maximum and further pushing will lose the load',
              'Reject the load entirely — only accept loads that meet your full ask',
              'Counter with $2,125 (split the difference) — a reasonable middle ground that often gets accepted',
              'Ask the driver if $2,050 is acceptable before responding to the broker',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q10',
            text: 'What are the key daily metrics an effective dispatcher should track?',
            options: [
              'Number of broker calls made, total hours worked, and number of emails sent',
              'RPM target, deadhead percentage, detention claims, and on-time delivery rate',
              'Driver mood rating, broker friendliness score, and load board subscription cost',
              'Total miles driven, number of state borders crossed, and fuel price averages',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q11',
            text: 'Mini-case: It\'s 6:00 AM. Your driver messages: "Truck won\'t start — engine issue. I have a load picking up at 9:00 AM." What do you do?',
            options: [
              'Wait until 8:00 AM to see if the driver resolves it themselves before taking action',
              'Immediately call the broker, explain the mechanical issue, ask for a later pickup time or whether they need to source another carrier — then help the driver arrange roadside assistance and document everything',
              'Cancel the load without notifying the broker and search for a new load for tomorrow',
              'Have the driver call the broker directly — mechanical issues are the driver\'s responsibility',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q12',
            text: 'Mini-case: It\'s 3:00 PM. Your driver just delivered. The next booked load picks up tomorrow at 7:00 AM, 450 miles away. The driver has 8 hours of available HOS. Should the driver drive now or wait until morning?',
            options: [
              'Wait until morning — driving at night is dangerous and not worth the risk',
              'Drive now — 450 miles at highway speed takes roughly 7 hours, which fits within the 8-hour HOS window. Arriving tonight means the driver can rest and be ready for the 7:00 AM appointment. Waiting means a rushed morning or a missed pickup',
              'Drive halfway and rest — always split long drives regardless of HOS availability',
              'Call the broker and ask them to move the pickup to noon tomorrow',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'dm-q1',
            text: 'Какова основная цель утренней проверки статуса в начале рабочего дня диспетчера?',
            options: [
              'Обновить личный учёт заработка и записи по invoice',
              'Узнать позиции водителей, доступные часы HOS, статус активных грузов и ночные сообщения до принятия каких-либо новых решений',
              'Разместить доступные грузовики на биржах грузов для брокеров',
              'Запланировать check calls на всю неделю вперёд',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q2',
            text: 'Груз A платит $2 400 за 1 800 миль. Груз B платит $1 800 за 1 100 миль. У какого лучше RPM и что это означает?',
            options: [
              'Груз A — более высокая итоговая сумма всегда означает большую прибыльность',
              'Груз B — его RPM $1,64/миля против $1,33/миля, то есть он приносит больше прибыли на каждую милю после расходов',
              'Они равны — итоговая сумма и RPM — это одно и то же',
              'RPM важен только для грузов свыше 1 500 миль',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q3',
            text: 'Что диспетчер должен сделать в первую очередь перед переговорами о ставке с брокером?',
            options: [
              'Принять выставленную ставку, чтобы быстро забрать груз до конкурентов',
              'Проверить историю ставок load board по этому направлению, чтобы знать, что сейчас платит рынок',
              'Позвонить водителю и уточнить, хочет ли он этот груз',
              'Отправить брокеру safety rating и страховые документы carrier\'а',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q4',
            text: 'Что такое check call и как часто их нужно делать во время дальнего рейса?',
            options: [
              'Звонок брокеру с просьбой повысить ставку в процессе рейса — один раз в день',
              'Короткий звонок водителю для подтверждения местоположения и статуса — каждые 4–6 часов, с дополнительными звонками перед доставкой и вблизи пункта назначения',
              'Звонок consignee для подтверждения delivery appointment — один раз в начале рейса',
              'Звонок в DOT для отчёта о соблюдении водителем правил — только при проблемах',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q5',
            text: 'Водитель прибывает к shipper\'у в 12:30, но загружается только в 16:00. Что должен сделать диспетчер?',
            options: [
              'Ничего — ожидание у shipper\'а — обычная часть работы без компенсации',
              'Зафиксировать время прибытия водителя, уведомить брокера о накоплении detention с отметки 2 часов и включить detention claim в invoice',
              'Отменить груз — чрезмерное ожидание является основанием для расторжения договора',
              'Связаться с consignee, чтобы предупредить о возможном опоздании',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q6',
            text: 'Когда диспетчер должен начинать поиск следующего груза после бронирования текущего?',
            options: [
              'После подтверждения текущей доставки и получения POD',
              'Утром в день доставки',
              'Пока водитель в пути — идеально найти следующий груз накануне доставки, чтобы не было простоев',
              'Только после того, как водитель сам попросит новое задание',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q7',
            text: 'Почему нельзя позволять водителю двигаться до подписания rate confirmation?',
            options: [
              'Федеральный закон требует подписанного rate con до любого законного отправления грузовика',
              'Подписанный rate con — это юридический документ, защищающий согласованную ставку: без него брокер может изменить условия или отказать в оплате при споре',
              'Страховое покрытие не активируется до подписания rate con',
              'Водителю нужен rate con, чтобы знать, каким шоссе ехать',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q8',
            text: 'Что такое deadhead и почему важно его минимизировать?',
            options: [
              'Отменённый груз — минимизация означает меньше потерянных бронирований',
              'Мили, пройденные с пустым прицепом без выручки — они стоят топлива и времени водителя при нулевом доходе, напрямую снижая прибыльность',
              'Время ожидания у shipper\'а или consignee — минимизация снижает усталость водителя',
              'Брокер, который не отвечает после бронирования — избегание таких улучшает надёжность',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q9',
            text: 'Брокер выставил груз за $1 900. Вы звоните и говорите, что вам нужно $2 200. Брокер говорит, что его потолок — $2 050. Какой лучший следующий шаг?',
            options: [
              'Принять $2 050 — брокер назвал свой максимум, дальнейшее давление приведёт к потере груза',
              'Полностью отказаться от груза — принимать только грузы, которые соответствуют вашему полному запросу',
              'Предложить $2 125 (разделить разницу) — разумный компромисс, который часто принимается',
              'Спросить водителя, устраивает ли его $2 050, прежде чем отвечать брокеру',
            ],
            correctIndex: 2,
          },
          {
            id: 'dm-q10',
            text: 'Какие ключевые ежедневные метрики должен отслеживать эффективный диспетчер?',
            options: [
              'Количество звонков брокерам, отработанные часы и количество отправленных писем',
              'Целевой RPM, процент deadhead, заявки на detention и процент своевременных доставок',
              'Настроение водителя, оценка дружелюбности брокера и стоимость подписки на биржу грузов',
              'Общий пробег, количество пересечённых границ штатов и средние цены на топливо',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q11',
            text: 'Мини-кейс: 6:00 утра. Водитель пишет: "Машина не заводится — проблема с двигателем. У меня pickup в 9:00." Что делаете?',
            options: [
              'Ждёте до 8:00, чтобы посмотреть, решит ли водитель проблему сам, прежде чем предпринимать действия',
              'Немедленно звоните брокеру, объясняете поломку, просите сдвинуть pickup или уточняете, нужно ли им найти другого carrier\'а — затем помогаете водителю вызвать техпомощь и документируете всё',
              'Отменяете груз без уведомления брокера и ищете новый груз на завтра',
              'Просите водителя самому звонить брокеру — механические проблемы — ответственность водителя',
            ],
            correctIndex: 1,
          },
          {
            id: 'dm-q12',
            text: 'Мини-кейс: 15:00. Ваш водитель только что сдал груз. Следующий забронированный груз забирается завтра в 7:00 утра, в 450 милях отсюда. У водителя 8 часов доступного HOS. Ехать сейчас или ждать до утра?',
            options: [
              'Ждать до утра — езда ночью опасна и не стоит риска',
              'Ехать сейчас — 450 миль со скоростью шоссе займут около 7 часов, что укладывается в 8-часовой лимит HOS. Приехав сегодня, водитель отдохнёт и будет готов к appointment в 7:00. Ожидание означает спешку утром или срыв pickup',
              'Проехать половину и отдохнуть — всегда разделять длинные поездки вне зависимости от доступности HOS',
              'Позвонить брокеру и попросить перенести pickup на полдень завтра',
            ],
            correctIndex: 1,
          },
        ],
      },
      simulation: true,
    },
    '1-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 1: Introduction to US Trucking</h2>
        <p>This practice test covers all material from Chapter 1: the roles of each participant in the freight supply chain, key industry terminology, and real dispatcher decision-making scenarios from the Demo lesson.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases. Each mini-case presents a real-world situation where you must choose the best professional course of action.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20 correct) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Roles in US freight: Shipper, Broker, Carrier, Dispatcher, Driver, Consignee</li>
          <li>Key terminology: RPM, BOL, HOS, CDL-A, detention, deadhead, load board, rate confirmation</li>
          <li>Dispatcher responsibilities: load selection by RPM, broker negotiation, driver management</li>
          <li>Real-world problem scenarios and professional decision-making</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 1: Введение в грузоперевозки США</h2>
        <p>Этот практический тест охватывает все материалы Главы 1: роль каждого участника цепочки поставок, ключевую терминологию отрасли и реальные сценарии принятия решений из блока Демо.</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных вопросов и 5 мини-кейсов. Мини-кейс описывает реальную рабочую ситуацию, где необходимо выбрать наилучший вариант действий.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20 правильных ответов) для прохождения практики по этой главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Роли в грузоперевозках США: Shipper, Broker, Carrier, Dispatcher, Driver, Consignee</li>
          <li>Ключевые термины: RPM, BOL, HOS, CDL-A, detention, deadhead, load board, rate confirmation</li>
          <li>Обязанности диспетчера: выбор груза по RPM, переговоры с брокером, управление водителем</li>
          <li>Реальные проблемные ситуации и профессиональное принятие решений</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 'pr-q1',
            text: 'Who acts as the intermediary between the shipper and the carrier in the US freight industry?',
            options: [
              'The driver — who physically transports the goods',
              'The broker — who connects shippers with carriers and earns a commission for the service',
              'The consignee — who receives the freight at the destination',
              'The owner-operator — who owns and drives their own truck',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q2',
            text: 'What is "deadhead" in trucking?',
            options: [
              'A load that pays above the current market rate',
              'Driving with an empty trailer — miles that generate no revenue for the carrier',
              'A specialized trailer type used for hazardous materials',
              'The final delivery destination of a shipment',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q3',
            text: 'What does RPM stand for and why is it the key metric when choosing a load?',
            options: [
              'Revenue Per Month — the carrier\'s total monthly earnings',
              'Rate Per Mile — the most accurate measure of profitability per mile driven, used to compare loads regardless of distance',
              'Route Planning Method — the algorithm used to optimize the route between pickup and delivery',
              'Revenue Per Movement — the total gross income from a single completed shipment',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q4',
            text: 'A dispatcher typically charges what percentage of the gross load rate as their service fee?',
            options: [
              '3–5% — the same commission level as a freight broker',
              '10% — the standard dispatcher commission in the US market',
              '20% — split equally between the dispatcher and the carrier',
              '15–18% — calculated based on mileage rather than the rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q5',
            text: 'What does a CDL-A (Commercial Driver\'s License — Class A) authorize a driver to operate?',
            options: [
              'Any vehicle weighing under 10,000 lbs, including cargo vans and light trucks',
              'Combination vehicles over 26,001 lbs gross vehicle weight, including semi-trucks with 53-ft dry van trailers',
              'Buses and passenger transport vehicles only, not freight trucks',
              'Forklifts and heavy warehouse equipment within a facility',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q6',
            text: 'Under FMCSA\'s Hours of Service (HOS) regulations, what is the maximum driving time allowed in a single day?',
            options: [
              '8 hours — the standard workday cap for all commercial drivers',
              '11 hours — maximum driving time within a 14-hour on-duty window',
              '14 hours — the total on-duty window including all activities, not just driving',
              '10 hours — the federal safety limit specifically for interstate trucking',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q7',
            text: 'What is a Bill of Lading (BOL) and what is its primary purpose?',
            options: [
              'A financial invoice the broker sends to the shipper listing all service fees and charges',
              'A legal document that serves as the contract between shipper and carrier, describing the freight, its condition, and terms of transport',
              'A driver\'s daily log required by FMCSA to track and verify hours of service compliance',
              'A government license required by the DOT to legally operate a commercial trucking company',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q8',
            text: 'What is "detention" in the context of freight transportation?',
            options: [
              'A penalty charged to the carrier for delivering a load past the scheduled delivery appointment',
              'A fee charged when a driver is held at a shipper or consignee beyond the standard free waiting time — typically 2 hours',
              'The formal process of booking and confirming a load on a digital load board platform',
              'A type of cargo insurance policy covering high-value or fragile shipments during transit',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q9',
            text: 'What is the primary responsibility of the Consignee in the freight supply chain?',
            options: [
              'Finding available carriers and posting load opportunities on load boards',
              'Negotiating freight rates with brokers and carriers on behalf of the shipper',
              'Receiving the delivered freight at the destination and signing the Proof of Delivery (POD)',
              'Maintaining and inspecting the trucks and equipment used for transporting goods',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q10',
            text: 'How does a freight broker earn money in the US trucking market?',
            options: [
              'Charging drivers a monthly subscription fee for access to exclusive load board listings',
              'Keeping the margin between what the shipper pays for the load and what the carrier actually receives',
              'Owning a fleet of trucks and leasing them to owner-operators at a daily rate',
              'Selling discounted fuel and maintenance services to carriers through negotiated contracts',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q11',
            text: 'At the start of a dispatcher\'s workday, what should be the FIRST action taken?',
            options: [
              'Immediately search the load board for the highest-paying available loads',
              'Call all broker contacts on the list to check for new load opportunities',
              'Check the current status of all active drivers — their location, load status, ETA, and any issues',
              'Review and send invoices for all loads completed the previous day',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q12',
            text: 'Two loads are available from Los Angeles, CA: Load A — LA to Phoenix, AZ: $950 / 370 miles. Load B — LA to Portland, OR: $2,400 / 1,050 miles. Which load has better RPM, and which is the stronger business decision overall?',
            options: [
              'Load A ($2.57/mi) has better RPM and is the better business decision',
              'Load B ($2.29/mi) has lower RPM but is the better business decision — higher total payout and Portland is a stronger outbound market',
              'Load A ($2.57/mi) has better RPM, but Load B is the better business decision — higher gross revenue and better lane positioning for the next load',
              'Both loads are equally profitable when all factors are considered',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q13',
            text: 'What does "book a load" mean in freight dispatching?',
            options: [
              'Recording a completed delivery in the carrier\'s internal tracking and invoicing system',
              'Officially confirming a shipment with a broker — agreeing on all details and receiving the signed Rate Confirmation document',
              'Finding and flagging a potential load on the load board before making the broker call',
              'Calculating and verifying the RPM before deciding whether a load is worth accepting',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q14',
            text: 'What is the purpose of a "check call" during active transit?',
            options: [
              'A verification call from the broker to the carrier before the Rate Confirmation is issued',
              'A regular call made by the dispatcher to the driver to confirm current location, ETA, and whether there are any issues',
              'A call from the shipper to the carrier to confirm that the load has been successfully picked up',
              'A mandatory daily compliance call required by FMCSA to report driver hours and route information',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q15',
            text: 'Which regulatory authority governs commercial driver safety standards, HOS rules, and CDL licensing requirements in the United States?',
            options: [
              'FAA (Federal Aviation Administration) — oversees safety across all modes of transportation',
              'FMCSA (Federal Motor Carrier Safety Administration) — specifically regulates commercial trucking and motor carrier safety',
              'NTSB (National Transportation Safety Board) — investigates major transportation accidents across all industries',
              'FTC (Federal Trade Commission) — regulates commerce, trade practices, and consumer protection',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q16',
            text: 'Mini-case: It\'s Monday morning. Your driver is empty in Dallas, TX and ready for a new load. You see three options on the load board:\n\nLoad A: Dallas, TX → Atlanta, GA | $2,100 | 780 miles | RPM: $2.69\nLoad B: Dallas, TX → Denver, CO | $1,400 | 920 miles | RPM: $1.52\nLoad C: Dallas, TX → Chicago, IL | $2,600 | 920 miles | RPM: $2.83\n\nWhich load do you choose?',
            options: [
              'Load A — shortest distance means the driver returns to Texas faster for the next load',
              'Load B — Denver is a strong outbound market, so finding the next load will be easy',
              'Load C — highest total payout ($2,600) AND best RPM ($2.83/mi). Chicago is a major freight hub with strong outbound options',
              'Load A — Atlanta has higher overall freight volume than Chicago, making it the better market',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q17',
            text: 'Mini-case: You call a broker about a load from Houston, TX to Nashville, TN — 640 miles. The broker opens with: "Rate is $1,750." Based on your market knowledge, the typical rate for this lane is $1,950–$2,100. What is the BEST response?',
            options: [
              'Accept $1,750 immediately — any confirmed load is better than sitting idle with an empty truck',
              '"I need at least $2,050 to make this lane work for us." — a professional counter within the realistic market range',
              '"We don\'t touch anything under $3,500 on Texas lanes." — set a high anchor to control the negotiation',
              'End the call and post your truck on the load board to attract inbound broker calls',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q18',
            text: 'Mini-case: Your driver arrived at a shipper at 9:00 AM for a scheduled pickup. The warehouse is slow and doesn\'t begin loading until 11:30 AM. The standard free waiting time is 2 hours. At what point does detention begin, and what is the correct dispatcher action?',
            options: [
              'Detention begins at 11:30 AM when loading starts. Tell the driver to wait patiently — delays happen',
              'Detention begins at 11:00 AM (2 hours after arrival at 9:00 AM). Notify the broker immediately, begin tracking detention time, and prepare to invoice if loading is not completed promptly',
              'Detention begins only after a full 4 hours of waiting — the 2-hour free window applies to each stage of the process separately',
              'Cancel the load — any shipper that causes a 2+ hour delay is not a reliable partner',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q19',
            text: 'Mini-case: It is 2:30 PM. Your driver just delivered in Memphis, TN with 8 hours of HOS remaining. Two loads are available:\n\nOption 1: Memphis, TN → Nashville, TN | $850 | 210 miles | RPM: $4.05\nOption 2: Memphis, TN → Atlanta, GA | $1,550 | 390 miles | RPM: $3.97\n\nBoth runs fit within available HOS. Which do you choose?',
            options: [
              'Option 1 (Nashville) — the RPM is higher at $4.05/mi, and RPM is always the deciding factor',
              'Option 2 (Atlanta) — higher gross revenue ($1,550 vs $850) AND Atlanta is a major freight hub with strong outbound options, making the next load easier to find',
              'Option 1 (Nashville) — the shorter run saves fuel and reduces driver fatigue for a more productive next day',
              'Neither — both RPMs are below $5.00, which is the minimum acceptable for short-haul loads',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q20',
            text: 'Mini-case: A broker calls you upset. Your driver delivered a load 4 hours late — the consignee had already closed, and re-delivery is scheduled for tomorrow. The broker was charged a $400 late fee by the shipper. You knew about the delay 5 hours before the delivery window but did not notify the broker. What was your critical mistake?',
            options: [
              'Accepting a load with a delivery window that was too tight for the actual distance and expected traffic conditions',
              'Failing to notify the broker immediately when the delay became known — proactive communication would have allowed the consignee to stay open, reschedule, or prepare, preventing the late fee entirely',
              'Hiring a driver who lacked sufficient route knowledge to avoid delays and traffic issues',
              'Failing to include a financial buffer in the negotiated rate to cover potential delays or penalty fees',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'pr-q1',
            text: 'Кто выступает посредником между грузоотправителем и перевозчиком в американской грузовой логистике?',
            options: [
              'Водитель — который физически перевозит груз из пункта А в пункт Б',
              'Брокер — который связывает грузоотправителей с перевозчиками и получает комиссию за услуги',
              'Грузополучатель — который принимает груз в месте назначения',
              'Owner-operator — который владеет собственным грузовиком и сам его водит',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q2',
            text: 'Что такое "deadhead" в грузоперевозках?',
            options: [
              'Груз с оплатой выше текущей рыночной ставки',
              'Движение с пустым прицепом — мили без груза, не приносящие перевозчику дохода',
              'Специализированный прицеп для перевозки опасных материалов',
              'Конечный пункт назначения при доставке груза',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q3',
            text: 'Что означает RPM и почему это ключевой показатель при выборе груза?',
            options: [
              'Revenue Per Month — ежемесячный общий доход перевозчика',
              'Rate Per Mile — наиболее точный показатель прибыльности на каждую пройденную милю, позволяющий сравнивать грузы независимо от расстояния',
              'Route Planning Method — алгоритм оптимизации маршрута между загрузкой и доставкой',
              'Revenue Per Movement — общий валовой доход от одной завершённой перевозки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q4',
            text: 'Какой стандартный процент от валовой ставки груза берёт диспетчер в качестве своей комиссии?',
            options: [
              '3–5% — такой же уровень комиссии, как у фрахтового брокера',
              '10% — стандартная комиссия диспетчера на рынке США',
              '20% — делится поровну между диспетчером и перевозчиком',
              '15–18% — рассчитывается исходя из миль, а не ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q5',
            text: 'Что даёт водителю лицензия CDL-A (Commercial Driver\'s License класса A)?',
            options: [
              'Право управлять любым транспортным средством весом до 10 000 фунтов, включая грузовые фургоны',
              'Право управлять составными транспортными средствами свыше 26 001 фунта полной массы, включая тягачи с прицепами 53 фута',
              'Право управлять только автобусами и пассажирским транспортом, но не грузовыми автомобилями',
              'Право управлять погрузчиками и тяжёлой складской техникой внутри предприятия',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q6',
            text: 'Согласно правилам HOS (Hours of Service) регулятора FMCSA, каково максимальное время вождения за один день?',
            options: [
              '8 часов — стандартный рабочий день для всех коммерческих водителей',
              '11 часов — максимальное время за рулём в рамках 14-часового рабочего окна',
              '14 часов — общее рабочее окно, включая все виды деятельности, а не только вождение',
              '10 часов — федеральный лимит безопасности конкретно для межштатных грузоперевозок',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q7',
            text: 'Что такое Bill of Lading (BOL) и для чего он служит?',
            options: [
              'Финансовый счёт, выставляемый брокером грузоотправителю за все услуги и сборы',
              'Юридический документ, который является договором между грузоотправителем и перевозчиком и описывает груз, его состояние и условия перевозки',
              'Ежедневный журнал водителя, обязательный по требованиям FMCSA для учёта рабочего времени',
              'Государственная лицензия, необходимая для законной работы транспортной компании',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q8',
            text: 'Что такое "detention" в контексте грузовых перевозок?',
            options: [
              'Штраф, выставляемый перевозчику за доставку груза позже согласованного срока',
              'Оплата за простой водителя у грузоотправителя или грузополучателя сверх бесплатного времени ожидания — обычно 2 часа',
              'Официальная процедура бронирования и подтверждения груза на электронной бирже',
              'Вид страхования груза для ценных или хрупких товаров во время транспортировки',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q9',
            text: 'Какова основная задача грузополучателя (Consignee) в цепочке грузоперевозок?',
            options: [
              'Поиск доступных перевозчиков и размещение грузов на load board',
              'Переговоры о ставках с брокерами и перевозчиками от имени грузоотправителя',
              'Приём доставленного груза в пункте назначения и подписание Proof of Delivery (POD)',
              'Техническое обслуживание и инспекция грузовиков и оборудования, используемых при перевозке',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q10',
            text: 'Как зарабатывает фрахтовый брокер на рынке грузоперевозок США?',
            options: [
              'Взимает с водителей ежемесячную плату за доступ к эксклюзивным грузам на load board',
              'Оставляет разницу между суммой, которую платит грузоотправитель, и суммой, которую получает перевозчик',
              'Владеет парком грузовиков и сдаёт их в аренду owner-operators по дневной ставке',
              'Продаёт топливо и услуги технического обслуживания перевозчикам по льготным ценам',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q11',
            text: 'С чего диспетчер должен начинать рабочий день в первую очередь?',
            options: [
              'Сразу открыть load board и искать самые высокооплачиваемые грузы',
              'Обзвонить всех брокеров из контактного списка в поисках новых грузов',
              'Проверить текущий статус всех активных водителей — местоположение, статус груза, ETA и наличие проблем',
              'Проверить и отправить счета за все грузы, доставленные накануне',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q12',
            text: 'Из Лос-Анджелеса доступны два груза: Груз A — LA → Phoenix, AZ: $950 / 370 миль. Груз B — LA → Portland, OR: $2 400 / 1 050 миль. У какого груза лучше RPM и какой является более сильным бизнес-решением?',
            options: [
              'Груз A ($2.57/миль) — лучше RPM и лучше как бизнес-решение',
              'Груз B ($2.29/миль) — RPM ниже, но лучше как бизнес-решение из-за высокой общей выплаты и сильного рынка Портленда',
              'Груз A ($2.57/миль) — лучше RPM, но Груз B — лучшее бизнес-решение из-за более высокого валового дохода и лучшей позиции для следующего груза',
              'Оба груза одинаково выгодны при учёте всех факторов',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q13',
            text: 'Что означает "book a load" в работе диспетчера?',
            options: [
              'Внесение данных о завершённой доставке во внутреннюю систему учёта и выставления счетов',
              'Официальное подтверждение груза с брокером — согласование всех деталей и получение подписанного Rate Confirmation',
              'Нахождение и отметка потенциального груза на load board перед звонком брокеру',
              'Расчёт и проверка RPM перед принятием решения о том, стоит ли брать груз',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q14',
            text: 'Какова цель "check call" во время активной перевозки?',
            options: [
              'Проверочный звонок от брокера к перевозчику перед выставлением Rate Confirmation',
              'Регулярный звонок диспетчера водителю для уточнения текущего местоположения, ETA и наличия каких-либо проблем',
              'Звонок от грузоотправителя перевозчику для подтверждения успешной загрузки',
              'Обязательный ежедневный звонок в FMCSA для отчёта о часах вождения и маршруте',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q15',
            text: 'Какой регуляторный орган США отвечает за стандарты безопасности коммерческих водителей, правила HOS и требования к лицензии CDL?',
            options: [
              'FAA (Федеральное управление гражданской авиации) — надзор за безопасностью всех видов транспорта',
              'FMCSA (Федеральное управление безопасности автомобильных перевозчиков) — регулирует именно коммерческие грузоперевозки',
              'NTSB (Национальный совет по безопасности на транспорте) — расследует крупные транспортные происшествия',
              'FTC (Федеральная торговая комиссия) — регулирует торговую деятельность и защиту потребителей',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q16',
            text: 'Мини-кейс: Понедельник, утро. Ваш водитель свободен в Далласе, TX и готов к следующему грузу. На load board три варианта:\n\nГруз A: Dallas, TX → Atlanta, GA | $2 100 | 780 миль | RPM: $2.69\nГруз B: Dallas, TX → Denver, CO | $1 400 | 920 миль | RPM: $1.52\nГруз C: Dallas, TX → Chicago, IL | $2 600 | 920 миль | RPM: $2.83\n\nКакой груз выбрать?',
            options: [
              'Груз A — кратчайшее расстояние означает, что водитель быстрее вернётся в Техас',
              'Груз B — Денвер — сильный рынок грузов, следующий груз найти будет легко',
              'Груз C — самая высокая общая ставка ($2 600) И лучший RPM ($2.83/миль). Чикаго — крупный транспортный узел с хорошим рынком исходящих грузов',
              'Груз A — Атланта имеет больший общий объём грузов, чем Чикаго',
            ],
            correctIndex: 2,
          },
          {
            id: 'pr-q17',
            text: 'Мини-кейс: Вы звоните брокеру по грузу Houston, TX → Nashville, TN (640 миль). Брокер открывает переговоры словами: "Ставка $1 750." По вашему опыту, рыночная ставка для этого маршрута — $1 950–$2 100. Какой ответ оптимален?',
            options: [
              'Согласиться на $1 750 сразу — любой подтверждённый груз лучше простоя',
              '"Нам нужно минимум $2 050, чтобы этот маршрут был для нас выгодным." — профессиональный встречный оффер в реалистичном рыночном диапазоне',
              '"Мы не берём ничего ниже $3 500 по техасским маршрутам." — установить высокую начальную позицию для переговоров',
              'Завершить звонок и разместить грузовик на load board, чтобы привлечь входящие звонки от брокеров',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q18',
            text: 'Мини-кейс: Водитель прибыл на склад грузоотправителя в 9:00 на плановую загрузку. Склад работает медленно и начинает погрузку только в 11:30. Стандартное бесплатное время ожидания — 2 часа. С какого момента начинается detention и каковы правильные действия диспетчера?',
            options: [
              'Detention начинается в 11:30, когда начинается погрузка. Скажите водителю терпеливо ждать — задержки бывают',
              'Detention начинается в 11:00 (2 часа после прибытия в 9:00). Немедленно уведомить брокера, начать фиксировать время простоя и подготовить счёт, если погрузка не завершится оперативно',
              'Detention начинается только после 4 часов ожидания — 2 часа бесплатного времени применяются к каждому этапу отдельно',
              'Отменить груз — любой грузоотправитель, задерживающий погрузку на 2+ часа, не является надёжным партнёром',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q19',
            text: 'Мини-кейс: 14:30. Водитель только что доставил груз в Мемфисе, TN. Доступно 8 часов HOS. На load board два варианта:\n\nВариант 1: Memphis, TN → Nashville, TN | $850 | 210 миль | RPM: $4.05\nВариант 2: Memphis, TN → Atlanta, GA | $1 550 | 390 миль | RPM: $3.97\n\nОба рейса укладываются в доступные часы HOS. Какой груз выбрать?',
            options: [
              'Вариант 1 (Нэшвилл) — RPM выше ($4.05/миль), а RPM всегда является решающим фактором',
              'Вариант 2 (Атланта) — выше общая выплата ($1 550 против $850), а Атланта — крупный транспортный узел с сильным рынком для следующего груза',
              'Вариант 1 (Нэшвилл) — более короткий рейс экономит топливо и снижает усталость водителя',
              'Ни один — оба RPM ниже $5.00, что является минимально приемлемым уровнем для коротких рейсов',
            ],
            correctIndex: 1,
          },
          {
            id: 'pr-q20',
            text: 'Мини-кейс: Брокер звонит с претензией. Ваш водитель опоздал на 4 часа, грузополучатель к тому времени уже закрылся, доставка перенесена на завтра. Брокеру выставили штраф $400. Вы знали о задержке за 5 часов до окна доставки, но брокера не уведомляли. Какова ваша ключевая ошибка?',
            options: [
              'Принятие груза с окном доставки, слишком узким для данного расстояния и возможных задержек',
              'Непредупреждение брокера сразу, как только стала известна задержка — своевременное сообщение позволило бы грузополучателю остаться, перенести приёмку или подготовиться, полностью предотвратив штраф',
              'Найм водителя с недостаточным знанием маршрута для избежания задержек',
              'Отсутствие финансового буфера в согласованной ставке на случай задержек и штрафов',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '2-1': {
      type: 'text',
      body: `
        <h2>Geography & Time Zones: The Dispatcher's Map</h2>
        <blockquote><strong>Key insight:</strong> Geography knowledge turns a dispatcher from someone who books loads into a strategic planner who knows which lanes are profitable, which markets have return freight, and how to keep drivers moving efficiently.</blockquote>

        <h3>The Four US Time Zones</h3>
        <ul>
          <li><strong>Pacific Time (PT)</strong> — Los Angeles, Seattle, San Francisco. UTC-8 winter, UTC-7 summer (DST).</li>
          <li><strong>Mountain Time (MT)</strong> — Denver, Salt Lake City, Albuquerque. UTC-7 winter, UTC-6 summer. <strong>Exception: Arizona does NOT observe DST — stays at UTC-7 year-round.</strong></li>
          <li><strong>Central Time (CT)</strong> — Chicago, Dallas, Houston, Memphis. UTC-6 winter, UTC-5 summer.</li>
          <li><strong>Eastern Time (ET)</strong> — New York, Miami, Atlanta, Boston. UTC-5 winter, UTC-4 summer.</li>
        </ul>
        <p><strong>Rule: moving east = clock forward.</strong> Noon in LA (PT) = 3:00 PM in New York (ET). ET is always 3 hours ahead of PT.</p>

        <h3>Time Zone Errors Cost Real Money</h3>
        <p>Example: broker in Atlanta (ET) says pickup is "7:00 AM." Shipper is in Phoenix, AZ (MT, no DST). In winter, Phoenix is 2 hours behind ET. Writing "7:00 AM" without the time zone sends your driver 2 hours early or late.</p>
        <p><strong>Professional standard: always use the local time zone of the pickup or delivery location.</strong> The driver is physically there — they need local time.</p>

        <h3>Geography Shapes Freight Rates</h3>
        <p>California, Texas, the Midwest, and the Northeast are high-volume freight markets. Rural areas — Montana, Wyoming, parts of the Deep South — are <strong>freight deserts</strong>: few outbound loads, high deadhead risk. Understanding where freight flows (and where trucks get stuck) is the foundation of profitable dispatching.</p>
      `,
      bodyRu: `
        <h2>География и часовые пояса: карта диспетчера</h2>
        <blockquote><strong>Ключевая мысль:</strong> Знание географии превращает диспетчера из человека, который "бронирует грузы", в стратегического планировщика, знающего прибыльные маршруты, рынки с обратными грузами и как удерживать водителей в движении.</blockquote>

        <h3>Четыре часовых пояса США</h3>
        <ul>
          <li><strong>Pacific Time (PT)</strong> — Лос-Анджелес, Сиэтл, Сан-Франциско. UTC-8 зимой, UTC-7 летом (DST).</li>
          <li><strong>Mountain Time (MT)</strong> — Денвер, Солт-Лейк-Сити, Альбукерке. UTC-7 зимой, UTC-6 летом. <strong>Исключение: Аризона НЕ соблюдает DST — остаётся на UTC-7 круглый год.</strong></li>
          <li><strong>Central Time (CT)</strong> — Чикаго, Даллас, Хьюстон, Мемфис. UTC-6 зимой, UTC-5 летом.</li>
          <li><strong>Eastern Time (ET)</strong> — Нью-Йорк, Майами, Атланта, Бостон. UTC-5 зимой, UTC-4 летом.</li>
        </ul>
        <p><strong>Правило: движение на восток = часы вперёд.</strong> Полдень в LA (PT) = 15:00 в Нью-Йорке (ET). ET всегда на 3 часа впереди PT.</p>

        <h3>Ошибки с часовыми поясами стоят денег</h3>
        <p>Пример: брокер в Атланте (ET) говорит загрузка "в 7:00 утра". Shipper в Финиксе, AZ (MT, без DST). Зимой Финикс отстаёт от ET на 2 часа. Написать просто "7:00 утра" без пояса — водитель приедет на 2 часа раньше или позже.</p>
        <p><strong>Профессиональный стандарт: всегда указывайте местное время точки загрузки или доставки.</strong> Водитель физически там — ему нужно местное время.</p>

        <h3>География формирует ставки</h3>
        <p>Калифорния, Техас, Средний Запад и Северо-Восток — крупнейшие рынки грузов. Сельские районы — Монтана, Вайоминг, части Глубокого Юга — это <strong>грузовые пустыни</strong>: мало исходящих грузов, высокий риск deadhead. Понимание потока грузов (откуда, куда и где застревают грузовики) — основа прибыльного диспетчинга.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-in-q1',
            text: 'How many hours ahead is Eastern Time (ET) compared to Pacific Time (PT)?',
            options: ['1 hour', '2 hours', '3 hours', '4 hours'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q2',
            text: 'It is 11:00 AM in Los Angeles, CA (Pacific Time). What time is it in Dallas, TX (Central Time)?',
            options: ['10:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q3',
            text: 'Which US state does NOT observe Daylight Saving Time and stays on Mountain Time (UTC-7) year-round?',
            options: ['Colorado', 'Arizona', 'Utah', 'New Mexico'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q4',
            text: 'When moving from west to east across US time zones, what happens to the clock?',
            options: ['It moves backward (earlier)', 'It moves forward (later)', 'It stays the same', 'It depends on DST'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q5',
            text: 'What is a "freight desert" in dispatching?',
            options: [
              'A route passing through desert states like Arizona or Nevada',
              'A region with low freight volume where finding a return load is difficult, leading to deadhead miles',
              'A dry van load in hot weather states',
              'A load paying below market rate',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q6',
            text: 'Your driver delivers in Seattle, WA (PT) at 4:00 PM PT. What time is it simultaneously in Atlanta, GA (ET)?',
            options: ['1:00 PM ET', '4:00 PM ET', '6:00 PM ET', '7:00 PM ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-in-q7',
            text: 'Which city is in the Central Time (CT) zone?',
            options: ['Los Angeles, CA', 'Denver, CO', 'Memphis, TN', 'Philadelphia, PA'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q8',
            text: 'What is the professional standard for communicating pickup and delivery appointment times?',
            options: [
              'Always use Eastern Time — it is the standard business time zone in the US',
              'Always use UTC to avoid confusion',
              'Always use the local time zone of the pickup or delivery location',
              'Always use the dispatcher\'s local time zone',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q9',
            text: 'What are the four main US time zones in order from west to east?',
            options: [
              'Pacific, Mountain, Central, Eastern',
              'Western, Central, Eastern, Atlantic',
              'Pacific, Rockies, Midwest, Eastern',
              'Pacific, Desert, Plains, Atlantic',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-in-q10',
            text: 'It is 3:00 PM Pacific Time. A broker in New York (ET) asks you to confirm the driver\'s ETA. What ET time do you report if the driver is 30 minutes away from delivery?',
            options: ['3:30 PM ET', '5:30 PM ET', '6:30 PM ET', '7:30 PM ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q11',
            text: 'Mini-case: You dispatch from Miami, FL (ET) in January. Your driver picks up in Phoenix, AZ. The shipper\'s appointment is 10:00 AM local Phoenix time. Phoenix is on Mountain Time (no DST, always UTC-7). Eastern Time in January is UTC-5. What time do you schedule this in your ET calendar?',
            options: ['8:00 AM ET', '10:00 AM ET', '12:00 PM ET', '1:00 PM ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q12',
            text: 'Mini-case: You book a load from Los Angeles, CA (PT) to Boston, MA (ET). The broker says "delivery appointment Monday 8:00 AM ET." Your driver asks what time to show up. What is the correct answer?',
            options: [
              '"8:00 AM PT" — adjust to the driver\'s home time zone',
              '"8:00 AM ET" — the appointment is at Boston\'s local time, and the driver will be in ET when they deliver',
              '"5:00 AM PT" — give the Pacific equivalent so the driver can plan their drive',
              '"11:00 AM ET" — add 3 hours for the coast-to-coast difference',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-in-q1',
            text: 'На сколько часов Eastern Time (ET) опережает Pacific Time (PT)?',
            options: ['На 1 час', 'На 2 часа', 'На 3 часа', 'На 4 часа'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q2',
            text: 'В Лос-Анджелесе, CA (Pacific Time) 11:00 утра. Который час в Далласе, TX (Central Time)?',
            options: ['10:00', '12:00', '13:00', '14:00'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q3',
            text: 'Какой штат США НЕ соблюдает летнее время и остаётся на Mountain Time (UTC-7) круглый год?',
            options: ['Колорадо', 'Аризона', 'Юта', 'Нью-Мексико'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q4',
            text: 'При движении с запада на восток через часовые пояса США что происходит со временем?',
            options: ['Время сдвигается назад (раньше)', 'Время сдвигается вперёд (позже)', 'Время остаётся прежним', 'Зависит от DST'],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q5',
            text: 'Что такое "freight desert" (грузовая пустыня) в диспетчинге?',
            options: [
              'Маршрут через пустынные штаты — Аризону или Неваду',
              'Регион с низким объёмом грузов, где трудно найти обратный груз, что ведёт к холостым милям',
              'Груз на dry van в жарких штатах',
              'Груз с оплатой ниже рыночной ставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-in-q6',
            text: 'Водитель доставляет груз в Сиэтле, WA (PT) в 16:00 PT. Который час одновременно в Атланте, GA (ET)?',
            options: ['13:00 ET', '16:00 ET', '19:00 ET', '20:00 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q7',
            text: 'Какой город находится в часовом поясе Central Time (CT)?',
            options: ['Лос-Анджелес, CA', 'Денвер, CO', 'Мемфис, TN', 'Филадельфия, PA'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q8',
            text: 'Каков профессиональный стандарт при указании времени загрузки и доставки?',
            options: [
              'Всегда использовать Eastern Time — это стандартное деловое время в США',
              'Всегда использовать UTC во избежание путаницы',
              'Всегда указывать местное время места загрузки или доставки',
              'Всегда использовать часовой пояс диспетчера',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q9',
            text: 'Назовите четыре основных часовых пояса США с запада на восток.',
            options: [
              'Pacific, Mountain, Central, Eastern',
              'Western, Central, Eastern, Atlantic',
              'Pacific, Rockies, Midwest, Eastern',
              'Pacific, Desert, Plains, Atlantic',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-in-q10',
            text: 'Сейчас 15:00 Pacific Time. Брокер в Нью-Йорке (ET) просит подтвердить ETA водителя. Водитель в 30 минутах от доставки. Какое время ET вы называете?',
            options: ['15:30 ET', '17:30 ET', '18:30 ET', '19:30 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q11',
            text: 'Мини-кейс: Вы диспетчер в Майами, FL (ET), январь. Водитель забирает груз в Финиксе, AZ. Appointment у грузоотправителя — 10:00 утра по местному времени Финикса (MT, без DST, всегда UTC-7). Eastern Time в январе — UTC-5. В какое время ET вы ставите это в своём календаре?',
            options: ['8:00 ET', '10:00 ET', '12:00 ET', '13:00 ET'],
            correctIndex: 2,
          },
          {
            id: 'geo-in-q12',
            text: 'Мини-кейс: Вы бронируете груз из Лос-Анджелеса, CA (PT) в Бостон, MA (ET). Брокер говорит: "Delivery appointment понедельник, 8:00 утра ET." Водитель спрашивает, в котором часу ему приехать. Что правильно ответить?',
            options: [
              '"8:00 PT" — привести к домашнему часовому поясу водителя',
              '"8:00 ET" — appointment по местному времени Бостона; когда водитель приедет в Бостон, он будет в ET',
              '"5:00 PT" — дать эквивалент в Pacific Time для планирования поездки',
              '"11:00 ET" — прибавить 3 часа на разницу между побережьями',
            ],
            correctIndex: 1,
          },
        ],
      },
    },
    '2-2': {
      type: 'text',
      body: `
        <h2>US Geography for Freight Dispatchers</h2>

        <h3>US Regions and Their Freight Profiles</h3>
        <ul>
          <li><strong>West Coast (CA, OR, WA)</strong> — High-volume market for big trucks. LA Ports drive massive import freight; CA outbound east is strong. <strong>Warning for sprinter vans:</strong> Oregon and Washington are weak sprinter markets — the freight mix is dominated by logging, agriculture, and full-truckload lanes, so small expedited loads are rare. Washington is typically a deadhead state for sprinters — do not end-route a sprinter there without a confirmed outbound.</li>
          <li><strong>Mountain West (CO, UT, NV, MT, WY, ID)</strong> — Lower density. Denver is the main hub. Montana, Wyoming, Idaho and North Dakota are near-freight deserts for sprinter vans — avoid dead-ending here. Salt Lake City is the only realistic recovery point in the region.</li>
          <li><strong>Southwest (TX, NM, AZ)</strong> — Texas is a top freight state. Dallas/FW and Houston are major hubs; TX→Midwest and TX→Southeast corridors are highly active. Arizona (Phoenix) is moderate; New Mexico is limited.</li>
          <li><strong>Midwest (IL, OH, IN, MI, MO, KS)</strong> — Chicago is the US freight capital — intersection of nearly all major highways. Columbus, OH and Indianapolis are major DCs. Memphis, TN (FedEx global hub) is one of the busiest logistics centers worldwide.</li>
          <li><strong>Southeast (GA, FL, NC, SC)</strong> — Atlanta is the dominant hub. Florida has strong inbound; outbound can be soft off-season. Charlotte, NC is a growing market.</li>
          <li><strong>Northeast (NY, NJ, PA, MA)</strong> — Densest population = constant demand. NY/NJ is a top destination. Getting OUT of the Northeast pays well — strong outbound market despite congestion.</li>
        </ul>

        <h3>Key Interstates</h3>
        <ul>
          <li><strong>I-5</strong> — West Coast N-S: Seattle → LA → San Diego</li>
          <li><strong>I-10</strong> — Southern E-W: LA → Phoenix → Houston → Jacksonville</li>
          <li><strong>I-40</strong> — Middle E-W ("modern Route 66"): LA → Albuquerque → Memphis → NC</li>
          <li><strong>I-70</strong> — Rockies E-W: Denver → KC → St. Louis → Columbus. <strong>Warning: mountain passes west of Denver are dangerous in winter.</strong></li>
          <li><strong>I-80</strong> — Northern E-W: San Francisco → Salt Lake City → Chicago → New York</li>
          <li><strong>I-90</strong> — Northernmost E-W: Seattle → Chicago → Boston (harsh winter weather)</li>
          <li><strong>I-95</strong> — East Coast N-S: Miami → NYC → Boston. Most congested US highway.</li>
          <li><strong>I-35</strong> — Central N-S: San Antonio → Dallas → Kansas City → Minneapolis</li>
        </ul>

        <h3>Freight Corridors + Lane Strength</h3>
        <p><strong>Strong bidirectional:</strong> CA ↔ TX | TX ↔ Midwest | Southeast ↔ Northeast | Midwest ↔ Mid-Atlantic.</p>
        <p><strong>Strong outbound, soft inbound:</strong> CA outbound east (strong); CA inbound (soft — too many trucks). FL inbound (easy); FL outbound (soft off-season).</p>
        <h3>Strong vs. Weak Markets for Sprinter Vans</h3>
        <p><strong>Strong sprinter markets</strong> (plenty of small expedited loads, fast turnover, easy to find the next load): <strong>Chicago, Dallas, Atlanta, Miami, NYC/NJ, Houston, Charlotte</strong>.</p>
        <p><strong>Weak sprinter markets</strong> (avoid dead-ending — few small loads, long wait times): <strong>Montana, Wyoming, Idaho, North Dakota, Maine, rural Washington, rural Oregon</strong>. These states are fine for big trucks hauling logging/agriculture, but not for a sprinter that needs its next load within hours.</p>
        <blockquote><strong>Philosophy:</strong> For a sprinter van, taking a load to Texas at $1.30/mi is often better than hauling a high-RPM load into a dead market like Montana. The next load matters as much as the current load.</blockquote>
        <blockquote><strong>Pro tip:</strong> After delivering in a soft market, start searching the next load BEFORE the driver arrives. Every empty hour is lost money.</blockquote>

        <h3>Seasonal Patterns</h3>
        <ul>
          <li><strong>Peak (Oct–Dec)</strong> — Holiday shipping surge; rates climb, capacity tightens — best negotiating time</li>
          <li><strong>Produce season (Apr–Sep)</strong> — CA/FL/TX fresh produce drives reefer demand; summer construction adds flatbed</li>
          <li><strong>Slow season (Jan–Feb)</strong> — Post-holiday lull; rates soften; position drivers in active markets proactively</li>
        </ul>

        <h3>California CARB Regulations</h3>
        <p>California enforces strict diesel emissions standards (CARB). Trucks must have 2011+ model-year engines to operate legally in CA. Non-compliant trucks cannot serve CA lanes — limits carrier options for CA loads.</p>
      `,
      bodyRu: `
        <h2>География США для диспетчеров грузоперевозок</h2>

        <h3>Регионы США и их грузовые профили</h3>
        <ul>
          <li><strong>Западное побережье (CA, OR, WA)</strong> — Высокий объём для больших грузовиков. Порты LA/Long Beach — огромный поток импорта; исходящий из CA на восток — сильный. <strong>Важно для sprinter van:</strong> Орегон и Вашингтон — слабые рынки для sprinter van. Там доминируют лесозаготовка, сельское хозяйство и FTL-направления, мелких экспресс-грузов почти нет. Вашингтон — типичный deadhead-штат для sprinter'ов, не ставьте туда машину без подтверждённого обратного груза.</li>
          <li><strong>Mountain West (CO, UT, NV, MT, WY, ID)</strong> — Низкая плотность. Денвер — главный хаб. Монтана, Вайоминг, Айдахо и Северная Дакота — грузовые пустыни для sprinter van, туда заезжать нельзя. Солт-Лейк-Сити — единственная реалистичная точка восстановления в регионе.</li>
          <li><strong>Юго-Запад (TX, NM, AZ)</strong> — Техас — ведущий грузовой штат. Даллас/Форт-Уэрт и Хьюстон — крупнейшие хабы; TX→Midwest и TX→Southeast — высококонкурентные коридоры. Аризона (Финикс) умеренная; Нью-Мексико ограниченная.</li>
          <li><strong>Средний Запад (IL, OH, IN, MI, MO, KS)</strong> — Чикаго — грузовая столица США. Колумбус (OH) и Индианаполис — крупные дистрибьюторские центры. Мемфис, TN (глобальный хаб FedEx) — один из самых загруженных логистических центров мира.</li>
          <li><strong>Юго-Восток (GA, FL, NC, SC)</strong> — Атланта — доминирующий хаб. Флорида: входящий сильный, исходящий в несезон мягкий. Шарлотт (NC) — растущий рынок.</li>
          <li><strong>Северо-Восток (NY, NJ, PA, MA)</strong> — Постоянный высокий спрос. NY/NJ — топовое направление. Исходящие из Северо-Востока грузы хорошо оплачиваются — несмотря на пробки.</li>
        </ul>

        <h3>Ключевые шоссе</h3>
        <ul>
          <li><strong>I-5</strong> — Запад С-Ю: Сиэтл → LA → Сан-Диего</li>
          <li><strong>I-10</strong> — Южный В-З: LA → Финикс → Хьюстон → Джэксонвилл</li>
          <li><strong>I-40</strong> — Средний В-З ("современный Route 66"): LA → Альбукерке → Мемфис → NC</li>
          <li><strong>I-70</strong> — Через Скалистые горы: Денвер → KC → Сент-Луис → Колумбус. <strong>Внимание: горные перевалы к западу от Денвера опасны зимой.</strong></li>
          <li><strong>I-80</strong> — Северный В-З: Сан-Франциско → Солт-Лейк-Сити → Чикаго → Нью-Йорк</li>
          <li><strong>I-90</strong> — Самый северный В-З: Сиэтл → Чикаго → Бостон (суровые зимы)</li>
          <li><strong>I-95</strong> — Восточное побережье С-Ю: Майами → NYC → Бостон. Самое загруженное шоссе США.</li>
          <li><strong>I-35</strong> — Центральный С-Ю: Сан-Антонио → Даллас → Канзас-Сити → Миннеаполис</li>
        </ul>

        <h3>Грузовые коридоры + сила маршрутов</h3>
        <p><strong>Сильные двусторонние:</strong> CA ↔ TX | TX ↔ Midwest | Southeast ↔ Northeast | Midwest ↔ Mid-Atlantic.</p>
        <p><strong>Сильный исходящий, слабый входящий:</strong> CA исходящий восток (сильный); CA входящий (мягкий). FL входящий (сильный); FL исходящий в несезон (слабый).</p>
        <h3>Сильные и слабые рынки для Sprinter Van</h3>
        <p><strong>Сильные рынки для sprinter van</strong> (много мелких экспресс-грузов, быстрый оборот, следующий груз найти легко): <strong>Чикаго, Лос-Анджелес, Даллас, Атланта, Майами, NYC/NJ, Хьюстон, Шарлотт</strong>.</p>
        <p><strong>Слабые рынки для sprinter van</strong> (не ставьте машину туда без обратного груза — мало мелких грузов, долгое ожидание): <strong>Монтана, Вайоминг, Айдахо, Северная Дакота, Мэн, сельский Вашингтон, сельский Орегон</strong>. Эти штаты подходят для больших грузовиков (лес, с/х), но не для sprinter van, которому нужен следующий груз в течение нескольких часов.</p>
        <blockquote><strong>Принцип:</strong> Для sprinter van груз в Техас по $1,30/миля часто выгоднее, чем груз с высоким RPM в мёртвый рынок типа Монтаны. Следующий груз важен не меньше, чем текущий.</blockquote>
        <blockquote><strong>Совет профи:</strong> После доставки в слабый рынок — искать следующий груз ДО прибытия водителя. Каждый час простоя — потерянные деньги.</blockquote>

        <h3>Сезонные закономерности</h3>
        <ul>
          <li><strong>Пик (окт–дек)</strong> — Предпраздничный всплеск; ставки растут, ёмкость сжимается — лучшее время для переговоров</li>
          <li><strong>Сезон продуктов (апр–сен)</strong> — CA/FL/TX свежие продукты → рост reefer; летнее строительство → рост flatbed</li>
          <li><strong>Мёртвый сезон (янв–фев)</strong> — Послепраздничный спад; заранее позиционировать водителей в активных рынках</li>
        </ul>

        <h3>Регулирование Калифорнии (CARB)</h3>
        <p>Калифорния требует соответствия стандартам выбросов CARB. Грузовики должны иметь двигатели 2011+ года для легальной работы в CA. Несоответствующие грузовики не могут обслуживать калифорнийские маршруты.</p>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-th-q1',
            text: 'Which city is considered the most important freight hub in the United States due to its central location and highway network?',
            options: ['Dallas, TX', 'Chicago, IL', 'Los Angeles, CA', 'Atlanta, GA'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q2',
            text: 'What is a "hot market" in freight dispatching?',
            options: [
              'A region with very high temperatures requiring reefer trailers',
              'A market where freight demand exceeds available trucks, resulting in higher rates',
              'A broker who consistently pays above-market rates',
              'A lane that is only profitable in summer',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q3',
            text: 'Which Interstate highway runs north-south along the West Coast, connecting Seattle to Los Angeles?',
            options: ['I-80', 'I-40', 'I-5', 'I-10'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q4',
            text: 'What is the key practical concern when routing a driver through I-70 west of Denver, CO in December?',
            options: [
              'Heavy truck traffic and construction delays',
              'I-70 west of Denver goes through dangerous mountain passes that become extremely hazardous in winter weather',
              'There are no truck stops on this section of I-70',
              'California CARB regulations apply on this stretch',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q5',
            text: 'Which region of the US is generally considered a near-"freight desert" — very difficult to find outbound loads?',
            options: [
              'Chicago, IL and the Midwest corridor',
              'Dallas/Fort Worth, TX',
              'Rural Montana or Wyoming',
              'Los Angeles, CA',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q6',
            text: 'Memphis, TN is a critical freight hub largely because of which company headquartered there?',
            options: ['Amazon — its largest fulfillment center', 'FedEx — its global air and ground hub', 'UPS — its primary distribution center', 'USPS — its central sorting facility'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q7',
            text: 'Which Interstate highway forms the primary east-west southern corridor, connecting Los Angeles to Jacksonville, FL via Houston?',
            options: ['I-40', 'I-80', 'I-10', 'I-70'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q8',
            text: 'When does the main US freight peak season occur, and what drives it?',
            options: [
              'January–March — post-holiday returns and restocking',
              'October–December — holiday retail shipping surges drive demand across all freight types',
              'June–August — summer construction and outdoor retail season',
              'March–May — produce season is the dominant driver',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q9',
            text: 'California outbound freight (loads leaving CA going east) is generally described as:',
            options: [
              'Soft — California trucks rarely go east',
              'Strong — California generates enormous freight volume and east-bound loads are plentiful',
              'Average — same as most other states',
              'Only profitable in summer during produce season',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q10',
            text: 'What are CARB regulations and how do they affect freight dispatching in California?',
            options: [
              'Cargo weight limits that restrict how much a truck can carry in California',
              'Emissions standards enforced by California — trucks must meet specific requirements to operate in-state, limiting which carriers can serve CA lanes',
              'Speed limits on California interstates that slow delivery times',
              'Union labor rules that require California-licensed drivers for all in-state pickups',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q11',
            text: 'Mini-case: Your driver just delivered in Miami, FL (ET). It\'s November. You see two loads:\nLoad A: Miami → Chicago, IL | $2,800 | 1,380 miles | $2.03/mi\nLoad B: Miami → Rural Montana | $3,100 | 2,100 miles | $1.48/mi\nWhich do you choose and why?',
            options: [
              'Load B — higher total payout always wins',
              'Load A — Chicago is a major freight hub with strong outbound options; Montana is a near-freight desert, making the next load extremely difficult to find despite higher gross',
              'Load B — longer haul means more driving time for the driver',
              'Load A only because of higher RPM — geography is secondary',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q12',
            text: 'Mini-case: It\'s January. You need to route a driver from Denver, CO to Columbus, OH — approximately 1,200 miles. A colleague suggests I-70 East straight through. What should you consider before approving that route?',
            options: [
              'Nothing — I-70 East from Denver is always the fastest and safest route',
              'I-70 west of Denver has dangerous mountain passes; however east of Denver toward Kansas it is flat. The segment through the Rockies is the concern — check weather conditions and consider if the driver is heading EAST from Denver (the mountain section is actually west of Denver, so eastbound from Denver is fine)',
              'Route through I-80 north instead — it is always safer than I-70',
              'Denver to Columbus via I-70 East is entirely through flat terrain — no concerns',
            ],
            correctIndex: 3,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-th-q1',
            text: 'Какой город считается самым важным грузовым хабом США благодаря центральному расположению и дорожной сети?',
            options: ['Даллас, TX', 'Чикаго, IL', 'Лос-Анджелес, CA', 'Атланта, GA'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q2',
            text: 'Что такое "горячий рынок" (hot market) в грузовом диспетчинге?',
            options: [
              'Регион с очень высокими температурами, требующий рефрижераторных прицепов',
              'Рынок, где спрос на грузы превышает количество доступных грузовиков, что ведёт к росту ставок',
              'Брокер, стабильно платящий выше рыночных ставок',
              'Маршрут, прибыльный только летом',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q3',
            text: 'Какое межштатное шоссе проходит с севера на юг вдоль Западного побережья, соединяя Сиэтл с Лос-Анджелесом?',
            options: ['I-80', 'I-40', 'I-5', 'I-10'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q4',
            text: 'Какова главная практическая опасность маршрута по I-70 к западу от Денвера, CO в декабре?',
            options: [
              'Плотный трафик грузовиков и строительные задержки',
              'I-70 к западу от Денвера проходит через опасные горные перевалы, которые в зимних условиях становятся крайне опасными',
              'На этом участке I-70 нет грузовых стоянок',
              'На этом участке применяются калифорнийские нормы CARB',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q5',
            text: 'Какой регион США считается почти "грузовой пустыней" — крайне сложным для поиска исходящих грузов?',
            options: [
              'Чикаго, IL и коридор Среднего Запада',
              'Даллас/Форт-Уэрт, TX',
              'Сельская Монтана или Вайоминг',
              'Лос-Анджелес, CA',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q6',
            text: 'Мемфис, TN является крупным грузовым хабом во многом благодаря какой компании, базирующейся там?',
            options: ['Amazon — крупнейший центр выполнения заказов', 'FedEx — глобальный воздушный и наземный хаб', 'UPS — главный дистрибьюторский центр', 'USPS — центральный сортировочный комплекс'],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q7',
            text: 'Какое шоссе образует основной восточно-западный южный коридор, соединяя Лос-Анджелес с Джэксонвиллем через Хьюстон?',
            options: ['I-40', 'I-80', 'I-10', 'I-70'],
            correctIndex: 2,
          },
          {
            id: 'geo-th-q8',
            text: 'Когда происходит основной пиковый сезон грузоперевозок США и что его вызывает?',
            options: [
              'Январь–март — послепраздничные возвраты и пополнение складов',
              'Октябрь–декабрь — предпраздничные розничные отгрузки резко повышают спрос по всем типам грузов',
              'Июнь–август — летний строительный и розничный сезон',
              'Март–май — сезон продуктов питания является главным драйвером',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q9',
            text: 'Как характеризуется исходящий поток грузов из Калифорнии (CA → восток)?',
            options: [
              'Слабый — калифорнийские грузовики редко едут на восток',
              'Сильный — Калифорния генерирует огромные объёмы грузов, исходящие на восток грузы многочисленны',
              'Средний — как и в большинстве других штатов',
              'Прибыльный только летом в сезон продуктов питания',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q10',
            text: 'Что такое нормы CARB и как они влияют на грузовой диспетчинг в Калифорнии?',
            options: [
              'Ограничения веса груза, регулирующие нагрузку на грузовик в Калифорнии',
              'Стандарты выбросов CARB — грузовики должны им соответствовать для работы в штате, что ограничивает список перевозчиков, способных обслуживать калифорнийские маршруты',
              'Ограничения скорости на калифорнийских шоссе, замедляющие доставку',
              'Правила профсоюзного труда, обязывающие использовать водителей с калифорнийскими лицензиями',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q11',
            text: 'Мини-кейс: Ваш водитель доставил груз в Майами, FL (ET). Ноябрь. Два варианта:\nГруз A: Miami → Chicago, IL | $2 800 | 1 380 миль | $2.03/миль\nГруз B: Miami → Сельская Монтана | $3 100 | 2 100 миль | $1.48/миль\nКакой выбрать и почему?',
            options: [
              'Груз B — более высокая общая выплата всегда важнее',
              'Груз A — Чикаго крупный хаб с хорошим рынком исходящих грузов; Монтана — почти грузовая пустыня, следующий груз найти крайне сложно, несмотря на более высокий gross',
              'Груз B — более длинный рейс означает больше времени за рулём для водителя',
              'Груз A только из-за более высокого RPM — география второстепенна',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-th-q12',
            text: 'Мини-кейс: Январь. Нужно провести водителя из Денвера, CO в Колумбус, OH (~1 200 миль). Коллега предлагает ехать прямо по I-70 на восток. Что важно учесть?',
            options: [
              'Ничего — I-70 на восток от Денвера всегда самый быстрый и безопасный маршрут',
              'I-70 к западу от Денвера проходит через опасные горные перевалы; однако от Денвера на восток (через Канзас) рельеф ровный. Опасный горный участок — к западу от Денвера, а не к востоку',
              'Лучше ехать по I-80 на север — он всегда безопаснее I-70',
              'Маршрут Denver → Columbus по I-70 East полностью пролегает по равнине — никаких опасений',
            ],
            correctIndex: 3,
          },
        ],
      },
    },
    '2-3': {
      type: 'text',
      body: `
        <h2>Demo: Managing a Cross-Country Load Across Time Zones</h2>
        <p>Dispatcher Maria (Dallas, TX — CT) manages a run: Los Angeles, CA → Chicago, IL. 2,015 miles, crossing three time zones (PT → MT → CT).</p>

        <h3>7:30 AM CT — Morning Setup</h3>
        <p>Driver Carlos delivered in LA. In Dallas it's 7:30 CT — in LA it's 5:30 PT. Carlos is still resting. Maria's earliest possible pickup: <strong>8:00 AM PT (10:00 AM CT)</strong>.</p>
        <blockquote><strong>Time zone rule:</strong> Always think in the local time of wherever the driver physically is.</blockquote>

        <h3>8:00 AM CT — Load Board Search + RPM</h3>
        <blockquote>
          Load A: LA → Chicago | $3,200 | 2,015 mi | RPM: <strong>$1.59/mi</strong><br/>
          Load B: LA → Dallas | $2,100 | 1,440 mi | RPM: <strong>$1.46/mi</strong><br/>
          Load C: LA → Denver | $1,800 | 1,020 mi | RPM: <strong>$1.76/mi</strong><br/>
          Load D: LA → Atlanta | $3,600 | 2,175 mi | RPM: <strong>$1.66/mi</strong>
        </blockquote>
        <p>Maria chooses Load A (Chicago) — strong outbound market, existing broker relationships. Calls the broker.</p>

        <h3>8:45 AM CT — Broker Negotiation + Timeline Check</h3>
        <p>Broker: "$3,200, pickup Wednesday 9:00 AM, delivery Friday 7:00 AM." Maria calculates: 2,015 mi at ~600 mi/day = 3.4 days. Wednesday pickup + 3.4 days = Saturday. Friday 7:00 AM CT is too tight.</p>
        <p>Maria counters: "I need $3,400 and Friday delivery by noon CT, not 7:00 AM." Agreed: <strong>$3,350, delivery Friday 10:00 AM CT</strong>.</p>
        <blockquote><strong>Key lesson:</strong> Always verify the timeline is achievable before agreeing to rate. An impossible delivery is a liability, not an opportunity.</blockquote>

        <h3>9:30 AM CT — Driver Briefing</h3>
        <ul>
          <li>Pickup: Wednesday 9:00 AM <strong>PT</strong>, 4521 Commerce Ave, Vernon, CA</li>
          <li>Delivery: Friday 10:00 AM <strong>CT</strong>, 800 W Fulton St, Chicago, IL</li>
          <li>Route: I-10 East → I-40 East → I-44 → I-55 North</li>
          <li><strong>Avoid I-70 through Denver</strong> — November, mountain passes can be icy</li>
        </ul>

        <h3>Wednesday 9:00 AM PT — Pickup. Check Calls En Route</h3>
        <p>Carlos departs Vernon, CA. 9:00 AM PT = 11:00 AM CT.</p>
        <p><strong>Check Call #1 (Wed 4:00 PM PT / 6:00 PM CT):</strong> Carlos passed Tucson, AZ — now on Mountain Time (5:00 PM MT). Overnighting near El Paso (~800 mi from LA).</p>
        <p><strong>Check Call #2 (Thu 2:00 PM CT):</strong> Carlos crossed into Texas near Amarillo — back on Central Time (NM = MT, TX = CT). Maria updates ETA.</p>
        <p><strong>Thu 9:00 PM CT:</strong> Carlos stopped near Joplin, MO — 300 miles from Chicago. Maria: "Depart 4:00 AM CT Friday." (300 mi ÷ 60 mph = 5 hrs → arrives 9:00 AM CT, 1-hr buffer.)</p>

        <h3>Friday — Delivery Complete</h3>
        <p>Carlos arrives 9:15 AM CT, delivers at 10:00 AM CT, POD signed. Maria finds a $2,800 Chicago → Atlanta load within 20 minutes — zero deadhead.</p>

        <h3>Full Run Summary</h3>
        <blockquote>
          Route: LA → Chicago | Distance: 2,015 mi | Rate: <strong>$3,350</strong> | RPM: <strong>$1.66/mi</strong><br/>
          Transit: 2.5 days | Time zones crossed: PT → MT → CT<br/>
          Dispatcher commission (10%): $335<br/>
          Key decisions: I-40 route (avoided I-70 winter risk), timeline negotiation, proactive ETA management across zones
        </blockquote>
      `,
      bodyRu: `
        <h2>Демо: Управление трансконтинентальным рейсом через часовые пояса</h2>
        <p>Диспетчер Мария (Даллас, TX — CT) управляет рейсом: Лос-Анджелес, CA → Чикаго, IL. 2 015 миль, три часовых пояса (PT → MT → CT).</p>

        <h3>7:30 CT — Утренняя подготовка</h3>
        <p>Водитель Карлос доставил груз в LA. В Далласе 7:30 CT — в LA только 5:30 PT. Карлос отдыхает. Ранняя загрузка: <strong>не раньше 8:00 PT (10:00 CT)</strong>.</p>
        <blockquote><strong>Правило часового пояса:</strong> Всегда думайте в местном времени там, где физически находится водитель.</blockquote>

        <h3>8:00 CT — Поиск груза + расчёт RPM</h3>
        <blockquote>
          Груз A: LA → Чикаго | $3 200 | 2 015 миль | RPM: <strong>$1,59/миля</strong><br/>
          Груз B: LA → Даллас | $2 100 | 1 440 миль | RPM: <strong>$1,46/миля</strong><br/>
          Груз C: LA → Денвер | $1 800 | 1 020 миль | RPM: <strong>$1,76/миля</strong><br/>
          Груз D: LA → Атланта | $3 600 | 2 175 миль | RPM: <strong>$1,66/миля</strong>
        </blockquote>
        <p>Мария выбирает Груз A (Чикаго) — сильный исходящий рынок, устоявшиеся отношения с брокерами. Звонит брокеру.</p>

        <h3>8:45 CT — Переговоры с брокером + проверка сроков</h3>
        <p>Брокер: "$3 200, загрузка среда 9:00, доставка пятница 7:00 утра." Мария считает: 2 015 миль ÷ ~600 миль/день = 3,4 дня. Среда 9:00 PT + 3,4 дня = суббота. Пятница 7:00 CT — нереально.</p>
        <p>Мария: "Нужно $3 400 и доставка в пятницу к полудню CT, не к 7:00." Согласовано: <strong>$3 350, доставка пятница 10:00 CT</strong>.</p>
        <blockquote><strong>Ключевой урок:</strong> Всегда проверяйте реальность срока до согласования ставки. Хорошо оплачиваемый груз с невозможным сроком — это риск.</blockquote>

        <h3>9:30 CT — Инструктаж водителя</h3>
        <ul>
          <li>Загрузка: среда 9:00 <strong>PT</strong>, 4521 Commerce Ave, Vernon, CA</li>
          <li>Доставка: пятница 10:00 <strong>CT</strong>, 800 W Fulton St, Chicago, IL</li>
          <li>Маршрут: I-10 East → I-40 East → I-44 → I-55 North</li>
          <li><strong>Избегать I-70 через Денвер</strong> — ноябрь, горные перевалы могут быть обледеневшими</li>
        </ul>

        <h3>Среда 9:00 PT — Загрузка. Check Calls в пути</h3>
        <p>Карлос выезжает из Vernon, CA. 9:00 PT = 11:00 CT.</p>
        <p><strong>Check Call #1 (среда 16:00 PT / 18:00 CT):</strong> Карлос проехал Тусон, AZ — уже на Mountain Time (17:00 MT). Ночёвка у Эль-Пасо (~800 миль от LA).</p>
        <p><strong>Check Call #2 (чт 14:00 CT):</strong> Карлос въехал в Техас у Амарилло — снова Central Time (NM = MT, TX = CT). Мария обновляет ETA.</p>
        <p><strong>Чт 21:00 CT:</strong> Карлос у Джоплина, MO — 300 миль до Чикаго. Мария: "Выезжай в 4:00 CT пятница." (300 миль ÷ 60 миль/ч = 5 часов → прибытие 9:00 CT, буфер 1 час.)</p>

        <h3>Пятница — Доставка завершена</h3>
        <p>Карлос прибывает в 9:15 CT, доставка в 10:00 CT, POD подписан. Мария находит груз Чикаго → Атланта $2 800 за 20 минут — нулевой deadhead.</p>

        <h3>Итоги рейса</h3>
        <blockquote>
          Маршрут: LA → Чикаго | Расстояние: 2 015 миль | Ставка: <strong>$3 350</strong> | RPM: <strong>$1,66/миля</strong><br/>
          Время в пути: 2,5 дня | Часовые пояса: PT → MT → CT<br/>
          Комиссия диспетчера (10%): $335<br/>
          Ключевые решения: маршрут I-40 (избегли I-70), проверка сроков, проактивное управление ETA через зоны
        </blockquote>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-dm-q1',
            text: 'In the Demo, Maria works from Dallas, TX (CT) while her driver Carlos is in Los Angeles (PT). At 7:30 AM CT, what time is it for Carlos in LA?',
            options: ['4:30 AM PT', '5:30 AM PT', '6:30 AM PT', '8:30 AM PT'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q2',
            text: 'Why did Maria choose the I-40 route through Albuquerque and Amarillo rather than I-70 through Denver for the November run?',
            options: [
              'I-70 has more truck stops than I-40',
              'I-70 west of Denver goes through mountain passes that are dangerous in November winter conditions',
              'I-40 is shorter than I-70 for this route',
              'I-70 has higher tolls than I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q3',
            text: 'The broker offered delivery at "7:00 AM CT Friday." Maria countered to change it to 10:00 AM CT. Why?',
            options: [
              'Carlos prefers late morning deliveries',
              'The original 7:00 AM Friday timeline was too tight given the 2,015-mile distance and pickup on Wednesday — a later window gives necessary buffer',
              'The warehouse in Chicago doesn\'t open until 10:00 AM',
              'Maria wanted to charge a higher rate for early delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q4',
            text: 'Carlos crosses from New Mexico into Texas. What time zone change occurs?',
            options: [
              'Pacific Time → Mountain Time',
              'Mountain Time → Central Time',
              'Central Time → Eastern Time',
              'No change — Texas and New Mexico are in the same time zone',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q5',
            text: 'Carlos reports he\'s 300 miles from Chicago at 9:00 PM CT Thursday. Maria tells him to depart at 4:00 AM CT Friday. What is the reasoning?',
            options: [
              '300 miles at 60 mph = 5 hours; departing 4:00 AM gets him there by 9:00 AM, giving a 1-hour buffer before the 10:00 AM appointment',
              'The driver needs exactly 7 hours to cover 300 miles',
              'Chicago traffic is lightest at 9:00 AM, so early departure is needed',
              'FMCSA requires drivers to arrive at least 2 hours before all delivery appointments',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q6',
            text: 'Why did Maria immediately search for the next Chicago outbound load as soon as Carlos confirmed delivery?',
            options: [
              'She was required to by her dispatcher contract',
              'Chicago is one of the strongest outbound freight markets — acting immediately avoids driver downtime and keeps revenue flowing',
              'The broker demanded she find a return load as part of the original deal',
              'Carlos had already driven too many miles and needed a short local load',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q7',
            text: 'The pickup appointment is at 9:00 AM PT. What is the equivalent time in Maria\'s Dallas (CT) office?',
            options: ['8:00 AM CT', '9:00 AM CT', '10:00 AM CT', '11:00 AM CT'],
            correctIndex: 3,
          },
          {
            id: 'geo-dm-q8',
            text: 'Maria\'s final rate was $3,350 for 2,015 miles. What is the RPM?',
            options: ['$1.46/mile', '$1.59/mile', '$1.66/mile', '$1.76/mile'],
            correctIndex: 2,
          },
          {
            id: 'geo-dm-q9',
            text: 'What is the professional term for the call Maria makes to Carlos to verify his location and status during transit?',
            options: ['Status update', 'Check call', 'ETA confirmation', 'Route verification'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q10',
            text: 'When Maria verified the timeline before accepting the load, she found the original 7:00 AM Friday delivery was too tight. This is an example of:',
            options: [
              'Over-negotiating a rate',
              'Checking ETA feasibility before booking — a critical dispatcher skill that prevents late deliveries and damaged broker relationships',
              'Refusing a load without good reason',
              'Standard industry practice of always asking for later delivery times',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q11',
            text: 'Mini-case: You\'re dispatching from New York (ET). Your driver picks up in Seattle, WA (PT) Thursday at 8:00 AM PT. Delivery in Atlanta, GA (ET) is Monday at 9:00 AM ET. Distance: 2,850 miles. Driver averages 600 miles/day. Is the schedule feasible?',
            options: [
              'No — 2,850 miles ÷ 600 miles/day = 4.75 days. Thursday 8 AM PT + 4.75 days = Monday ~11 AM PT = Monday ~2 PM ET — the driver misses the 9:00 AM ET Monday appointment',
              'Yes — easily achievable, the driver has plenty of time',
              'Yes — because crossing time zones from PT to ET adds 3 hours, making the effective driving time shorter',
              'No — FMCSA does not allow drivers to cross more than 2 time zones in one trip',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q12',
            text: 'Mini-case: After delivering in Chicago, Maria finds a $2,800 Atlanta load in 20 minutes. A colleague says "You got lucky — Chicago loads are hard to find." Is this correct?',
            options: [
              'Yes — finding any load in under an hour is rare luck',
              'No — Chicago is one of the top freight hubs in the US with constant outbound load availability; finding a load quickly there is expected, not lucky',
              'Partially — Chicago is only a strong market during peak season',
              'Yes — Atlanta loads from Chicago are specifically rare because the lane is always oversaturated',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-dm-q1',
            text: 'В демо Мария работает из Далласа, TX (CT), а водитель Карлос — в Лос-Анджелесе (PT). В 7:30 CT у Марии, который час у Карлоса в LA?',
            options: ['4:30 PT', '5:30 PT', '6:30 PT', '8:30 PT'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q2',
            text: 'Почему Мария выбрала маршрут по I-40 через Альбукерке и Амарилло, а не по I-70 через Денвер для ноябрьского рейса?',
            options: [
              'На I-70 больше грузовых стоянок, чем на I-40',
              'I-70 к западу от Денвера проходит через горные перевалы, опасные в ноябрьских зимних условиях',
              'I-40 короче I-70 для этого маршрута',
              'На I-70 более высокие платные сборы',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q3',
            text: 'Брокер предложил доставку в "7:00 CT пятница". Мария попросила перенести на 10:00 CT. Почему?',
            options: [
              'Карлос предпочитает доставки в середине утра',
              'Исходный срок 7:00 CT пятница был слишком жёстким при расстоянии 2 015 миль и загрузке в среду — более позднее окно даёт необходимый запас времени',
              'Склад в Чикаго открывается только в 10:00',
              'Мария хотела взять более высокую ставку за раннюю доставку',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q4',
            text: 'Карлос пересекает границу Нью-Мексико и Техаса. Какая смена часового пояса происходит?',
            options: [
              'Pacific Time → Mountain Time',
              'Mountain Time → Central Time',
              'Central Time → Eastern Time',
              'Никакой — Техас и Нью-Мексико в одном часовом поясе',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q5',
            text: 'Карлос сообщает, что в четверг в 21:00 CT он в 300 милях от Чикаго. Мария говорит выехать в 4:00 CT пятницы. В чём логика?',
            options: [
              '300 миль при 60 миль/час = 5 часов; выезд в 4:00 — прибытие к 9:00, буфер 1 час до appointment в 10:00',
              'Водителю нужно ровно 7 часов на 300 миль',
              'Чикагские пробки минимальны в 9:00 утра, поэтому нужен ранний выезд',
              'FMCSA требует прибывать за 2 часа до всех delivery appointments',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q6',
            text: 'Почему Мария немедленно начала искать следующий груз из Чикаго сразу после подтверждения доставки?',
            options: [
              'Это требовалось по её диспетчерскому контракту',
              'Чикаго — один из сильнейших исходящих рынков грузов; действие немедленно позволяет избежать простоя водителя и поддерживать доход',
              'Брокер потребовал найти обратный груз как часть исходного договора',
              'Карлос проехал слишком много миль и нуждался в коротком местном грузе',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q7',
            text: 'Appointment на загрузку — 9:00 PT. Какое это время в офисе Марии в Далласе (CT)?',
            options: ['8:00 CT', '9:00 CT', '10:00 CT', '11:00 CT'],
            correctIndex: 3,
          },
          {
            id: 'geo-dm-q8',
            text: 'Итоговая ставка Марии — $3 350 за 2 015 миль. Каков RPM?',
            options: ['$1.46/миль', '$1.59/миль', '$1.66/миль', '$1.76/миль'],
            correctIndex: 2,
          },
          {
            id: 'geo-dm-q9',
            text: 'Как профессионально называется звонок, который Мария делает Карлосу во время рейса для проверки местоположения и статуса?',
            options: ['Обновление статуса', 'Check call', 'Подтверждение ETA', 'Проверка маршрута'],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q10',
            text: 'Когда Мария проверила сроки и обнаружила, что доставка в 7:00 CT пятницы нереальна, это пример:',
            options: [
              'Чрезмерного торга по ставке',
              'Проверки выполнимости ETA перед бронированием — критически важный навык диспетчера, предотвращающий опоздания и ущерб репутации',
              'Отказа от груза без веских оснований',
              'Стандартной практики всегда просить более позднее время доставки',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-dm-q11',
            text: 'Мини-кейс: Вы диспетчер в Нью-Йорке (ET). Водитель забирает груз в Сиэтле (PT) в четверг в 8:00 PT. Доставка в Атланте (ET) в понедельник в 9:00 ET. Расстояние: 2 850 миль. Водитель в среднем 600 миль/день. Реален ли график?',
            options: [
              'Нет — 2 850 ÷ 600 = 4.75 дня. Четверг 8:00 PT + 4.75 дня = понедельник ~11:00 PT = ~14:00 ET — водитель не успевает к 9:00 ET понедельника',
              'Да — времени вполне достаточно',
              'Да — пересечение часовых поясов с PT на ET прибавляет 3 часа, сокращая эффективное время вождения',
              'Нет — FMCSA не разрешает водителям пересекать более 2 часовых поясов в одном рейсе',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-dm-q12',
            text: 'Мини-кейс: После доставки в Чикаго Мария нашла груз в Атланту за 20 минут. Коллега говорит: "Тебе повезло — грузы из Чикаго трудно найти." Верно ли это?',
            options: [
              'Да — найти груз менее чем за час — редкая удача',
              'Нет — Чикаго один из ведущих грузовых хабов США с постоянным наличием исходящих грузов; быстрый поиск там закономерен, а не случаен',
              'Частично — Чикаго сильный рынок только в пиковый сезон',
              'Да — грузы Atlanta из Чикаго редки из-за перенасыщения маршрута',
            ],
            correctIndex: 1,
          },
        ],
      },
      freightMap: true,
    },
    '2-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 2: Geography & Time Zones</h2>
        <p>This practice test covers all material from Chapter 2: US time zones, regional freight profiles, major highway corridors, key freight hubs, lane dynamics, and seasonal patterns.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Four US time zones (PT, MT, CT, ET) and DST rules including the Arizona exception</li>
          <li>Time zone conversions and communication standards</li>
          <li>US regional freight profiles: West Coast, Mountain West, Southwest, Midwest, Southeast, Northeast</li>
          <li>Major interstates: I-5, I-10, I-40, I-70, I-80, I-90, I-95, I-35</li>
          <li>Freight hubs, lane balance, hot vs soft markets, seasonal patterns</li>
          <li>California CARB regulations</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 2: География и часовые пояса</h2>
        <p>Этот практический тест охватывает все материалы Главы 2: часовые пояса США, региональные профили грузов, основные автомобильные коридоры, ключевые хабы, динамику маршрутов и сезонные закономерности.</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных и 5 мини-кейсов.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20) для прохождения практики по этой главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Четыре часовых пояса США (PT, MT, CT, ET) и правила DST, включая исключение Аризоны</li>
          <li>Конвертация часовых поясов и стандарты коммуникации</li>
          <li>Региональные профили грузов: Западное побережье, Mountain West, Юго-Запад, Средний Запад, Юго-Восток, Северо-Восток</li>
          <li>Основные шоссе: I-5, I-10, I-40, I-70, I-80, I-90, I-95, I-35</li>
          <li>Грузовые хабы, баланс маршрутов, горячие и мягкие рынки, сезонные закономерности</li>
          <li>Нормы CARB Калифорнии</li>
        </ul>
      `,
      quiz: {
        questions: [
          {
            id: 'geo-pr-q1',
            text: 'It is 2:00 PM Pacific Time on a Tuesday. What time is it in New York (Eastern Time)?',
            options: ['1:00 PM ET', '3:00 PM ET', '4:00 PM ET', '5:00 PM ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q2',
            text: 'Which state observes Mountain Standard Time (UTC-7) year-round without adjusting for Daylight Saving Time?',
            options: ['Colorado', 'Utah', 'Arizona', 'Nevada'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q3',
            text: 'A shipper in Houston, TX (CT) schedules a pickup for "6:00 AM CT." Your driver is coming from Phoenix, AZ (MT, no DST). In January, what time should the driver depart Phoenix to arrive by 6:00 AM CT in Houston, assuming the drive takes exactly 14 hours?',
            options: [
              'Depart 4:00 PM MT the previous day (14 hrs before 6:00 AM MT = 4:00 PM; 6:00 AM CT = 5:00 AM MT in January)',
              'Depart 3:00 PM MT the previous day (6:00 AM CT = 5:00 AM MT in January; 5:00 AM − 14 hrs = 3:00 PM MT)',
              'Depart 4:00 PM MT the previous day',
              'Depart 5:00 PM MT the previous day',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q4',
            text: 'Which Interstate highway runs north-south through the center of the US, connecting San Antonio, TX to Minneapolis, MN?',
            options: ['I-70', 'I-35', 'I-80', 'I-40'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q5',
            text: 'Which city is universally recognized as the freight capital of the United States?',
            options: ['Los Angeles, CA', 'Dallas, TX', 'Chicago, IL', 'Atlanta, GA'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q6',
            text: 'A dispatcher books a load: pickup in Seattle, WA (PT) at 8:00 AM, delivery in Boston, MA (ET). In the driver\'s trip sheet, what time should the pickup be listed as?',
            options: [
              '8:00 AM ET — always use ET as the standard',
              '8:00 AM PT — use the local time of the pickup location',
              '11:00 AM ET — convert to Eastern Time',
              '5:00 AM PT — convert to the driver\'s home time',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q7',
            text: 'What is the primary east-west southern highway corridor connecting Los Angeles to Jacksonville, FL?',
            options: ['I-40', 'I-80', 'I-70', 'I-10'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q8',
            text: 'Your driver delivers in rural Wyoming in February. What is the first thing you should do?',
            options: [
              'Call the consignee to confirm delivery quality',
              'Immediately search for the next load — Wyoming is a near-freight desert and every hour without a load is lost revenue',
              'Schedule mandatory 10-hour rest for the driver before searching',
              'Post the truck on the load board and wait for brokers to call',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q9',
            text: 'California\'s CARB emission standards affect freight dispatching primarily by:',
            options: [
              'Requiring all drivers to hold a California CDL endorsement',
              'Limiting which carriers (trucks) can legally operate in California based on emissions compliance',
              'Restricting delivery hours to 8:00 AM – 6:00 PM in California',
              'Adding a mandatory fuel surcharge to all California loads',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q10',
            text: 'Which US freight region typically has strong outbound freight volume but can be challenging for inbound (many trucks compete to get there, pushing inbound rates down)?',
            options: ['The Midwest (Chicago area)', 'The Northeast (New York/NJ)', 'California (Los Angeles)', 'The Southeast (Atlanta)'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q11',
            text: 'What happens to freight rates and load availability during the October–December peak season?',
            options: [
              'Rates drop due to increased competition between carriers',
              'Load volume decreases as companies prepare for year-end accounting',
              'Rates climb and capacity tightens — it is the best time to negotiate higher rates',
              'Only reefer freight increases; dry van volume stays flat',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q12',
            text: 'Which Interstate highway warning should every dispatcher know for winter routing east of the Rockies?',
            options: [
              'I-80 through Wyoming can be extremely dangerous in winter due to high winds and blizzards',
              'I-95 is closed in winter between New York and Boston',
              'I-40 is impassable in winter through New Mexico',
              'I-10 through Texas floods every winter',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-pr-q13',
            text: 'A load from Los Angeles to Atlanta has a rate of $3,800 for 2,175 miles. A load from LA to Denver pays $1,800 for 1,020 miles. Which has a higher RPM?',
            options: [
              'LA → Atlanta: $1.75/mi — higher RPM',
              'LA → Denver: $1.76/mi — higher RPM, but only slightly',
              'LA → Atlanta: $1.66/mi — higher RPM',
              'They are equal',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q14',
            text: 'Memphis, TN is strategically important for freight because:',
            options: [
              'It has the largest population in the South',
              'It is home to FedEx\'s global hub and sits at the geographic center of US freight flow',
              'Memphis has the lowest diesel prices in the country',
              'It is the eastern terminus of I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q15',
            text: 'In January, when Eastern Time is UTC-5 and most of Mountain Time is UTC-7, how many hours behind ET is Arizona (which is always UTC-7)?',
            options: ['1 hour behind ET', '2 hours behind ET', '3 hours behind ET', 'Same time as ET'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q16',
            text: 'Mini-case: It\'s December. Your driver is empty in Billings, MT (MT). You see these loads:\nA: Billings → Chicago, IL | $2,400 | 1,380 miles | $1.74/mi\nB: Billings → Seattle, WA | $1,200 | 680 miles | $1.76/mi\nC: Billings → Dallas, TX | $2,100 | 1,250 miles | $1.68/mi\nWhich do you choose?',
            options: [
              'Load B — highest RPM at $1.76/mi',
              'Load A — Chicago is the top US freight hub; despite similar RPM, the destination gives the best options for the next load and the driver escapes a low-activity region',
              'Load C — Dallas is a strong market and warmer in December',
              'Load B — shorter haul means the driver finishes faster',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q17',
            text: 'Mini-case: A broker in Atlanta (ET) calls you at 9:00 AM ET Monday. The pickup is in Albuquerque, NM (MT) "Tuesday at 7:00 AM." It\'s January. What time do you tell the driver to be at the shipper?',
            options: [
              '7:00 AM ET — always communicate in the broker\'s time zone',
              '7:00 AM MT — the appointment is at the shipper\'s location, which is on Mountain Time',
              '9:00 AM MT — add 2 hours for the ET-to-MT conversion',
              '5:00 AM MT — subtract 2 hours from ET',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q18',
            text: 'Mini-case: You need to route a driver from Los Angeles to Chicago in November. Distance: 2,015 miles. Two route options:\nRoute 1: I-15 North → I-70 East through Denver → I-70 to Chicago\nRoute 2: I-10 East → I-40 East → I-55 North to Chicago\nWhich do you recommend?',
            options: [
              'Route 1 — more direct through Denver',
              'Route 2 — I-40 avoids the dangerous mountain passes on I-70 west of Denver; in November, this is the safer and more reliable choice',
              'Route 1 — I-70 is a faster highway overall',
              'Either route is equally safe in November',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q19',
            text: 'Mini-case: Your driver delivers in Miami, FL (ET) Thursday at 3:00 PM. You find a load: Miami → Los Angeles, CA (PT) — 2,750 miles, $4,100, pickup Friday 8:00 AM ET. The driver has 8 hours of HOS remaining Thursday. Is this load feasible, and is it a good deal?',
            options: [
              'Yes and yes — $4,100 is a huge payout and the schedule works',
              'Feasible on timing (driver rests Thursday night, picks up Friday). But $4,100 ÷ 2,750 = $1.49/mi RPM is below average for a long haul. Additionally, Los Angeles inbound is a soft market with many competing trucks. Consider negotiating a higher rate before accepting.',
              'Not feasible — the driver needs 24 hours of rest before any pickup after a delivery',
              'Good deal but not feasible — the driver cannot make an 8 AM Friday pickup after a Thursday 3 PM delivery',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q20',
            text: 'Mini-case: It\'s August. You dispatch from Chicago (CT). Your driver is in Los Angeles (PT) and has a delivery appointment in New York (ET) that the broker described as "Wednesday 6:00 AM." The driver asks what time that is locally. What do you tell them?',
            options: [
              '"It\'s 3:00 AM PT — the appointment is 3 hours earlier in Pacific Time" — this only matters for the driver\'s departure planning from LA',
              '"The delivery is at 6:00 AM ET Wednesday — when you\'re in New York, you\'ll be in Eastern Time. Plan your drive to arrive by 6:00 AM ET."',
              '"It\'s 6:00 AM CT — use Chicago time since that\'s our base"',
              '"It\'s 9:00 AM PT — add 3 hours for the West Coast"',
            ],
            correctIndex: 1,
          },
        ],
      },
      quizRu: {
        questions: [
          {
            id: 'geo-pr-q1',
            text: 'Сейчас 14:00 Pacific Time во вторник. Который час в Нью-Йорке (Eastern Time)?',
            options: ['13:00 ET', '15:00 ET', '16:00 ET', '17:00 ET'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q2',
            text: 'Какой штат соблюдает Mountain Standard Time (UTC-7) круглый год без перехода на летнее время?',
            options: ['Колорадо', 'Юта', 'Аризона', 'Невада'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q3',
            text: 'Грузоотправитель в Хьюстоне, TX (CT) назначил загрузку на "6:00 CT". Водитель едет из Финикса, AZ (MT, без DST). В январе, в котором часу MT водитель должен выехать, чтобы к 6:00 CT достичь Хьюстона, если поездка занимает ровно 14 часов?',
            options: [
              'Выехать в 16:00 MT накануне (14 часов до 6:00 MT = 16:00; 6:00 CT = 5:00 MT в январе)',
              'Выехать в 15:00 MT накануне (6:00 CT = 5:00 MT в январе; 5:00 − 14 часов = 15:00 MT)',
              'Выехать в 16:00 MT накануне',
              'Выехать в 17:00 MT накануне',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q4',
            text: 'Какое шоссе проходит с севера на юг через центр США, соединяя Сан-Антонио, TX с Миннеаполисом, MN?',
            options: ['I-70', 'I-35', 'I-80', 'I-40'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q5',
            text: 'Какой город повсеместно признан грузовой столицей США?',
            options: ['Лос-Анджелес, CA', 'Даллас, TX', 'Чикаго, IL', 'Атланта, GA'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q6',
            text: 'Диспетчер бронирует груз: загрузка в Сиэтле, WA (PT) в 8:00, доставка в Бостоне, MA (ET). Какое время загрузки указывается в маршрутном листе водителя?',
            options: [
              '8:00 ET — всегда использовать ET как стандарт',
              '8:00 PT — местное время места загрузки',
              '11:00 ET — конвертировать в Eastern Time',
              '5:00 PT — конвертировать в домашнее время водителя',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q7',
            text: 'Какое основное шоссе образует восточно-западный южный коридор, соединяя Лос-Анджелес с Джэксонвиллем, FL?',
            options: ['I-40', 'I-80', 'I-70', 'I-10'],
            correctIndex: 3,
          },
          {
            id: 'geo-pr-q8',
            text: 'Ваш водитель доставил груз в сельский Вайоминг в феврале. Что сделать первым?',
            options: [
              'Позвонить грузополучателю для подтверждения качества доставки',
              'Немедленно искать следующий груз — Вайоминг почти грузовая пустыня, каждый час без груза — потерянный доход',
              'Поставить водителю обязательный отдых 10 часов перед поиском',
              'Разместить грузовик на load board и ждать звонков от брокеров',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q9',
            text: 'Нормы выбросов CARB в Калифорнии влияют на грузовой диспетчинг прежде всего тем, что:',
            options: [
              'Требуют от всех водителей наличия калифорнийского CDL-эндорсмента',
              'Ограничивают список перевозчиков (грузовиков), которые могут легально работать в Калифорнии, по соответствию нормам выбросов',
              'Запрещают доставки в Калифорнии до 8:00 и после 18:00',
              'Добавляют обязательную топливную надбавку ко всем калифорнийским грузам',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q10',
            text: 'Какой регион США традиционно имеет сильный исходящий поток, но сложный входящий (много грузовиков конкурируют за попадание туда, снижая входящие ставки)?',
            options: ['Средний Запад (район Чикаго)', 'Северо-Восток (Нью-Йорк/NJ)', 'Калифорния (Лос-Анджелес)', 'Юго-Восток (Атланта)'],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q11',
            text: 'Что происходит со ставками и доступностью грузов в пиковый сезон октябрь–декабрь?',
            options: [
              'Ставки падают из-за роста конкуренции между перевозчиками',
              'Объём грузов снижается, компании готовятся к закрытию года',
              'Ставки растут, мощности сокращаются — лучшее время для переговоров о высоких ставках',
              'Растёт только рефрижераторный сектор; dry van остаётся неизменным',
            ],
            correctIndex: 2,
          },
          {
            id: 'geo-pr-q12',
            text: 'Какое предупреждение о зимней маршрутизации должен знать каждый диспетчер применительно к I-80 к востоку от Скалистых гор?',
            options: [
              'I-80 через Вайоминг может быть крайне опасен зимой из-за сильного ветра и метелей',
              'I-95 закрыт зимой между Нью-Йорком и Бостоном',
              'I-40 непроходим зимой через Нью-Мексико',
              'I-10 через Техас ежегодно затапливается зимой',
            ],
            correctIndex: 0,
          },
          {
            id: 'geo-pr-q13',
            text: 'Груз из Лос-Анджелеса в Атланту: $3 800 за 2 175 миль. Груз LA → Denver: $1 800 за 1 020 миль. У какого выше RPM?',
            options: [
              'LA → Атланта: $1.75/миль — выше',
              'LA → Денвер: $1.76/миль — выше, но незначительно',
              'LA → Атланта: $1.66/миль — выше',
              'Одинаковые',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q14',
            text: 'Мемфис, TN стратегически важен для грузоперевозок, потому что:',
            options: [
              'Это крупнейший по населению город Юга США',
              'Здесь расположен глобальный хаб FedEx, а сам город находится в географическом центре грузовых потоков США',
              'В Мемфисе самые низкие цены на дизельное топливо в стране',
              'Это восточный конечный пункт I-40',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q15',
            text: 'В январе, когда ET = UTC-5, а большинство Mountain Time = UTC-7, насколько Аризона (всегда UTC-7) отстаёт от ET?',
            options: ['На 1 час', 'На 2 часа', 'На 3 часа', 'Одинаково'],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q16',
            text: 'Мини-кейс: Декабрь. Водитель свободен в Биллингсе, MT (MT). Три варианта:\nA: Billings → Chicago, IL | $2 400 | 1 380 миль | $1.74/миль\nB: Billings → Seattle, WA | $1 200 | 680 миль | $1.76/миль\nC: Billings → Dallas, TX | $2 100 | 1 250 миль | $1.68/миль\nКакой выбрать?',
            options: [
              'Груз B — наивысший RPM $1.76/миль',
              'Груз A — Чикаго ведущий грузовой хаб США; несмотря на схожий RPM, пункт назначения даёт лучшие возможности для следующего груза и позволяет водителю покинуть регион с низкой активностью',
              'Груз C — Даллас сильный рынок и теплее в декабре',
              'Груз B — короткий рейс быстрее завершится',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q17',
            text: 'Мини-кейс: Брокер из Атланты (ET) звонит в 9:00 ET в понедельник. Загрузка в Альбукерке, NM (MT) "во вторник в 7:00". Январь. Какое время вы говорите водителю?',
            options: [
              '"7:00 ET" — всегда общаться в часовом поясе брокера',
              '"7:00 MT" — appointment у грузоотправителя, который находится в Mountain Time',
              '"9:00 MT" — прибавить 2 часа для конвертации ET → MT',
              '"5:00 MT" — вычесть 2 часа из ET',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q18',
            text: 'Мини-кейс: Ноябрь. Маршрут из Лос-Анджелеса в Чикаго, 2 015 миль. Два варианта маршрута:\nВариант 1: I-15 North → I-70 East через Денвер → I-70 до Чикаго\nВариант 2: I-10 East → I-40 East → I-55 North до Чикаго\nКакой рекомендовать?',
            options: [
              'Вариант 1 — прямее через Денвер',
              'Вариант 2 — I-40 обходит опасные горные перевалы I-70 к западу от Денвера; в ноябре это более безопасный и надёжный выбор',
              'Вариант 1 — I-70 в целом более скоростная трасса',
              'Оба маршрута одинаково безопасны в ноябре',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q19',
            text: 'Мини-кейс: Водитель доставил груз в Майами, FL (ET) в четверг в 15:00. Найден груз: Miami → Los Angeles, CA (PT) — 2 750 миль, $4 100, загрузка пятница 8:00 ET. У водителя 8 часов HOS в четверг. Реален ли груз и выгоден ли он?',
            options: [
              'Да, реален и выгоден — $4 100 большая выплата и расписание совпадает',
              'По срокам реален (водитель отдыхает четверг ночью, загружается в пятницу). Но $4 100 ÷ 2 750 = $1.49/миль — ниже среднего для дальнего рейса. Входящий в Калифорнию поток — мягкий рынок. Стоит попробовать поднять ставку перед принятием.',
              'Нереален — водителю нужны 24 часа отдыха после доставки перед любой загрузкой',
              'Выгоден, но нереален — водитель не успеет на загрузку 8:00 пятницы после доставки в 15:00 четверга',
            ],
            correctIndex: 1,
          },
          {
            id: 'geo-pr-q20',
            text: 'Мини-кейс: Август. Вы диспетчер в Чикаго (CT). Водитель в Лос-Анджелесе (PT), доставка в Нью-Йорке (ET), брокер сказал "среда 6:00 утра". Водитель спрашивает, что это за время. Что отвечаете?',
            options: [
              '"Это 3:00 PT — appointment на 3 часа раньше тихоокеанского времени" — важно только для планирования отъезда из LA',
              '"Доставка в среду в 6:00 ET — когда приедешь в Нью-Йорк, будешь в Eastern Time. Планируй поездку так, чтобы прибыть к 6:00 ET."',
              '"Это 6:00 CT — используй чикагское время как базу"',
              '"Это 9:00 PT — прибавь 3 часа для Западного побережья"',
            ],
            correctIndex: 1,
          },
        ],
      },
    },

    // ─── CHAPTER 3: Equipment Types ───────────────────────────────────────
    '3-1': {
      type: 'text',
      body: `
        <h2>Equipment Types — Introduction</h2>
        <blockquote>
          <strong>Core rule:</strong> Every load has equipment requirements. Every truck has limitations. Match them perfectly — every single time. Wrong equipment = failed delivery.
        </blockquote>

        <h2>Three Main Straight Truck Types</h2>

        <h3>1. Cargo Van / Sprinter Van</h3>
        <figure><img src="/trucks/cargo-van.jpg" alt="Cargo Van used for expedited deliveries" /><figcaption>Cargo Van / Sprinter Van — compact, no CDL needed, ideal for 2–4 pallets and urban last-mile delivery</figcaption></figure>
        <ul>
          <li><strong>Pallets:</strong> 2–4</li>
          <li><strong>CDL required:</strong> No</li>
          <li><strong>Best for:</strong> Medical supplies, electronics, expedited last-mile, urban areas</li>
        </ul>

        <h3>2. Box Truck 16ft</h3>
        <figure><img src="/trucks/box-truck-16.jpg" alt="Box Truck — straight truck for local deliveries" /><figcaption>Box Truck (Straight Truck) — the workhorse of local and regional freight delivery</figcaption></figure>
        <ul>
          <li><strong>Pallets:</strong> 6–8</li>
          <li><strong>CDL required:</strong> Generally no (under 26,001 lbs GVWR)</li>
          <li><strong>Best for:</strong> Food service, furniture, appliances, local distribution</li>
        </ul>

        <h3>3. Box Truck 24ft / 26ft</h3>
        <figure><img src="/trucks/box-truck-26.jpg" alt="Large Box Truck 24-26ft for regional distribution" /><figcaption>Box Truck 24ft/26ft — higher capacity (12–14 pallets), may require CDL Class B</figcaption></figure>
        <ul>
          <li><strong>Pallets:</strong> 12–14</li>
          <li><strong>CDL required:</strong> If GVWR over 26,001 lbs — <strong>CDL Class B minimum</strong></li>
          <li><strong>Best for:</strong> Regional distribution, trade shows, large appliances, industrial deliveries</li>
        </ul>
        <blockquote>
          <strong>Dispatcher warning:</strong> Always verify CDL status before booking a 24ft/26ft load. Dispatching an unlicensed driver is a federal violation and direct carrier liability.
        </blockquote>

        <h2>Key Accessories</h2>
        <figure><img src="/trucks/loading-dock.jpg" alt="Warehouse loading dock with truck" /><figcaption>Loading dock — when the delivery has no dock, a liftgate or ramps become essential</figcaption></figure>
        <ul>
          <li><strong>Ramps (RA)</strong> — portable metal ramps for loading without a dock or liftgate</li>
          <li><strong>Pallet Jack (PJ)</strong> — hydraulic tool to move pallets on flat surfaces; not all drivers carry one — always confirm</li>
          <li><strong>Liftgate (LG)</strong> — hydraulic platform that lowers freight to ground level; most frequently required accessory. Fee: <strong>$75–$150</strong> — confirm it's included in the agreed rate</li>
          <li><strong>Bulkhead</strong> — partition separating freight from the cab; standard safety feature on straight trucks</li>
          <li><strong>PPE (vest + steel-toed boots + hard hat)</strong> — required at manufacturing/industrial facilities; driver turned away without it = service failure</li>
          <li><strong>Load Bars</strong> — adjustable bars to prevent freight shifting; required for DOT compliance</li>
        </ul>
        <blockquote>
          <strong>Dispatcher habit:</strong> Know your drivers' equipment before any load comes up. A broker asking "Does your driver have a liftgate?" demands an instant, definitive answer.
        </blockquote>
      `,
      bodyRu: `
        <h2>Типы оборудования — Введение</h2>
        <blockquote>
          <strong>Главное правило:</strong> У каждого груза есть требования к оборудованию. У каждого грузовика — свои ограничения. Совмещайте их идеально каждый раз. Неверное оборудование = сорванная доставка.
        </blockquote>

        <h2>Три основных типа прямых грузовиков</h2>

        <h3>1. Cargo Van / Sprinter Van</h3>
        <figure><img src="/trucks/cargo-van.jpg" alt="Cargo Van для экспресс-доставки" /><figcaption>Cargo Van / Sprinter Van — компактный, CDL не нужен, подходит для 2–4 поддонов и городской доставки</figcaption></figure>
        <ul>
          <li><strong>Поддоны:</strong> 2–4</li>
          <li><strong>CDL:</strong> Не требуется</li>
          <li><strong>Лучше всего для:</strong> Медикаменты, электроника, срочная доставка, городские маршруты</li>
        </ul>

        <h3>2. Box Truck 16ft</h3>
        <figure><img src="/trucks/box-truck-16.jpg" alt="Box Truck — прямой грузовик для местных доставок" /><figcaption>Box Truck (Straight Truck) — основная рабочая лошадка местной и региональной доставки</figcaption></figure>
        <ul>
          <li><strong>Поддоны:</strong> 6–8</li>
          <li><strong>CDL:</strong> Как правило нет (GVWR до 26 001 фунта)</li>
          <li><strong>Лучше всего для:</strong> Общепит, мебель, бытовая техника, местная дистрибуция</li>
        </ul>

        <h3>3. Box Truck 24ft / 26ft</h3>
        <figure><img src="/trucks/box-truck-26.jpg" alt="Большой Box Truck 24-26ft" /><figcaption>Box Truck 24ft/26ft — повышенная вместимость (12–14 поддонов), может требовать CDL класса B</figcaption></figure>
        <ul>
          <li><strong>Поддоны:</strong> 12–14</li>
          <li><strong>CDL:</strong> При GVWR свыше 26 001 фунта — <strong>минимум CDL класса B</strong></li>
          <li><strong>Лучше всего для:</strong> Региональная дистрибуция, выставки, крупная бытовая техника</li>
        </ul>
        <blockquote>
          <strong>Предупреждение:</strong> Всегда проверяйте CDL до бронирования 24ft/26ft. Направить водителя без прав — федеральное нарушение и прямая ответственность carrier'а.
        </blockquote>

        <h2>Ключевые дополнения</h2>
        <figure><img src="/trucks/loading-dock.jpg" alt="Погрузочный док склада" /><figcaption>Погрузочный док — когда у получателя нет дока, лифтгейт или пандусы становятся обязательными</figcaption></figure>
        <ul>
          <li><strong>Пандусы (RA)</strong> — металлические рампы для загрузки без дока или лифтгейта</li>
          <li><strong>Pallet Jack (PJ)</strong> — гидравлическая тележка для перемещения поддонов; не у всех водителей есть — всегда уточняйте</li>
          <li><strong>Лифтгейт (LG)</strong> — гидравлическая платформа для погрузки без дока; наиболее часто требуемое дополнение. Сбор: <strong>$75–$150</strong> — убедитесь, что включён в ставку</li>
          <li><strong>Bulkhead</strong> — перегородка между кузовом и кабиной; стандартная функция безопасности</li>
          <li><strong>PPE (жилет + ботинки со стальным носком + каска)</strong> — обязательно на производственных/промышленных объектах; водителя без PPE не пустят = срыв доставки</li>
          <li><strong>Load Bars</strong> — регулируемые распорки для фиксации груза от смещения; требование DOT</li>
        </ul>
        <blockquote>
          <strong>Привычка диспетчера:</strong> Знайте оборудование водителей до того, как появится груз. Вопрос брокера "есть лифтгейт?" требует мгновенного чёткого ответа.
        </blockquote>
      `,
      quiz: {
        questions: [
          { id: 'eq-q1', text: 'How many standard pallets can a Cargo Van / Sprinter Van carry on average?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-q2', text: 'What does "LG" mean in a broker\'s load requirements?', options: ['Long Haul', 'Liftgate', 'Load Gate', 'Logistics Grade'], correctIndex: 1 },
          { id: 'eq-q3', text: 'Which straight truck type generally does NOT require a CDL?', options: ['Box Truck 26ft over 26,001 lbs GVWR', 'Box Truck 24ft requiring CDL Class B', 'Cargo Van under 10,001 lbs GVWR', 'Semi-truck tractor-trailer'], correctIndex: 2 },
          { id: 'eq-q4', text: 'What is a Pallet Jack (PJ) used for?', options: ['Locking the truck\'s rear cargo door', 'Manually lifting and moving pallets when no forklift is available', 'Measuring pallet dimensions before loading', 'Connecting the trailer hitch to the tractor'], correctIndex: 1 },
          { id: 'eq-q5', text: 'What is the average pallet capacity of a Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '18–20'], correctIndex: 1 },
          { id: 'eq-q6', text: 'What is the primary function of Load Bars in a truck?', options: ['Extending the truck\'s maximum cargo length', 'Preventing freight from shifting during transit', 'Measuring the weight distribution across the load', 'Locking the rear doors from inside'], correctIndex: 1 },
          { id: 'eq-q7', text: 'Which truck can carry 12–14 standard pallets on average?', options: ['Sprinter Van', 'Box Truck 16ft', 'Box Truck 24ft / 26ft', 'Cargo Van'], correctIndex: 2 },
          { id: 'eq-q8', text: 'What is a Bulkhead in a straight truck?', options: ['A hydraulic platform that raises freight to truck floor level', 'An internal partition separating the cargo area from the cab', 'A portable loading ramp for non-dock deliveries', 'A weight sensor built into the truck bed'], correctIndex: 1 },
          { id: 'eq-q9', text: 'Why must a dispatcher confirm PPE requirements before a driver\'s appointment?', options: ['PPE affects the truck\'s legal weight limit', 'Facilities turn away drivers without required PPE, causing missed appointment windows', 'PPE is only required for hazardous materials shipments', 'PPE compliance is a billing requirement for the broker'], correctIndex: 1 },
          { id: 'eq-q10', text: 'Ramps are most useful when a delivery location has:', options: ['A high-bay loading dock', 'No dock and no liftgate, but cargo can be wheeled or rolled out', 'A forklift available at all times', 'Heavy palletized freight requiring hydraulic lift'], correctIndex: 1 },
          { id: 'eq-q11', text: 'Mini-case: A broker has a load — 10 pallets, delivery to a strip mall with no loading dock and no forklift. What equipment do you need?', options: ['Cargo Van — most flexible for tight locations', 'Box Truck 16ft — 6–8 pallets is close enough', 'Box Truck 24ft/26ft with Liftgate — handles 10 pallets and unloads without dock', 'Box Truck 16ft with Ramps only — driver can roll pallets out'], correctIndex: 2 },
          { id: 'eq-q12', text: 'Mini-case: Your driver has a Cargo Van. A broker offers a load: 6 pallets, 500 lbs each, pickup today. What is your call?', options: ['Accept — vans handle any pallets if they are light enough', 'Decline — a cargo van holds 2–4 pallets on average; 6 pallets exceeds its capacity', 'Accept — 500 lbs per pallet is under the weight limit so dimensions do not matter', 'Accept with ramps — ramps let you load extra pallets on the bumper'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-q1', text: 'Сколько стандартных поддонов в среднем вмещает Cargo Van / Sprinter Van?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-q2', text: 'Что означает аббревиатура "LG" в требованиях брокера к грузу?', options: ['Long Haul (дальний рейс)', 'Liftgate (лифтгейт)', 'Load Gate (грузовые ворота)', 'Logistics Grade (класс логистики)'], correctIndex: 1 },
          { id: 'eq-q3', text: 'Какой тип прямого грузовика, как правило, не требует прав CDL?', options: ['Box Truck 26ft с GVWR более 26 001 фунта', 'Box Truck 24ft с CDL класса B', 'Cargo Van с GVWR до 10 001 фунта', 'Полуприцеп-тягач'], correctIndex: 2 },
          { id: 'eq-q4', text: 'Для чего используется Pallet Jack (PJ)?', options: ['Блокировки задней двери кузова', 'Ручного подъёма и перемещения поддонов при отсутствии погрузчика', 'Измерения габаритов поддона перед погрузкой', 'Присоединения прицепа к тягачу'], correctIndex: 1 },
          { id: 'eq-q5', text: 'Какова средняя вместимость поддонов Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '18–20'], correctIndex: 1 },
          { id: 'eq-q6', text: 'Каково основное назначение стяжных штанг (Load Bars)?', options: ['Увеличение максимальной длины грузового отсека', 'Предотвращение смещения груза в пути', 'Измерение распределения веса по грузу', 'Блокировка задних дверей изнутри'], correctIndex: 1 },
          { id: 'eq-q7', text: 'Какой грузовик вмещает в среднем 12–14 стандартных поддонов?', options: ['Sprinter Van', 'Box Truck 16ft', 'Box Truck 24ft / 26ft', 'Cargo Van'], correctIndex: 2 },
          { id: 'eq-q8', text: 'Что такое Bulkhead в прямом грузовике?', options: ['Гидравлическая платформа, поднимающая груз до уровня пола', 'Внутренняя перегородка, отделяющая грузовой отсек от кабины', 'Переносной пандус для доставки без дока', 'Встроенный датчик веса в полу кузова'], correctIndex: 1 },
          { id: 'eq-q9', text: 'Почему важно заранее уточнять требования к PPE перед приездом водителя?', options: ['PPE влияет на допустимую полную массу грузовика', 'Объекты не допускают водителей без PPE — пропускается окно доставки', 'PPE требуется только для опасных грузов', 'Это требование выставления счёта брокеру'], correctIndex: 1 },
          { id: 'eq-q10', text: 'Пандусы наиболее полезны, когда в точке доставки:', options: ['Есть высокий погрузочный док', 'Нет дока и лифтгейта, но груз можно выкатить', 'Постоянно доступен погрузчик', 'Требуется гидравлический подъём тяжёлых поддонов'], correctIndex: 1 },
          { id: 'eq-q11', text: 'Мини-кейс: Брокер предлагает груз — 10 поддонов, доставка в торговый центр без дока и без погрузчика. Какое оборудование необходимо?', options: ['Cargo Van — самый гибкий для небольших мест', 'Box Truck 16ft — 6–8 поддонов достаточно близко', 'Box Truck 24ft/26ft с лифтгейтом — вмещает 10 поддонов и выгрузит без дока', 'Box Truck 16ft с пандусами — водитель выкатит поддоны'], correctIndex: 2 },
          { id: 'eq-q12', text: 'Мини-кейс: Ваш водитель управляет Cargo Van. Брокер предлагает 6 поддонов по 500 фунтов каждый. Ваше решение?', options: ['Принять — фургоны справляются с любым числом поддонов, если они лёгкие', 'Отказать — cargo van вмещает 2–4 поддона в среднем; 6 превышает вместимость', 'Принять — 500 фунтов на поддон ниже лимита, размер не имеет значения', 'Принять с пандусами — так можно загрузить лишние поддоны снаружи'], correctIndex: 1 },
        ],
      },
    },

    '3-2': {
      type: 'text',
      body: `
        <h2>Equipment Types — Deep Dive for Dispatchers</h2>

        <h2>CDL/GVWR Thresholds</h2>
        <blockquote>
          <strong>GVWR</strong> (Gross Vehicle Weight Rating) — stamped on the door frame; determines CDL requirement:<br/>
          Under 10,001 lbs — No CDL (Cargo Van, Sprinter Van)<br/>
          10,001–26,000 lbs — Standard driver's license (Box Truck 16ft)<br/>
          Over 26,001 lbs — <strong>CDL Class B minimum</strong> (heavier 24ft/26ft Box Trucks)<br/>
          Tractor-trailer — <strong>CDL Class A required</strong>
        </blockquote>
        <figure><img src="/trucks/semi-truck.jpg" alt="Semi-truck (18-wheeler) on the highway" /><figcaption>Semi-truck / 18-wheeler — requires CDL Class A, the backbone of long-haul freight in the US</figcaption></figure>
        <p><strong>Never assume — always check GVWR on the specific vehicle.</strong> A 26ft truck at 24,000 lbs needs no CDL; the same truck at 27,000 lbs does.</p>

        <h2>When to Use Each Truck</h2>
        <ul>
          <li><strong>Cargo Van:</strong> 1–4 pallets, speed priority, urban access, no CDL needed</li>
          <li><strong>Box Truck 16ft:</strong> 5–8 pallets, mixed city/suburban, no CDL Class B, liftgate possible</li>
          <li><strong>Box Truck 24ft/26ft:</strong> 10–14 pallets, regional delivery, CDL Class B confirmed</li>
        </ul>

        <h3>Other Common Equipment Types</h3>
        <figure><img src="/trucks/flatbed.jpg" alt="Flatbed trailer hauling freight" /><figcaption>Flatbed trailer — used for oversized, heavy, or irregularly shaped freight that cannot fit inside an enclosed trailer</figcaption></figure>
        <figure><img src="/trucks/reefer.jpg" alt="Refrigerated trailer (reefer)" /><figcaption>Reefer (refrigerated trailer) — temperature-controlled for perishable goods, pharmaceuticals, and frozen freight</figcaption></figure>

        <h2>Accessorial Charges</h2>
        <p>Always negotiate accessorials into the rate — never assume they're included.</p>
        <ul>
          <li><strong>Liftgate fee:</strong> <strong>$75–$150 per stop</strong> — can apply at both pickup and delivery</li>
          <li><strong>Residential delivery fee:</strong> <strong>$50–$100</strong> — longer time, no dock, narrow streets</li>
          <li><strong>Inside delivery fee (ID):</strong> <strong>$50–$150</strong> — driver brings freight inside building; must be explicit in rate con</li>
          <li><strong>Detention:</strong> <strong>$50–$75/hr</strong> after the free window (1–2 hrs); document and bill immediately</li>
        </ul>

        <h2>Load Board Shorthand</h2>
        <blockquote>
          <strong>SB</strong> — Straight Box (any box truck) | <strong>CV</strong> — Cargo Van | <strong>SPR</strong> — Sprinter Van<br/>
          <strong>LG</strong> — Liftgate required | <strong>PJ</strong> — Pallet Jack | <strong>RA</strong> — Ramps<br/>
          <strong>PPE</strong> — PPE required at facility | <strong>RESI</strong> — Residential | <strong>ID</strong> — Inside delivery
        </blockquote>
        <p>"26ft SB / LG / RESI" = 26ft box truck, liftgate required, residential delivery. Before calling: confirm truck size, liftgate availability, and all accessorial fees in the rate.</p>

        <figure><img src="/trucks/warehouse.jpg" alt="Warehouse loading area" /><figcaption>A loading facility — knowing what equipment is available at pickup/delivery determines which truck you dispatch</figcaption></figure>
        <h2>Equipment Matching Errors and Consequences</h2>
        <ul>
          <li>No liftgate at residential delivery → service failure, possible chargeback</li>
          <li>No CDL verification for GVWR over 26,001 lbs → federal violation, insurance nullified</li>
          <li>Ignoring accessorials → load pays $1,800 but nets $1,500 after liftgate + RESI + ID</li>
          <li>Assuming PJ is standard → freight stuck on truck, no forklift at consignee</li>
          <li>Missing PPE → driver turned away, appointment missed, broker files service failure</li>
        </ul>
        <blockquote>
          <em>"My driver has a 26ft box truck with liftgate and pallet jack, CDL Class B. For a residential delivery with those requirements, I need $2,400 — not $1,900."</em> Use specialized equipment as negotiation leverage.
        </blockquote>
      `,
      bodyRu: `
        <h2>Типы оборудования — Углублённый курс для диспетчера</h2>

        <h2>Пороги CDL/GVWR</h2>
        <blockquote>
          <strong>GVWR</strong> (Gross Vehicle Weight Rating) — нанесён на дверной стойке; определяет требования к CDL:<br/>
          До 10 001 фунта — CDL не требуется (Cargo Van, Sprinter Van)<br/>
          10 001–26 000 фунтов — Обычные водительские права (Box Truck 16ft)<br/>
          Свыше 26 001 фунта — <strong>Минимум CDL класса B</strong> (тяжёлые 24ft/26ft Box Trucks)<br/>
          Тягач+прицеп — <strong>CDL класса A</strong>
        </blockquote>
        <figure><img src="/trucks/semi-truck.jpg" alt="Тягач с полуприцепом (18-wheeler) на трассе" /><figcaption>Semi-truck / 18-wheeler — требует CDL класса A, основа дальнобойных перевозок в США</figcaption></figure>
        <p><strong>Никогда не предполагайте — всегда проверяйте GVWR конкретного автомобиля.</strong> 26ft при 24 000 фунтов — CDL не нужен; тот же грузовик при 27 000 фунтов — нужен.</p>

        <h2>Когда использовать каждый тип</h2>
        <ul>
          <li><strong>Cargo Van:</strong> 1–4 поддона, приоритет скорости, городской доступ, CDL не нужен</li>
          <li><strong>Box Truck 16ft:</strong> 5–8 поддонов, смешанный город/пригород, без CDL класса B, лифтгейт возможен</li>
          <li><strong>Box Truck 24ft/26ft:</strong> 10–14 поддонов, региональная доставка, CDL класса B подтверждён</li>
        </ul>

        <h3>Другие распространённые типы оборудования</h3>
        <figure><img src="/trucks/flatbed.jpg" alt="Flatbed-прицеп с грузом" /><figcaption>Flatbed (бортовой прицеп) — для негабаритных, тяжёлых или нестандартных грузов, которые не помещаются в закрытый прицеп</figcaption></figure>
        <figure><img src="/trucks/reefer.jpg" alt="Рефрижераторный прицеп (reefer)" /><figcaption>Reefer (рефрижератор) — температурный контроль для скоропортящихся товаров, фармацевтики и замороженных грузов</figcaption></figure>

        <h2>Дополнительные сборы (Accessorials)</h2>
        <p>Всегда включайте accessorials в переговоры о ставке — никогда не предполагайте, что они входят.</p>
        <ul>
          <li><strong>Лифтгейт:</strong> <strong>$75–$150 за остановку</strong> — может взиматься дважды (погрузка + выгрузка)</li>
          <li><strong>Доставка в жилую зону (RESI):</strong> <strong>$50–$100</strong> — узкие улицы, нет дока, сложная парковка</li>
          <li><strong>Занос внутрь (ID/Inside Delivery):</strong> <strong>$50–$150</strong> — водитель заносит груз в здание; должно быть явно указано в rate con</li>
          <li><strong>Detention:</strong> <strong>$50–$75/час</strong> после бесплатного периода (1–2 часа); фиксировать и выставлять немедленно</li>
        </ul>

        <h2>Сокращения на бирже грузов</h2>
        <blockquote>
          <strong>SB</strong> — Straight Box (любой box truck) | <strong>CV</strong> — Cargo Van | <strong>SPR</strong> — Sprinter Van<br/>
          <strong>LG</strong> — лифтгейт обязателен | <strong>PJ</strong> — Pallet Jack | <strong>RA</strong> — пандусы<br/>
          <strong>PPE</strong> — PPE обязательно на объекте | <strong>RESI</strong> — жилая зона | <strong>ID</strong> — занос внутрь
        </blockquote>
        <p>"26ft SB / LG / RESI" = 26ft box truck, лифтгейт обязателен, жилая зона. До звонка: подтвердить размер грузовика, наличие лифтгейта, все accessorials в ставке.</p>

        <figure><img src="/trucks/warehouse.jpg" alt="Зона погрузки на складе" /><figcaption>Погрузочная зона — знание доступного оборудования на точках погрузки/выгрузки определяет выбор грузовика</figcaption></figure>
        <h2>Ошибки при подборе оборудования и их последствия</h2>
        <ul>
          <li>Нет лифтгейта на жилой доставке → срыв доставки, возможный штраф</li>
          <li>Не проверен CDL при GVWR свыше 26 001 фунта → федеральное нарушение, страховка аннулируется</li>
          <li>Не учтены accessorials → груз платит $1 800, чистый доход $1 500 после лифтгейта + RESI + ID</li>
          <li>Предположение о наличии PJ → груз застрял в кузове, погрузчика нет</li>
          <li>Не уточнено PPE → водителя не пустили, appointment пропущен, service failure</li>
        </ul>
        <blockquote>
          <em>«Водитель приедет на 26ft с лифтгейтом и PJ, CDL класс B. За жилую доставку с такими требованиями нужно $2 400, а не $1 900.»</em> Используйте оборудование как рычаг переговоров.
        </blockquote>
      `,
      quiz: {
        questions: [
          { id: 'eq-th-q1', text: 'At what GVWR threshold is CDL Class B the minimum requirement for operating a straight truck?', options: ['Over 10,001 lbs', 'Over 18,001 lbs', 'Over 26,001 lbs', 'Over 33,001 lbs'], correctIndex: 2 },
          { id: 'eq-th-q2', text: 'What does GVWR stand for, and why does it matter for dispatchers?', options: ['Gross Vehicle Width Rating — it determines if the truck fits at a dock', 'Gross Vehicle Weight Rating — it determines CDL requirements for the driver', 'General Vehicle Work Rating — it sets the truck\'s insurance class', 'Gross Vehicle Wheel Rating — it determines tire load capacity'], correctIndex: 1 },
          { id: 'eq-th-q3', text: 'A load posting reads "26ft SB / LG / RESI." What does this mean?', options: ['26ft straight box truck, long-haul rate included, rush delivery', '26ft straight box truck, liftgate required, residential delivery', '26ft semi-box trailer, low-grade freight, refrigerated', '26ft straight box, loading ramps available, standard delivery'], correctIndex: 1 },
          { id: 'eq-th-q4', text: 'What is the standard accessorial fee range for liftgate service per stop?', options: ['$10–$25', '$75–$150', '$200–$300', '$400–$500'], correctIndex: 1 },
          { id: 'eq-th-q5', text: 'A driver arrives on time at a pickup facility but waits 3 hours beyond the 2-hour free period. What should the dispatcher do?', options: ['Wait until delivery is complete before raising the issue', 'Accept the delay — detention is the driver\'s problem to track', 'Document the detention time and bill the broker immediately for hours beyond the free period', 'Cancel the load and find a replacement freight that pays more'], correctIndex: 2 },
          { id: 'eq-th-q6', text: 'What is an "Inside Delivery" fee, and when does it apply?', options: ['A fee for delivering to an address with an interior courtyard', 'An extra charge when the driver is required to bring freight inside the building beyond the dock or doorstep', 'A fee for using the truck\'s interior liftgate system', 'A surcharge for delivering to high-rise buildings with freight elevators'], correctIndex: 1 },
          { id: 'eq-th-q7', text: 'Your driver has a Box Truck 26ft with a GVWR of 27,500 lbs. What license does the driver need to legally operate it?', options: ['Standard driver\'s license — GVWR thresholds only apply to semi-trucks', 'CDL Class A — all commercial trucks require Class A', 'CDL Class B minimum — required for vehicles over 26,001 lbs GVWR', 'CDL Class C — only required for passenger vehicles'], correctIndex: 2 },
          { id: 'eq-th-q8', text: 'When negotiating rate, why does having a liftgate-equipped truck give the dispatcher leverage?', options: ['Liftgate trucks are federally subsidized so brokers must accept higher rates', 'Liftgate-equipped drivers are scarce for certain loads, making it harder for brokers to replace them quickly', 'Liftgates add significant weight that increases fuel costs which justifies higher rates', 'Brokers are legally required to pay a liftgate premium by FMCSA regulation'], correctIndex: 1 },
          { id: 'eq-th-q9', text: 'A load requires a pallet jack. Your driver confirms he does not have one. The consignee has no forklift. What is the correct dispatcher action?', options: ['Book the load and hope the consignee figures out a solution on the day', 'Decline the load or find a driver who has a PJ before committing to the broker', 'Accept the load and negotiate a discount to compensate the consignee', 'Tell the broker PJ is not needed and let the driver handle it on arrival'], correctIndex: 1 },
          { id: 'eq-th-q10', text: 'Which of these loads would most likely generate both a Residential Delivery fee AND a Liftgate fee?', options: ['8 pallets of auto parts, delivery to a distribution center with docks', '4 pallets of appliances, delivery to a private home address, no dock', '12 pallets of produce, delivery to a grocery chain warehouse', '2 pallets of electronics, delivery to a tech company HQ loading dock'], correctIndex: 1 },
          { id: 'eq-th-q11', text: 'Mini-case: A broker posts a load — 10 pallets, Box Truck 26ft required, residential delivery, liftgate required, rate $2,100. Your driver has a 26ft truck with liftgate and CDL Class B. Should you accept at $2,100?', options: ['Yes — $2,100 is solid for a straight truck run', 'Yes — the driver has all required equipment so there\'s no reason to negotiate', 'No — residential + liftgate accessorials ($125+$75) reduce net pay; counter to $2,400 minimum', 'No — you can never accept a residential delivery load under any circumstances'], correctIndex: 2 },
          { id: 'eq-th-q12', text: 'Mini-case: You book a load for a driver with a Box Truck 24ft GVWR 24,500 lbs. Halfway through the route you realize the driver only has a standard license, not CDL. What is the critical issue?', options: ['No issue — 24,500 lbs GVWR is under the 26,001 lb CDL threshold, so no CDL is required', 'Major issue — any straight truck requires CDL Class B regardless of GVWR', 'Minor issue — CDL is only required at delivery locations in certain states', 'Issue only if the truck is fully loaded to max weight'], correctIndex: 0 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-th-q1', text: 'При каком значении GVWR минимально требуется CDL класса B для управления прямым грузовиком?', options: ['Свыше 10 001 фунта', 'Свыше 18 001 фунта', 'Свыше 26 001 фунта', 'Свыше 33 001 фунта'], correctIndex: 2 },
          { id: 'eq-th-q2', text: 'Что означает GVWR и почему это важно для диспетчера?', options: ['Gross Vehicle Width Rating — определяет, войдёт ли грузовик в dok', 'Gross Vehicle Weight Rating — определяет требования к CDL для водителя', 'General Vehicle Work Rating — задаёт страховой класс грузовика', 'Gross Vehicle Wheel Rating — определяет нагрузку на шины'], correctIndex: 1 },
          { id: 'eq-th-q3', text: 'Объявление на бирже грузов: «26ft SB / LG / RESI». Что это означает?', options: ['26ft box truck, ставка за дальний рейс, срочная доставка', '26ft box truck, лифтгейт обязателен, доставка в жилую зону', '26ft полуприцеп, низкосортный груз, рефрижератор', '26ft box truck, пандусы доступны, стандартная доставка'], correctIndex: 1 },
          { id: 'eq-th-q4', text: 'Каков стандартный диапазон accessorial-сбора за лифтгейт за одну остановку?', options: ['$10–$25', '$75–$150', '$200–$300', '$400–$500'], correctIndex: 1 },
          { id: 'eq-th-q5', text: 'Водитель прибыл вовремя на погрузку, но ждал 3 часа после бесплатного периода в 2 часа. Что должен сделать диспетчер?', options: ['Подождать окончания доставки и только потом поднимать вопрос', 'Принять задержку — detention time — проблема водителя', 'Зафиксировать время простоя и немедленно выставить брокеру счёт за часы сверх бесплатного периода', 'Отменить груз и найти более выгодный'], correctIndex: 2 },
          { id: 'eq-th-q6', text: 'Что такое сбор за "Inside Delivery" и когда он применяется?', options: ['Сбор за доставку на адрес с внутренним двором', 'Доплата, когда водитель обязан занести груз внутрь здания, а не только к доку или двери', 'Сбор за использование внутренней лифтейтовой системы грузовика', 'Наценка за доставку в высотные здания с грузовыми лифтами'], correctIndex: 1 },
          { id: 'eq-th-q7', text: 'У вашего водителя Box Truck 26ft с GVWR 27 500 фунтов. Какие права ему нужны?', options: ['Обычные водительские права — пороги GVWR применяются только к полуприцепам', 'CDL класса A — все коммерческие грузовики требуют класс A', 'Минимум CDL класса B — обязателен для ТС свыше 26 001 фунта GVWR', 'CDL класса C — требуется только для пассажирских ТС'], correctIndex: 2 },
          { id: 'eq-th-q8', text: 'Почему наличие грузовика с лифтгейтом даёт диспетчеру преимущество в переговорах?', options: ['Грузовики с лифтгейтом субсидируются государством, поэтому брокеры обязаны принимать более высокие ставки', 'Водители с лифтгейтом редки для определённых грузов, и брокеру сложнее быстро найти замену', 'Лифтгейт добавляет значительный вес, увеличивая расход топлива, что оправдывает более высокую ставку', 'Брокеры по правилам FMCSA обязаны доплачивать за наличие лифтгейта'], correctIndex: 1 },
          { id: 'eq-th-q9', text: 'Груз требует pallet jack. Водитель подтверждает, что у него нет PJ. У грузополучателя нет погрузчика. Ваши действия?', options: ['Забронировать груз и надеяться, что грузополучатель найдёт решение в день доставки', 'Отказаться от груза или найти водителя с PJ до подтверждения брокеру', 'Принять груз и договориться о скидке для компенсации грузополучателю', 'Сказать брокеру, что PJ не нужен, и оставить решение водителю'], correctIndex: 1 },
          { id: 'eq-th-q10', text: 'Какой из этих грузов с наибольшей вероятностью породит и Residential Delivery Fee, и Liftgate Fee?', options: ['8 поддонов автозапчастей, доставка в дистрибьюторский центр с доками', '4 поддона бытовой техники, доставка по частному жилому адресу без дока', '12 поддонов продуктов, доставка на склад сети супермаркетов', '2 поддона электроники, доставка на погрузочный дoк офиса tech-компании'], correctIndex: 1 },
          { id: 'eq-th-q11', text: 'Мини-кейс: Брокер предлагает груз — 10 поддонов, Box Truck 26ft, доставка в жилую зону, лифтгейт обязателен, ставка $2 100. У вашего водителя 26ft с лифтгейтом и CDL класса B. Принять за $2 100?', options: ['Да — $2 100 хорошая ставка для прямого грузовика', 'Да — водитель имеет всё необходимое, смысла торговаться нет', 'Нет — residential + liftgate accessorials ($125+$75) снижают чистую ставку; встречное предложение от $2 400', 'Нет — доставку в жилую зону нельзя принимать ни при каких условиях'], correctIndex: 2 },
          { id: 'eq-th-q12', text: 'Мини-кейс: Вы бронируете груз для водителя на Box Truck 24ft с GVWR 24 500 фунтов. На полпути обнаруживаете, что у водителя только обычные права, без CDL. В чём критическая проблема?', options: ['Никакой проблемы — 24 500 фунтов GVWR ниже порога 26 001 фунта, CDL не требуется', 'Серьёзная проблема — любой прямой грузовик требует CDL класса B вне зависимости от GVWR', 'Незначительная проблема — CDL требуется только в точках доставки определённых штатов', 'Проблема только если грузовик нагружен до максимальной массы'], correctIndex: 0 },
        ],
      },
    },

    '3-3': {
      type: 'text',
      body: `
        <h2>Demo: A Dispatcher's Day with Equipment Decisions</h2>

        <h2>7:45 AM — Morning Equipment Audit</h2>
        <blockquote>
          <strong>Marcus:</strong> 26ft, GVWR 28,000 lbs, CDL Class B, liftgate, pallet jack — Dallas, TX<br/>
          <strong>Priya:</strong> 16ft, GVWR 22,000 lbs, no CDL, no liftgate, ramps — Houston, TX<br/>
          <strong>Derek:</strong> Cargo Van, no CDL, no liftgate — Austin, TX
        </blockquote>
        <blockquote>
          <strong>Professional habit:</strong> Know your fleet equipment profile before your first call. Never discover a missing liftgate after committing to a broker.
        </blockquote>

        <h2>8:20 AM — Load 1: Residential Liftgate (Dallas→San Antonio)</h2>
        <p>Load board listing: 12 pallets | 26ft SB/LG/RESI | $1,650 → Marcus (only match). Broker: LG accessorial not included. Alex: "Need $1,800 — residential, liftgate both ends." Broker: "$1,750." Done.</p>
        <p>Result: +$100 by asking about accessorials before accepting.</p>

        <h2>9:10 AM — Load 2: PPE Discovered Late (Houston→Beaumont)</h2>
        <p>6 pallets | 16ft | $820 → Priya. After booking: petrochemical plant, PPE required (hard hat, vest, steel-toed boots) — buried in posting.</p>
        <blockquote>
          1. Call broker — request 30-min window for Priya to get PPE.<br/>
          2. Find nearest safety supply store.<br/>
          3. If no extension — offer Marcus (has PPE kit).<br/>
          <strong>Never send a driver into a facility without PPE. DOT violation or injury is catastrophic.</strong>
        </blockquote>
        <p>Broker extended 45 min. Load delivered. Note: always check facility type for PPE before confirming pickup.</p>

        <h2>11:30 AM — Load 3: Inside Delivery Trap (Austin→Houston)</h2>
        <p>3 pallets | Cargo Van | $450 | residential → Derek (available). Alex's standard questions surface: inside delivery, 2nd floor, no elevator.</p>
        <blockquote>
          <strong>Alex:</strong> "Inside delivery 2nd floor is not standard. Need $600 minimum and inside delivery fee explicitly in rate con."<br/>
          <strong>Broker:</strong> "$575 all-in."<br/>
          <strong>Alex:</strong> "Done — but 'inside delivery, 2nd floor' must be written in the rate con. If it's not there, Derek doesn't go past the door."
        </blockquote>

        <h2>2:00 PM — CDL Verification at Weigh Station</h2>
        <p>Marcus: "CDL Class B current? Truck loaded at 24,000 lbs." Alex checks records: CDL Class B valid, GVWR 28,000 lbs → Class B required and covered.</p>

        <h2>End of Day Summary</h2>
        <ul>
          <li>Fleet audit before load search — no last-minute equipment mismatches</li>
          <li>Asked about accessorials on RESI/LG load — gained $100</li>
          <li>Caught PPE requirement — resolved before driver was turned away</li>
          <li>Identified inside delivery trap — negotiated fee into rate con explicitly</li>
          <li>Maintained CDL records — instant verification at weigh station</li>
        </ul>
      `,
      bodyRu: `
        <h2>Демо: рабочий день диспетчера с решением задач по оборудованию</h2>

        <h2>7:45 утра — Утренний аудит оборудования</h2>
        <blockquote>
          <strong>Маркус:</strong> 26ft, GVWR 28 000 фунтов, CDL класс B, лифтгейт, pallet jack — Даллас, TX<br/>
          <strong>Прия:</strong> 16ft, GVWR 22 000 фунтов, без CDL, без лифтгейта, пандусы — Хьюстон, TX<br/>
          <strong>Дерек:</strong> Cargo Van, без CDL, без лифтгейта — Остин, TX
        </blockquote>
        <blockquote>
          <strong>Профессиональная привычка:</strong> Знайте оборудование автопарка до первого звонка. Никогда не обнаруживайте отсутствие лифтгейта после взятых обязательств перед брокером.
        </blockquote>

        <h2>8:20 утра — Груз 1: жилая доставка с лифтгейтом (Даллас→Сан-Антонио)</h2>
        <p>Load board: 12 поддонов | 26ft SB/LG/RESI | $1 650 → Маркус (единственное совпадение). Брокер: accessorial за LG не включён. Алекс: «Нужно $1 800 — жилая, лифтгейт с обеих сторон.» Брокер: «$1 750.» Договорились.</p>
        <p>Результат: +$100 за один вопрос об accessorials до принятия ставки.</p>

        <h2>9:10 утра — Груз 2: PPE обнаружен поздно (Хьюстон→Бомонт)</h2>
        <p>6 поддонов | 16ft | $820 → Прия. После бронирования: нефтехимический завод, PPE required (каска, жилет, ботинки со стальным носком) — скрыто в низу объявления.</p>
        <blockquote>
          1. Позвонить брокеру — попросить окно 30 мин, пока Прия купит PPE.<br/>
          2. Найти ближайший магазин средств защиты.<br/>
          3. Если окно не сдвинуть — предложить Маркуса (есть PPE-комплект).<br/>
          <strong>Никогда не отправляйте водителя без PPE. Нарушение DOT или травма — катастрофа.</strong>
        </blockquote>
        <p>Брокер расширил окно на 45 минут. Доставка состоялась. Вывод: всегда проверять тип объекта на PPE до подтверждения окна погрузки.</p>

        <h2>11:30 утра — Груз 3: ловушка inside delivery (Остин→Хьюстон)</h2>
        <p>3 поддона | Cargo Van | $450 | жилой адрес → Дерек (доступен). Стандартные вопросы Алекса выявляют: занос внутрь, 2-й этаж, лифта нет.</p>
        <blockquote>
          <strong>Алекс:</strong> «Занос на 2-й этаж — нестандартная услуга. Нужно минимум $600, и inside delivery должен быть явно в rate con.»<br/>
          <strong>Брокер:</strong> «$575 всё включено.»<br/>
          <strong>Алекс:</strong> «Договорились — но "inside delivery, 2nd floor" должно быть прописано в rate con. Без этого Дерек не заходит дальше двери.»
        </blockquote>

        <h2>14:00 — Проверка CDL на весовом пункте</h2>
        <p>Маркус: «CDL класс B актуален? Загружен на 24 000 фунтов.» Алекс проверяет: CDL класс B действует, GVWR 28 000 фунтов — класс B обязателен и покрывает.</p>

        <h2>Итоги дня</h2>
        <ul>
          <li>Аудит парка до поиска грузов — никаких несовпадений оборудования в последний момент</li>
          <li>Спросил об accessorials на RESI/LG-грузе — получил +$100</li>
          <li>Поймал PPE до отказа водителю в допуске — решил проактивно</li>
          <li>Распознал ловушку inside delivery — включил сбор в rate con явно</li>
          <li>Вёл записи CDL — мгновенная верификация на весовом пункте</li>
        </ul>
      `,
      quiz: {
        questions: [
          { id: 'eq-dm-q1', text: 'In the demo, why does Alex audit his drivers\' equipment profiles before opening the load board each morning?', options: ['It is a regulatory requirement from FMCSA', 'So he knows what each driver can handle before any load comes up — preventing last-minute equipment mismatches', 'To verify that drivers have not modified their trucks overnight', 'So he can report equipment status to the carrier\'s insurance company'], correctIndex: 1 },
          { id: 'eq-dm-q2', text: 'Alex sees a load posting: "26ft SB / LG / RESI." Which driver in his fleet should he assign?', options: ['Priya — her 16ft truck with ramps is fastest', 'Derek — his Cargo Van is most flexible for residential deliveries', 'Marcus — his 26ft truck with liftgate and CDL Class B is the only correct match', 'Any driver — residential deliveries have no equipment requirements'], correctIndex: 2 },
          { id: 'eq-dm-q3', text: 'The broker offers the residential liftgate load at $1,650. Alex counters to $1,800. What is his justification?', options: ['He always marks up 10% as standard dispatcher fee', 'The liftgate accessorial fee was not included in the $1,650 rate — he needs it accounted for', 'He wants to test the broker\'s flexibility before accepting any load', 'He believes the distance is longer than what the broker calculated'], correctIndex: 1 },
          { id: 'eq-dm-q4', text: 'Priya discovers a PPE requirement after being assigned to a petrochemical plant pickup. What is Alex\'s FIRST action?', options: ['Cancel the load immediately and blame the broker for not listing PPE', 'Call the broker, explain the situation, and request a window extension so Priya can obtain the required PPE', 'Tell Priya to enter the facility anyway — PPE rules are not strictly enforced', 'Assign the load to Derek — Cargo Vans are exempt from PPE requirements'], correctIndex: 1 },
          { id: 'eq-dm-q5', text: 'A broker offers a Cargo Van load — 3 pallets, $450, residential, inside delivery to the 2nd floor. Alex asks about inside delivery. Why does this matter?', options: ['Inside delivery is automatically included in all cargo van rates', 'Inside delivery requires a special insurance rider not available for Cargo Vans', 'Inside delivery is an extra service that requires an additional fee — it was not included in the $450 rate', 'Inside delivery changes the CDL requirements for the driver'], correctIndex: 2 },
          { id: 'eq-dm-q6', text: 'Alex tells Derek: "Do not go past the door if inside delivery is not on the rate con." Why is this instruction critical?', options: ['Without written confirmation, the carrier could be held liable for inside delivery labor without compensation', 'FMCSA prohibits inside delivery for Cargo Van drivers without a special permit', 'Drivers face CDL suspension if they perform inside delivery without documentation', 'The broker can cancel the load if the driver enters the building before unloading is complete'], correctIndex: 0 },
          { id: 'eq-dm-q7', text: 'Marcus calls from a DOT weigh station to confirm his CDL status. His truck has a GVWR of 28,000 lbs and he has CDL Class B. Is he compliant?', options: ['No — 28,000 lbs GVWR requires CDL Class A, not Class B', 'Yes — CDL Class B covers vehicles with GVWR over 26,001 lbs when not pulling a trailer over 10,001 lbs', 'No — DOT weigh stations require CDL Class A for all commercial vehicles', 'Yes — but only if the load weight is under 26,001 lbs regardless of GVWR'], correctIndex: 1 },
          { id: 'eq-dm-q8', text: 'Why is maintaining accurate, up-to-date CDL records for drivers a core dispatcher responsibility?', options: ['It is required for load board membership', 'CDL expiry or class mismatch can cause federal violations, insurance nullification, and service failures mid-load', 'Insurance companies require monthly CDL updates from dispatchers', 'It allows dispatchers to charge higher accessorial rates'], correctIndex: 1 },
          { id: 'eq-dm-q9', text: 'Priya\'s truck is a 16ft Box Truck with GVWR 22,000 lbs and no liftgate. Which of these loads is she UNABLE to accept?', options: ['6 pallets to a warehouse with a loading dock', '5 pallets of furniture to a residential address — no dock, liftgate required', '7 pallets to a commercial facility with a dock and forklift on site', '6 pallets to a distribution center with standard dock access'], correctIndex: 1 },
          { id: 'eq-dm-q10', text: 'In the demo, which single morning habit generates the most value for Alex throughout the day?', options: ['Checking load board rates before calling any broker', 'Auditing driver equipment profiles before any loads come up', 'Calling brokers on multiple loads simultaneously to find the highest rate', 'Confirming driver HOS hours before searching for loads'], correctIndex: 1 },
          { id: 'eq-dm-q11', text: 'Mini-case: A broker calls you with an urgent load — 8 pallets, Box Truck 26ft, pickup in 2 hours, $1,500. Your only available 26ft driver has CDL Class B but no liftgate. The load posting says "LG required." What do you do?', options: ['Accept — the driver will figure out liftgate alternatives on arrival', 'Decline or find a driver with liftgate — booking without required equipment causes a guaranteed service failure', 'Accept and charge the broker a "no liftgate surcharge" later', 'Accept and ask the consignee to bring their own forklift'], correctIndex: 1 },
          { id: 'eq-dm-q12', text: 'Mini-case: You have a Cargo Van load — medical supplies, 2 pallets, residential delivery, $380. Driver arrives and the consignee requests he bring the boxes to the 3rd floor (no elevator). The rate con says "curbside delivery only." What does the driver do?', options: ['Deliver to the 3rd floor — customer satisfaction is the priority', 'Call you immediately — this is beyond the scope of the rate con; you negotiate inside delivery pay before proceeding', 'Leave the freight at the curb and drive away without further discussion', 'Charge the customer a cash fee on the spot for the extra service'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-dm-q1', text: 'В демо-уроке — почему Алекс проверяет оборудование водителей ещё до открытия биржи грузов?', options: ['Это обязательное требование FMCSA', 'Чтобы знать, что умеет каждый водитель, прежде чем появится груз — и избежать несовпадений оборудования в последний момент', 'Чтобы убедиться, что водители не модифицировали грузовики ночью', 'Чтобы сообщить статус оборудования в страховую компанию перевозчика'], correctIndex: 1 },
          { id: 'eq-dm-q2', text: 'Алекс видит объявление: «26ft SB / LG / RESI». Какого водителя назначить?', options: ['Прию — её 16ft с пандусами самый быстрый', 'Дерека — Cargo Van наиболее гибкий для жилых доставок', 'Маркуса — его 26ft с лифтгейтом и CDL класса B единственное правильное совпадение', 'Любого — жилые доставки не имеют требований к оборудованию'], correctIndex: 2 },
          { id: 'eq-dm-q3', text: 'Брокер предлагает жилую liftgate-доставку за $1 650. Алекс просит $1 800. Его обоснование?', options: ['Он всегда добавляет 10% как стандартную комиссию диспетчера', 'Accessorial за лифтгейт не был включён в ставку $1 650 — он должен быть учтён', 'Он хочет проверить гибкость брокера перед принятием любого груза', 'Он считает, что расстояние длиннее, чем рассчитал брокер'], correctIndex: 1 },
          { id: 'eq-dm-q4', text: 'После назначения Прии на погрузку в нефтехимическом заводе обнаруживается требование PPE. Первое действие Алекса?', options: ['Немедленно отменить груз и обвинить брокера в отсутствии указания PPE', 'Позвонить брокеру, объяснить ситуацию и попросить расширить окно, пока Прия купит PPE', 'Сказать Прие заходить всё равно — требования PPE нестрого соблюдаются', 'Передать груз Дереку — Cargo Van освобождён от требований PPE'], correctIndex: 1 },
          { id: 'eq-dm-q5', text: 'Брокер предлагает груз для Cargo Van — 3 поддона, $450, жилой адрес, занос на 2-й этаж. Почему Алекс спрашивает про inside delivery?', options: ['Inside delivery автоматически включён во все ставки для cargo van', 'Inside delivery требует специального страхового дополнения, недоступного для Cargo Van', 'Inside delivery — дополнительная услуга с отдельным сбором, который не включён в $450', 'Inside delivery меняет требования к CDL для водителя'], correctIndex: 2 },
          { id: 'eq-dm-q6', text: 'Алекс говорит Дереку: «Не заходи внутрь, если inside delivery нет в rate con». Почему это важно?', options: ['Без письменного подтверждения перевозчик может выполнить занос без компенсации и без оснований для оплаты', 'FMCSA запрещает inside delivery для водителей Cargo Van без специального разрешения', 'Водителям грозит приостановка CDL за занос без документации', 'Брокер может отменить груз, если водитель войдёт в здание до окончания выгрузки'], correctIndex: 0 },
          { id: 'eq-dm-q7', text: 'Маркус звонит с весового пункта DOT. GVWR его грузовика 28 000 фунтов, у него CDL класса B. Соответствует ли он требованиям?', options: ['Нет — 28 000 фунтов GVWR требует CDL класса A, а не B', 'Да — CDL класс B покрывает транспортные средства с GVWR свыше 26 001 фунта без прицепа свыше 10 001 фунта', 'Нет — DOT весовые пункты требуют CDL класса A для всех коммерческих ТС', 'Да — но только если масса груза не превышает 26 001 фунта вне зависимости от GVWR'], correctIndex: 1 },
          { id: 'eq-dm-q8', text: 'Почему ведение точных актуальных записей о CDL водителей — ключевая обязанность диспетчера?', options: ['Это требуется для членства на бирже грузов', 'Истечение CDL или несоответствие категории могут вызвать федеральные нарушения, аннулирование страховки и срывы среди пути', 'Страховые компании требуют ежемесячных обновлений CDL от диспетчеров', 'Это позволяет диспетчерам устанавливать более высокие accessorial-ставки'], correctIndex: 1 },
          { id: 'eq-dm-q9', text: 'Грузовик Прии — Box Truck 16ft, GVWR 22 000 фунтов, без лифтгейта. Какой из этих грузов она НЕ может принять?', options: ['6 поддонов на склад с погрузочным доком', '5 поддонов мебели по жилому адресу — нет дока, лифтгейт обязателен', '7 поддонов в коммерческий объект с доком и погрузчиком', '6 поддонов в дистрибьюторский центр со стандартным доком'], correctIndex: 1 },
          { id: 'eq-dm-q10', text: 'Какая одна утренняя привычка приносит Алексу наибольшую ценность в течение дня?', options: ['Проверка ставок на бирже грузов до звонка любому брокеру', 'Аудит оборудования водителей до появления каких-либо грузов', 'Одновременные звонки нескольким брокерам для нахождения максимальной ставки', 'Проверка HOS водителей до поиска грузов'], correctIndex: 1 },
          { id: 'eq-dm-q11', text: 'Мини-кейс: Брокер звонит срочно — 8 поддонов, Box Truck 26ft, загрузка через 2 часа, $1 500. Единственный доступный 26ft-водитель имеет CDL класс B, но без лифтгейта. В объявлении «LG required». Ваши действия?', options: ['Принять — водитель разберётся с альтернативами на месте', 'Отказать или найти водителя с лифтгейтом — бронирование без нужного оборудования гарантированно ведёт к срыву', 'Принять и выставить брокеру "доплату за отсутствие лифтгейта" позже', 'Принять и попросить грузополучателя привезти свой погрузчик'], correctIndex: 1 },
          { id: 'eq-dm-q12', text: 'Мини-кейс: Груз для Cargo Van — медикаменты, 2 поддона, жилой адрес, $380. Водитель прибывает, грузополучатель просит занести коробки на 3-й этаж (лифта нет). В rate con написано "curbside delivery only". Действия водителя?', options: ['Занести на 3-й этаж — удовлетворённость клиента в приоритете', 'Немедленно позвонить вам — это выходит за рамки rate con; вы договариваетесь об оплате inside delivery до продолжения', 'Оставить груз у тротуара и уехать без дополнительного обсуждения', 'Взять наличные с клиента на месте за дополнительную услугу'], correctIndex: 1 },
        ],
      },
    },

    '3-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 3: Equipment Types</h2>
        <p>This practice test covers all material from Chapter 3: truck types and pallet capacities, CDL requirements and GVWR thresholds, equipment features (liftgate, pallet jack, ramps, bulkhead, PPE, load bars), accessorial charges, load board shorthand, and real dispatcher decision scenarios from the Demo lesson.</p>
        <p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-cases.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20) to pass this chapter's practice.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Truck types: Cargo Van (2–4 pallets), Box Truck 16ft (6–8 pallets), Box Truck 24ft/26ft (12–14 pallets)</li>
          <li>CDL Class B threshold: GVWR over 26,001 lbs</li>
          <li>Equipment features: LG, PJ, Ramps, Bulkhead, PPE, Load Bars</li>
          <li>Accessorial charges: liftgate, residential, inside delivery, detention</li>
          <li>Load board equipment shorthand: SB, CV, SPR, LG, PJ, RA, RESI, ID</li>
          <li>Equipment-based rate negotiation tactics</li>
          <li>Real dispatcher problem-solving: PPE failures, CDL verification, inside delivery documentation</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 3: Типы оборудования</h2>
        <p>Этот практический тест охватывает все материалы Главы 3: типы грузовиков и вместимость поддонов, требования к CDL и пороги GVWR, оснащение (лифтгейт, pallet jack, пандусы, перегородка, PPE, стяжные штанги), дополнительные сборы, сокращения биржи грузов и реальные сценарии принятия решений из урока «Демо».</p>
        <p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных и 5 мини-кейсов.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20) для прохождения практики по главе.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Типы грузовиков: Cargo Van (2–4 поддона), Box Truck 16ft (6–8 поддонов), Box Truck 24ft/26ft (12–14 поддонов)</li>
          <li>Порог CDL класса B: GVWR свыше 26 001 фунта</li>
          <li>Оснащение: LG, PJ, пандусы, Bulkhead, PPE, Load Bars</li>
          <li>Дополнительные сборы: liftgate, residential, inside delivery, detention</li>
          <li>Сокращения биржи грузов: SB, CV, SPR, LG, PJ, RA, RESI, ID</li>
          <li>Переговоры о ставке на основе оборудования</li>
          <li>Реальные задачи: сбои с PPE, проверка CDL, документирование inside delivery</li>
        </ul>
      `,
      quiz: {
        questions: [
          { id: 'eq-pr-q1', text: 'A Cargo Van / Sprinter Van can carry an average of how many standard pallets?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-pr-q2', text: 'What is the GVWR threshold that triggers a CDL Class B requirement for a straight truck driver?', options: ['Over 10,001 lbs', 'Over 18,001 lbs', 'Over 26,001 lbs', 'Over 33,001 lbs'], correctIndex: 2 },
          { id: 'eq-pr-q3', text: 'What does "LG" stand for in a load board posting?', options: ['Long Haul', 'Liftgate', 'Load Gate', 'Large Gauge'], correctIndex: 1 },
          { id: 'eq-pr-q4', text: 'A Box Truck 16ft carries how many standard pallets on average?', options: ['2–4', '6–8', '12–14', '16–18'], correctIndex: 1 },
          { id: 'eq-pr-q5', text: 'What is the primary purpose of a Pallet Jack (PJ) on a straight truck load?', options: ['Securing freight with a locking system during transit', 'Moving pallets manually when no forklift is available at the pickup or delivery location', 'Measuring pallet height to confirm trailer clearance', 'Connecting the truck body to the chassis frame'], correctIndex: 1 },
          { id: 'eq-pr-q6', text: 'Which accessorial charge is most likely to apply on a delivery to a private residence?', options: ['Hazmat handling fee', 'Residential Delivery fee', 'Overweight permit fee', 'Fuel surcharge only'], correctIndex: 1 },
          { id: 'eq-pr-q7', text: 'A load posting reads "26ft SB / LG / PJ / RESI." What does this tell you before calling the broker?', options: ['You need a 26ft box truck with liftgate and pallet jack, delivering to a residential address', 'You need a semi-truck with a 26ft box, long haul route, pallet jack for unloading', 'You need a 26ft van with a rear platform, pickup at a rail yard, ramps standard', 'You need a 26ft trailer, loading only, pallet jack provided by the shipper'], correctIndex: 0 },
          { id: 'eq-pr-q8', text: 'What is the standard accessorial fee range for a liftgate service per stop?', options: ['$10–$30', '$75–$150', '$200–$350', '$500+'], correctIndex: 1 },
          { id: 'eq-pr-q9', text: 'A Bulkhead in a straight truck serves what primary safety function?', options: ['It acts as a firewall protecting the engine compartment', 'It protects the driver from cargo shifting forward during hard braking', 'It seals the rear door from unauthorized access', 'It distributes weight evenly across the truck\'s axles'], correctIndex: 1 },
          { id: 'eq-pr-q10', text: 'When a driver is held at a facility beyond the free-time window (typically 1–2 hours), what charge applies?', options: ['Fuel surcharge at double rate', 'Detention pay — typically $50–$75 per hour beyond the free period', 'Residential surcharge for extended appointments', 'Inside delivery fee charged per extra hour'], correctIndex: 1 },
          { id: 'eq-pr-q11', text: 'Ramps are most appropriate at delivery locations that have:', options: ['A full loading dock with dock leveler', 'No dock and no liftgate, but freight can be wheeled or rolled off the truck', 'A forklift available but no dock plates', 'Standard palletized freight that requires hydraulic lift'], correctIndex: 1 },
          { id: 'eq-pr-q12', text: 'Why is confirming PPE requirements before a driver\'s pickup appointment a critical dispatcher responsibility?', options: ['PPE affects the truck\'s federal weight classification', 'Drivers turned away without PPE miss their appointment window, creating service failures and potential chargebacks', 'PPE verification is required for load board subscription compliance', 'PPE requirements only apply in California and New York'], correctIndex: 1 },
          { id: 'eq-pr-q13', text: 'A Box Truck 24ft has GVWR of 24,800 lbs. Does the driver need a CDL Class B?', options: ['Yes — all Box Trucks 24ft require CDL Class B regardless of GVWR', 'No — 24,800 lbs is under the 26,001 lb threshold; standard license is sufficient', 'Yes — any vehicle over 20,000 lbs requires CDL', 'No — CDL is only required if the truck is carrying hazardous materials'], correctIndex: 1 },
          { id: 'eq-pr-q14', text: 'Your driver has a Box Truck 26ft (GVWR 28,500 lbs) with liftgate. A broker offers a residential liftgate delivery at $1,700 — the liftgate fee is NOT included. What is your minimum counter-offer?', options: ['$1,700 — accept as posted; liftgate is standard equipment', '$1,775–$1,850 — add the liftgate accessorial ($75–$150) to the base rate', '$2,500 — residential deliveries always pay a premium above market', '$1,650 — offer a discount to build the broker relationship'], correctIndex: 1 },
          { id: 'eq-pr-q15', text: 'Load Bars (cargo bars) prevent what specific problem during freight transport?', options: ['Cargo overheating due to lack of ventilation', 'Freight shifting or sliding during transit, which can damage cargo and trigger DOT violations', 'Truck overloading beyond its GVWR', 'Liftgate hydraulic pressure loss during operation'], correctIndex: 1 },
          { id: 'eq-pr-q16', text: 'Mini-case: A broker posts a load — 8 pallets, Box Truck 16ft, warehouse delivery with dock, $950. Your 16ft driver has no CDL and no liftgate but has ramps. The posting has no LG requirement. Can you accept?', options: ['No — all Box Truck loads require liftgate by default', 'Yes — 8 pallets fits the 16ft capacity, dock delivery needs no liftgate, no CDL required under 26,001 lbs GVWR', 'No — 8 pallets exceed the 16ft Box Truck\'s 6-pallet maximum', 'Yes — but only if the driver gets a temporary CDL waiver first'], correctIndex: 1 },
          { id: 'eq-pr-q17', text: 'Mini-case: You have a Cargo Van driver available. A broker offers: 5 pallets of electronics, residential delivery, $550. What is the immediate problem?', options: ['$550 is too low for any residential delivery', 'A Cargo Van holds 2–4 pallets on average; 5 pallets exceeds its capacity — wrong equipment for this load', 'Electronics always require a refrigerated vehicle', 'Residential delivery is prohibited for Cargo Van drivers under FMCSA rules'], correctIndex: 1 },
          { id: 'eq-pr-q18', text: 'Mini-case: Your driver arrives at a pickup facility and is told: "You need steel-toed boots and a hard hat to enter." The rate con says nothing about PPE. Your driver has neither. What is the correct sequence of actions?', options: ['Driver enters the facility — PPE rules are rarely enforced', 'Driver waits in the truck; you call the broker immediately to request a time window extension, locate nearby safety supply, and get driver equipped before the appointment window closes', 'Cancel the load and find a different run — PPE issues are not worth solving', 'Driver borrows PPE from the shipper — most facilities have spare equipment for guests'], correctIndex: 1 },
          { id: 'eq-pr-q19', text: 'Mini-case: A broker offers an inside delivery load — 4 pallets, 2nd floor, no elevator, $480 flat. The load board shows "ID." How should you handle rate negotiation?', options: ['Accept $480 — ID loads always pay flat regardless of floor', 'Decline immediately — inside delivery to 2nd floor with no elevator is against carrier policy', 'Counter to $650–$700, explicitly requiring "inside delivery, 2nd floor, no elevator" written on the rate con', 'Accept $480 but tell the driver to only deliver to the first floor'], correctIndex: 2 },
          { id: 'eq-pr-q20', text: 'Mini-case: You have assigned a Box Truck 26ft driver (CDL Class B, GVWR 27,200 lbs) to a load. En route, the driver is pulled over at a DOT checkpoint and the officer asks for CDL documentation. The CDL expired 3 weeks ago. What is the immediate consequence and dispatcher lesson?', options: ['No consequence — a 3-week grace period exists for CDL renewal', 'Driver is placed out of service; load cannot continue; carrier faces federal violation. Dispatcher lesson: verify CDL expiration dates proactively — never dispatch without confirming current license status', 'Driver receives a warning only — first offense for expired CDL is non-actionable', 'Driver can continue if the carrier\'s insurance covers the gap period'], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'eq-pr-q1', text: 'Сколько стандартных поддонов в среднем вмещает Cargo Van / Sprinter Van?', options: ['2–4', '6–8', '10–12', '12–14'], correctIndex: 0 },
          { id: 'eq-pr-q2', text: 'При каком значении GVWR требуется минимум CDL класса B для водителя прямого грузовика?', options: ['Свыше 10 001 фунта', 'Свыше 18 001 фунта', 'Свыше 26 001 фунта', 'Свыше 33 001 фунта'], correctIndex: 2 },
          { id: 'eq-pr-q3', text: 'Что означает "LG" в объявлении на бирже грузов?', options: ['Long Haul (дальний рейс)', 'Liftgate (лифтгейт)', 'Load Gate (грузовые ворота)', 'Large Gauge (крупный калибр)'], correctIndex: 1 },
          { id: 'eq-pr-q4', text: 'Сколько стандартных поддонов в среднем вмещает Box Truck 16ft?', options: ['2–4', '6–8', '12–14', '16–18'], correctIndex: 1 },
          { id: 'eq-pr-q5', text: 'Каково основное назначение Pallet Jack (PJ) при работе с прямым грузовиком?', options: ['Фиксация груза замковой системой в пути', 'Ручное перемещение поддонов при отсутствии погрузчика в точке погрузки/выгрузки', 'Измерение высоты поддона для контроля просвета кузова', 'Соединение кузова с рамой шасси грузовика'], correctIndex: 1 },
          { id: 'eq-pr-q6', text: 'Какой дополнительный сбор с наибольшей вероятностью применяется при доставке по частному жилому адресу?', options: ['Сбор за обращение с опасными грузами', 'Сбор за доставку в жилую зону (Residential Delivery)', 'Сбор за разрешение на перегруз', 'Только надбавка за топливо'], correctIndex: 1 },
          { id: 'eq-pr-q7', text: 'Объявление гласит: «26ft SB / LG / PJ / RESI». Что это означает до звонка брокеру?', options: ['Нужен Box Truck 26ft с лифтгейтом и pallet jack, доставка по жилому адресу', 'Нужен полуприцеп 26ft, дальний маршрут, PJ предоставляет перевозчик', 'Нужен фургон 26ft с задней платформой, погрузка на ж/д терминале, пандусы стандартные', 'Нужен прицеп 26ft, только погрузка, PJ обеспечивает грузоотправитель'], correctIndex: 0 },
          { id: 'eq-pr-q8', text: 'Каков стандартный диапазон accessorial-сбора за лифтгейт на одну остановку?', options: ['$10–$30', '$75–$150', '$200–$350', '$500+'], correctIndex: 1 },
          { id: 'eq-pr-q9', text: 'Какую основную функцию безопасности выполняет Bulkhead в прямом грузовике?', options: ['Служит противопожарной перегородкой, защищая двигательный отсек', 'Защищает водителя от смещения груза вперёд при резком торможении', 'Защищает заднюю дверь от несанкционированного доступа', 'Равномерно распределяет вес по осям грузовика'], correctIndex: 1 },
          { id: 'eq-pr-q10', text: 'Когда водителя задерживают на объекте дольше бесплатного периода (обычно 1–2 часа), какой сбор применяется?', options: ['Двойная надбавка за топливо', 'Оплата простоя (detention) — обычно $50–$75 в час сверх бесплатного периода', 'Жилой сбор за длительные приёмы', 'Плата за inside delivery за каждый дополнительный час'], correctIndex: 1 },
          { id: 'eq-pr-q11', text: 'Пандусы наиболее уместны в точках доставки, где:', options: ['Есть полный погрузочный дoк с выравнивателем', 'Нет дока и лифтгейта, но груз можно выкатить или вывезти', 'Есть погрузчик, но нет перекладных плит', 'Поддонный груз требует гидравлического подъёма'], correctIndex: 1 },
          { id: 'eq-pr-q12', text: 'Почему уточнение требований к PPE до окна погрузки водителя — критическая ответственность диспетчера?', options: ['PPE влияет на федеральную весовую классификацию грузовика', 'Водители без PPE не допускаются на объект, пропускают окно доставки — срыв и возможный штраф', 'Верификация PPE обязательна для соответствия требованиям биржи грузов', 'Требования PPE действуют только в Калифорнии и Нью-Йорке'], correctIndex: 1 },
          { id: 'eq-pr-q13', text: 'Box Truck 24ft имеет GVWR 24 800 фунтов. Требуется ли водителю CDL класса B?', options: ['Да — все Box Truck 24ft требуют CDL класса B вне зависимости от GVWR', 'Нет — 24 800 фунтов ниже порога 26 001 фунта; достаточно обычных прав', 'Да — любое ТС свыше 20 000 фунтов требует CDL', 'Нет — CDL требуется только при перевозке опасных грузов'], correctIndex: 1 },
          { id: 'eq-pr-q14', text: 'Ваш водитель: Box Truck 26ft (GVWR 28 500 фунтов) с лифтгейтом. Брокер предлагает жилую доставку с лифтгейтом за $1 700 — liftgate fee не включён. Какое минимальное встречное предложение?', options: ['$1 700 — принять как опубликовано; лифтгейт стандартное оборудование', '$1 775–$1 850 — добавить accessorial за лифтгейт ($75–$150) к базовой ставке', '$2 500 — жилые доставки всегда платят выше рынка', '$1 650 — предложить скидку для развития отношений с брокером'], correctIndex: 1 },
          { id: 'eq-pr-q15', text: 'Стяжные штанги (Load Bars) предотвращают какую конкретную проблему при транспортировке?', options: ['Перегрев груза из-за отсутствия вентиляции', 'Смещение или скольжение груза в пути — повреждение товара и нарушения при проверке DOT', 'Перегруз грузовика сверх GVWR', 'Потерю гидравлического давления лифтгейта во время работы'], correctIndex: 1 },
          { id: 'eq-pr-q16', text: 'Мини-кейс: Брокер предлагает 8 поддонов, Box Truck 16ft, доставка на склад с доком, $950. Ваш водитель на 16ft без CDL и без лифтгейта, но с пандусами. В объявлении нет требования LG. Можно принять?', options: ['Нет — все грузы на Box Truck требуют лифтгейта по умолчанию', 'Да — 8 поддонов вмещается в 16ft, доставка на dock без лифтгейта, CDL не нужен при GVWR ниже 26 001 фунта', 'Нет — 8 поддонов превышают максимум 16ft в 6 поддонов', 'Да — но только после получения водителем временного разрешения CDL'], correctIndex: 1 },
          { id: 'eq-pr-q17', text: 'Мини-кейс: Водитель Cargo Van доступен. Брокер предлагает: 5 поддонов электроники, жилой адрес, $550. В чём немедленная проблема?', options: ['$550 слишком мало для любой жилой доставки', 'Cargo Van вмещает 2–4 поддона в среднем; 5 поддонов превышает вместимость — неверное оборудование для груза', 'Электроника всегда требует рефрижераторного транспорта', 'Жилые доставки запрещены для водителей Cargo Van по правилам FMCSA'], correctIndex: 1 },
          { id: 'eq-pr-q18', text: 'Мини-кейс: Водитель приезжает на погрузку и ему говорят: «Нужны ботинки со стальным носком и каска». В rate con ничего про PPE нет. У водителя ничего нет. Правильная последовательность действий?', options: ['Водитель входит — требования PPE редко соблюдаются строго', 'Водитель ждёт в кабине; вы немедленно звоните брокеру для продления окна, ищете ближайший магазин защиты и снаряжаете водителя до закрытия окна', 'Отменить груз — проблемы с PPE не стоят решения', 'Водитель занимает PPE у грузоотправителя — у большинства объектов есть запасное снаряжение'], correctIndex: 1 },
          { id: 'eq-pr-q19', text: 'Мини-кейс: Брокер предлагает inside delivery — 4 поддона, 2-й этаж, лифта нет, $480 фикс. В объявлении указано "ID". Как вести переговоры о ставке?', options: ['Принять $480 — ID-грузы всегда фиксированная ставка вне зависимости от этажа', 'Отказать немедленно — inside delivery на 2-й этаж без лифта против политики перевозчика', 'Встречное предложение $650–$700, явно потребовав в rate con "inside delivery, 2nd floor, no elevator"', 'Принять $480, но сказать водителю доставлять только на первый этаж'], correctIndex: 2 },
          { id: 'eq-pr-q20', text: 'Мини-кейс: Водитель Box Truck 26ft (CDL класс B, GVWR 27 200 фунтов) — в пути. Его останавливает DOT. CDL истёк 3 недели назад. Немедленные последствия и урок для диспетчера?', options: ['Никаких последствий — существует 3-недельный льготный период для продления CDL', 'Водитель снят с рейса; груз не может продолжить движение; перевозчик получает федеральное нарушение. Урок: проверяйте дату истечения CDL проактивно — никогда не отправляйте без подтверждения актуальности прав', 'Водитель получает только предупреждение — первое нарушение за просроченный CDL не влечёт санкций', 'Водитель может продолжить, если страховая перевозчика покрывает период истечения CDL'], correctIndex: 1 },
        ],
      },
    },

    '4-1': {
      type: 'text',
      body: `
        <h2>Documentation in US Trucking</h2>
        <p>In US trucking, every load comes with paperwork. Documents are not bureaucracy for its own sake — they protect the carrier, confirm the shipment, and are the basis for payment. Without properly completed documents, the dispatcher risks not getting paid, receiving fines, or losing broker trust.</p>
        <blockquote>
          <strong>The core rule:</strong> No document — no payment. Each document has a specific function and a specific moment when it must be completed.
        </blockquote>

        <h3>Why Documents Matter to the Dispatcher</h3>
        <p>The dispatcher isn't in the cab, but bears full responsibility for ensuring all documents are correctly completed at every stage of the load. Document errors turn into payment disputes, freight holds, or legal conflicts with the broker.</p>
        <p>The three core documents a dispatcher handles every day are the <strong>Rate Confirmation</strong>, the <strong>Bill of Lading</strong>, and the <strong>Proof of Delivery</strong>. Beyond these, there are supporting documents: lumper receipts, detention forms, and the carrier packet.</p>

        <h3>Key Documents: Overview</h3>
        <p><strong>Rate Confirmation (Rate Con)</strong> — the contract between broker and carrier. It specifies the rate, route, and delivery terms. Signed before the load moves. This is the legal foundation of the entire deal.</p>
        <p><strong>Bill of Lading (BOL)</strong> — the shipping receipt issued by the shipper at pickup. Confirms that the driver received the freight and describes its contents, weight, and addresses. Travels with the load through to delivery.</p>
        <p><strong>Proof of Delivery (POD)</strong> — delivery confirmation. Created when the consignee signs the BOL upon receipt. Forms the basis for invoicing the broker.</p>
        <p><strong>Lumper Receipt</strong> — a receipt for warehouse unloading services. Used to recover unloading costs through the broker.</p>
        <p><strong>Carrier Packet / MC Authority</strong> — a carrier documentation package that brokers request before working together for the first time.</p>

        <h3>Document Flow Through the Load</h3>
        <p>Understanding documentation is easier when viewed through the load timeline. Before dispatch — the dispatcher signs the <strong>Rate Con</strong> with the broker. At pickup — the driver receives the <strong>BOL</strong> from the shipper. In transit — the BOL rides in the truck cab. At delivery — the consignee signs the BOL, creating the <strong>POD</strong>. After delivery — the dispatcher sends the POD to the broker and invoices for payment.</p>

        <h3>Documents and Money</h3>
        <p>Every document is directly tied to money. The Rate Con determines how much the carrier earns. The BOL protects against disputes over what was shipped. The POD is required for payment release. The Lumper Receipt allows recovery of unloading costs.</p>
        <p>A dispatcher who understands document flow and controls every stage of it works professionally and ensures consistent revenue for the carrier.</p>

        <h3>Summary</h3>
        <p>In the following lessons we will cover each document in detail: what it must contain, what to look for, and how to handle non-standard situations. The goal is to make working with documents an automatic part of your daily practice.</p>
      <figure><img src="/wikimedia/Person_writing_in_notebook_while_using_laptop.jpg" alt="Dispatcher reviewing documents at workstation" /><figcaption>Every load starts and ends with documentation — the dispatcher's daily workflow</figcaption></figure>

      <h3>Document Timeline — Visual Flow</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Stage</th>
          <th style="padding:10px;text-align:left">Document</th>
          <th style="padding:10px;text-align:left">Who Creates</th>
          <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Key Action</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">📋 Before Dispatch</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>Rate Con</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Broker → Dispatcher signs</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Verify & sign</td></tr>
        <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0">🚚 At Pickup</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>BOL</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Shipper → Driver receives</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Photo → Dispatcher → Broker</td></tr>
        <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">📦 At Delivery</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>POD</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Consignee signs BOL</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Photo → Dispatcher → Broker</td></tr>
        <tr><td style="padding:10px">💰 After Delivery</td><td style="padding:10px"><strong>Invoice</strong></td><td style="padding:10px">Carrier/Dispatcher</td><td style="padding:10px">Checkout in CargoETL</td></tr>
      </table>

      <blockquote><strong>💡 Pro Tip:</strong> Think of documents as a chain — if any link is missing, the payment chain breaks. Rate Con → BOL → POD → Payment.</blockquote>`,
      bodyRu: `
        <h2>Документация в американских грузоперевозках</h2>
        <p>В грузоперевозках США каждый рейс сопровождается документами. Документы — это не бюрократия ради бюрократии: они защищают перевозчика, подтверждают факт перевозки и являются основанием для оплаты. Без правильно оформленных документов диспетчер рискует не получить деньги, получить штраф или потерять доверие брокера.</p>
        <blockquote>
          <strong>Главное правило:</strong> Нет документа — нет оплаты. Каждый документ имеет конкретную функцию и момент, когда он должен быть оформлен.
        </blockquote>

        <h3>Почему документы важны для диспетчера</h3>
        <p>Диспетчер не едет в кабине, но несёт полную ответственность за то, чтобы все документы были правильно оформлены на каждом этапе рейса. Ошибки в документах превращаются в споры об оплате, задержку груза или юридические конфликты с брокером.</p>
        <p>Три основных документа, с которыми работает диспетчер каждый день — это <strong>Rate Confirmation</strong>, <strong>Bill of Lading</strong> и <strong>Proof of Delivery</strong>. Помимо них, существуют дополнительные документы: lumper receipt, detention forms и carrier packet.</p>

        <h3>Основные документы: краткий обзор</h3>
        <p><strong>Rate Confirmation (Rate Con)</strong> — договор между брокером и перевозчиком. Фиксирует ставку, маршрут, условия доставки. Подписывается до начала рейса. Это юридическая основа всей сделки.</p>
        <p><strong>Bill of Lading (BOL)</strong> — накладная, выдаваемая грузоотправителем при погрузке. Подтверждает, что груз принят водителем и описывает его содержимое, вес и адреса. Следует с грузом до доставки.</p>
        <p><strong>Proof of Delivery (POD)</strong> — подтверждение доставки. Создаётся путём подписания BOL грузополучателем при сдаче груза. Является основанием для выставления счёта брокеру.</p>
        <p><strong>Lumper Receipt</strong> — квитанция за услуги разгрузки на складе. Используется для возмещения расходов через брокера.</p>
        <p><strong>Carrier Packet / MC Authority</strong> — пакет документов перевозчика, который запрашивает брокер перед первой совместной работой.</p>

        <h3>Документооборот по ходу рейса</h3>
        <p>Понять документацию проще через хронологию рейса. До отправки водителя — диспетчер подписывает <strong>Rate Con</strong> с брокером. На погрузке — водитель получает <strong>BOL</strong> от грузоотправителя. В пути — BOL хранится в кабине грузовика. На выгрузке — грузополучатель подписывает BOL, он становится <strong>POD</strong>. После доставки — диспетчер отправляет POD брокеру и выставляет счёт.</p>

        <h3>Документы и деньги</h3>
        <p>Каждый документ напрямую связан с деньгами. Rate Con определяет, сколько заработает перевозчик. BOL защищает от споров о том, что именно было перевезено. POD является основанием для выплаты. Lumper Receipt позволяет вернуть деньги за разгрузку.</p>
        <p>Диспетчер, который понимает документооборот и контролирует каждый его этап, работает профессионально и обеспечивает стабильный доход перевозчику.</p>

        <h3>Итог</h3>
        <p>В следующих уроках мы подробно разберём каждый документ: что в нём должно быть, на что обратить внимание и что делать в нестандартных ситуациях. Цель — сделать работу с документами автоматической частью вашей ежедневной практики.</p>
      <figure><img src="/wikimedia/Person_writing_in_notebook_while_using_laptop.jpg" alt="Диспетчер за рабочим местом с документами" /><figcaption>Каждый рейс начинается и заканчивается документами — ежедневный рабочий процесс диспетчера</figcaption></figure>

    <h3>Хронология документов — визуальная схема</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Этап</th>
        <th style="padding:10px;text-align:left">Документ</th>
        <th style="padding:10px;text-align:left">Кто создаёт</th>
        <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Действие</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">📋 До отправки</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>Rate Con</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Брокер → Диспетчер подписывает</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Проверить и подписать</td></tr>
      <tr><td style="padding:10px;border-bottom:1px solid #e2e8f0">🚚 На погрузке</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>BOL</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Грузоотправитель → Водитель</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Фото → Диспетчер → Брокер</td></tr>
      <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">📦 На доставке</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>POD</strong></td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Получатель подписывает BOL</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Фото → Диспетчер → Брокер</td></tr>
      <tr><td style="padding:10px">💰 После доставки</td><td style="padding:10px"><strong>Счёт</strong></td><td style="padding:10px">Перевозчик/Диспетчер</td><td style="padding:10px">Checkout в CargoETL</td></tr>
    </table>

    <blockquote><strong>💡 Совет:</strong> Документы — это цепочка: если одно звено отсутствует, цепочка оплаты рвётся. Rate Con → BOL → POD → Оплата.</blockquote>`,
      quiz: {
        questions: [
          { id: 'doc-in-q1', text: "What are the three core documents a dispatcher works with daily?", options: ["Invoice, Receipt, Contract", "Rate Confirmation, Bill of Lading, Proof of Delivery", "BOL, POD, CDL", "Rate Con, TMS Report, Insurance Certificate"], correctIndex: 1 },
          { id: 'doc-in-q2', text: "What is the Rate Confirmation (Rate Con)?", options: ["A receipt for fuel purchases", "A contract between broker and carrier specifying rate, route, and terms", "The driver's license verification", "A load board search result"], correctIndex: 1 },
          { id: 'doc-in-q3', text: "When does a BOL become a POD?", options: ["When the dispatcher uploads it to CargoETL", "When the consignee signs the BOL at delivery", "When the broker approves the rate", "When the driver starts the engine"], correctIndex: 1 },
          { id: 'doc-in-q4', text: "What happens if POD is not sent to the broker?", options: ["Nothing — POD is optional", "Payment will not be received", "The broker sends a replacement POD", "The load is automatically cancelled"], correctIndex: 1 },
          { id: 'doc-in-q5', text: "Can the Rate Con rate be shown to the driver?", options: ["Yes — drivers need to know the full rate", "No — the rate is confidential and must NEVER be disclosed to the driver", "Only if the driver asks directly", "Only for owner-operators"], correctIndex: 1 },
          { id: 'doc-in-q6', text: "What is a Lumper Receipt?", options: ["A fuel expense document", "A receipt for warehouse unloading services, used to recover costs through the broker", "A toll payment receipt", "A driver's overtime slip"], correctIndex: 1 },
          { id: 'doc-in-q7', text: "In what order do documents flow through a load?", options: ["BOL → Rate Con → POD", "POD → BOL → Rate Con", "Rate Con → BOL → POD", "BOL → POD → Rate Con"], correctIndex: 2 },
          { id: 'doc-in-q8', text: "What is HCPOD?", options: ["High Clearance Proof of Delivery", "Hard Copy POD — the POD in PDF format", "Hazmat Certified Proof of Delivery", "Highway Checkpoint POD"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'doc-in-q1', text: "Какие три основных документа использует диспетчер ежедневно?", options: ["Счёт, Квитанция, Контракт", "Rate Confirmation, Bill of Lading, Proof of Delivery", "BOL, POD, CDL", "Rate Con, TMS-отчёт, Страховой сертификат"], correctIndex: 1 },
          { id: 'doc-in-q2', text: "Что такое Rate Confirmation (Rate Con)?", options: ["Квитанция за топливо", "Договор между брокером и перевозчиком с указанием ставки, маршрута и условий", "Проверка водительских прав", "Результат поиска на бирже грузов"], correctIndex: 1 },
          { id: 'doc-in-q3', text: "Когда BOL становится POD?", options: ["Когда диспетчер загружает его в CargoETL", "Когда грузополучатель подписывает BOL при доставке", "Когда брокер утверждает ставку", "Когда водитель заводит двигатель"], correctIndex: 1 },
          { id: 'doc-in-q4', text: "Что будет, если POD не отправлен брокеру?", options: ["Ничего — POD необязателен", "Оплата не будет получена", "Брокер отправит замену POD", "Груз автоматически отменяется"], correctIndex: 1 },
          { id: 'doc-in-q5', text: "Можно ли показывать водителю ставку из Rate Con?", options: ["Да — водитель должен знать полную ставку", "Нет — ставка конфиденциальна и НИКОГДА не раскрывается водителю", "Только если водитель спросит", "Только для owner-операторов"], correctIndex: 1 },
          { id: 'doc-in-q6', text: "Что такое Lumper Receipt?", options: ["Документ на топливные расходы", "Квитанция за услуги разгрузки на складе для возмещения через брокера", "Квитанция за дорожные сборы", "Документ на сверхурочную работу водителя"], correctIndex: 1 },
          { id: 'doc-in-q7', text: "В каком порядке документы проходят через рейс?", options: ["BOL → Rate Con → POD", "POD → BOL → Rate Con", "Rate Con → BOL → POD", "BOL → POD → Rate Con"], correctIndex: 2 },
          { id: 'doc-in-q8', text: "Что такое HCPOD?", options: ["High Clearance Proof of Delivery", "Hard Copy POD — POD в формате PDF", "Hazmat Certified Proof of Delivery", "Highway Checkpoint POD"], correctIndex: 1 },
        ],
      },
    },

    '4-2': {
      type: 'text',
      body: `
        <h2>Freight Documentation: Complete Guide</h2>
        <p>A dispatcher works with several key documents every day. Each has a specific purpose, a specific moment in the load lifecycle, and specific consequences when completed incorrectly. Let's cover each document in detail.</p>

        <h2>Rate Confirmation (Rate Con)</h2>
        <p>The Rate Confirmation is a legally binding contract between the <strong>broker</strong> (or direct shipper) and the <strong>carrier</strong>. It defines the terms of the load and the agreed payment.</p>

        <h3>What Rate Con Must Contain</h3>
        <p>Every Rate Con must include: broker and carrier names and contacts, load number / reference number, pickup and delivery addresses with dates and time windows, freight description and weight, agreed rate in dollars, equipment type (53ft dry van, flatbed, etc.), special requirements (temperature, team drivers, hazmat), and payment terms (quick pay, standard net terms).</p>

        <blockquote>
          <strong>Dispatcher rule:</strong> Before signing the Rate Con, check every field. Rate, route, date, address — everything must match what was agreed verbally. A signed Rate Con with an error is your error.
        </blockquote>

        <h3>Common Rate Con Errors</h3>
        <p><strong>Wrong rate</strong> — the most common mistake. The broker "accidentally" lists the opening offer instead of the agreed amount. Always verify against the final negotiated number.</p>
        <p><strong>Wrong address</strong> — incorrect zipcode or city name. The driver goes to the wrong location. Time and money lost.</p>
        <p><strong>Wrong date</strong> — pickup or delivery listed a day early or late. Results in a missed appointment.</p>
        <p><strong>Wrong equipment type</strong> — Rate Con says 53ft but driver has 48ft or flatbed. Driver gets turned away at pickup.</p>
        <p><strong>Missing accessorial charges</strong> — if additional charges were negotiated (fuel surcharge, detention, layover), they must be explicitly listed in the Rate Con or an addendum.</p>

        <h3>Signing and Storing</h3>
        <p>Rate Cons are signed electronically (DocuSign, email confirmation) or by fax. After signing — save a copy. It is your evidence in any payment dispute.</p>

        <h2>Bill of Lading (BOL)</h2>
        <p>The Bill of Lading is an official document issued by the <strong>shipper</strong> to the driver at pickup. It serves three functions: it is a contract of carriage, a freight inventory, and a receipt acknowledging the driver accepted the freight.</p>

        <h3>What the BOL Contains</h3>
        <p>A standard BOL includes: shipper name and address, consignee name and address, commodity description, quantity (pieces/pallets/skids), weight in lbs, freight class, special handling instructions, PRO/BOL number, and signatures of both driver and shipper at pickup.</p>

        <h3>What to Verify When Receiving the BOL</h3>
        <p>The driver must verify: addresses match those on the Rate Con, actual freight weight, piece count, and that freight description matches expectations. If discrepancies are found, the driver must immediately inform the dispatcher, and the dispatcher contacts the broker before the driver signs the document.</p>

        <blockquote>
          <strong>Important:</strong> The driver's signature on the BOL means they accepted the freight in the stated quantity and condition. If weight is incorrect or freight is damaged at loading — this must be noted on the BOL before signing (notation: "subject to count" or "damaged at pickup").
        </blockquote>

        <h3>Straight BOL vs Order BOL</h3>
        <p><strong>Straight BOL</strong> — freight is delivered to the specific consignee named in the document. Non-transferable. Used in the majority of trucking loads.</p>
        <p><strong>Order BOL (Negotiable BOL)</strong> — can be transferred to a third party. Less common; appears in international and complex logistics chains.</p>

        <h2>Proof of Delivery (POD)</h2>
        <p>Proof of Delivery is confirmation that freight was delivered to the recipient. Technically, the POD is the BOL signed by the consignee at unloading. In some cases it is a separate form or digital signature.</p>

        <h3>Why POD is Critical</h3>
        <p>Most brokers will not release payment without a POD. This isn't a preference — the broker must confirm delivery to the shipper before they themselves get paid. Without the POD, the payment chain breaks.</p>
        <p>The dispatcher is responsible for ensuring the driver obtains a signed POD immediately after unloading and sends it to the dispatcher. The dispatcher forwards the POD to the broker without delay.</p>

        <h3>What POD Must Contain</h3>
        <p>A valid POD includes: signature of an authorized consignee representative, delivery date and time, consignee stamp (if required), and notes on freight damage at delivery (if any).</p>

        <blockquote>
          <strong>Dispatcher rule:</strong> As soon as the driver reports delivery — request the POD immediately. Don't leave it for later. The faster the POD reaches the broker, the faster payment arrives.
        </blockquote>

        <h3>Damage at Delivery</h3>
        <p>If the consignee discovers damage — it must be noted on the POD before signing. A "damaged" notation with description proves the damage did not occur due to carrier fault (assuming freight was accepted in good condition per the BOL at pickup).</p>

        <h2>Lumper Receipt</h2>
        <p>A lumper is a warehouse-hired worker who unloads freight from the trailer. Some warehouses unload with their own staff at no charge; others require a lumper fee (typically $75–$200 per load).</p>

        <h3>How Lumper Fee Works</h3>
        <p>The driver arrives for unloading. The warehouse announces a lumper fee. The driver or carrier pays cash or check. In return, the lumper provides a signed receipt (lumper receipt).</p>
        <p>The dispatcher submits the lumper receipt to the broker alongside the POD. The broker reimburses the lumper fee to the carrier — if covered under the deal terms. This is why a detailed receipt is essential: date, address, amount, signature.</p>

        <h2>Carrier Packet (MC Authority)</h2>
        <p>Before working together for the first time, the broker requests a carrier documentation package. This typically includes: MC number and DOT number copy, Certificate of Insurance, W-9 form for tax purposes, NOA (Notice of Assignment) if using a factoring company.</p>
        <p>The dispatcher is responsible for keeping all carrier packet documents current and ready to send at a new broker's first request. An expired insurance certificate or missing W-9 stops work with a new broker.</p>

        <h2>Detention Documentation</h2>
        <p>If the driver waits at pickup or delivery beyond 2 hours past the appointment time, the carrier is entitled to detention pay (typically $50–$75/hour). To collect detention: record exact arrival time and start/end of waiting, notify the broker in real time about the delay, and obtain broker confirmation agreeing to pay detention.</p>
        <p>Without documented proof, the broker can refuse detention payment. The dispatcher must keep accurate records and notify the broker promptly.</p>

        <h2>Chapter 4 Final Test</h2>
        <p>This test covers all chapter topics: Rate Confirmation, Bill of Lading, Proof of Delivery, Lumper Receipt, Carrier Packet, and Detention. <strong>Goal: 80% or higher.</strong></p>
      <figure><img src="/trucks/semi-truck.jpg" alt="Inside a truck cab — driver workspace" /><figcaption>The truck cab where drivers handle BOL and communicate with dispatch</figcaption></figure>

      <h3>VIN Rules — Quick Reference</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Truck Type</th>
          <th style="padding:10px;text-align:left">Which VIN to Use</th>
          <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Why</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">Cargo Van / Sprinter</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>Highway VIN</strong> (registered)</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Contracted owner-operator model</td></tr>
        <tr><td style="padding:10px">Box Truck</td><td style="padding:10px"><strong>Real VIN</strong></td><td style="padding:10px">Company-owned vehicle</td></tr>
      </table>
      <blockquote><strong>⚠️ Critical:</strong> If a broker says the VIN doesn't match their records, respond: "It's a contracted owner-operator under our MC, 100% exclusive use for our carrier."</blockquote>

      <h3>Rate Con Checklist — Before You Sign</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#dc2626;color:white">
          <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">🔍 VERIFY BEFORE SIGNING</th>
        </tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Company name spelled correctly</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">ZIP codes match the load offer</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Miles match (±10 miles is OK)</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Pickup and delivery times are realistic</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Cargo dimensions and weight match</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Rate is correct</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-radius:0 0 8px 8px">✅</td><td style="padding:8px;border-radius:0 0 8px 8px"><strong>CALLED THE DRIVER to confirm</strong></td></tr>
      </table>`,
      bodyRu: `
        <h2>Документы грузоперевозок: полное руководство</h2>
        <p>Диспетчер работает с несколькими ключевыми документами ежедневно. Каждый из них имеет конкретное назначение, момент появления в рейсе и последствия при неправильном оформлении. Разберём каждый документ детально.</p>

        <h2>Rate Confirmation (Rate Con)</h2>
        <p>Rate Confirmation — это юридически обязывающий договор между <strong>брокером</strong> (или грузоотправителем-напрямую) и <strong>перевозчиком</strong>. Именно он определяет, на каких условиях выполняется рейс и сколько будет заплачено.</p>

        <h3>Что должно быть в Rate Con</h3>
        <p>Каждый Rate Con должен содержать: имена и контактные данные брокера и перевозчика, номер груза (load number / reference number), адреса погрузки и выгрузки с датами и временными окнами, описание груза и вес, согласованную ставку в долларах, тип оборудования (53ft dry van, flatbed и т.д.), специальные требования (температурный режим, team drivers, hazmat), а также условия оплаты (quick pay, standard net terms).</p>

        <blockquote>
          <strong>Правило диспетчера:</strong> Перед подписанием Rate Con проверьте каждое поле. Ставка, маршрут, дата, адрес — всё должно совпадать с тем, о чём вы договорились устно. Подписанный Rate Con с ошибкой — это ваша ошибка.
        </blockquote>

        <h3>Типичные ошибки в Rate Con</h3>
        <p><strong>Неверная ставка</strong> — самая распространённая ошибка. Брокер «случайно» указывает первоначальное предложение вместо согласованной суммы. Всегда сверяйте с конечной договорённостью.</p>
        <p><strong>Неверный адрес</strong> — неправильный zipcode или название города. Водитель едет не туда. Это теряет время и деньги.</p>
        <p><strong>Неверная дата</strong> — pickup или delivery указан на день раньше или позже. Влечёт нарушение appointment.</p>
        <p><strong>Неверный тип оборудования</strong> — в rate con указан 53ft, а у водителя 48ft или flatbed. Водителя развернут на погрузке.</p>
        <p><strong>Отсутствие accessorial charges</strong> — если согласованы дополнительные надбавки (fuel surcharge, detention, layover), они должны быть явно прописаны в rate con или в приложении к нему.</p>

        <h3>Подписание и хранение</h3>
        <p>Rate Con подписывается электронно (DocuSign, email confirmation) или по факсу. После подписания — сохраните копию. Это ваше доказательство при любом споре об оплате.</p>

        <h2>Bill of Lading (BOL)</h2>
        <p>Bill of Lading — это официальный документ, выдаваемый <strong>грузоотправителем</strong> водителю при погрузке. Он выполняет три функции: является договором перевозки, описью груза и распиской о приёме груза водителем.</p>

        <h3>Что содержит BOL</h3>
        <p>Стандартный BOL включает: наименование и адрес грузоотправителя (shipper), наименование и адрес грузополучателя (consignee), описание товара (commodity), количество единиц (pieces/pallets/skids), вес (weight in lbs), класс груза (freight class), специальные инструкции по обращению, номер PRO/BOL, а также подписи водителя и грузоотправителя при погрузке.</p>

        <h3>Что проверить при получении BOL</h3>
        <p>Водитель обязан проверить: соответствие адресов тем, что указаны в Rate Con; фактический вес груза; количество единиц; соответствие описания груза ожидаемому. При обнаружении расхождений водитель должен немедленно сообщить диспетчеру, а диспетчер — связаться с брокером до того, как водитель подпишет документ.</p>

        <blockquote>
          <strong>Важно:</strong> Подпись водителя на BOL означает, что он принял груз в указанном количестве и состоянии. Если вес неверный или товар повреждён при погрузке — это нужно зафиксировать в BOL до подписания (пометка "subject to count" или "damaged at pickup").
        </blockquote>

        <h3>Straight BOL vs Order BOL</h3>
        <p><strong>Straight BOL</strong> — груз доставляется конкретному получателю, указанному в документе. Не переуступаем. Используется в большинстве грузоперевозок.</p>
        <p><strong>Order BOL (Negotiable BOL)</strong> — может быть передан третьей стороне. Менее распространён, встречается при международных перевозках и сложных логистических схемах.</p>

        <h2>Proof of Delivery (POD)</h2>
        <p>Proof of Delivery — это подтверждение того, что груз был доставлен получателю. Технически POD — это BOL, подписанный грузополучателем при выгрузке. В некоторых случаях это отдельная форма или цифровая подпись.</p>

        <h3>Почему POD критически важен</h3>
        <p>Большинство брокеров не выпустят платёж без POD. Это не прихоть — брокер должен подтвердить грузоотправителю, что груз был доставлен, прежде чем сам получит оплату. Без POD цепочка оплаты разрывается.</p>
        <p>Диспетчер несёт ответственность за то, чтобы водитель получил подписанный POD сразу после выгрузки и отправил его диспетчеру. Диспетчер незамедлительно пересылает POD брокеру.</p>

        <h3>Что должно быть в POD</h3>
        <p>Полноценный POD содержит: подпись уполномоченного представителя грузополучателя, дату и время доставки, печать грузополучателя (если требуется), пометки о повреждениях груза при доставке (если есть).</p>

        <blockquote>
          <strong>Правило диспетчера:</strong> Как только водитель сообщил о доставке — немедленно запросите POD. Не ждите «на потом». Чем быстрее POD отправлен брокеру, тем быстрее приходит оплата.
        </blockquote>

        <h3>Повреждения при доставке</h3>
        <p>Если грузополучатель обнаружил повреждения — это должно быть зафиксировано на POD до подписания. Пометка "damaged" с описанием является доказательством того, что повреждение произошло не по вине перевозчика (если груз был принят в нормальном состоянии согласно BOL при погрузке).</p>

        <h2>Lumper Receipt</h2>
        <p>Lumper — это нанятый складом работник, который выгружает груз из трейлера. В некоторых складах выгрузку выполняет собственный персонал бесплатно, в других — требуют оплату lumper fee (обычно $75–$200 за рейс).</p>

        <h3>Как работает lumper fee</h3>
        <p>Водитель приезжает на выгрузку. Склад сообщает о lumper fee. Водитель или перевозчик оплачивает наличными или чеком. Взамен lumper выдаёт подписанную квитанцию (lumper receipt).</p>
        <p>Диспетчер отправляет lumper receipt брокеру вместе с POD. Брокер возмещает lumper fee перевозчику — если это предусмотрено условиями сделки. Именно поэтому важно получить детальную квитанцию: дата, адрес, сумма, подпись.</p>

        <h2>Carrier Packet (MC Authority)</h2>
        <p>Перед первой совместной работой брокер запрашивает от перевозчика пакет документов. Обычно он включает: копию MC-номера и DOT-номера, страховой сертификат (Certificate of Insurance), W-9 форму для налоговых целей, NOA (Notice of Assignment) если используется факторинговая компания.</p>
        <p>Диспетчер отвечает за то, чтобы все документы carrier packet были актуальными и готовы к отправке при первом запросе нового брокера. Устаревшая страховка или отсутствующий W-9 останавливают работу с новым брокером.</p>

        <h2>Detention Documentation</h2>
        <p>Если водитель ждёт на погрузке или выгрузке более 2 часов сверх appointment времени — перевозчик имеет право на detention pay (обычно $50–$75/час). Для получения detention необходимо: зафиксировать точное время прибытия и начала/окончания ожидания, уведомить брокера о задержке в реальном времени, получить подтверждение от брокера о согласии выплатить detention.</p>
        <p>Без документального подтверждения брокер может отказать в оплате detention. Диспетчер должен вести точные записи и своевременно информировать брокера.</p>

        <h2>Итоговый тест по всей 4-й главе</h2>
        <p>Тест охватывает все темы главы: Rate Confirmation, Bill of Lading, Proof of Delivery, Lumper Receipt, Carrier Packet и Detention. <strong>Цель: 80% и выше.</strong></p>
      <figure><img src="/trucks/semi-truck.jpg" alt="Кабина грузовика — рабочее пространство водителя" /><figcaption>Кабина грузовика, где водитель работает с BOL и связывается с диспетчером</figcaption></figure>

    <h3>Правила VIN — краткая справка</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Тип грузовика</th>
        <th style="padding:10px;text-align:left">Какой VIN использовать</th>
        <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Почему</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:10px;border-bottom:1px solid #e2e8f0">Cargo Van / Sprinter</td><td style="padding:10px;border-bottom:1px solid #e2e8f0"><strong>Highway VIN</strong> (зарегистрированный)</td><td style="padding:10px;border-bottom:1px solid #e2e8f0">Модель субконтракта</td></tr>
      <tr><td style="padding:10px">Box Truck</td><td style="padding:10px"><strong>Реальный VIN</strong></td><td style="padding:10px">Машина компании</td></tr>
    </table>
    <blockquote><strong>⚠️ Критически важно:</strong> Если брокер говорит, что VIN не совпадает: «Это субконтрактный owner-operator под нашим MC, 100% эксклюзивное использование.»</blockquote>

    <h3>Чеклист Rate Con — до подписания</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#dc2626;color:white">
        <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">🔍 ПРОВЕРИТЬ ДО ПОДПИСАНИЯ</th>
      </tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Название компании без ошибок</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">ZIP-коды совпадают с офером</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Мили совпадают (±10 миль ОК)</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Время погрузки и доставки реалистичны</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Габариты и вес совпадают</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #fecaca">✅</td><td style="padding:8px;border-bottom:1px solid #fecaca">Ставка верна</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-radius:0 0 8px 8px">✅</td><td style="padding:8px;border-radius:0 0 8px 8px"><strong>ПОЗВОНИЛИ водителю для подтверждения</strong></td></tr>
    </table>`,
      quiz: {
        questions: [
          { id: 'doc-th-eq1', text: "What is a Rate Confirmation and when is it signed?", options: ["A delivery confirmation signed after unloading", "A legally binding contract between broker and carrier specifying rate and terms — signed before the driver moves", "A shipper-issued receipt at pickup", "A government permit for interstate transport"], correctIndex: 1 },
          { id: 'doc-th-eq2', text: "What must a valid Rate Con contain?", options: ["Only the rate and route — everything else is optional", "Party names, addresses, dates, rate, equipment type, and special requirements", "Only load number and pickup date", "Driver's personal info and CDL number"], correctIndex: 1 },
          { id: 'doc-th-eq3', text: "What is the function of the Bill of Lading (BOL)?", options: ["The payment contract between broker and carrier", "A contract of carriage, freight inventory, and receipt of acceptance — issued by the shipper at pickup", "Delivery confirmation from the consignee", "A receipt for lumper unloading services"], correctIndex: 1 },
          { id: 'doc-th-eq4', text: "What does the driver's signature on the BOL at pickup mean?", options: ["Driver confirms their CDL qualification", "Driver accepted the freight in the stated quantity and condition — and is responsible for it", "Driver agrees to the route listed on the BOL", "Driver acknowledges the warehouse detention policy"], correctIndex: 1 },
          { id: 'doc-th-eq5', text: "How is a Proof of Delivery (POD) technically created?", options: ["Dispatcher fills out a POD form in the TMS after driver confirms delivery", "Driver photographs the freight outside the warehouse", "The BOL is signed by an authorized consignee representative at unloading", "Broker auto-generates a POD when shipper payment is received"], correctIndex: 2 },
          { id: 'doc-th-eq6', text: "Why do brokers require a POD before paying the carrier?", options: ["It's just a formality — most brokers pay without POD", "The broker must confirm delivery to the shipper before getting paid themselves — POD unlocks the payment chain", "POD is only needed for accessorial charge reimbursement", "Brokers use POD to calculate dispatcher bonuses"], correctIndex: 1 },
          { id: 'doc-th-eq7', text: "What is a lumper and when is a lumper receipt needed?", options: ["A lumper is the carrier's insurance agent; receipt needed for claims", "A lumper is a warehouse-hired unloader; the receipt is needed to recover unloading costs through the broker", "A lumper is a broker's load-finding agent; receipt confirms commission", "A lumper is a relief driver; receipt issued when freight is transferred between drivers"], correctIndex: 1 },
          { id: 'doc-th-eq8', text: "What does a standard Carrier Packet requested by a broker include?", options: ["Dispatcher's passport and driver's license", "MC number, DOT number, Certificate of Insurance, and W-9 form", "Only the carrier's insurance policy", "Carrier's bank details and payment history"], correctIndex: 1 },
          { id: 'doc-th-eq9', text: "When is the carrier entitled to detention pay?", options: ["If the driver waited more than 30 minutes at any facility", "If the driver waited more than 2 hours past appointment time at pickup or delivery", "Only if the delay was pre-documented by the broker", "If traffic increased total trip time by more than one hour"], correctIndex: 1 },
          { id: 'doc-th-eq10', text: "The driver finds freight is damaged at pickup. How should the BOL be handled?", options: ["Don't note it — it will cause problems with the broker", "Note the damage on the BOL before signing with a \"damaged at pickup\" notation and description", "Refuse the load entirely without explanation", "Sign the BOL as-is and report damage only at delivery"], correctIndex: 1 },
          { id: 'doc-th-eq11', text: "Mini-case: Rate Con arrives with correct route and rate, but \"Equipment\" says Flatbed — your driver has a Dry Van. Departure in 2 hours. What do you do?", options: ["Sign it — broker won't check equipment type at pickup", "Contact the broker immediately to correct the equipment type before signing — dispatching with wrong equipment will get the driver turned away", "Send the driver and explain the mismatch at the pickup facility", "Sign and add a handwritten note \"Dry Van, not Flatbed\""], correctIndex: 1 },
          { id: 'doc-th-eq12', text: "Mini-case: Driver delivered. Consignee signed POD but noted \"1 pallet damaged — forklift damage at delivery.\" What does this mean for the carrier?", options: ["Carrier bears full responsibility for the damage — no exceptions", "Damage is documented as occurring at delivery — if the BOL at pickup had no damage notations, consignee liability needs investigation. The notation protects the carrier.", "A POD with a damage notation is not valid for payment", "Carrier must deduct the damaged pallet cost from their rate"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'doc-th-q1', text: "Что такое Rate Confirmation и когда он подписывается?", options: ["Документ, подтверждающий доставку груза, подписывается после выгрузки", "Юридически обязывающий договор между брокером и перевозчиком, фиксирующий ставку и условия — подписывается до отправки водителя", "Накладная, выдаваемая грузоотправителем при погрузке", "Государственное разрешение на межштатную перевозку"], correctIndex: 1 },
          { id: 'doc-th-q2', text: "Что обязательно должен содержать корректный Rate Con?", options: ["Только ставку и маршрут — остальное опционально", "Имена сторон, адреса, даты, ставку, тип оборудования и специальные требования", "Только номер груза и дату погрузки", "Личные данные водителя и номер его CDL"], correctIndex: 1 },
          { id: 'doc-th-q3', text: "Какова функция Bill of Lading (BOL)?", options: ["Договор оплаты между брокером и перевозчиком", "Договор перевозки, опись груза и расписка о его приёме — выдаётся грузоотправителем при погрузке", "Подтверждение доставки от грузополучателя", "Квитанция за услуги разгрузчиков на складе"], correctIndex: 1 },
          { id: 'doc-th-q4', text: "Что означает подпись водителя на BOL при погрузке?", options: ["Водитель подтверждает свою квалификацию и наличие CDL", "Водитель принял груз в указанном количестве и состоянии — и несёт за него ответственность", "Водитель согласен с маршрутом, указанным в BOL", "Водитель уведомлён о detention policy склада"], correctIndex: 1 },
          { id: 'doc-th-q5', text: "Как технически создаётся Proof of Delivery (POD)?", options: ["Диспетчер заполняет форму POD в TMS после подтверждения доставки от водителя", "Водитель фотографирует груз у склада на телефон", "BOL подписывается уполномоченным представителем грузополучателя при выгрузке", "Брокер автоматически создаёт POD в своей системе при получении оплаты от грузоотправителя"], correctIndex: 2 },
          { id: 'doc-th-q6', text: "Почему брокеры требуют POD перед выплатой перевозчику?", options: ["Это только формальность — большинство брокеров платят без POD", "Брокер должен подтвердить доставку грузоотправителю перед тем, как сам получит оплату — POD разблокирует цепочку платежей", "POD нужен только для возмещения accessorial charges", "Брокер использует POD для расчёта бонуса диспетчеру"], correctIndex: 1 },
          { id: 'doc-th-q7', text: "Что такое lumper и когда нужен lumper receipt?", options: ["Lumper — это страховой агент перевозчика; receipt нужен при подаче страховой претензии", "Lumper — нанятый складом работник по разгрузке; receipt — квитанция за эту услугу, необходимая для возмещения расходов через брокера", "Lumper — брокерский агент по поиску грузов; receipt подтверждает комиссию", "Lumper — водитель на подмену; receipt оформляется при передаче груза между водителями"], correctIndex: 1 },
          { id: 'doc-th-q8', text: "Что входит в стандартный Carrier Packet, который запрашивает брокер?", options: ["Паспорт и водительское удостоверение диспетчера", "MC-номер, DOT-номер, страховой сертификат и W-9 форма", "Только страховой полис перевозчика", "Банковские реквизиты перевозчика и история платежей"], correctIndex: 1 },
          { id: 'doc-th-q9', text: "Когда перевозчик имеет право на detention pay?", options: ["Если водитель прождал более 30 минут на любом объекте", "Если водитель ждал свыше 2 часов сверх appointment времени на погрузке или выгрузке", "Только если задержка задокументирована брокером заранее", "Если пробки на маршруте увеличили время рейса более чем на час"], correctIndex: 1 },
          { id: 'doc-th-q10', text: "Водитель обнаружил, что груз повреждён при погрузке. Как должно быть оформлено в BOL?", options: ["Не отмечать — это создаст проблемы с брокером", "Зафиксировать повреждение на BOL до подписания с пометкой \"damaged at pickup\" и описанием", "Отказаться от груза полностью без объяснений", "Подписать BOL как есть и сообщить о повреждении только при доставке"], correctIndex: 1 },
          { id: 'doc-th-q11', text: "Мини-кейс: Rate Con прислан с правильным маршрутом и ставкой, но в поле \"Equipment\" указан Flatbed, а у вашего водителя Dry Van. Время отправки через 2 часа. Что делать?", options: ["Подписать — брокер не проверит тип оборудования при погрузке", "Немедленно связаться с брокером для исправления типа оборудования до подписания — отправка с неверным equipment-type приведёт к отказу на погрузке", "Отправить водителя и объяснить несоответствие на месте погрузки", "Подписать и добавить примечание \"Dry Van, not Flatbed\" от руки"], correctIndex: 1 },
          { id: 'doc-th-q12', text: "Мини-кейс: Водитель доставил груз. Грузополучатель подписал POD, но поставил отметку \"1 pallet damaged — forklift damage at delivery\". Что это означает для перевозчика?", options: ["Перевозчик несёт полную ответственность за повреждение — без исключений", "Повреждение зафиксировано как произошедшее при доставке — если BOL при погрузке не содержал замечаний, ответственность грузополучателя нуждается в расследовании. Отметка защищает перевозчика.", "POD с пометкой о повреждении не является действительным для оплаты", "Перевозчик должен оплатить стоимость повреждённого поддона из своей ставки"], correctIndex: 1 },
        ],
      },
    },

    '4-3': {
      type: 'text',
      simulation: true,
      body: `
        <h2>Demo: Full Document Cycle on a Real Load</h2>
        <p>Let's see how documents work on a real load — from the broker call to payment receipt. Dispatcher Alex is working with driver Tom on the Dallas, TX → Atlanta, GA run.</p>

        <h3>Stage 1: Booking the Load — Rate Con</h3>
        <p><strong>Monday, 9:15 AM.</strong> Alex finds a load on Load board: Dallas → Atlanta, 820 miles, 53ft dry van, $2,400. Calls the broker, negotiates to $2,650. Broker agrees.</p>
        <p>Twenty minutes later the Rate Con arrives. Alex opens the document and checks every field:</p>
        <blockquote>
          ✅ Rate: $2,650 — correct<br/>
          ✅ Route: Dallas, TX → Atlanta, GA — correct<br/>
          ✅ Pickup: Tuesday 08:00, 1400 Industrial Blvd, Dallas TX 75207<br/>
          ✅ Delivery: Wednesday by 14:00, 800 Logistics Way, Atlanta GA 30303<br/>
          ✅ Equipment: 53ft Dry Van — Tom has exactly that<br/>
          ✅ Commodity: General freight, 22 pallets, 28,000 lbs
        </blockquote>
        <p>Everything checks out. Alex signs the Rate Con and sends Tom the load details.</p>

        <h3>Stage 2: Pickup — Bill of Lading</h3>
        <p><strong>Tuesday, 7:50 AM.</strong> Tom arrives at the Dallas warehouse 10 minutes early. The dock worker greets him and begins loading. By 8:45 AM, loading is complete — 22 pallets of packaged consumer goods.</p>
        <p>The warehouse documentation office hands Tom the BOL. Tom carefully reviews it before signing:</p>
        <blockquote>
          ✅ Shipper: ABC Distribution, Dallas TX 75207<br/>
          ✅ Consignee: XYZ Retail Warehouse, Atlanta GA 30303<br/>
          ✅ Commodity: Consumer goods, 22 pallets<br/>
          ⚠️ Weight: 29,400 lbs — Rate Con showed 28,000 lbs
        </blockquote>
        <p>Tom spots the weight discrepancy and calls Alex. Alex immediately calls the broker back: "The BOL shows 29,400 lbs — we had 28,000 on the Rate Con. Need an updated rate con." The broker verifies with the shipper, confirms actual weight is 29,400, and updates the Rate Con. Fifteen minutes later Tom gets confirmation from Alex, signs the BOL, and moves.</p>

        <h3>Stage 3: In Transit — Check Calls</h3>
        <p><strong>Tuesday, 2:00 PM.</strong> Alex makes a scheduled check call. Tom: "All good, passed Shreveport, on schedule. ETA Atlanta tomorrow around 10:00 AM."</p>
        <p><strong>Tuesday, 10:00 PM.</strong> Tom is resting in Biloxi, MS. Alex updates the broker: "Driver on reset, ETA Atlanta tomorrow 10:00 AM."</p>

        <h3>Stage 4: Delivery — POD</h3>
        <p><strong>Wednesday, 9:55 AM.</strong> Tom arrives at the Atlanta warehouse. By 10:30 AM unloading is complete. The XYZ Retail warehouse manager inspects the freight — all good, 22 pallets, no damage.</p>
        <p>The manager signs the BOL. That signed BOL is now the <strong>Proof of Delivery</strong>. Tom photographs it and sends it to Alex.</p>
        <p>Alex receives the POD at 10:47 AM and immediately forwards it to the broker: "Load delivered. POD attached. Please confirm receipt and process payment."</p>

        <h3>Stage 5: Getting Paid</h3>
        <p><strong>Wednesday, 2:30 PM.</strong> The broker confirms receipt of the POD and invoices the shipper. The carrier will receive payment within 30–45 days (or faster via quick pay).</p>
        <p>Alex closes the load in the system and adds this broker's contact to the reliable partners list. The full document cycle — from Rate Con to POD — completed without errors.</p>

        <h3>What Would Have Happened Without the Weight Check?</h3>
        <p>If Tom had signed the BOL at 29,400 lbs without notifying anyone, a DOT weigh station could have flagged an overweight situation. Additionally, in any dispute over freight damage or shortage — an incorrect weight on the BOL would put the carrier in a vulnerable position. The right action: always verify and clarify before signing.</p>

        <h3>Key Lessons From This Load</h3>
        <p>The Rate Con is fully reviewed before signing — especially rate and equipment type. The BOL is verified at the warehouse before signing — especially weight and addresses. The POD is requested immediately after delivery. Every document is saved and forwarded without delay. Document management is the dispatcher's professionalism in action.</p>

        <h3>Simulation: Document Quiz</h3>
        <p>Below is an interactive simulation with questions based on real freight documentation scenarios. Answer carefully — these questions are based on situations that occur in real dispatcher work.</p>
      `,
      bodyRu: `
        <h2>Демо: Полный цикл документооборота на реальном рейсе</h2>
        <p>Посмотрим, как документы используются в реальном рейсе — от звонка брокера до получения оплаты. Диспетчер Алекс работает с водителем Томом на маршруте Даллас, TX → Атланта, GA.</p>

        <h3>Этап 1: Бронирование груза — Rate Con</h3>
        <p><strong>Понедельник, 9:15 утра.</strong> Алекс находит груз на Load board: Даллас → Атланта, 820 миль, сухой фургон 53ft, $2 400. Звонит брокеру, ведёт переговоры до $2 650. Брокер соглашается.</p>
        <p>Через 20 минут приходит Rate Con. Алекс открывает документ и проверяет каждое поле:</p>
        <blockquote>
          ✅ Ставка: $2 650 — верно<br/>
          ✅ Маршрут: Dallas, TX → Atlanta, GA — верно<br/>
          ✅ Погрузка: вторник 08:00, 1400 Industrial Blvd, Dallas TX 75207<br/>
          ✅ Доставка: среда до 14:00, 800 Logistics Way, Atlanta GA 30303<br/>
          ✅ Оборудование: 53ft Dry Van — у Тома именно такой<br/>
          ✅ Commodity: General freight, 22 pallets, 28 000 lbs
        </blockquote>
        <p>Все данные верны. Алекс подписывает Rate Con и отправляет Тому детали рейса.</p>

        <h3>Этап 2: Погрузка — Bill of Lading</h3>
        <p><strong>Вторник, 07:50 утра.</strong> Том прибывает на склад в Далласе на 10 минут раньше. Докер встречает его и начинает погрузку. В 08:45 погрузка завершена — 22 поддона упакованных потребительских товаров.</p>
        <p>Документальная служба склада выдаёт Тому BOL. Том внимательно проверяет его перед подписанием:</p>
        <blockquote>
          ✅ Shipper: ABC Distribution, Dallas TX 75207<br/>
          ✅ Consignee: XYZ Retail Warehouse, Atlanta GA 30303<br/>
          ✅ Commodity: Consumer goods, 22 pallets<br/>
          ⚠️ Weight: 29 400 lbs — в rate con было 28 000 lbs
        </blockquote>
        <p>Том замечает расхождение по весу и звонит Алексу. Алекс немедленно перезванивает брокеру: «Вес в BOL — 29 400 фунтов, у нас в rate con было 28 000. Нужно обновить rate con». Брокер уточняет у грузоотправителя — подтверждает фактический вес 29 400, обновляет rate con. Через 15 минут Том получает подтверждение от Алекса, подписывает BOL и трогается.</p>

        <h3>Этап 3: В пути — check calls</h3>
        <p><strong>Вторник, 14:00.» </strong> Алекс делает плановый check call. Том: «Всё хорошо, проехал Shreveport, иду по графику. ETA на Atlanta — завтра в 10:00 утра.»</p>
        <p><strong>Вторник, 22:00.</strong> Том отдыхает в Биксби, MS. Алекс уведомляет брокера: «Водитель на отдыхе, ETA Atlanta — завтра 10:00.»</p>

        <h3>Этап 4: Доставка — POD</h3>
        <p><strong>Среда, 09:55 утра.</strong> Том прибывает на склад в Атланте. В 10:30 разгрузка завершена. Менеджер склада XYZ Retail осматривает груз — всё в порядке, 22 поддона без повреждений.</p>
        <p>Менеджер подписывает BOL. Теперь этот подписанный BOL — <strong>Proof of Delivery</strong>. Том фотографирует его и отправляет Алексу.</p>
        <p>Алекс получает POD в 10:47 и немедленно пересылает его брокеру с письмом: «Load delivered. POD attached. Please confirm receipt and process payment.»</p>

        <h3>Этап 5: Получение оплаты</h3>
        <p><strong>Среда, 14:30.</strong> Брокер подтверждает получение POD и выставляет счёт грузоотправителю. Перевозчик получит оплату в течение 30–45 дней (или быстрее через quick pay).</p>
        <p>Алекс закрывает рейс в системе и добавляет контакт этого брокера в список надёжных партнёров. Полный документооборот — от Rate Con до POD — выполнен без ошибок.</p>

        <h3>Что было бы, если бы Том не проверил вес?</h3>
        <p>Если бы Том подписал BOL с весом 29 400 фунтов без уведомления, при проверке на весовой станции DOT мог бы возникнуть вопрос о перегрузке. Кроме того, в случае спора о повреждении груза или недостаче веса — неверный вес в BOL ставил бы перевозчика в уязвимое положение. Правильное действие — всегда проверять и уточнять до подписания.</p>

        <h3>Ключевые уроки этого рейса</h3>
        <p>Rate Con проверяется полностью до подписания — особенно ставка и тип оборудования. BOL проверяется на складе до подписания — особенно вес и адреса. POD запрашивается немедленно после доставки. Каждый документ хранится и пересылается без задержек. Документооборот — это профессионализм диспетчера в действии.</p>

        <h3>Симуляция: опросы по документации</h3>
        <p>Ниже — интерактивная симуляция с вопросами по реальным ситуациям из документооборота грузоперевозок. Отвечай внимательно — вопросы основаны на сценариях, которые происходят в реальной работе диспетчера.</p>
      `,
    },

    '4-4': {
      type: 'text',
      body: `
        <h2>Practice — Chapter 4: Documentation in US Trucking</h2>
        <p>This practice test covers all Chapter 4 material: Rate Confirmation, Bill of Lading, Proof of Delivery, Lumper Receipt, Carrier Packet, and Detention. The test contains <strong>20 questions</strong> — 14 standard and 6 mini-cases.</p>
        <blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20 correct) to pass.</blockquote>
        <h3>Topics covered:</h3>
        <ul>
          <li>Rate Confirmation: content, verification, signing</li>
          <li>Bill of Lading: functions, pickup verification, BOL types</li>
          <li>Proof of Delivery: creation, importance, actions when missing</li>
          <li>Lumper Receipt: process, reimbursement</li>
          <li>Carrier Packet: contents, document currency</li>
          <li>Detention: conditions, documentation</li>
        </ul>
      `,
      bodyRu: `
        <h2>Практика — Глава 4: Документация в грузоперевозках США</h2>
        <p>Практический тест охватывает все материалы Главы 4: Rate Confirmation, Bill of Lading, Proof of Delivery, Lumper Receipt, Carrier Packet и Detention. Тест содержит <strong>20 вопросов</strong> — 14 стандартных и 6 мини-кейсов.</p>
        <blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20 правильных ответов) для прохождения.</blockquote>
        <h3>Темы:</h3>
        <ul>
          <li>Rate Confirmation: содержание, проверка, подписание</li>
          <li>Bill of Lading: функции, проверка при погрузке, типы BOL</li>
          <li>Proof of Delivery: создание, важность, действия при отсутствии</li>
          <li>Lumper Receipt: процесс, возмещение</li>
          <li>Carrier Packet: состав, актуальность документов</li>
          <li>Detention: условия, документирование</li>
        </ul>
      `,
      quiz: {
        questions: [
          { id: 'doc-pr-eq1', text: "Who issues the Bill of Lading to the driver at pickup?", options: ["The broker — after rate negotiation", "The shipper — at the warehouse when freight is loaded", "The dispatcher — when booking the load", "The consignee — at delivery"], correctIndex: 1 },
          { id: 'doc-pr-eq2', text: "What happens to the BOL when the consignee signs it?", options: ["It is voided and replaced by a new document", "It becomes the Proof of Delivery (POD) — confirming delivery", "It is returned to the shipper for filing", "It is used by the broker to calculate their margin"], correctIndex: 1 },
          { id: 'doc-pr-eq3', text: "Which document is the legal foundation of the financial agreement between broker and carrier?", options: ["Bill of Lading", "Rate Confirmation", "Proof of Delivery", "Lumper Receipt"], correctIndex: 1 },
          { id: 'doc-pr-eq4', text: "How many hours past appointment time generally triggers the carrier's right to detention pay?", options: ["30 minutes", "1 hour", "2 hours", "4 hours"], correctIndex: 2 },
          { id: 'doc-pr-eq5', text: "Which of the following is NOT part of a standard Carrier Packet?", options: ["MC number and DOT number", "Certificate of Insurance", "Driver's route weather history", "W-9 form"], correctIndex: 2 },
          { id: 'doc-pr-eq6', text: "Which type of BOL can be transferred to a third party?", options: ["Straight BOL", "Order BOL (Negotiable BOL)", "Digital BOL", "Express BOL"], correctIndex: 1 },
          { id: 'doc-pr-eq7', text: "What must a valid POD contain?", options: ["Only the driver's signature", "Authorized consignee representative signature, delivery date and time", "Broker and carrier signatures", "Only the warehouse stamp"], correctIndex: 1 },
          { id: 'doc-pr-eq8', text: "What is a \"subject to count\" notation on a BOL?", options: ["A note about overweight requiring weigh station verification", "A notation meaning the driver could not count units and accepted freight on trust", "An indication that freight is insured for a specific amount", "A broker requirement for additional freight inspection"], correctIndex: 1 },
          { id: 'doc-pr-eq9', text: "When must the dispatcher notify the broker about a driver delay?", options: ["Only if the delay exceeds 4 hours", "As soon as possible — the moment the delay is known, regardless of cause", "After delivery — in the final report", "Only if the delay causes a delivery window violation"], correctIndex: 1 },
          { id: 'doc-pr-eq10', text: "What is \"quick pay\" in the context of freight documentation?", options: ["A special type of rate con with a fixed fast rate", "An option to receive payment faster than standard terms, typically for a small fee", "A broker service for instant rate con signing", "An electronic document submission system"], correctIndex: 1 },
          { id: 'doc-pr-eq11', text: "Mini-case: Rate Con arrives with correct route and rate but no fuel surcharge — you negotiated $0.15/mile. What do you do before signing?", options: ["Sign it — fuel surcharge is calculated automatically by law", "Return the Rate Con to the broker requesting an explicit fuel surcharge line before signing", "Add the fuel surcharge manually to the Rate Con before signing", "Accept as-is — add fuel surcharge to the invoice later"], correctIndex: 1 },
          { id: 'doc-pr-eq12', text: "Mini-case: Driver at unloading is told the warehouse charges a $250 lumper fee. The Rate Con has no lumper clause. What do you do?", options: ["Refuse — if lumper isn't in the Rate Con, it's not your cost", "Allow the driver to pay, get a detailed signed receipt, notify the broker, and request reimbursement as an accessorial charge", "Tell the driver to unload himself — that's his job", "Cancel the delivery — extra costs make the load unprofitable"], correctIndex: 1 },
          { id: 'doc-pr-eq13', text: "Mini-case: Driver has been waiting at pickup 3.5 hours past appointment. You want to claim detention. What is required for successful payment?", options: ["A verbal claim by phone after delivery is sufficient", "Document arrival time and delay start, notify broker in real time, and obtain written broker confirmation of detention payment", "Wait until tomorrow — detention claims are only processed after the load completes", "Only the driver's signature on wait time is needed"], correctIndex: 1 },
          { id: 'doc-pr-eq14', text: "Mini-case: POD from a load delivered 3 days ago is still missing. Broker is holding payment. What do you do?", options: ["Wait — driver will send it when available", "Immediately contact the consignee directly for a digital POD by email, simultaneously notifying the broker of the status", "Create your own delivery confirmation based on the Rate Con", "Demand the broker pay without POD — the load was clearly delivered"], correctIndex: 1 },
          { id: 'doc-pr-eq15', text: "Mini-case: Broker requests carrier packet for first-time work. You find the Certificate of Insurance expired 2 weeks ago. What do you do?", options: ["Send the expired certificate — brokers typically don't check dates", "Immediately contact the insurance agent for an updated certificate before sending the carrier packet", "Ask the broker to wait a month for the next insurance renewal", "Send the packet without insurance and add it \"later\""], correctIndex: 1 },
          { id: 'doc-pr-eq16', text: "Mini-case: Rate Con shows $1,950, but you negotiated $2,100. Driver is ready to go in one hour. What do you do?", options: ["Dispatch the driver — $1,950 is \"close enough\"", "Call the broker, point out the discrepancy, and require a corrected Rate Con. Driver waits.", "Sign the current Rate Con and add the difference to the next invoice", "Ask the driver to resolve the issue himself"], correctIndex: 1 },
          { id: 'doc-pr-eq17', text: "The consignee signed the POD but refused to stamp it, citing \"internal policy.\" The POD has a signature and date. Is it valid?", options: ["No — without a warehouse stamp, the POD has no legal standing", "Yes — authorized representative signature and date are sufficient for most brokers; a stamp is not a mandatory industry requirement", "No — a notarized confirmation is required instead of a stamp", "Only if the broker agreed in advance to accept a POD without a stamp"], correctIndex: 1 },
          { id: 'doc-pr-eq18', text: "What is the correct post-delivery document workflow?", options: ["Only call the broker to verbally confirm delivery", "Receive POD from driver, send to broker, save a copy in the accounting system", "Wait for the broker to request documents", "Send POD to shipper and give broker only verbal confirmation"], correctIndex: 1 },
          { id: 'doc-pr-eq19', text: "What does NOA (Notice of Assignment) in the Carrier Packet tell the broker?", options: ["To notify DOT about a new route", "That carrier payments are directed to a factoring company", "To confirm the driver has a valid CDL", "To register new equipment in the FMCSA database"], correctIndex: 1 },
          { id: 'doc-pr-eq20', text: "Driver finds freight is damaged at pickup. What is the correct way to handle the BOL?", options: ["Don't note it — it complicates things with the broker", "Note the damage on the BOL before signing with a \"damaged at pickup\" notation and description", "Refuse the load entirely without documentation", "Sign the BOL normally and only report damage after delivery"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'doc-pr-q1', text: "Кто выдаёт Bill of Lading водителю при погрузке?", options: ["Брокер — после согласования ставки", "Грузоотправитель (shipper) — на складе при загрузке груза", "Диспетчер — при бронировании рейса", "Грузополучатель (consignee) — при доставке"], correctIndex: 1 },
          { id: 'doc-pr-q2', text: "Что происходит с BOL после того, как грузополучатель его подписывает?", options: ["Он аннулируется и заменяется новым документом", "Он становится Proof of Delivery (POD) — подтверждением факта доставки", "Он возвращается грузоотправителю для архивирования", "Он используется брокером для расчёта маржи"], correctIndex: 1 },
          { id: 'doc-pr-q3', text: "Какой документ является юридической основой финансового договора между брокером и перевозчиком?", options: ["Bill of Lading", "Rate Confirmation", "Proof of Delivery", "Lumper Receipt"], correctIndex: 1 },
          { id: 'doc-pr-q4', text: "Как правило, через сколько часов ожидания сверх appointment у перевозчика возникает право на detention pay?", options: ["30 минут", "1 час", "2 часа", "4 часа"], correctIndex: 2 },
          { id: 'doc-pr-q5', text: "Что из перечисленного НЕ входит в стандартный Carrier Packet?", options: ["MC-номер и DOT-номер", "Страховой сертификат (Certificate of Insurance)", "История погодных условий по маршрутам водителя", "W-9 форма"], correctIndex: 2 },
          { id: 'doc-pr-q6', text: "Какой тип BOL может быть передан третьей стороне?", options: ["Straight BOL", "Order BOL (Negotiable BOL)", "Digital BOL", "Express BOL"], correctIndex: 1 },
          { id: 'doc-pr-q7', text: "Что должен содержать полноценный POD?", options: ["Только подпись водителя", "Подпись уполномоченного представителя грузополучателя, дату и время доставки", "Подпись брокера и перевозчика", "Только штамп склада"], correctIndex: 1 },
          { id: 'doc-pr-q8', text: "Для чего нужна NOA (Notice of Assignment) в Carrier Packet?", options: ["Для уведомления DOT о новом маршруте", "Чтобы уведомить брокера, что платежи перевозчика переводятся на факторинговую компанию", "Для подтверждения наличия CDL у водителя", "Для регистрации нового оборудования в базе FMCSA"], correctIndex: 1 },
          { id: 'doc-pr-q9', text: "Водитель получил подписанный POD, но в нём есть пометка о повреждении 2 поддонов при доставке. Что должен сделать диспетчер?", options: ["Не отправлять этот POD брокеру — дождаться нового без пометок", "Отправить POD брокеру как есть и уточнить у водителя состояние груза при погрузке по BOL — пометка может зафиксировать ответственность грузополучателя", "Потребовать от брокера снизить ставку на стоимость повреждённого товара", "Просить водителя вернуться на склад и получить новый POD без пометок"], correctIndex: 1 },
          { id: 'doc-pr-q10', text: "Что значит \"quick pay\" в контексте документооборота?", options: ["Специальный тип rate con с фиксированной быстрой ставкой", "Опция получения оплаты быстрее стандартного срока (обычно за небольшую комиссию)", "Услуга брокера по мгновенному подписанию rate con", "Электронная система отправки документов в реальном времени"], correctIndex: 1 },
          { id: 'doc-pr-q11', text: "Мини-кейс: Брокер отправил rate con, но accessorial charge за fuel surcharge отсутствует, хотя вы договорились о $0,15/миля. Что делать до подписания?", options: ["Подписать — fuel surcharge начисляется автоматически по закону", "Вернуть rate con брокеру с требованием добавить явный пункт о fuel surcharge перед подписанием", "Добавить fuel surcharge от руки в rate con перед подписанием", "Принять как есть — fuel surcharge можно добавить в инвойс позже"], correctIndex: 1 },
          { id: 'doc-pr-q12', text: "Мини-кейс: Водитель на выгрузке обнаружил, что склад требует $250 lumper fee. В rate con нет пункта о lumper. Ваши действия?", options: ["Отказать — если lumper не в rate con, это не ваши расходы", "Разрешить водителю оплатить, получить детальную подписанную квитанцию, уведомить брокера и запросить возмещение как accessorial charge", "Попросить водителя самому разгружать — это его работа", "Отменить доставку — дополнительные расходы делают груз невыгодным"], correctIndex: 1 },
          { id: 'doc-pr-q13', text: "Мини-кейс: Водитель ждёт на погрузке уже 3,5 часа после назначенного времени. Вы хотите заявить detention. Что необходимо для успешного получения оплаты?", options: ["Достаточно устного требования по телефону после доставки", "Зафиксировать время прибытия и начала задержки, уведомить брокера в реальном времени и получить его письменное подтверждение о согласии выплатить detention", "Подождать до завтра — detention claims рассматриваются только после завершения рейса", "Получить только подпись водителя о времени ожидания"], correctIndex: 1 },
          { id: 'doc-pr-q14', text: "Мини-кейс: Вы отправили водителя, но POD от предыдущего рейса ещё не получен, хотя груз доставлен 3 дня назад. Брокер на удержании. Что делать?", options: ["Ждать — водитель сам пришлёт POD когда освободится", "Немедленно связаться с грузополучателем напрямую для запроса цифрового POD по email, одновременно уведомив брокера о статусе", "Создать подтверждение доставки самостоятельно на основе rate con", "Потребовать от брокера оплатить без POD — груз явно доставлен"], correctIndex: 1 },
          { id: 'doc-pr-q15', text: "Мини-кейс: Брокер требует carrier packet для первой работы. Вы обнаруживаете, что страховой сертификат истёк 2 недели назад. Что делать?", options: ["Отправить просроченный сертификат — брокер обычно не проверяет даты", "Немедленно связаться со страховой агентурой для получения обновлённого сертификата перед отправкой carrier packet брокеру", "Попросить брокера подождать месяц до следующего обновления страховки", "Отправить пакет без страховки и добавить её «позже»"], correctIndex: 1 },
          { id: 'doc-pr-q16', text: "Что такое \"subject to count\" на BOL?", options: ["Отметка о перегрузе, требующая взвешивания на весовой станции", "Пометка, означающая что водитель не имел возможности пересчитать единицы груза — они приняты на веру", "Указание на то, что груз застрахован на определённую сумму", "Требование брокера о дополнительном осмотре груза"], correctIndex: 1 },
          { id: 'doc-pr-q17', text: "Когда диспетчер обязан уведомить брокера о задержке водителя?", options: ["Только если задержка превышает 4 часа", "Как можно скорее — в момент, когда становится известно о задержке, независимо от её причины", "После доставки — в финальном отчёте", "Только если задержка влечёт нарушение delivery window"], correctIndex: 1 },
          { id: 'doc-pr-q18', text: "Что из перечисленного является частью правильного документооборота после доставки?", options: ["Только звонок брокеру с подтверждением доставки", "Получить POD от водителя, отправить брокеру, сохранить копию в системе учёта", "Ждать пока брокер сам запросит документы", "Направить POD грузоотправителю, а брокеру — только устное подтверждение"], correctIndex: 1 },
          { id: 'doc-pr-q19', text: "Мини-кейс: В Rate Con указана ставка $1 950, но вы договорились на $2 100. Водитель готов ехать через час. Что делаете?", options: ["Отправляете водителя — $1 950 «достаточно»", "Звоните брокеру, указываете на расхождение и требуете исправленный rate con. Водитель ждёт.", "Подписываете текущий rate con и добавляете разницу в следующий инвойс", "Просите водителя решить вопрос самостоятельно"], correctIndex: 1 },
          { id: 'doc-pr-q20', text: "Мини-кейс: Грузополучатель подписал POD, но отказался ставить печать склада, сославшись на «внутреннюю политику». POD содержит подпись и дату. Действителен ли он?", options: ["Нет — без печати склада POD не имеет юридической силы", "Да — подпись уполномоченного представителя и дата достаточны для большинства брокеров; печать не является обязательным реквизитом по стандартам отрасли", "Нет — необходимо получить нотариально заверенное подтверждение вместо печати", "Только если брокер заранее согласился принять POD без печати"], correctIndex: 1 },
        ],
      },
    },

    '5-1': {
      type: 'text',
      body: `<h2>CARGO ETL — Your Main Dispatch Tool</h2>
<p>CARGO ETL is our proprietary dispatch application built specifically for finding and booking freight loads. It was created after dispatchers spent enormous amounts of time on repetitive manual tasks that left little room for actual load searching.</p>
<h3>What It Does</h3>
<ul>
<li>Automatically pulls incoming load requests from broker emails</li>
<li>Displays all available loads in real time on the Dispatch Board</li>
<li>Shows which of your trucks can realistically take each load (within 300 miles)</li>
<li>Lets you call brokers and owners directly inside the app</li>
<li>Manages your entire fleet — locations, availability, and status</li>
</ul>
<h3>Why It Matters</h3>
<p>Without CARGO ETL, a dispatcher would have to manually check dozens of emails, cross-reference truck locations, and switch between multiple apps just to book one load. The application consolidates all of this into one screen, letting you focus on decisions rather than data collection.</p>
<blockquote>The app works in sync with your Gmail account. Broker communication happens in email — CARGO ETL reads those emails and surfaces the relevant load data automatically.</blockquote><figure><img src="/wikimedia/Desktop_with_laptop_and_calculator_(Unsplash).jpg" alt="Dispatcher workstation with laptop" /><figcaption>The dispatcher's command center — load board, email, and fleet management on screen</figcaption></figure>

      <h3>CargoETL Screen Layout</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:center;border-radius:8px 0 0 0" width="50%">⬅️ LEFT PANEL</th>
          <th style="padding:10px;text-align:center;border-radius:0 8px 0 0" width="50%">RIGHT PANEL ➡️</th>
        </tr>
        <tr>
          <td style="padding:12px;border:1px solid #e2e8f0;vertical-align:top;background:#f8fafc">
            <strong>Load Details:</strong><br/>
            • Loaded miles & deadhead<br/>
            • Weight & pallet count<br/>
            • Pickup/delivery dates<br/>
            • Broker name & contact<br/>
            • Equipment requirements
          </td>
          <td style="padding:12px;border:1px solid #e2e8f0;vertical-align:top;background:#f0fdf4">
            <strong>Available Trucks:</strong><br/>
            • All trucks within <strong>300 miles</strong><br/>
            • Truck type & capacity<br/>
            • Current location<br/>
            • Driver/owner contact<br/>
            • Call button for quick contact
          </td>
        </tr>
      </table>
      <blockquote><strong>💡 Recommended setup:</strong> Two monitors — one for CargoETL load board, one for email. Email notifications from brokers pop up for 10 seconds, so you need to react fast!</blockquote>`,
      bodyRu: `<h2>CARGO ETL — Ваш главный инструмент диспетчера</h2>
<p>CARGO ETL — это наше собственное приложение для диспетчеров, созданное специально для поиска и бронирования грузов. Программа появилась после того, как диспетчеры тратили огромное время на рутинные задачи вместо реального поиска грузов.</p>
<h3>Что делает приложение</h3>
<ul>
<li>Автоматически получает входящие заявки из писем брокеров</li>
<li>Отображает все доступные грузы в режиме реального времени на доске заявок</li>
<li>Показывает, какие из ваших машин реально могут взять каждый груз (в радиусе 300 миль)</li>
<li>Позволяет звонить брокерам и оунерам прямо внутри программы</li>
<li>Управляет всем парком — местоположение, доступность, статус</li>
</ul>
<h3>Почему это важно</h3>
<p>Без CARGO ETL диспетчер вручную просматривал бы десятки писем, сопоставлял местоположение машин и переключался между несколькими приложениями только чтобы забронировать один груз. Программа объединяет всё это на одном экране.</p>
<blockquote>Приложение работает в связке с вашим Gmail. Общение с брокерами происходит в почте — CARGO ETL читает эти письма и автоматически отображает данные по грузам.</blockquote><figure><img src="/wikimedia/Desktop_with_laptop_and_calculator_(Unsplash).jpg" alt="Рабочее место диспетчера" /><figcaption>Командный центр диспетчера — биржа грузов, email и управление парком на экране</figcaption></figure>

    <h3>Раскладка экрана CargoETL</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:center;border-radius:8px 0 0 0" width="50%">⬅️ ЛЕВАЯ ПАНЕЛЬ</th>
        <th style="padding:10px;text-align:center;border-radius:0 8px 0 0" width="50%">ПРАВАЯ ПАНЕЛЬ ➡️</th>
      </tr>
      <tr>
        <td style="padding:12px;border:1px solid #e2e8f0;vertical-align:top;background:#f8fafc">
          <strong>Детали груза:</strong><br/>
          • Гружёные мили и deadhead<br/>
          • Вес и количество паллет<br/>
          • Даты погрузки/доставки<br/>
          • Имя и контакт брокера<br/>
          • Требования к оборудованию
        </td>
        <td style="padding:12px;border:1px solid #e2e8f0;vertical-align:top;background:#f0fdf4">
          <strong>Доступные машины:</strong><br/>
          • Все грузовики в радиусе <strong>300 миль</strong><br/>
          • Тип и вместимость<br/>
          • Текущее расположение<br/>
          • Контакт водителя/владельца<br/>
          • Кнопка быстрого звонка
        </td>
      </tr>
    </table>
    <blockquote><strong>💡 Рекомендация:</strong> Два монитора — один для биржи грузов CargoETL, другой для email. Уведомления от брокеров появляются на 10 секунд — нужна быстрая реакция!</blockquote>`,
      quiz: {
        questions: [
          { id: '6-1-q1', text: "What is the primary purpose of CARGO ETL?", options: ["Send invoices to brokers automatically", "Find and display available freight loads in real time from broker emails", "Manage driver payroll and expenses", "Track delivery locations via GPS"], correctIndex: 1 },
          { id: '6-1-q2', text: "Where does CARGO ETL pull incoming load requests from?", options: ["A central freight exchange database", "Broker emails connected to your Gmail account", "Direct API calls from load boards or Truckstop", "Manual entries by the dispatcher"], correctIndex: 1 },
          { id: '6-1-q3', text: "What was the main problem CARGO ETL was built to solve?", options: ["Drivers forgetting to submit PODs", "Dispatchers spending too much time on repetitive manual tasks instead of finding loads", "Brokers not responding fast enough", "Incorrect rate confirmations from brokers"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-1-q1-ru', text: "Какова основная цель CARGO ETL?", options: ["Автоматически отправлять инвойсы брокерам", "Находить и отображать доступные грузы в реальном времени из писем брокеров", "Управлять зарплатами водителей", "Отслеживать местоположение доставки по GPS"], correctIndex: 1 },
          { id: '6-1-q2-ru', text: "Откуда CARGO ETL получает входящие заявки?", options: ["Из центральной биржи грузов", "Из писем брокеров, подключённых к вашему Gmail", "Через прямые API-запросы к биржам грузов", "Из ручных записей диспетчера"], correctIndex: 1 },
          { id: '6-1-q3-ru', text: "Какую главную проблему решает CARGO ETL?", options: ["Водители забывают отправить POD", "Диспетчеры тратили слишком много времени на рутину вместо поиска грузов", "Брокеры отвечают недостаточно быстро", "Неправильные Rate Con от брокеров"], correctIndex: 1 },
        ],
      },
    },

    '5-2': {
      type: 'text',
      body: `<h2>Core Features of CARGO ETL</h2>
<h3>Dispatch Board</h3>
<p>The Dispatch Board is the main screen. It shows all incoming load requests pulled from broker emails in real time. Every manager can see the same board, open any load, and decide whether to play (book) it.</p>
<figure><img src="/cargo/fig1.png" alt="Dispatch Board" /><figcaption>Fig. 1 — Dispatch Board: incoming loads in real time</figcaption></figure>
<h3>Load View</h3>
<p>When you open a load, you see two sides:</p>
<ul>
<li><strong>Left side:</strong> All load details — loaded miles, weight, pallets, broker name, contact info</li>
<li><strong>Right side:</strong> All trucks within 300 miles that could theoretically take the load</li>
</ul>
<p>There are two call buttons in the top-right corner: <strong>DRIVER</strong> and <strong>OWNER</strong>. Use the correct button depending on who makes pricing decisions for that truck. You must know this for every truck in your fleet.</p>
<figure><img src="/cargo/fig2.png" alt="Load View" /><figcaption>Fig. 2 — Load View: load details on the left, available trucks on the right, DRIVER/OWNER call buttons</figcaption></figure>
<h3>VEHICLES Tab</h3>
<p>The VEHICLES tab shows your entire fleet. Key columns:</p>
<ul>
<li><strong>DRIVERS</strong> — driver first and last name</li>
<li><strong>TYPE</strong> — truck size (small, medium, large)</li>
<li><strong>SIZE</strong> — dimensions in inches (1 inch = 2.54 cm)</li>
<li><strong>STATUS</strong> — one of three values you can change yourself: <strong>IN SERVICE</strong>, <strong>OUT OF SERVICE</strong>, <strong>RETIRED</strong></li>
</ul>
<p>Status meanings: <strong>IN SERVICE</strong> — truck is available, you know its location. <strong>OUT OF SERVICE</strong> — unavailable (broken, vacation, etc.). <strong>RETIRED</strong> — truck no longer works with you.</p>
<figure><img src="/cargo/fig3.png" alt="VEHICLES Tab" /><figcaption>Fig. 3 — VEHICLES tab: full fleet overview with statuses</figcaption></figure>
<h3>Vehicle Detail</h3>
<p>Inside each vehicle record you can edit four fields daily: <strong>AVAILABLE CITY</strong>, <strong>AVAILABLE DATE</strong>, <strong>AVAILABILITY NOTE</strong>, <strong>STATUS</strong>. Keeping these updated is your responsibility — the board shows trucks based on this data.</p>
<figure><img src="/cargo/fig4.png" alt="Vehicle Detail" /><figcaption>Fig. 4 — Vehicle Detail: editable fields inside a truck record</figcaption></figure>
<h3>FAVOURITES Tab</h3>
<p>Add your trucks to Favourites to filter the Dispatch Board. When active, you only see loads where one of your trucks is within range — eliminating irrelevant results and keeping your focus sharp.</p>
<figure><img src="/cargo/fig5.png" alt="Favourites — fleet list" /><figcaption>Fig. 5 — FAVOURITES: your trucks marked as favourites</figcaption></figure>
<figure><img src="/cargo/fig6.png" alt="Favourites — filtered board" /><figcaption>Fig. 6 — Board filtered by FAVOURITES: only loads matching your fleet are shown</figcaption></figure>
<h3>OWNERS Tab</h3>
<p>A directory of all drivers and their owners with contact information. Use it when you need to reach someone quickly without leaving the app.</p>
<figure><img src="/cargo/fig7.png" alt="OWNERS Tab" /><figcaption>Fig. 7 — OWNERS tab: driver and owner contact directory</figcaption></figure>
<h3>Gmail Integration & Notifications</h3>
<p>When a broker replies to your email, a green notification icon appears in the bottom-right corner. It stays for <strong>10 seconds</strong> — if you miss it, the app will not remind you again. Recommended setup: use two monitors. One screen for Gmail, one for CARGO ETL. This way you never miss a broker response.</p>
<figure><img src="/cargo/fig8.png" alt="Gmail notification" /><figcaption>Fig. 8 — Green notification icon (bottom-right): broker replied to your email</figcaption></figure><h3>📋 Load Offer Example — Decoded</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;border:2px solid #1e293b;border-radius:12px;overflow:hidden">
        <tr style="background:#1e293b;color:white"><th style="padding:10px" colspan="2">LOAD #47821 — Small Straight</th></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0;width:40%"><strong>Miles Out:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">14 mi ✅ (under 50 = great)</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Pickup:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Mosinee, WI 54455 — 1/9 15:00 EST</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Delivery:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Columbia City, IN 46725 — 1/12 07:00 EST</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Miles:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">412 loaded</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Pieces / Weight:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">3 pcs / 3,414 lbs</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Dims:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">150L × 30W × 30H inches</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px"><strong>⚠️ Notes:</strong></td><td style="padding:8px"><strong>Requires PPE</strong></td></tr>
      </table>

      <h3>🗺️ Area Pricing System</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr>
          <td style="padding:12px;background:#059669;color:white;text-align:center;border-radius:8px 0 0 0;border:1px solid #047857"><strong>🟢 GOOD</strong><br/>High demand, good rates<br/>IL, WI, MI, OH, IN</td>
          <td style="padding:12px;background:#eab308;color:#1e293b;text-align:center;border:1px solid #ca8a04"><strong>🟡 NBS</strong><br/>Decent volume, avg rates<br/>TX, GA, PA, NJ, NY</td>
          <td style="padding:12px;background:#dc2626;color:white;text-align:center;border-radius:0 8px 0 0;border:1px solid #b91c1c"><strong>🔴 DEAD</strong><br/>Few loads, must escape<br/>FL, ME, LA, MS, AL</td>
        </tr>
      </table>

      <figure><img src="/wikimedia/Container_loading_with_forklift_at_warehouse_in_Thailand.jpg" alt="Forklift loading palletized cargo" /><figcaption>Understanding pallet counts and weight limits is essential for matching loads to trucks</figcaption></figure>

      <blockquote><strong>🚨 Airport Pickup Warnings:</strong><br/>• ZIP <strong>60666</strong> (Chicago) = 90% chance airport pickup at O'Hare (ORD)<br/>• ZIP <strong>90045</strong> (LA/Westchester) = 90% chance airport pickup at LAX<br/>Airport pickups take longer and require extra patience.</blockquote>`,
      bodyRu: `<h2>Основные функции CARGO ETL</h2>
<h3>Доска заявок (Dispatch Board)</h3>
<p>Главный экран приложения. Отображает все входящие заявки из писем брокеров в реальном времени. Все менеджеры видят одну доску, могут открыть любую заявку и "сыграть" её (забронировать груз).</p>
<figure><img src="/cargo/fig1.png" alt="Dispatch Board" /><figcaption>Рис. 1 — Dispatch Board: входящие заявки в реальном времени</figcaption></figure>
<h3>Просмотр заявки (Load View)</h3>
<p>При открытии заявки вы видите два блока:</p>
<ul>
<li><strong>Левая сторона:</strong> Детали груза — гружёные мили, вес, паллеты, имя брокера, контакты</li>
<li><strong>Правая сторона:</strong> Все машины в радиусе 300 миль, которые теоретически могут взять груз</li>
</ul>
<p>В правом верхнем углу — две кнопки звонка: <strong>DRIVER</strong> и <strong>OWNER</strong>. Используйте нужную в зависимости от того, кто принимает решения по ценам за данный трак. Вы должны знать это для каждой машины своего парка.</p>
<figure><img src="/cargo/fig2.png" alt="Load View" /><figcaption>Рис. 2 — Load View: детали груза слева, доступные машины справа, кнопки звонка DRIVER/OWNER</figcaption></figure>
<h3>Вкладка VEHICLES</h3>
<p>Показывает весь ваш парк. Основные колонки:</p>
<ul>
<li><strong>DRIVERS</strong> — имя и фамилия водителя</li>
<li><strong>TYPE</strong> — размер трака (маленький, средний, большой)</li>
<li><strong>SIZE</strong> — размеры в дюймах (1 дюйм = 2,54 см)</li>
<li><strong>STATUS</strong> — один из трёх статусов, которые вы меняете сами: <strong>IN SERVICE</strong>, <strong>OUT OF SERVICE</strong>, <strong>RETIRED</strong></li>
</ul>
<p>Статусы: <strong>IN SERVICE</strong> — машина доступна, вы знаете её местоположение. <strong>OUT OF SERVICE</strong> — недоступна (поломка, отпуск и т.д.). <strong>RETIRED</strong> — трак больше не работает с вами.</p>
<figure><img src="/cargo/fig3.png" alt="Вкладка VEHICLES" /><figcaption>Рис. 3 — Вкладка VEHICLES: список всего парка со статусами</figcaption></figure>
<h3>Детали машины</h3>
<p>Внутри каждой карточки машины вы можете ежедневно редактировать четыре поля: <strong>AVAILABLE CITY</strong>, <strong>AVAILABLE DATE</strong>, <strong>AVAILABILITY NOTE</strong>, <strong>STATUS</strong>. Своевременное обновление — ваша ответственность.</p>
<figure><img src="/cargo/fig4.png" alt="Карточка машины" /><figcaption>Рис. 4 — Карточка машины: редактируемые поля внутри записи</figcaption></figure>
<h3>Вкладка FAVOURITES</h3>
<p>Добавляйте свои машины в Избранное, чтобы фильтровать доску заявок. При активной вкладке вы видите только те грузы, для которых у вас есть машина — это убирает лишние результаты и помогает сосредоточиться.</p>
<figure><img src="/cargo/fig5.png" alt="Favourites — список машин" /><figcaption>Рис. 5 — FAVOURITES: машины, добавленные в избранное</figcaption></figure>
<figure><img src="/cargo/fig6.png" alt="Favourites — отфильтрованная доска" /><figcaption>Рис. 6 — Доска с фильтром FAVOURITES: видны только грузы под ваш парк</figcaption></figure>
<h3>Вкладка OWNERS</h3>
<p>Справочник водителей и их оунеров с контактами. Используйте, когда нужно быстро найти чей-то номер, не выходя из программы.</p>
<figure><img src="/cargo/fig7.png" alt="Вкладка OWNERS" /><figcaption>Рис. 7 — Вкладка OWNERS: справочник водителей и оунеров</figcaption></figure>
<h3>Интеграция с Gmail и уведомления</h3>
<p>Когда брокер отвечает на ваше письмо, в правом нижнем углу появляется зелёная иконка. Она видна <strong>10 секунд</strong> — если пропустили, программа больше не напомнит. Рекомендация: работайте на двух мониторах. На одном — Gmail, на другом — CARGO ETL. Тогда вы не пропустите ни одного ответа брокера.</p>
<figure><img src="/cargo/fig8.png" alt="Уведомление Gmail" /><figcaption>Рис. 8 — Зелёная иконка уведомления (правый нижний угол): брокер ответил на ваше письмо</figcaption></figure><h3>📋 Пример оффера — разбор</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;border:2px solid #1e293b;border-radius:12px;overflow:hidden">
      <tr style="background:#1e293b;color:white"><th style="padding:10px" colspan="2">ГРУЗ #47821 — Small Straight</th></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0;width:40%"><strong>Miles Out:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">14 миль ✅ (до 50 = отлично)</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Погрузка:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Mosinee, WI 54455 — 1/9 15:00 EST</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Доставка:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Columbia City, IN 46725 — 1/12 07:00 EST</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Мили:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">412 гружёных</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Кол-во / Вес:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">3 шт. / 3 414 фунтов</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Габариты:</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">150Д × 30Ш × 30В дюймов</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px"><strong>⚠️ Примечания:</strong></td><td style="padding:8px"><strong>Требуется PPE</strong></td></tr>
    </table>

    <h3>🗺️ Система зон ценообразования</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr>
        <td style="padding:12px;background:#059669;color:white;text-align:center;border-radius:8px 0 0 0;border:1px solid #047857"><strong>🟢 GOOD</strong><br/>Высокий спрос, хорошие ставки<br/>IL, WI, MI, OH, IN</td>
        <td style="padding:12px;background:#eab308;color:#1e293b;text-align:center;border:1px solid #ca8a04"><strong>🟡 NBS</strong><br/>Средний объём, средние ставки<br/>TX, GA, PA, NJ, NY</td>
        <td style="padding:12px;background:#dc2626;color:white;text-align:center;border-radius:0 8px 0 0;border:1px solid #b91c1c"><strong>🔴 DEAD</strong><br/>Мало грузов, нужно уезжать<br/>FL, ME, LA, MS, AL</td>
      </tr>
    </table>

    <figure><img src="/wikimedia/Container_loading_with_forklift_at_warehouse_in_Thailand.jpg" alt="Погрузка поддонов вилочным погрузчиком" /><figcaption>Понимание паллетных объёмов и весовых лимитов — ключ к правильному подбору груза</figcaption></figure>

    <blockquote><strong>🚨 Предупреждения по аэропортным погрузкам:</strong><br/>• ZIP <strong>60666</strong> (Чикаго) = 90% аэропортная погрузка в O'Hare (ORD)<br/>• ZIP <strong>90045</strong> (LA/Westchester) = 90% аэропортная погрузка в LAX<br/>Аэропортные погрузки занимают больше времени.</blockquote>`,
      quiz: {
        questions: [
          { id: '6-2-q1', text: "What does the right side of the Load View show?", options: ["Broker payment history", "All trucks within 300 miles that could potentially take the load", "The route map with toll locations", "Available parking near the pickup point"], correctIndex: 1 },
          { id: '6-2-q2', text: "When should you use the DRIVER button vs the OWNER button in Load View?", options: ["DRIVER for daytime loads, OWNER for night loads", "Depending on who makes pricing decisions for that specific truck", "DRIVER always — owners don't handle load pricing", "OWNER always — drivers just follow instructions"], correctIndex: 1 },
          { id: '6-2-q3', text: "Which VEHICLES status means the truck is broken or on vacation?", options: ["RETIRED", "IN SERVICE", "OUT OF SERVICE", "PENDING"], correctIndex: 2 },
          { id: '6-2-q4', text: "How long does the Gmail broker reply notification stay visible?", options: ["30 seconds", "1 minute", "10 seconds", "Until you click it"], correctIndex: 2 },
          { id: '6-2-q5', text: "What is the purpose of the FAVOURITES tab?", options: ["Save loads you want to book later", "Filter the board to show only loads matching your own fleet's trucks", "Mark preferred brokers", "Set favorite routes for drivers"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-2-q1-ru', text: "Что показывает правая сторона в просмотре заявки (Load View)?", options: ["История выплат брокера", "Все машины в радиусе 300 миль, которые могут взять груз", "Карту маршрута с пунктами оплаты", "Доступные парковки у места загрузки"], correctIndex: 1 },
          { id: '6-2-q2-ru', text: "Когда использовать кнопку DRIVER, а когда OWNER в просмотре заявки?", options: ["DRIVER для дневных грузов, OWNER для ночных", "В зависимости от того, кто принимает решения по ценам для данного трака", "Всегда DRIVER — оунеры не занимаются ценами", "Всегда OWNER — водители просто выполняют инструкции"], correctIndex: 1 },
          { id: '6-2-q3-ru', text: "Какой статус в VEHICLES означает, что машина сломана или в отпуске?", options: ["RETIRED", "IN SERVICE", "OUT OF SERVICE", "PENDING"], correctIndex: 2 },
          { id: '6-2-q4-ru', text: "Сколько секунд видно уведомление об ответе брокера в Gmail?", options: ["30 секунд", "1 минута", "10 секунд", "Пока не нажмёшь"], correctIndex: 2 },
          { id: '6-2-q5-ru', text: "Для чего нужна вкладка FAVOURITES?", options: ["Сохранять грузы, которые хочешь взять позже", "Фильтровать доску, чтобы видеть только грузы под машины своего парка", "Отмечать предпочтительных брокеров", "Устанавливать любимые маршруты для водителей"], correctIndex: 1 },
        ],
      },
    },

    '5-3': {
      type: 'text',
      body: `<h2>Working in CARGO ETL — Step by Step</h2>
<p>Every shift in CARGO ETL follows a clear routine. Here's how a typical dispatcher workflow looks from login to booking.</p>
<h3>Step 1 — Update Your Fleet</h3>
<p>Before anything else, open the VEHICLES tab and update every truck in your fleet: set the correct <strong>AVAILABLE CITY</strong>, <strong>AVAILABLE DATE</strong>, and <strong>STATUS</strong>. If a truck has a note (special equipment, driver preference), add it to <strong>AVAILABILITY NOTE</strong>. This data drives everything the board shows you.</p>
<h3>Step 2 — Set Up FAVOURITES</h3>
<p>Add all your trucks to the FAVOURITES tab. This filters the Dispatch Board so you only see loads that are physically reachable by your fleet — saving time and reducing noise.</p>
<h3>Step 3 — Work the Board</h3>
<p>Monitor the Dispatch Board for new loads. When something looks promising, open the load. Check the left side for load details (miles, weight, commodity, pickup/delivery times). Check the right side for which of your trucks is closest.</p>
<figure><img src="/cargo/fig1.png" alt="Dispatch Board" /><figcaption>Fig. 1 — Dispatch Board: find your load here</figcaption></figure>
<figure><img src="/cargo/fig2.png" alt="Load View" /><figcaption>Fig. 2 — Open the load to see details and available trucks</figcaption></figure>
<h3>Step 4 — Call and Book</h3>
<p>Use the in-app call button (DRIVER or OWNER) to confirm the truck is available and the driver agrees. Then reply to the broker email to play the load. All communication with brokers stays in Gmail — the app surfaces the data, Gmail handles the conversation.</p>
<h3>Step 5 — Monitor Notifications</h3>
<p>Keep an eye on the green notification icon. If a broker replies, you have 10 seconds to click it. Set up two monitors to watch Gmail and CARGO ETL simultaneously — this is the standard recommended setup.</p>

<h2>Video Tutorials — CARGO ETL in Action</h2>
<p>Watch these short tutorials to see how each feature works in practice.</p>

<h3>Getting Started</h3>

<h4>Video: How to authorize in Gmail and place a bid</h4>

<h4>Video: How to change unit location and set IN SERVICE</h4>

<h3>Working with Loads</h3>

<h4>Video: How to quick search fleet capacity</h4>

<h4>Video: How to view loads for favorite trucks</h4>

<h4>Video: How to remove loads with no trucks nearby</h4>

<h4>Video: How to quick copy load information</h4>

<h3>Bidding</h3>

<h4>Video: How to change bid email message</h4>

<h4>Video: How to cancel a driver bid</h4>

<h3>Order Management</h3>

<h4>Video: How to create and track an order</h4>

<h4>Video: How to change load status (checkout)</h4>
<blockquote>Key rule: CARGO ETL shows which trucks <em>theoretically</em> can take a load based on location. It's your job to analyze whether they <em>actually</em> can — considering driver hours, existing loads, preferences, and any owner restrictions.</blockquote>`,
      bodyRu: `<h2>Работа в CARGO ETL — шаг за шагом</h2>
<p>Каждая смена в CARGO ETL следует чёткому порядку. Вот как выглядит типичный рабочий процесс диспетчера.</p>
<h3>Шаг 1 — Обновите парк</h3>
<p>Перед всем остальным откройте вкладку VEHICLES и обновите данные по каждой машине: <strong>AVAILABLE CITY</strong>, <strong>AVAILABLE DATE</strong>, <strong>STATUS</strong>. Если есть примечание — добавьте в <strong>AVAILABILITY NOTE</strong>. Эти данные определяют, что вы видите на доске.</p>
<h3>Шаг 2 — Настройте FAVOURITES</h3>
<p>Добавьте все свои машины во вкладку Избранное. Это отфильтрует доску так, чтобы вы видели только физически доступные для вашего парка грузы.</p>
<h3>Шаг 3 — Работайте с доской</h3>
<p>Следите за новыми заявками на Dispatch Board. Когда появляется перспективный груз, откройте его. Левая сторона — детали груза (мили, вес, товар, время загрузки/выгрузки). Правая — какая из ваших машин ближе всего.</p>
<figure><img src="/cargo/fig1.png" alt="Dispatch Board" /><figcaption>Рис. 1 — Dispatch Board: здесь находите нужный груз</figcaption></figure>
<figure><img src="/cargo/fig2.png" alt="Load View" /><figcaption>Рис. 2 — Открываете заявку и видите детали и доступные машины</figcaption></figure>
<h3>Шаг 4 — Звоните и бронируйте</h3>
<p>Используйте кнопку звонка (DRIVER или OWNER), чтобы подтвердить доступность машины. Затем отвечайте брокеру в Gmail, чтобы сыграть груз. Всё общение с брокерами — через почту, приложение лишь показывает данные.</p>
<h3>Шаг 5 — Следите за уведомлениями</h3>
<p>Следите за зелёной иконкой в правом нижнем углу. Если брокер ответил — у вас 10 секунд. Рекомендуется два монитора: один для Gmail, второй для CARGO ETL.</p>

<h2>Видеоуроки — CARGO ETL на практике</h2>
<p>Посмотрите короткие обучающие видео, чтобы увидеть, как работает каждая функция.</p>

<h3>Начало работы</h3>



<h3>Работа с грузами</h3>





<h3>Ставки (Bidding)</h3>



<h3>Управление заказами</h3>


<blockquote>Важное правило: CARGO ETL показывает, какие машины <em>теоретически</em> могут взять груз по местоположению. Ваша задача — оценить, могут ли они это сделать <em>реально</em>, с учётом часов водителя, существующих грузов и ограничений оунера.</blockquote>`,
      loadBoard: true,
      quiz: {
        questions: [
          { id: '6-3-q1', text: "What is the first thing you should do at the start of a shift in CARGO ETL?", options: ["Start booking loads immediately from the board", "Update your fleet data in the VEHICLES tab (city, date, status)", "Check the OWNERS tab for new contacts", "Call all your drivers to confirm availability"], correctIndex: 1 },
          { id: '6-3-q2', text: "A load appears on the board near your truck. The right side shows your truck is 280 miles away. What must you do before booking?", options: ["Book immediately — 280 miles is within range so it qualifies", "Analyze whether the driver actually can take it: check hours, current load, and owner restrictions", "Reject it — only loads within 100 miles are worth booking", "Ask the broker to hold it for 24 hours while you decide"], correctIndex: 1 },
          { id: '6-3-q3', text: "You missed the green notification icon. What happens next?", options: ["The app re-displays it after 30 seconds", "The app sends you an email instead", "The app does not remind you again — check Gmail manually", "The broker is automatically notified that you're busy"], correctIndex: 2 },
          { id: '6-3-q4', text: "Where should all communication with brokers take place?", options: ["Inside CARGO ETL messaging system", "Via phone calls only", "In Gmail — CARGO ETL only surfaces load data, not conversations", "In a separate broker portal"], correctIndex: 2 },
          { id: '6-3-q5', text: "You want to book a load but aren't sure who handles pricing for that truck. Where do you look?", options: ["Check the VEHICLES tab STATUS field", "Check the OWNERS tab for the driver's owner contact and ask", "Check the Dispatch Board comments", "Ask another dispatcher"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-3-q1-ru', text: "Что нужно сделать в первую очередь в начале смены в CARGO ETL?", options: ["Сразу начать бронировать грузы с доски", "Обновить данные парка во вкладке VEHICLES (город, дата, статус)", "Проверить вкладку OWNERS на наличие новых контактов", "Позвонить всем водителям для подтверждения доступности"], correctIndex: 1 },
          { id: '6-3-q2-ru', text: "На доске появился груз рядом с вашей машиной. Правая сторона показывает, что ваш трак в 280 милях. Что нужно сделать перед бронированием?", options: ["Бронировать сразу — 280 миль в радиусе, значит подходит", "Проанализировать, может ли водитель реально взять груз: часы, текущий груз, ограничения оунера", "Отклонить — только грузы в радиусе 100 миль стоят внимания", "Попросить брокера подержать груз 24 часа"], correctIndex: 1 },
          { id: '6-3-q3-ru', text: "Вы пропустили зелёную иконку уведомления. Что происходит дальше?", options: ["Приложение покажет её снова через 30 секунд", "Приложение отправит письмо на почту", "Приложение не напомнит снова — проверьте Gmail вручную", "Брокер автоматически получает уведомление, что вы заняты"], correctIndex: 2 },
          { id: '6-3-q4-ru', text: "Где должно происходить всё общение с брокерами?", options: ["Внутри системы сообщений CARGO ETL", "Только по телефону", "В Gmail — CARGO ETL лишь показывает данные о грузах, а не ведёт переписку", "В отдельном портале для брокеров"], correctIndex: 2 },
          { id: '6-3-q5-ru', text: "Вы хотите взять груз, но не знаете, кто принимает решения по ценам для этого трака. Куда смотреть?", options: ["В поле STATUS во вкладке VEHICLES", "Во вкладку OWNERS — найти контакт оунера и уточнить", "В комментарии на Dispatch Board", "Спросить другого диспетчера"], correctIndex: 1 },
        ],
      },
    },

    '5-4': {
      type: 'text',
      body: `<h2>CARGO ETL — Final Practice Test</h2>
<p>This test covers the complete CARGO ETL workflow: the Dispatch Board, Load View, VEHICLES management, FAVOURITES, OWNERS, Gmail integration, and dispatcher decision-making. 20 questions. Pass threshold: 18/20.</p>`,
      bodyRu: `<h2>CARGO ETL — Итоговый тест</h2>
<p>Этот тест охватывает весь рабочий процесс в CARGO ETL: доску заявок, просмотр груза, управление VEHICLES, FAVOURITES, OWNERS, интеграцию с Gmail и принятие решений диспетчером. 20 вопросов. Порог прохождения: 18/20.</p>`,
      quiz: {
        questions: [
          { id: '6-4-q1', text: "What is CARGO ETL primarily designed to do?", options: ["Generate invoices and process carrier payments", "Aggregate broker load requests from email and display them in real time for dispatchers", "Replace Gmail as the main communication channel with brokers", "Automatically book loads without dispatcher involvement"], correctIndex: 1 },
          { id: '6-4-q2', text: "How does CARGO ETL receive incoming load requests?", options: ["Via direct API integration with major load boards (e.g. Truckstop)", "Through your connected Gmail account — broker emails are parsed automatically", "By manually entering load data from broker phone calls", "Via a shared company inbox separate from personal Gmail"], correctIndex: 1 },
          { id: '6-4-q3', text: "What does the LEFT side of the Load View display?", options: ["Trucks within 300 miles sorted by distance", "All load details: miles, weight, pallets, broker name, and contact info", "The broker's rating and payment history", "Route map with estimated transit time"], correctIndex: 1 },
          { id: '6-4-q4', text: "What does the RIGHT side of the Load View display?", options: ["All load details for easy reference", "All trucks within 300 miles that could theoretically take the load", "Available drivers currently online in the system", "Competing loads from other brokers on the same route"], correctIndex: 1 },
          { id: '6-4-q5', text: "The DRIVER and OWNER call buttons appear in Load View. When do you press OWNER?", options: ["When the driver is unavailable by phone", "When the owner — not the driver — makes the final decision on pricing for that truck", "Always call OWNER first before DRIVER", "Only for owner-operators who drive their own truck"], correctIndex: 1 },
          { id: '6-4-q6', text: "What does \"IN SERVICE\" status mean for a truck in the VEHICLES tab?", options: ["The truck passed its last DOT inspection", "The truck is available, the dispatcher knows its location, and it can be offered loads", "The truck is currently delivering a load", "The truck is being serviced at a repair shop"], correctIndex: 1 },
          { id: '6-4-q7', text: "What does \"OUT OF SERVICE\" status mean?", options: ["The truck is permanently removed from the fleet", "The truck is temporarily unavailable — broken, on vacation, or otherwise not ready", "The truck needs a DOT inspection before operating", "The truck is available but the driver refused loads this week"], correctIndex: 1 },
          { id: '6-4-q8', text: "What does \"RETIRED\" status mean?", options: ["The truck is on a long-distance route and unavailable temporarily", "The truck no longer operates with your company for any reason", "The driver retired but the truck is still available with another driver", "The truck is in scheduled maintenance"], correctIndex: 1 },
          { id: '6-4-q9', text: "Which four fields can a dispatcher edit in the Vehicle Detail record?", options: ["DRIVER NAME, TRUCK TYPE, SIZE, WEIGHT CAPACITY", "AVAILABLE CITY, AVAILABLE DATE, AVAILABILITY NOTE, STATUS", "PICKUP LOCATION, DELIVERY LOCATION, RATE, BROKER", "MC NUMBER, DOT NUMBER, INSURANCE DATE, VIN"], correctIndex: 1 },
          { id: '6-4-q10', text: "Why is it important to update the Vehicle Detail daily?", options: ["The app charges a fee if records are not updated", "The Dispatch Board uses this data to match trucks to loads — stale data leads to wrong matches", "Brokers can see the vehicle data directly and reject outdated trucks", "DOT requires daily fleet status reporting via CARGO ETL"], correctIndex: 1 },
          { id: '6-4-q11', text: "What is the purpose of the FAVOURITES tab in CARGO ETL?", options: ["Bookmark loads you want to book later in the day", "Filter the Dispatch Board to only show loads matching your own fleet's trucks", "Mark brokers you prefer working with", "Save your most-used routes for quick access"], correctIndex: 1 },
          { id: '6-4-q12', text: "What does the OWNERS tab provide?", options: ["A list of freight brokers and their load rates", "Contact information for drivers and their owners", "Owner-operator contract templates", "A record of all past loads by owner"], correctIndex: 1 },
          { id: '6-4-q13', text: "A broker replies to your email. A green icon appears in the bottom-right corner of CARGO ETL. How long do you have to click it?", options: ["30 seconds", "1 minute", "10 seconds", "5 minutes"], correctIndex: 2 },
          { id: '6-4-q14', text: "You miss the green notification icon. What is the correct next step?", options: ["Wait — the app will show it again in 60 seconds", "Refresh the entire application to reload notifications", "Open Gmail manually to check for the broker's reply", "Call the broker directly — the email system has failed"], correctIndex: 2 },
          { id: '6-4-q15', text: "What is the recommended monitor setup for working with CARGO ETL and Gmail simultaneously?", options: ["One monitor with both windows side by side", "Two monitors: one for Gmail, one for CARGO ETL", "Use only CARGO ETL — Gmail notifications are redirected inside the app", "Three monitors: Gmail, CARGO ETL, and load board"], correctIndex: 1 },
          { id: '6-4-q16', text: "CARGO ETL shows a truck 290 miles from a load pickup. Does this mean the truck should automatically take the load?", options: ["Yes — if it's within 300 miles it's always a good match", "No — the dispatcher must verify the driver's actual availability: hours, current load, and owner approval", "Yes — the app only shows trucks that are confirmed available", "No — only trucks within 100 miles should ever be offered loads"], correctIndex: 1 },
          { id: '6-4-q17', text: "Where must all negotiations and communication with brokers take place?", options: ["Inside the CARGO ETL messaging system", "Via phone calls only — email is too slow", "In Gmail — CARGO ETL surfaces load data but does not handle broker conversations", "In a broker portal outside both Gmail and CARGO ETL"], correctIndex: 2 },
          { id: '6-4-q18', text: "A load appears on the Dispatch Board. What is the correct order of steps to book it?", options: ["Call the broker first, then check your trucks, then update VEHICLES", "Check load details in Load View, verify a truck is available, call DRIVER/OWNER to confirm, reply to broker in Gmail", "Reply to broker in Gmail immediately to hold the load, then check trucks", "Update VEHICLES status first, then open the load, then call the broker"], correctIndex: 1 },
          { id: '6-4-q19', text: "Mini-case: You have two trucks available. The board shows 12 loads but none appear in your FAVOURITES view. What is the most likely cause?", options: ["CARGO ETL is disconnected from Gmail and not pulling new loads", "Your trucks are not added to the FAVOURITES tab, so the filter excludes all loads", "All 12 loads are already booked by other dispatchers", "The broker emails haven't been parsed yet — wait 10 minutes"], correctIndex: 1 },
          { id: '6-4-q20', text: "Mini-case: Your driver has been IN SERVICE all week but hasn't moved. A load matches his location but the AVAILABLE CITY field still shows last week's city. What should you do?", options: ["Book the load — the system is usually accurate enough", "Update the AVAILABLE CITY immediately before acting on any load match, then verify with the driver", "Call the broker and let them decide based on the system data", "Change the driver's status to OUT OF SERVICE until you can update the location"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-4-q1-ru', text: "Для чего в первую очередь создано CARGO ETL?", options: ["Формировать инвойсы и обрабатывать выплаты перевозчикам", "Агрегировать заявки брокеров из почты и отображать их в реальном времени для диспетчеров", "Заменить Gmail как основной канал общения с брокерами", "Автоматически бронировать грузы без участия диспетчера"], correctIndex: 1 },
          { id: '6-4-q2-ru', text: "Как CARGO ETL получает входящие заявки?", options: ["Через прямую API-интеграцию с биржами грузов (e.g. Truckstop)", "Через подключённый Gmail — письма брокеров парсятся автоматически", "Путём ручного ввода данных из телефонных звонков брокеров", "Через общий корпоративный ящик, отдельный от личного Gmail"], correctIndex: 1 },
          { id: '6-4-q3-ru', text: "Что отображает ЛЕВАЯ сторона в просмотре заявки?", options: ["Машины в радиусе 300 миль, отсортированные по расстоянию", "Все детали груза: мили, вес, паллеты, имя брокера и контакты", "Рейтинг брокера и история выплат", "Карту маршрута с расчётным временем в пути"], correctIndex: 1 },
          { id: '6-4-q4-ru', text: "Что отображает ПРАВАЯ сторона в просмотре заявки?", options: ["Все детали груза для удобного просмотра", "Все машины в радиусе 300 миль, которые теоретически могут взять груз", "Доступных водителей, которые сейчас онлайн в системе", "Конкурирующие грузы от других брокеров на том же маршруте"], correctIndex: 1 },
          { id: '6-4-q5-ru', text: "В просмотре заявки есть кнопки DRIVER и OWNER. Когда нажимать OWNER?", options: ["Когда до водителя не дозвониться", "Когда именно оунер — а не водитель — принимает окончательное решение по цене за данный трак", "Всегда звонить сначала OWNER, потом DRIVER", "Только для owner-операторов, которые сами управляют своей машиной"], correctIndex: 1 },
          { id: '6-4-q6-ru', text: "Что означает статус \"IN SERVICE\" для машины во вкладке VEHICLES?", options: ["Машина прошла последнюю проверку DOT", "Машина доступна, диспетчер знает её местоположение и может предлагать грузы", "Машина в данный момент везёт груз", "Машина на техническом обслуживании"], correctIndex: 1 },
          { id: '6-4-q7-ru', text: "Что означает статус \"OUT OF SERVICE\"?", options: ["Машина навсегда выведена из парка", "Машина временно недоступна — сломана, в отпуске или по другой причине", "Машине нужна проверка DOT перед работой", "Машина доступна, но водитель отказывается от грузов на этой неделе"], correctIndex: 1 },
          { id: '6-4-q8-ru', text: "Что означает статус \"RETIRED\"?", options: ["Машина на дальнем маршруте и временно недоступна", "Машина больше не работает с вашей компанией по любой причине", "Водитель вышел на пенсию, но машина доступна с другим водителем", "Машина на плановом техническом обслуживании"], correctIndex: 1 },
          { id: '6-4-q9-ru', text: "Какие четыре поля может редактировать диспетчер в карточке машины?", options: ["ИМЯ ВОДИТЕЛЯ, ТИП ТРАКА, РАЗМЕР, ГРУЗОПОДЪЁМНОСТЬ", "AVAILABLE CITY, AVAILABLE DATE, AVAILABILITY NOTE, STATUS", "МЕСТО ЗАГРУЗКИ, МЕСТО ВЫГРУЗКИ, СТАВКА, БРОКЕР", "MC НОМЕР, DOT НОМЕР, ДАТА СТРАХОВКИ, VIN"], correctIndex: 1 },
          { id: '6-4-q10-ru', text: "Почему важно обновлять карточку машины ежедневно?", options: ["Приложение берёт плату, если записи не обновляются", "Dispatch Board использует эти данные для сопоставления машин с грузами — устаревшие данные ведут к ошибкам", "Брокеры видят данные о машинах напрямую и отклоняют устаревшие", "DOT требует ежедневной отчётности о статусе парка через CARGO ETL"], correctIndex: 1 },
          { id: '6-4-q11-ru', text: "Для чего предназначена вкладка FAVOURITES в CARGO ETL?", options: ["Сохранять грузы, которые планируете взять позже", "Фильтровать доску заявок, оставив только грузы под машины вашего парка", "Отмечать брокеров, с которыми предпочитаете работать", "Сохранять часто используемые маршруты"], correctIndex: 1 },
          { id: '6-4-q12-ru', text: "Что предоставляет вкладка OWNERS?", options: ["Список брокеров с их ставками", "Контактную информацию по водителям и их оунерам", "Шаблоны договоров для owner-операторов", "Историю всех грузов по каждому оунеру"], correctIndex: 1 },
          { id: '6-4-q13-ru', text: "Брокер ответил на ваше письмо. В правом нижнем углу CARGO ETL появилась зелёная иконка. Сколько секунд есть, чтобы нажать на неё?", options: ["30 секунд", "1 минута", "10 секунд", "5 минут"], correctIndex: 2 },
          { id: '6-4-q14-ru', text: "Вы пропустили зелёную иконку уведомления. Какой следующий правильный шаг?", options: ["Подождать — приложение покажет её снова через 60 секунд", "Перезапустить приложение для перезагрузки уведомлений", "Открыть Gmail вручную и проверить ответ брокера", "Позвонить брокеру — система почты дала сбой"], correctIndex: 2 },
          { id: '6-4-q15-ru', text: "Какая рекомендуемая настройка мониторов для одновременной работы с CARGO ETL и Gmail?", options: ["Один монитор с двумя окнами рядом", "Два монитора: один для Gmail, один для CARGO ETL", "Использовать только CARGO ETL — уведомления Gmail перенаправляются в приложение", "Три монитора: Gmail, CARGO ETL и биржа грузов"], correctIndex: 1 },
          { id: '6-4-q16-ru', text: "CARGO ETL показывает машину в 290 милях от места загрузки. Означает ли это, что машина должна автоматически взять груз?", options: ["Да — если в радиусе 300 миль, это всегда хорошее совпадение", "Нет — диспетчер должен проверить реальную доступность водителя: часы, текущий груз, разрешение оунера", "Да — приложение показывает только подтверждённо доступные машины", "Нет — грузы стоит предлагать только машинам в радиусе 100 миль"], correctIndex: 1 },
          { id: '6-4-q17-ru', text: "Где должны происходить все переговоры и общение с брокерами?", options: ["Внутри системы сообщений CARGO ETL", "Только по телефону — почта слишком медленная", "В Gmail — CARGO ETL показывает данные о грузах, но не ведёт переписку с брокерами", "В брокерском портале, отдельном от Gmail и CARGO ETL"], correctIndex: 2 },
          { id: '6-4-q18-ru', text: "На доске появился груз. Какой правильный порядок действий для его бронирования?", options: ["Сначала позвонить брокеру, затем проверить машины, затем обновить VEHICLES", "Проверить детали груза в Load View, убедиться в доступности машины, позвонить DRIVER/OWNER для подтверждения, ответить брокеру в Gmail", "Сразу ответить брокеру в Gmail чтобы зафиксировать груз, затем проверить машины", "Сначала обновить статус в VEHICLES, затем открыть заявку, затем позвонить брокеру"], correctIndex: 1 },
          { id: '6-4-q19-ru', text: "Кейс: У вас две доступные машины. На доске 12 грузов, но во вкладке FAVOURITES ни одного не видно. Какова наиболее вероятная причина?", options: ["CARGO ETL отключён от Gmail и не получает новые грузы", "Ваши машины не добавлены во вкладку FAVOURITES, поэтому фильтр исключает все грузы", "Все 12 грузов уже забронированы другими диспетчерами", "Письма от брокеров ещё не обработаны — подождите 10 минут"], correctIndex: 1 },
          { id: '6-4-q20-ru', text: "Кейс: Ваш водитель всю неделю в статусе IN SERVICE, но не двигался. Груз совпадает с его позицией, но в поле AVAILABLE CITY указан город прошлой недели. Что делать?", options: ["Бронировать груз — система обычно достаточно точна", "Сразу обновить AVAILABLE CITY перед любыми действиями по грузу, затем уточнить у водителя", "Позвонить брокеру и пусть он решает на основе данных системы", "Перевести водителя в OUT OF SERVICE до момента обновления локации"], correctIndex: 1 },
        ],
      },
    },

    '6-1': {
      type: 'text',
      body: `<h2>Who Are Brokers and Why You Need to Know How to Work With Them</h2>
<p>A <strong>freight broker</strong> is a licensed intermediary (requires an FMCSA Broker Authority) who connects shippers with carriers. Brokers don't own trucks — they earn a margin between what the shipper pays and what the carrier gets. As a dispatcher, the broker is your direct customer: you find loads through them and get paid through them.</p>
<div class="bg-red-50 border-l-4 border-red-500 px-4 py-3 my-4 rounded-r-xl"><p class="font-bold text-red-700 text-sm">⚠️ CRITICAL RULE — READ THIS FIRST</p><p class="text-red-700 text-sm mt-1">BEFORE YOU SIGN THE RC, YOU MUST CALL THE DRIVER AND ASK IF THEY ARE STILL DOING THIS LOAD. If you sign without calling and a recovery situation is created — you will be penalized. No exceptions.</p></div>
<h3>Types of Brokers You'll Deal With</h3>
<ul>
<li><strong>Large national brokers</strong> — Echo Global, Coyote, TQL, CH Robinson, Worldwide Express. High volume, strict processes, often lower rates. They have portals and carrier compliance requirements.</li>
<li><strong>Mid-size brokers</strong> — Regional players. Often more flexible on rates, faster to set up with.</li>
<li><strong>Small/independent brokers</strong> — Direct access to decision-makers. Can negotiate more freely. Risk: slower payment, verify carefully before first load.</li>
</ul>
<h3>How Brokers Find Carriers (and You Find Them)</h3>
<ul>
<li><strong>Load boards:</strong> Truckstop.com, 123Loadboard — brokers post loads, carriers search and call</li>
<li><strong>Direct outreach:</strong> Brokers email carriers they've worked with before</li>
<li><strong>CARGO ETL:</strong> Our system pulls broker emails automatically — you see their loads on the board</li>
</ul>
<h3>The Broker's Priorities</h3>
<ul>
<li>Cover the load quickly (their shipper has a deadline)</li>
<li>Reliable carrier — no late pickups, no missed deliveries</li>
<li>Minimal drama — no constant calls, no surprise price changes after booking</li>
<li>Documentation on time — signed RC, POD delivered fast</li>
</ul>
<blockquote>The broker who trusts you sends you loads without shopping around. Building that trust is the long-term goal of every broker relationship.</blockquote><figure><img src="/trucks/warehouse.jpg" alt="Call center headset — dispatcher phone equipment" /><figcaption>The headset is a dispatcher's primary tool — most broker communication happens by phone</figcaption></figure>

      <h3>The Communication Golden Rules</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#059669;color:white">
          <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">✅ DO</th>
        </tr>
        <tr style="background:#f0fdf4"><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Update the broker proactively — even if the news is bad</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Provide realistic ETAs, never optimistic guesses</td></tr>
        <tr style="background:#f0fdf4"><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Send updates every 2 hours on long hauls</td></tr>
        <tr><td style="padding:8px">🟢</td><td style="padding:8px">Use professional email templates for every stage</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px">
        <tr style="background:#dc2626;color:white">
          <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">❌ DON'T</th>
        </tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Go silent when there's a problem</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Promise ETAs you can't deliver</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Wait for the broker to call you for updates</td></tr>
        <tr><td style="padding:8px">🔴</td><td style="padding:8px">Blame the driver by name to the broker</td></tr>
      </table>
      <blockquote><strong>💡 Remember:</strong> Even 10+ hour delays can be forgiven if the broker feels constantly informed and your ETA is realistic.</blockquote>`,
      bodyRu: `<h2>Кто такие брокеры и почему важно уметь с ними работать</h2>
<p><strong>Грузовой брокер</strong> — это лицензированный посредник (лицензия Broker Authority от FMCSA), который соединяет грузоотправителей с перевозчиками. Брокеры не владеют траками — они зарабатывают на марже. Для диспетчера брокер — прямой клиент: через него находите грузы и получаете оплату.</p>
<div class="bg-red-50 border-l-4 border-red-500 px-4 py-3 my-4 rounded-r-xl"><p class="font-bold text-red-700 text-sm">⚠️ КРИТИЧЕСКОЕ ПРАВИЛО — ПРОЧИТАЙТЕ ПЕРВЫМ</p><p class="text-red-700 text-sm mt-1">ДО ПОДПИСАНИЯ RC ВЫ ОБЯЗАНЫ ПОЗВОНИТЬ ВОДИТЕЛЮ И УБЕДИТЬСЯ, ЧТО ОН ВЕЗЁТ ЭТОТ ГРУЗ. Если подпишете без звонка и возникнет recovery situation — будет штраф. Без исключений.</p></div>
<h3>Типы брокеров, с которыми вы работаете</h3>
<ul>
<li><strong>Крупные национальные брокеры</strong> — Echo Global, Coyote, TQL, CH Robinson, Worldwide Express. Большой объём, строгие процессы, ставки нередко ниже.</li>
<li><strong>Средние брокеры</strong> — региональные игроки. Гибче в переговорах, быстрее регистрация.</li>
<li><strong>Мелкие/независимые брокеры</strong> — прямой выход на тех, кто принимает решения. Риск: медленная оплата — проверяйте перед первым грузом.</li>
</ul>
<h3>Как брокеры находят перевозчиков (и вы находите их)</h3>
<ul>
<li><strong>Биржи грузов:</strong> Truckstop.com, 123Loadboard</li>
<li><strong>Прямые контакты:</strong> брокеры сами пишут перевозчикам, с которыми работали раньше</li>
<li><strong>CARGO ETL:</strong> система автоматически получает письма брокеров</li>
</ul>
<h3>Приоритеты брокера</h3>
<ul>
<li>Закрыть груз быстро (у грузоотправителя дедлайн)</li>
<li>Надёжный перевозчик — без опозданий и срывов доставки</li>
<li>Минимум проблем — без постоянных звонков и неожиданных изменений цены</li>
<li>Документы вовремя — подписанный RC, быстрая отправка POD</li>
</ul>
<blockquote>Брокер, который вам доверяет, отдаёт груз без поиска альтернатив. Выстроить это доверие — долгосрочная цель каждых брокерских отношений.</blockquote><figure><img src="/trucks/warehouse.jpg" alt="Гарнитура оператора — оборудование диспетчера" /><figcaption>Гарнитура — основной инструмент диспетчера. Большая часть коммуникации с брокерами происходит по телефону</figcaption></figure>

    <h3>Золотые правила коммуникации</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#059669;color:white">
        <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">✅ ДЕЛАЙТЕ</th>
      </tr>
      <tr style="background:#f0fdf4"><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Обновляйте брокера проактивно — даже если новости плохие</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Давайте реалистичные ETA, никогда оптимистичные</td></tr>
      <tr style="background:#f0fdf4"><td style="padding:8px;border-bottom:1px solid #bbf7d0">🟢</td><td style="padding:8px;border-bottom:1px solid #bbf7d0">Обновления каждые 2 часа на длинных рейсах</td></tr>
      <tr><td style="padding:8px">🟢</td><td style="padding:8px">Используйте шаблоны email на каждом этапе</td></tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin:0 0 16px 0;font-size:14px">
      <tr style="background:#dc2626;color:white">
        <th style="padding:10px;text-align:center;border-radius:8px 8px 0 0" colspan="2">❌ НЕ ДЕЛАЙТЕ</th>
      </tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Замолкать при проблемах</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Обещать нереальные ETA</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #fecaca">🔴</td><td style="padding:8px;border-bottom:1px solid #fecaca">Ждать пока брокер позвонит за обновлением</td></tr>
      <tr><td style="padding:8px">🔴</td><td style="padding:8px">Называть водителя по имени брокеру</td></tr>
    </table>
    <blockquote><strong>💡 Помните:</strong> Даже 10+ часовые задержки прощаются, если брокер постоянно в курсе, а ваш ETA реалистичен.</blockquote>`,
      quiz: {
        questions: [
          { id: '6-1-q1', text: "What MUST you do before signing the RC?", options: ["Check the rate matches what you negotiated", "Call the driver and confirm they are still doing this load", "Send the RC to the broker for review", "Create the load in Cargo ETL"], correctIndex: 1 },
          { id: '6-1-q2', text: "What happens if you sign the RC without calling the driver first and they can't go?", options: ["Nothing — you simply cancel the load", "You create a recovery situation and will be penalized", "The broker automatically finds another carrier", "You get a warning but no penalty on the first offense"], correctIndex: 1 },
          { id: '6-1-q3', text: "What is the broker's top priority when posting a load?", options: ["Finding the cheapest carrier on the market", "Maximizing their profit margin on every load", "Covering the load quickly with a reliable carrier who delivers without issues", "Building a relationship with the dispatcher"], correctIndex: 2 },
          { id: '6-1-q4', text: "Which system automatically pulls broker emails and shows loads in real time?", options: ["load board", "Truckstop.com", "CARGO ETL", "Gmail directly"], correctIndex: 2 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-1-q1-ru', text: "Что вы ОБЯЗАНЫ сделать до подписания RC?", options: ["Проверить, что ставка совпадает с согласованной", "Позвонить водителю и убедиться, что он везёт этот груз", "Отправить RC брокеру на проверку", "Создать груз в Cargo ETL"], correctIndex: 1 },
          { id: '6-1-q2-ru', text: "Что произойдёт, если подписать RC без звонка водителю, а он не сможет ехать?", options: ["Ничего — просто отменяете груз", "Создаётся recovery situation и будет штраф", "Брокер автоматически найдёт другого перевозчика", "Получите предупреждение, но без штрафа в первый раз"], correctIndex: 1 },
          { id: '6-1-q3-ru', text: "Главный приоритет брокера при размещении груза?", options: ["Найти самого дешёвого перевозчика", "Максимизировать свою маржу", "Быстро закрыть груз надёжным перевозчиком, который доставит без проблем", "Выстроить отношения с диспетчером"], correctIndex: 2 },
          { id: '6-1-q4-ru', text: "Какая система автоматически получает письма брокеров и показывает грузы в реальном времени?", options: ["Load board", "Truckstop.com", "CARGO ETL", "Gmail напрямую"], correctIndex: 2 },
        ],
      },
    },

    '6-2': {
      type: 'text',
      body: `<h2>Full Load Workflow: From Bid to Delivery</h2>
<h3>Phase 1 — Bidding and Booking</h3>
<ol>
<li>Place a bid on a load.</li>
<li>Receive confirmation from the broker. Phrases like <strong>"Send it over"</strong> mean the load is booked.</li>
<li>Immediately provide driver info: <strong>driver's name and phone number</strong>.</li>
<li>Tell the broker you are <strong>"standing by for the RC"</strong>.</li>
<li>Receive the email from the broker with the RC, BOL, and any notes.</li>
</ol>
<div class="bg-red-50 border-l-4 border-red-500 px-4 py-3 my-4 rounded-r-xl"><p class="font-bold text-red-700 text-sm">⚠️ Before signing the RC: CALL THE DRIVER. Confirm they are doing this load. No exceptions.</p></div>
<h3>Phase 2 — Broker Setup (if not set up yet)</h3>
<ol start="6">
<li>Identify the setup type: online portal (Highway, MyCarrierPackets) or PDF contract.</li>
<li><strong>PDF contract:</strong> dispatcher can sign immediately.</li>
<li><strong>Online portal:</strong> contact your operations manager in chat (or call if offline). Send them the broker's setup link. Also forward the setup email to <strong>info.shiftline@gmail.com</strong>.</li>
</ol>
<p><strong>Setup email template to send the broker:</strong></p>
<blockquote>Dear [Broker's representative name],<br/><br/>We would be happy to complete the carrier setup so we can work together on future shipments. We look forward to establishing a working relationship.<br/><br/>Attached is the setup package.<br/><br/>Best regards,<br/>[Your name]</blockquote>
<p>⚠️ If the broker asks for the truck's VIN — provide the <strong>Highway VIN</strong>, not the real VIN. Ask in chat if unsure.</p>
<h3>Phase 3 — RC Signing and Cargo ETL</h3>
<ol start="9">
<li><strong>Sign the RC</strong> using <strong>sejda.com/pdf-editor</strong> — the company standard tool for digital signatures.</li>
<li><strong>Create the load in Cargo ETL:</strong> open Cargo ETL → Bids → open your bid → click <strong>"Accept"</strong>.</li>
<li>In the Orders tab: verify origin, destination, driver pay, and broker pay.</li>
<li>Send the broker: driver's name, unit number, and phone number.</li>
<li>Upload the signed RC into Cargo ETL.</li>
</ol>
<h3>Phase 4 — Pickup</h3>
<ol start="14">
<li>Inform the broker how far the driver is: <em>"30-35 minutes away."</em></li>
<li>When the driver arrives: message the broker <strong>"The unit is on site."</strong></li>
<li>Wait for the driver to be loaded.</li>
<li>Once loaded: driver sends you cargo photos and the BOL. Forward them to the broker.</li>
<li>Ask the broker for <strong>"Good to go"</strong> before the driver leaves the facility.</li>
</ol>
<h3>Phase 5 — Transit</h3>
<ol start="19">
<li>Monitor tracking via the order page in Cargo ETL.</li>
<li>On long hauls (1,000+ miles): send broker updates <strong>every 2 hours</strong>.</li>
<li>Update format: <em>if moving</em> — current location + <strong>"Rolling"</strong>. <em>If stopped</em> — location + reason (e.g., "Unit stopped for a quick snack and gas").</li>
</ol>
<h3>Phase 6 — Delivery and Closeout</h3>
<ol start="22">
<li>When driver arrives: message the broker <strong>"The unit is on site."</strong></li>
<li>Once unloaded: driver sends POD photo. <strong>POD is mandatory — without it, payment will not be received.</strong></li>
<li>Forward POD and unloading photos to the broker.</li>
<li>Wait for broker's <strong>"Good to go"</strong> signal.</li>
<li>Release the driver.</li>
</ol><h3>📧 Complete Email Template Sequence</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:8px;text-align:left;border-radius:8px 0 0 0">Stage</th>
          <th style="padding:8px;text-align:left;border-radius:0 8px 0 0">Template</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📌 Book It</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver info: [Name], [Phone]"</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">✍️ RC Signed</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Signed RC attached. Added my team, please reply all"</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚀 Sending Driver</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"ETA [time]. I will keep you posted"</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 PU Arrived</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver arrived at pick up. Will let you know once loaded"</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📦 PU Loaded</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver loaded. BOL attached. Can we roll to delivery?"</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🛣️ Departed (G2G)</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver headed to delivery. ETA [time]. I will keep you posted"</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 DEL Arrived</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver arrived at delivery. POD as soon as I get it"</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">✅ DEL Unloaded</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver unloaded. POD attached. Signed by: [name]. Can we release?"</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-radius:0 0 8px 8px">🤝 Thank You</td><td style="padding:8px;border-radius:0 0 8px 8px">"We appreciate you selecting our business. Happy to work more!"</td></tr>
      </table>
      <blockquote><strong>💡 Pro Tip:</strong> Save these as email templates in your client. One-click sending saves 5+ minutes per load — that adds up to hours per week.</blockquote>

      <figure><img src="/wikimedia/Person_writing_in_notebook_while_using_laptop.jpg" alt="Dispatcher at workstation managing emails" /><figcaption>Organized email workflow — the key to professional broker relationships</figcaption></figure>`,
      bodyRu: `<h2>Полный рабочий процесс: от ставки до доставки</h2>
<h3>Фаза 1 — Ставка и бронирование</h3>
<ol>
<li>Делаете ставку на груз.</li>
<li>Получаете подтверждение от брокера. Фразы типа <strong>"Send it over"</strong> означают, что груз забронирован.</li>
<li>Немедленно предоставляете данные водителя: <strong>имя и номер телефона</strong>.</li>
<li>Сообщаете брокеру, что <strong>"standing by for the RC"</strong>.</li>
<li>Получаете письмо от брокера с RC, BOL и инструкциями.</li>
</ol>
<div class="bg-red-50 border-l-4 border-red-500 px-4 py-3 my-4 rounded-r-xl"><p class="font-bold text-red-700 text-sm">⚠️ До подписания RC: ПОЗВОНИТЕ ВОДИТЕЛЮ. Убедитесь, что он везёт этот груз. Без исключений.</p></div>
<h3>Фаза 2 — Регистрация у брокера (если не зарегистрированы)</h3>
<ol start="6">
<li>Определите тип регистрации: онлайн-портал (Highway, MyCarrierPackets) или PDF-контракт.</li>
<li><strong>PDF-контракт:</strong> диспетчер может подписать сразу.</li>
<li><strong>Онлайн-портал:</strong> свяжитесь с менеджером операций в чате (позвоните если нет онлайн). Отправьте ссылку на регистрацию. Также перешлите письмо о регистрации на <strong>info.shiftline@gmail.com</strong>.</li>
</ol>
<p><strong>Шаблон письма брокеру для регистрации:</strong></p>
<blockquote>Dear [Broker's representative name],<br/><br/>We would be happy to complete the carrier setup so we can work together on future shipments. We look forward to establishing a working relationship.<br/><br/>Attached is the setup package.<br/><br/>Best regards,<br/>[Ваше имя]</blockquote>
<p>⚠️ Если брокер просит VIN трака — указывайте <strong>Highway VIN</strong>, не настоящий VIN. Уточните в чате если не знаете.</p>
<h3>Фаза 3 — Подписание RC и Cargo ETL</h3>
<ol start="9">
<li><strong>Подпишите RC</strong> через <strong>sejda.com/pdf-editor</strong> — стандартный инструмент компании.</li>
<li><strong>Создайте груз в Cargo ETL:</strong> откройте Cargo ETL → Bids → откройте вашу ставку → нажмите <strong>"Accept"</strong>.</li>
<li>Во вкладке Orders: проверьте или введите origin, destination, driver pay, broker pay.</li>
<li>Отправьте брокеру: имя водителя, номер трака, телефон.</li>
<li>Загрузите подписанный RC в Cargo ETL.</li>
</ol>
<h3>Фаза 4 — Загрузка</h3>
<ol start="14">
<li>Сообщите брокеру, как далеко водитель: <em>"30-35 минут."</em></li>
<li>Когда водитель прибыл: напишите брокеру <strong>"The unit is on site."</strong></li>
<li>Ожидайте загрузки водителя.</li>
<li>После загрузки: водитель присылает фото груза и BOL. Перешлите брокеру.</li>
<li>Запросите у брокера <strong>"Good to go"</strong> перед отъездом водителя.</li>
</ol>
<h3>Фаза 5 — В пути</h3>
<ol start="19">
<li>Отслеживайте через страницу заказа в Cargo ETL.</li>
<li>На дальних рейсах (1000+ миль): отправляйте обновления брокеру <strong>каждые 2 часа</strong>.</li>
<li>Формат: <em>едет</em> — текущее местоположение + <strong>"Rolling"</strong>. <em>Стоит</em> — местоположение + причина.</li>
</ol>
<h3>Фаза 6 — Доставка и закрытие</h3>
<ol start="22">
<li>Когда водитель прибыл: напишите брокеру <strong>"The unit is on site."</strong></li>
<li>После выгрузки: водитель присылает фото POD. <strong>POD обязателен — без него не будет оплаты.</strong></li>
<li>Перешлите POD и фото выгрузки брокеру.</li>
<li>Дождитесь <strong>"Good to go"</strong> от брокера.</li>
<li>Отпустите водителя.</li>
</ol><h3>📧 Полная последовательность email-шаблонов</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:8px;text-align:left;border-radius:8px 0 0 0">Этап</th>
        <th style="padding:8px;text-align:left;border-radius:0 8px 0 0">Шаблон</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📌 Бронирование</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver info: [Имя], [Телефон]"</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">✍️ RC подписан</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Signed RC attached. Added my team, please reply all"</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚀 Отправка</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"ETA [время]. I will keep you posted"</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 Прибыл на PU</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver arrived at pick up. Will let you know once loaded"</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📦 Загружен</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver loaded. BOL attached. Can we roll to delivery?"</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🛣️ Выехал (G2G)</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver headed to delivery. ETA [время]"</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 Прибыл на DEL</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver arrived at delivery. POD as soon as I get it"</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">✅ Разгружен</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">"Driver unloaded. POD attached. Signed by: [имя]. Can we release?"</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-radius:0 0 8px 8px">🤝 Благодарность</td><td style="padding:8px;border-radius:0 0 8px 8px">"We appreciate you selecting our business. Happy to work more!"</td></tr>
    </table>
    <blockquote><strong>💡 Совет:</strong> Сохраните шаблоны в email-клиенте. Отправка в один клик экономит 5+ минут на рейс — за неделю это часы.</blockquote>

    <figure><img src="/wikimedia/Person_writing_in_notebook_while_using_laptop.jpg" alt="Диспетчер управляет email за рабочим столом" /><figcaption>Организованный email-процесс — ключ к профессиональным отношениям с брокерами</figcaption></figure>`,
      quiz: {
        questions: [
          { id: '6-2-q1', text: "Broker says \"Send it over!\" What do you do immediately?", options: ["Say \"Standing by for the RC\" and wait", "Provide driver name and phone number, then say \"standing by for the RC\"", "Sign the RC and create the load in Cargo ETL", "Call the operations manager to inform them"], correctIndex: 1 },
          { id: '6-2-q2', text: "The broker sends an online portal link for carrier setup. What is the correct action?", options: ["Sign up on the portal yourself immediately", "Contact your operations manager and forward the portal link", "Tell the broker you'll handle it after delivery", "Skip setup — forward your MC number by email"], correctIndex: 1 },
          { id: '6-2-q3', text: "Which tool does the company use to sign the RC digitally?", options: ["DocuSign", "Adobe Acrobat", "sejda.com/pdf-editor", "HelloSign"], correctIndex: 2 },
          { id: '6-2-q4', text: "What must happen before the driver can leave the pickup facility?", options: ["Driver sends the POD photo", "You receive broker's \"Good to go\" after sending cargo photos and BOL", "You upload the signed RC to Cargo ETL", "Driver signs the Rate Confirmation"], correctIndex: 1 },
          { id: '6-2-q5', text: "How often must you send broker updates on a 1,000-mile haul?", options: ["Every 30 minutes", "Once at pickup and once at delivery", "Every 2 hours", "Only when the broker asks"], correctIndex: 2 },
          { id: '6-2-q6', text: "The broker asks for the truck's VIN. What VIN do you provide?", options: ["The real VIN from the truck's registration", "The Highway VIN — ask in chat if unsure", "Any VIN from a similar truck model", "Tell the broker VIN is confidential"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-2-q1-ru', text: "Брокер говорит \"Send it over!\" Что делаете немедленно?", options: ["Говорите \"Standing by for the RC\" и ждёте", "Предоставляете имя и телефон водителя, затем сообщаете что ждёте RC", "Подписываете RC и создаёте груз в Cargo ETL", "Звоните менеджеру операций сообщить о грузе"], correctIndex: 1 },
          { id: '6-2-q2-ru', text: "Брокер прислал ссылку на онлайн-портал для регистрации. Правильное действие?", options: ["Самостоятельно регистрируетесь на портале", "Связываетесь с менеджером операций и пересылаете ссылку", "Скажете брокеру, что займётесь после доставки", "Пропускаете портал — присылаете MC номер по email"], correctIndex: 1 },
          { id: '6-2-q3-ru', text: "Какой инструмент использует компания для цифровой подписи RC?", options: ["DocuSign", "Adobe Acrobat", "sejda.com/pdf-editor", "HelloSign"], correctIndex: 2 },
          { id: '6-2-q4-ru', text: "Что должно произойти до того, как водитель покинет место загрузки?", options: ["Водитель присылает фото POD", "Вы получаете \"Good to go\" от брокера после отправки фото груза и BOL", "Вы загружаете подписанный RC в Cargo ETL", "Водитель подписывает Rate Confirmation"], correctIndex: 1 },
          { id: '6-2-q5-ru', text: "Как часто нужно отправлять обновления брокеру на рейсе 1000 миль?", options: ["Каждые 30 минут", "Один раз при загрузке и один при доставке", "Каждые 2 часа", "Только когда брокер сам спрашивает"], correctIndex: 2 },
          { id: '6-2-q6-ru', text: "Брокер просит VIN трака. Какой VIN предоставляете?", options: ["Настоящий VIN из регистрации трака", "Highway VIN — уточните в чате если не знаете", "Любой VIN от аналогичной модели трака", "Говорите брокеру что VIN конфиденциален"], correctIndex: 1 },
        ],
      },
    },

    '6-3': {
      type: 'text',
      brokerCall: true,
      body: `<h2>Demo: Broker Communication in Practice</h2>
<p>This lesson walks you through the key communication moments of a real load — from booking to delivery. Each phase has a specific phrase or action that is standard in the industry.</p>
<h3>Key Phrases You Must Know</h3>
<ul>
<li><strong>"Send it over"</strong> — broker's confirmation that the load is yours. Respond immediately with driver info.</li>
<li><strong>"Standing by for the RC"</strong> — your confirmation that you're ready to receive and sign the Rate Confirmation.</li>
<li><strong>"The unit is on site"</strong> — standard arrival notification. Use at pickup AND delivery.</li>
<li><strong>"Good to go"</strong> — broker's clearance. Never let the driver leave without it.</li>
<li><strong>"Rolling"</strong> — transit update. Send with current location every 2 hours on long hauls.</li>
</ul>
<h3>The Setup Email Template</h3>
<p>When a broker is not set up with your company, use this exact template:</p>
<blockquote>Dear [Broker's representative name],<br/><br/>We would be happy to complete the carrier setup so we can work together on future shipments. We look forward to establishing a working relationship.<br/><br/>Attached is the setup package.<br/><br/>Best regards,<br/>[Your name]</blockquote>
<h3>How to Sign the RC</h3>
<p>Go to <strong>sejda.com/pdf-editor</strong> → upload the RC PDF → add your signature → download → send back to the broker.</p>
<h3>Practice: Broker Communication Simulation</h3>
<p>Go through all 9 steps of a real load — from the moment the broker says "Send it over" to the final POD delivery. Choose the correct action at each step.</p>`,
      bodyRu: `<h2>Демо: Общение с брокером на практике</h2>
<p>Этот урок проводит вас через ключевые моменты коммуникации в реальном грузе — от бронирования до доставки. На каждом этапе есть конкретная фраза или действие, которое является стандартом в индустрии.</p>
<h3>Ключевые фразы, которые нужно знать</h3>
<ul>
<li><strong>"Send it over"</strong> — подтверждение брокера, что груз ваш. Немедленно ответьте данными водителя.</li>
<li><strong>"Standing by for the RC"</strong> — ваше подтверждение готовности получить и подписать RC.</li>
<li><strong>"The unit is on site"</strong> — стандартное уведомление о прибытии. Используйте при загрузке И при доставке.</li>
<li><strong>"Good to go"</strong> — разрешение брокера. Никогда не отпускайте водителя без него.</li>
<li><strong>"Rolling"</strong> — обновление в пути. Отправляйте с текущей позицией каждые 2 часа на дальних рейсах.</li>
</ul>
<h3>Шаблон письма для регистрации</h3>
<p>Когда брокер не зарегистрировал вашу компанию, используйте этот точный шаблон:</p>
<blockquote>Dear [Broker's representative name],<br/><br/>We would be happy to complete the carrier setup so we can work together on future shipments. We look forward to establishing a working relationship.<br/><br/>Attached is the setup package.<br/><br/>Best regards,<br/>[Ваше имя]</blockquote>
<h3>Как подписать RC</h3>
<p>Перейдите на <strong>sejda.com/pdf-editor</strong> → загрузите PDF RC → добавьте подпись → скачайте → отправьте брокеру.</p>
<h3>Практика: Симуляция общения с брокером</h3>
<p>Пройдите все 9 шагов реального груза — с момента, когда брокер говорит "Send it over", до финальной отправки POD. Выбирайте правильное действие на каждом шаге.</p>`,
      phoneCall: true,
      quiz: {
        questions: [
          { id: '6-3-q1', text: "Broker says \"Send it over.\" What is your immediate next message?", options: ["\"Standing by for the RC.\"", "Driver name and phone number, then \"standing by for the RC.\"", "\"Great, I'll have the RC signed in 10 minutes.\"", "\"Can you confirm the rate one more time?\""], correctIndex: 1 },
          { id: '6-3-q2', text: "Driver arrived at the pickup warehouse. What do you message the broker?", options: ["\"Driver is at the warehouse.\"", "\"My driver just pulled up.\"", "\"The unit is on site.\"", "\"ETA: arrived.\""], correctIndex: 2 },
          { id: '6-3-q3', text: "It's been 2 hours since your last update on a 900-mile haul. Driver is moving. What do you send?", options: ["\"All good, driver is rolling.\"", "\"Update on load #[X]: current location — [City, State]. Status: Rolling.\"", "\"Driver is on the way, no issues.\"", "Nothing — wait for the broker to ask"], correctIndex: 1 },
          { id: '6-3-q4', text: "Driver is loaded and ready to leave. What must you do before releasing him?", options: ["Tell him to go — the RC is signed, that's enough", "Send cargo photos and BOL to broker and wait for \"Good to go\"", "Upload the signed RC to Cargo ETL", "Call the broker to verbally confirm the load is picked up"], correctIndex: 1 },
          { id: '6-3-q5', text: "Driver delivered and sent you a POD photo. What is the correct sequence?", options: ["Release driver, then send POD when you have time", "Forward POD + unloading photos to broker → wait for \"Good to go\" → release driver", "Send POD to broker and release driver at the same time", "Ask the consignee to send POD directly to the broker"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-3-q1-ru', text: "Брокер говорит \"Send it over.\" Ваше следующее немедленное сообщение?", options: ["\"Standing by for the RC.\"", "Имя и телефон водителя, затем \"standing by for the RC.\"", "\"Отлично, подпишу RC через 10 минут.\"", "\"Можете ещё раз подтвердить ставку?\""], correctIndex: 1 },
          { id: '6-3-q2-ru', text: "Водитель прибыл на склад загрузки. Что пишете брокеру?", options: ["\"Водитель на складе.\"", "\"Мой водитель только что подъехал.\"", "\"The unit is on site.\"", "\"ETA: прибыл.\""], correctIndex: 2 },
          { id: '6-3-q3-ru', text: "Прошло 2 часа с последнего обновления, рейс 900 миль, водитель едет. Что отправляете?", options: ["\"Всё хорошо, водитель едет.\"", "\"Обновление по грузу #[X]: текущая позиция — [Город, Штат]. Статус: Rolling.\"", "\"Водитель в пути, проблем нет.\"", "Ничего — ждёте пока брокер спросит"], correctIndex: 1 },
          { id: '6-3-q4-ru', text: "Водитель загрузился и готов выехать. Что нужно сделать до того, как его отпустить?", options: ["Говорите ехать — RC подписан, этого достаточно", "Отправить фото груза и BOL брокеру и дождаться \"Good to go\"", "Загрузить подписанный RC в Cargo ETL", "Позвонить брокеру и устно подтвердить загрузку"], correctIndex: 1 },
          { id: '6-3-q5-ru', text: "Водитель доставил и прислал фото POD. Правильная последовательность?", options: ["Отпустить водителя, потом отправить POD когда будет время", "Переслать POD + фото выгрузки брокеру → дождаться \"Good to go\" → отпустить водителя", "Отправить POD брокеру и отпустить водителя одновременно", "Попросить получателя отправить POD брокеру напрямую"], correctIndex: 1 },
        ],
      },
    },

    '6-4': {
      type: 'text',
      body: `<h2>Chapter 6 — Final Practice Test: Communication with Brokers</h2>
<p>This test covers broker types, carrier packet setup, Rate Confirmation review and signing, phone and email communication, rate negotiation, and building broker relationships. 20 questions. Pass threshold: 18/20.</p>`,
      bodyRu: `<h2>Глава 6 — Итоговый тест: Общение с брокерами</h2>
<p>Тест охватывает типы брокеров, оформление Carrier Packet, проверку и подписание Rate Confirmation, телефонное и email-общение, переговоры о ставках и построение отношений с брокерами. 20 вопросов. Порог прохождения: 18/20.</p>`,
      quiz: {
        questions: [
          { id: '6-4-q1', text: "What government authority does a freight broker need to legally operate?", options: ["DOT Safety Rating", "FMCSA Broker Authority (MC number with broker designation)", "State transportation license", "ICC permit"], correctIndex: 1 },
          { id: '6-4-q2', text: "What is the primary difference between a broker and a carrier?", options: ["Brokers can haul freight, carriers cannot negotiate rates", "Brokers are intermediaries who don't own trucks; carriers own trucks and physically haul freight", "Brokers set freight rates; carriers enforce payment terms", "There is no legal difference — the terms are interchangeable"], correctIndex: 1 },
          { id: '6-4-q3', text: "Which three documents are always required in a standard Carrier Packet?", options: ["Driver's CDL, truck registration, and route history", "MC Authority, Certificate of Insurance, and W-9", "BOL template, POD form, and Rate Confirmation", "FMCSA inspection report, GPS log, and insurance card"], correctIndex: 1 },
          { id: '6-4-q4', text: "What does NOA stand for and when is it included in a Carrier Packet?", options: ["Notice of Availability — when the truck is ready for dispatch", "Notice of Assignment — when the carrier uses a factoring company for payments", "Notice of Accident — when there was a recent claim on the insurance", "Notice of Authorization — when the driver is new"], correctIndex: 1 },
          { id: '6-4-q5', text: "A broker uses MyCarrierPackets.com. What should you do?", options: ["Tell the broker to switch to email — portals are unreliable", "Upload your carrier documents through the portal link they send you", "Ask the broker to enter your information for you", "Skip the portal and email documents directly — portals are optional"], correctIndex: 1 },
          { id: '6-4-q6', text: "You receive an RC. The pickup address matches but the delivery city is wrong. What do you do?", options: ["Dispatch the driver — city errors get corrected at the warehouse", "Contact the broker immediately to issue a corrected RC before signing or dispatching", "Sign the RC and email the correct delivery address separately", "Have the driver verify the address at pickup"], correctIndex: 1 },
          { id: '6-4-q7', text: "The RC shows \"Net 30\" payment terms. What does this mean?", options: ["Payment is made 30 minutes after delivery", "Payment is made 30 days after all documents (RC + POD) are submitted", "The carrier gets 30% of the rate upfront", "The broker has 30 days to dispute the rate"], correctIndex: 1 },
          { id: '6-4-q8', text: "What is a \"quick pay\" option on an RC?", options: ["A broker service to expedite pickup scheduling", "An option to receive payment faster than Net 30, usually within 2–3 days, for a small fee (1–3%)", "A premium rate for same-day loads", "An automatic payment system that requires no invoice"], correctIndex: 1 },
          { id: '6-4-q9', text: "You verbally agreed to $1,950 with a broker. The RC arrives showing $1,950 with a fuel surcharge of $0.10/mile. You never discussed fuel surcharge. What do you do?", options: ["Accept — fuel surcharge is always a broker bonus", "Call the broker to discuss the surcharge. If you want it removed or adjusted, negotiate before signing.", "Sign and ignore the surcharge line — it won't affect payment", "Add your own surcharge terms in the email when returning the signed RC"], correctIndex: 1 },
          { id: '6-4-q10', text: "What is TONU and when should it appear on an RC?", options: ["Truck On Non-Urgent loads — standard language on all RCs", "Truck Ordered Not Used — agreed payment if the broker cancels after the driver is dispatched", "Total Outstanding Non-payment — a penalty clause for late payment", "Time Of Notified Unloading — estimated unload time"], correctIndex: 1 },
          { id: '6-4-q11', text: "Your truck is 180 miles from the pickup point. How should this affect your rate negotiation?", options: ["It shouldn't — dead miles are the carrier's problem", "Factor dead miles into your rate by adding the cost of positioning to your target", "Always refuse loads more than 100 miles away", "Dead miles are reimbursed automatically by all brokers"], correctIndex: 1 },
          { id: '6-4-q12', text: "A broker offers $1,400. Your minimum is $1,600. You counter at $1,800. They come back at $1,550. What is the correct response?", options: ["Accept $1,550 — you already countered once and can't push further", "Decline — only $1,600 or above is acceptable. Politely walk away.", "Counter again at $1,700 and keep negotiating until they agree", "Accept $1,550 and charge a fuel surcharge separately to make up the difference"], correctIndex: 1 },
          { id: '6-4-q13', text: "Which of the following is the correct way to open a phone call to a broker about a posted load?", options: ["\"Do you have any loads available?\" — keep it open-ended", "\"Hi, this is [Name] from [Carrier], calling about load #[X] from [City A] to [City B] — I have a [truck type] available in [city], ready [date].\"", "\"I saw your load on a load board, what's the rate?\" — brokers appreciate directness", "\"Can you hold that load for me? I'll call back in an hour.\""], correctIndex: 1 },
          { id: '6-4-q14', text: "Mini-case: You booked a load at $2,100. Two hours later the driver tells you he can't make the pickup. You need to find a replacement truck or cancel. What do you do first?", options: ["Cancel with the broker by text — quick and easy", "Immediately call the broker, explain the situation, give a realistic ETA for a solution, and offer options", "Wait until the scheduled pickup time and then notify", "Have the driver call the broker directly"], correctIndex: 1 },
          { id: '6-4-q15', text: "A broker you work with regularly sends you a load but the rate is $300 below market. How do you handle this?", options: ["Take it — loyalty to regular brokers is more important than rate", "Politely decline and explain your current market rate. Offer to take it if they can get closer.", "Take it and complain after delivery", "Block the broker — they clearly don't value your service"], correctIndex: 1 },
          { id: '6-4-q16', text: "What is the fastest digital method to sign and return an RC?", options: ["Print, sign by hand, scan, and email back", "Use a digital signature platform (DocuSign, HelloSign, Adobe Sign) via the link the broker sends", "Type \"I accept\" in an email reply with the RC attached", "Call the broker and give verbal acceptance only"], correctIndex: 1 },
          { id: '6-4-q17', text: "Your driver delivered the load 2 hours ago. The broker emailed asking for the POD. What is the correct response time?", options: ["Within 24 hours — brokers understand drivers need time to rest", "As soon as possible — get the POD from the driver and send to the broker same day", "Within 3–5 business days — standard industry POD timeline", "The broker should request the POD from the consignee directly"], correctIndex: 1 },
          { id: '6-4-q18', text: "What information must you give the driver after signing the RC?", options: ["Only the pickup address and rate", "Pickup address and time, delivery address and window, broker load number, and special instructions", "Just the RC PDF — driver is responsible for reading it", "Broker contact and load number only"], correctIndex: 1 },
          { id: '6-4-q19', text: "Mini-case: A broker you've never worked with before offers a great rate but pays Net 45. What should you consider?", options: ["Always accept great rates regardless of payment terms", "Verify the broker's credit rating on load boards such as Carrier411, check reviews, and factor the 45-day cash flow impact into your decision", "Refuse any broker that isn't Net 30", "Ask for 50% upfront before dispatch"], correctIndex: 1 },
          { id: '6-4-q20', text: "Mini-case: You negotiated $1,750 with a broker. RC arrives with correct rate, correct route, but the equipment says \"Dry Van 53ft\" and your truck is a 26ft Straight. What do you do?", options: ["Sign it — the rate is correct, equipment is close enough", "Call the broker immediately to correct the equipment type before signing. Wrong equipment voids your authority to haul.", "Add a note in the email that your truck is actually 26ft Straight", "Dispatch the driver and correct the paperwork at pickup"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '6-4-q1-ru', text: "Какой государственный документ нужен грузовому брокеру для легальной работы?", options: ["Рейтинг безопасности DOT", "FMCSA Broker Authority (MC номер с обозначением брокера)", "Государственная транспортная лицензия", "Разрешение ICC"], correctIndex: 1 },
          { id: '6-4-q2-ru', text: "В чём принципиальное отличие брокера от перевозчика?", options: ["Брокеры могут перевозить грузы, перевозчики не могут договариваться о ставках", "Брокеры — посредники без траков; перевозчики владеют траками и физически везут груз", "Брокеры устанавливают ставки; перевозчики контролируют условия оплаты", "Юридической разницы нет — термины взаимозаменяемы"], correctIndex: 1 },
          { id: '6-4-q3-ru', text: "Какие три документа всегда входят в стандартный Carrier Packet?", options: ["CDL водителя, регистрация трака и история маршрутов", "MC Authority, Сертификат страхования и W-9", "Шаблон BOL, форма POD и Rate Confirmation", "Отчёт об инспекции FMCSA, GPS-лог и страховая карточка"], correctIndex: 1 },
          { id: '6-4-q4-ru', text: "Что означает NOA и когда он включается в Carrier Packet?", options: ["Notice of Availability — когда трак готов к отправке", "Notice of Assignment — когда перевозчик использует факторинговую компанию для оплат", "Notice of Accident — когда был недавний страховой случай", "Notice of Authorization — когда водитель новый"], correctIndex: 1 },
          { id: '6-4-q5-ru', text: "Брокер использует MyCarrierPackets.com. Что делать?", options: ["Попросить брокера перейти на email — порталы ненадёжны", "Загрузить документы перевозчика через ссылку в присланном портале", "Попросить брокера самому внести ваши данные", "Пропустить портал и отправить документы по email — порталы необязательны"], correctIndex: 1 },
          { id: '6-4-q6-ru', text: "Вы получили RC. Адрес загрузки верный, но город доставки указан неправильно. Что делаете?", options: ["Отправляете водителя — ошибки в городе исправляются на складе", "Немедленно связываетесь с брокером для исправления RC до подписания и отправки водителя", "Подписываете RC и отправляете правильный адрес доставки отдельным письмом", "Просите водителя уточнить адрес при загрузке"], correctIndex: 1 },
          { id: '6-4-q7-ru', text: "В RC указаны условия оплаты \"Net 30\". Что это означает?", options: ["Оплата через 30 минут после доставки", "Оплата через 30 дней после подачи всех документов (RC + POD)", "Перевозчик получает 30% ставки авансом", "У брокера есть 30 дней на оспаривание ставки"], correctIndex: 1 },
          { id: '6-4-q8-ru', text: "Что такое \"quick pay\" в RC?", options: ["Брокерский сервис для ускорения расписания загрузки", "Опция получить оплату быстрее Net 30, обычно в течение 2–3 дней, за небольшую комиссию (1–3%)", "Повышенная ставка для грузов в тот же день", "Автоматическая система оплаты без инвойса"], correctIndex: 1 },
          { id: '6-4-q9-ru', text: "Вы устно согласились на $1 950. RC приходит с $1 950 и надбавкой за топливо $0,10/миля. Надбавку вы не обсуждали. Что делаете?", options: ["Принимаете — надбавка за топливо всегда бонус от брокера", "Звоните брокеру для обсуждения надбавки. Если хотите убрать или изменить — переговоры до подписания.", "Подписываете и игнорируете строку надбавки — на оплату не влияет", "Добавляете свои условия надбавки в письме при возврате подписанного RC"], correctIndex: 1 },
          { id: '6-4-q10-ru', text: "Что такое TONU и когда оно должно быть в RC?", options: ["Truck On Non-Urgent — стандартная формулировка во всех RC", "Truck Ordered Not Used — согласованная выплата, если брокер отменяет груз после отправки водителя", "Total Outstanding Non-payment — штрафная оговорка за просрочку оплаты", "Time Of Notified Unloading — расчётное время выгрузки"], correctIndex: 1 },
          { id: '6-4-q11-ru', text: "Ваш трак в 180 милях от точки загрузки. Как это влияет на переговоры о ставке?", options: ["Никак — пустые мили это проблема перевозчика", "Включите пустые мили в ставку, добавив стоимость позиционирования к вашей цели", "Всегда отказывайтесь от грузов дальше 100 миль", "Пустые мили автоматически компенсируются всеми брокерами"], correctIndex: 1 },
          { id: '6-4-q12-ru', text: "Брокер предлагает $1 400. Ваш минимум $1 600. Вы предлагаете $1 800. Они приходят на $1 550. Правильный ответ?", options: ["Принять $1 550 — вы уже делали контроффер и больше нажимать нельзя", "Отказаться — только $1 600 и выше приемлемо. Вежливо уйти.", "Предложить $1 700 и продолжать торговаться до согласия", "Принять $1 550 и добавить надбавку за топливо отдельно чтобы компенсировать"], correctIndex: 1 },
          { id: '6-4-q13-ru', text: "Правильное начало телефонного звонка брокеру по размещённому грузу?", options: ["\"У вас есть грузы?\" — оставьте открытый вопрос", "\"Hi, this is [Имя] from [Компания], calling about load #[X] from [Город A] to [Город B] — I have a [тип трака] available in [город], ready [дата].\"", "\"Видел ваш груз на load board, какая ставка?\" — брокеры ценят прямоту", "\"Можете придержать этот груз? Перезвоню через час.\""], correctIndex: 1 },
          { id: '6-4-q14-ru', text: "Кейс: Вы забронировали груз за $2 100. Через два часа водитель говорит, что не сможет приехать на загрузку. Нужно найти замену или отменить. Что делаете первым?", options: ["Отменяете у брокера по SMS — быстро и просто", "Немедленно звоните брокеру, объясняете ситуацию, даёте реальный срок решения и предлагаете варианты", "Ждёте запланированного времени загрузки, потом уведомляете", "Пусть водитель сам позвонит брокеру"], correctIndex: 1 },
          { id: '6-4-q15-ru', text: "Постоянный брокер присылает груз с ценой на $300 ниже рынка. Как поступаете?", options: ["Берёте — лояльность к постоянным брокерам важнее ставки", "Вежливо отказываете и объясняете вашу текущую рыночную ставку. Предлагаете взять если смогут приблизиться.", "Берёте и жалуетесь после доставки", "Блокируете брокера — они явно не ценят ваш сервис"], correctIndex: 1 },
          { id: '6-4-q16-ru', text: "Самый быстрый цифровой способ подписать и вернуть RC?", options: ["Распечатать, подписать вручную, отсканировать и отправить по email", "Использовать платформу цифровой подписи (DocuSign, HelloSign, Adobe Sign) по ссылке от брокера", "Написать \"I accept\" в ответном письме с прикреплённым RC", "Позвонить брокеру и дать только устное согласие"], correctIndex: 1 },
          { id: '6-4-q17-ru', text: "Ваш водитель доставил груз 2 часа назад. Брокер написал и просит POD. Какое правильное время ответа?", options: ["В течение 24 часов — брокеры понимают, что водителям нужен отдых", "Как можно скорее — получить POD от водителя и отправить брокеру в тот же день", "В течение 3–5 рабочих дней — стандартный отраслевой срок", "Брокер должен запросить POD у получателя напрямую"], correctIndex: 1 },
          { id: '6-4-q18-ru', text: "Какую информацию нужно передать водителю после подписания RC?", options: ["Только адрес загрузки и ставку", "Адрес и время загрузки, адрес и окно доставки, номер груза брокера и особые инструкции", "Просто PDF RC — водитель сам читает", "Только контакт брокера и номер груза"], correctIndex: 1 },
          { id: '6-4-q19-ru', text: "Кейс: Незнакомый брокер предлагает отличную ставку, но платит Net 45. Что учитываете?", options: ["Всегда берите хорошие ставки, условия оплаты неважны", "Проверьте кредитный рейтинг брокера на load board или Carrier411, отзывы, и оцените влияние 45-дневного кэшфлоу на решение", "Отказывайте всем, кто не платит Net 30", "Просите 50% аванса до отправки водителя"], correctIndex: 1 },
          { id: '6-4-q20-ru', text: "Кейс: Вы согласовали $1 750. RC с правильной ставкой и маршрутом, но тип оборудования — \"Dry Van 53ft\", а ваш трак 26ft Straight. Что делаете?", options: ["Подписываете — ставка верная, оборудование близкое", "Немедленно звоните брокеру исправить тип оборудования до подписания. Неверное оборудование лишает вас права везти груз.", "Добавляете примечание в письме, что ваш трак 26ft Straight", "Отправляете водителя и исправляете документы при загрузке"], correctIndex: 1 },
        ],
      },
    },

    '7-1': {
      type: 'text',
      body: `<h2>The Dispatcher-Driver Relationship</h2>
<p>The driver is your hands on the ground. No matter how well you book a load, the outcome depends entirely on how well you communicate with your driver. A dispatcher who gives clear instructions, responds fast, and handles problems calmly builds drivers who trust them — and trust leads to fewer issues.</p>
<h3>Types of Drivers You Work With</h3>
<ul>
<li><strong>Company drivers</strong> — employed by the carrier. More predictable schedules, set pay rates.</li>
<li><strong>Owner-operators</strong> — own their truck, work independently. More flexible, but pricing decisions go through the owner, not always the driver.</li>
</ul>
<h3>Communication Channels</h3>
<ul>
<li><strong>Phone call</strong> — urgent issues, breakdowns, disputes at pickup/delivery, anything that needs immediate resolution</li>
<li><strong>Text / WhatsApp / Telegram</strong> — address details, ETA confirmations, document photo requests, routine updates</li>
</ul>
<blockquote>Rule of thumb: if something can go wrong or needs a quick decision — call. If it's information transfer — text.</blockquote>
<h3>What Good Driver Communication Looks Like</h3>
<ul>
<li>Give complete dispatch info in one message — driver shouldn't have to ask follow-up questions</li>
<li>Respond quickly when driver calls — they're often in a time-sensitive situation</li>
<li>Don't wait for the driver to report problems — check in proactively on long hauls</li>
<li>Never yell or pressure the driver — a stressed driver makes more mistakes</li>
</ul><figure><img src="/wikimedia/The_Driver_(23143217816).jpg" alt="Truck driver — your key business partner" /><figcaption>The truck driver — your primary partner. Building trust means building revenue.</figcaption></figure>

      <h3>Driver Earnings — Quick Reference</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Truck Type</th>
          <th style="padding:10px;text-align:center">Avg Daily</th>
          <th style="padding:10px;text-align:center">Payment</th>
          <th style="padding:10px;text-align:center;border-radius:0 8px 0 0">QuickPay</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚐 Cargo Van</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">$400–$700</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">Weekly (Friday)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">5% commission</td></tr>
        <tr><td style="padding:8px">🚚 Box Truck</td><td style="padding:8px;text-align:center">$600–$900</td><td style="padding:8px;text-align:center">Weekly (Friday)</td><td style="padding:8px;text-align:center">5% commission</td></tr>
      </table>

      <h3>First Contact Script</h3>
      <blockquote><strong>📞 New Driver Introduction:</strong><br/>"Hello! It's [Name] with [Company]. You've been approved in our system so we can start working together! I'll be your dispatcher — save this number and contact me with any questions."<br/><br/><strong>Then ask:</strong><br/>• Truck dimensions (L×W×H) + door dimensions<br/>• Load preferences (local / regional / OTR)<br/>• Equipment: LG, PJ, ramps, dolly, PPE?<br/>• TWIC card? HAZMAT endorsement?<br/>• Ready for work today?</blockquote>`,
      bodyRu: `<h2>Отношения диспетчера и водителя</h2>
<p>Водитель — ваши руки на земле. Как бы хорошо вы ни забронировали груз, результат полностью зависит от качества вашего общения с водителем. Диспетчер, который даёт чёткие инструкции, быстро отвечает и спокойно решает проблемы, получает доверие водителей — а доверие означает меньше проблем.</p>
<h3>Типы водителей, с которыми вы работаете</h3>
<ul>
<li><strong>Штатные водители</strong> — наняты перевозчиком. Предсказуемый график, фиксированные ставки оплаты.</li>
<li><strong>Owner-operators</strong> — владеют своим траком, работают самостоятельно. Гибче, но ценовые решения принимает оунер, не всегда водитель.</li>
</ul>
<h3>Каналы общения</h3>
<ul>
<li><strong>Звонок</strong> — срочные вопросы, поломки, споры на загрузке/выгрузке, всё что требует немедленного решения</li>
<li><strong>SMS / WhatsApp / Telegram</strong> — детали адреса, подтверждение ETA, запрос фото документов, плановые обновления</li>
</ul>
<blockquote>Правило: если что-то может пойти не так или нужно быстрое решение — звоните. Если нужно передать информацию — пишите.</blockquote>
<h3>Как выглядит хорошее общение с водителем</h3>
<ul>
<li>Давайте полную информацию о грузе в одном сообщении — водитель не должен задавать уточняющие вопросы</li>
<li>Отвечайте быстро на звонки водителя — он часто в ситуации, требующей срочного решения</li>
<li>Не ждите пока водитель сообщит о проблемах — проактивно проверяйте на длинных рейсах</li>
<li>Никогда не кричите и не давите на водителя — стрессованный водитель делает больше ошибок</li>
</ul><figure><img src="/wikimedia/The_Driver_(23143217816).jpg" alt="Водитель грузовика — ваш ключевой партнёр" /><figcaption>Водитель — ваш основной партнёр. Построение доверия = построение дохода.</figcaption></figure>

    <h3>Заработок водителей — справочник</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Тип грузовика</th>
        <th style="padding:10px;text-align:center">Ср. в день</th>
        <th style="padding:10px;text-align:center">Оплата</th>
        <th style="padding:10px;text-align:center;border-radius:0 8px 0 0">QuickPay</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚐 Cargo Van</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">$400–$700</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">Еженедельно (пт)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0">Комиссия 5%</td></tr>
      <tr><td style="padding:8px">🚚 Box Truck</td><td style="padding:8px;text-align:center">$600–$900</td><td style="padding:8px;text-align:center">Еженедельно (пт)</td><td style="padding:8px;text-align:center">Комиссия 5%</td></tr>
    </table>

    <h3>Скрипт первого контакта</h3>
    <blockquote><strong>📞 Знакомство с водителем:</strong><br/>"Hello! It's [Имя] with [Компания]. You've been approved in our system so we can start working together! I'll be your dispatcher — save this number and contact me with any questions."<br/><br/><strong>Затем спросите:</strong><br/>• Габариты кузова (Д×Ш×В) + размеры двери<br/>• Предпочтения: локальные / региональные / OTR<br/>• Оборудование: LG, PJ, пандусы, долли, PPE?<br/>• Карта TWIC? Сертификат HAZMAT?<br/>• Готов к работе сегодня?</blockquote>`,
      quiz: {
        questions: [
          { id: '7-1-q1', text: "When should you call a driver instead of texting?", options: ["Always — calls are more professional", "For urgent issues: breakdowns, pickup disputes, anything needing immediate resolution", "Only for long-haul loads over 500 miles", "Only after delivery is complete"], correctIndex: 1 },
          { id: '7-1-q2', text: "What is the difference between a company driver and an owner-operator?", options: ["Company drivers own their truck; owner-operators are employed", "Company drivers are employed by the carrier; owner-operators own their truck and work independently", "Owner-operators only do local deliveries; company drivers do long haul", "There is no practical difference for the dispatcher"], correctIndex: 1 },
          { id: '7-1-q3', text: "What does good dispatch communication include?", options: ["Only the pickup address — driver figures out the rest", "Complete info in one message: load number, pickup address + time, delivery address + window, broker name", "A PDF of the RC and a verbal \"good luck\"", "A phone call every 30 minutes to check status"], correctIndex: 1 },
          { id: '7-1-q4', text: "Why should you never yell or pressure a driver?", options: ["It's against company policy", "A stressed driver makes more mistakes — calm communication leads to better outcomes", "Drivers can report you to FMCSA", "It wastes time on the phone"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '7-1-q1-ru', text: "Когда нужно звонить водителю вместо SMS?", options: ["Всегда — звонки профессиональнее", "В срочных ситуациях: поломка, споры на загрузке, всё что требует немедленного решения", "Только для дальних рейсов свыше 500 миль", "Только после завершения доставки"], correctIndex: 1 },
          { id: '7-1-q2-ru', text: "В чём разница между штатным водителем и owner-operator?", options: ["Штатные водители владеют траком; owner-operators наняты", "Штатные водители наняты перевозчиком; owner-operators владеют своим траком и работают самостоятельно", "Owner-operators только местные доставки; штатные — дальний рейс", "Для диспетчера практической разницы нет"], correctIndex: 1 },
          { id: '7-1-q3-ru', text: "Что включает хорошее отправление водителя?", options: ["Только адрес загрузки — дальше сам разберётся", "Полная информация в одном сообщении: номер груза, адрес + время загрузки, адрес + окно выгрузки, брокер", "PDF RC и устное \"удачи\"", "Звонок каждые 30 минут для проверки статуса"], correctIndex: 1 },
          { id: '7-1-q4-ru', text: "Почему нельзя кричать или давить на водителя?", options: ["Это нарушение политики компании", "Стрессованный водитель делает больше ошибок — спокойное общение даёт лучший результат", "Водители могут пожаловаться в FMCSA", "Это трата времени на звонки"], correctIndex: 1 },
        ],
      },
    },

    '7-2': {
      type: 'text',
      body: `<h2>Driver Communication at Every Stage of the Load</h2>
<h3>Stage 1 — Dispatching</h3>
<p>When you dispatch a driver, give everything in one message:</p>
<ul>
<li>Load number (broker's reference)</li>
<li>Pickup address + appointment time</li>
<li>Delivery address + delivery window</li>
<li>Broker company name</li>
<li>Any special instructions (appointment required, dock level, team required, hazmat, etc.)</li>
</ul>
<h3>Stage 2 — Pre-Pickup Check</h3>
<p>1–2 hours before pickup, confirm with driver: ETA, any issues, truck is ready. If driver will be late — notify broker immediately with new ETA and reason.</p>
<h3>Stage 3 — At Pickup</h3>
<ul>
<li>Driver arrives → he calls you → you message broker: <strong>"The unit is on site."</strong></li>
<li>If warehouse won't accept driver (no appointment, wrong address) → driver stays, you call broker immediately.</li>
<li>After loading: driver sends <strong>cargo photos + BOL photo</strong> → you forward to broker → broker gives <strong>"Good to go"</strong> → driver leaves.</li>
</ul>
<h3>Detention</h3>
<p>If driver waits more than 2 hours past appointment at pickup or delivery:</p>
<ol>
<li>Document exact arrival time (screenshot or note)</li>
<li>Notify broker in real time — do not wait until after the load</li>
<li>Request broker's written confirmation of detention pay</li>
<li>Tell driver to document his wait time as well</li>
</ol>
<h3>Stage 4 — Transit</h3>
<ul>
<li>Check in on long hauls (1,000+ miles) every few hours</li>
<li>Send broker updates every 2 hours: <strong>current location + "Rolling"</strong></li>
<li>If driver is stopped: location + reason</li>
</ul>
<h3>Handling Breakdowns</h3>
<ol>
<li>Driver confirms safety (hazards on, safe location)</li>
<li>Get exact location (mile marker, nearest exit, city)</li>
<li>Notify broker immediately with ETA impact</li>
<li>Coordinate roadside assistance</li>
<li>Keep broker updated until resolved</li>
</ol>
<h3>Stage 5 — At Delivery</h3>
<ul>
<li>Driver arrives → message broker: <strong>"The unit is on site."</strong></li>
<li>If consignee refuses freight → driver does NOT unload, you call broker immediately</li>
<li>After unloading: driver gets <strong>BOL signed by consignee</strong> → photo → that's your <strong>POD</strong></li>
<li>Forward POD to broker → wait for <strong>"Good to go"</strong> → release driver</li>
</ul>
<blockquote>Without POD — no payment. This is the most critical document at the end of every load.</blockquote><h3>📞 Load Offer Call Script (30 seconds)</h3>
      <blockquote><strong>English version:</strong><br/>"Hello, it's [Sam] with [Trucking Express]. I see a load from Mosinee, Wisconsin going to Columbia City, Indiana. Pickup as soon as possible, delivery Friday morning. It's about 14 miles from you and 412 loaded miles, 3 pieces, thirty-four hundred pounds. It also requires PPE. What do you think?"</blockquote>

      <h3>Driver Action Checklist</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Stage</th>
          <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Driver Must Do</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 At Pickup</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">1. Notify arrival → 2. Send BOL + cargo photos → 3. Wait for dispatcher OK</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🛣️ In Transit</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Keep GPS on "Always" → Respond to check calls → Report delays immediately</td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px">📦 At Delivery</td><td style="padding:8px">1. Notify arrival → 2. Send signed POD photo → 3. Wait for release</td></tr>
      </table>

      <figure><img src="/wikimedia/Bakersfield_Truck_Peterbilt.jpg" alt="Truck fleet at Flying J Travel Plaza" /><figcaption>A fleet at a truck stop — managing multiple drivers means managing multiple conversations simultaneously</figcaption></figure>

      <blockquote><strong>⚠️ When the driver doesn't know their rate:</strong><br/>"We don't have any target for this load — tell me your usual rate and I will try to get this for you."</blockquote>`,
      bodyRu: `<h2>Общение с водителем на каждом этапе груза</h2>
<h3>Этап 1 — Отправка водителя</h3>
<p>При отправке давайте всё в одном сообщении:</p>
<ul>
<li>Номер груза (номер брокера)</li>
<li>Адрес загрузки + время аппойнтмента</li>
<li>Адрес выгрузки + окно доставки</li>
<li>Название компании брокера</li>
<li>Особые инструкции (нужен аппойнтмент, dock level, тандем, опасный груз и т.д.)</li>
</ul>
<h3>Этап 2 — Проверка до загрузки</h3>
<p>За 1–2 часа до загрузки: подтвердите ETA водителя, убедитесь что нет проблем, трак готов. Если водитель опаздывает — немедленно уведомите брокера с новым ETA и причиной.</p>
<h3>Этап 3 — На загрузке</h3>
<ul>
<li>Водитель прибыл → звонит вам → вы пишете брокеру: <strong>"The unit is on site."</strong></li>
<li>Если склад не принимает (нет аппойнтмента, неверный адрес) → водитель остаётся, вы немедленно звоните брокеру.</li>
<li>После загрузки: водитель присылает <strong>фото груза + фото BOL</strong> → вы пересылаете брокеру → брокер даёт <strong>"Good to go"</strong> → водитель уезжает.</li>
</ul>
<h3>Detention</h3>
<p>Если водитель ждёт более 2 часов сверх аппойнтмента на загрузке или выгрузке:</p>
<ol>
<li>Зафиксируйте точное время прибытия (скриншот или запись)</li>
<li>Уведомите брокера в реальном времени — не ждите конца груза</li>
<li>Запросите письменное подтверждение оплаты detention от брокера</li>
<li>Скажите водителю тоже фиксировать время ожидания</li>
</ol>
<h3>Этап 4 — В пути</h3>
<ul>
<li>Проверяйте водителя на длинных рейсах (1000+ миль) каждые несколько часов</li>
<li>Отправляйте брокеру обновления каждые 2 часа: <strong>текущая позиция + "Rolling"</strong></li>
<li>Если водитель стоит: позиция + причина</li>
</ul>
<h3>Поломки</h3>
<ol>
<li>Водитель подтверждает безопасность (аварийка, безопасное место)</li>
<li>Точное местоположение (отметка мили, ближайший съезд, город)</li>
<li>Немедленно брокеру с влиянием на ETA</li>
<li>Организуете помощь на дороге</li>
<li>Держите брокера в курсе до решения</li>
</ol>
<h3>Этап 5 — На выгрузке</h3>
<ul>
<li>Водитель прибыл → пишете брокеру: <strong>"The unit is on site."</strong></li>
<li>Если получатель отказывается → водитель НЕ выгружает, вы немедленно звоните брокеру</li>
<li>После выгрузки: водитель получает <strong>BOL с подписью получателя</strong> → фото → это ваш <strong>POD</strong></li>
<li>Пересылаете POD брокеру → ждёте <strong>"Good to go"</strong> → отпускаете водителя</li>
</ul>
<blockquote>Без POD — нет оплаты. Это самый критический документ в конце каждого груза.</blockquote><h3>📞 Скрипт предложения груза (30 секунд)</h3>
    <blockquote><strong>English-версия:</strong><br/>"Hello, it's [Sam] with [Trucking Express]. I see a load from Mosinee, Wisconsin going to Columbia City, Indiana. Pickup as soon as possible, delivery Friday morning. It's about 14 miles from you and 412 loaded miles, 3 pieces, thirty-four hundred pounds. It also requires PPE. What do you think?"</blockquote>

    <h3>Чеклист действий водителя</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Этап</th>
        <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Водитель должен</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📍 На погрузке</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">1. Сообщить о прибытии → 2. Отправить BOL + фото → 3. Ждать ОК диспетчера</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🛣️ В пути</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">GPS «Всегда» → Отвечать на check calls → Сообщать о задержках немедленно</td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px">📦 На доставке</td><td style="padding:8px">1. Сообщить о прибытии → 2. Отправить фото подписанного POD → 3. Ждать разрешения</td></tr>
    </table>

    <figure><img src="/wikimedia/Bakersfield_Truck_Peterbilt.jpg" alt="Парк грузовиков на Flying J" /><figcaption>Парк на трак-стопе — управление несколькими водителями = несколько диалогов одновременно</figcaption></figure>

    <blockquote><strong>⚠️ Когда водитель не знает свою ставку:</strong><br/>"We don't have any target for this load — tell me your usual rate and I will try to get this for you."</blockquote>`,
      quiz: {
        questions: [
          { id: '7-2-q1', text: "Your driver has been waiting at pickup for 2.5 hours past his appointment. What must you do?", options: ["Tell driver to wait patiently — warehouses are often slow", "Document arrival time, notify broker in real time, request written detention pay confirmation", "Call the consignee to complain", "Only act after 4 hours — that's when detention typically starts"], correctIndex: 1 },
          { id: '7-2-q2', text: "Driver is loaded and says \"Can I go?\" What is missing before you release him?", options: ["Nothing — RC is signed, that's enough", "Cargo photos + BOL photo sent to broker and broker's \"Good to go\" received", "Driver's verbal confirmation that freight is not damaged", "Broker's invoice for the load"], correctIndex: 1 },
          { id: '7-2-q3', text: "Driver reports his truck broke down. What is the FIRST priority?", options: ["Call the broker immediately", "Tell driver to continue to nearest exit slowly", "Confirm driver safety (hazards on, safe location) and get exact location", "Find a replacement truck"], correctIndex: 2 },
          { id: '7-2-q4', text: "The consignee refuses to accept the delivery. What should the driver do?", options: ["Leave the freight and drive away", "Try to negotiate with the consignee", "Do NOT unload — wait while you call the broker immediately", "Call the shipper directly to resolve it"], correctIndex: 2 },
          { id: '7-2-q5', text: "What document does the driver get at delivery that becomes the POD?", options: ["A new Rate Confirmation for the return trip", "The BOL signed by an authorized representative of the consignee", "A delivery receipt printed from Cargo ETL", "The broker's payment confirmation email"], correctIndex: 1 },
          { id: '7-2-q6', text: "How often must you send transit updates to the broker on a 1,200-mile haul?", options: ["Once at pickup and once at delivery", "Every hour", "Every 2 hours with current location and status", "Only when there is a problem"], correctIndex: 2 },
        ],
      },
      quizRu: {
        questions: [
          { id: '7-2-q1-ru', text: "Водитель ждёт на загрузке 2,5 часа сверх аппойнтмента. Что нужно сделать?", options: ["Сказать водителю терпеливо ждать — склады часто медленные", "Зафиксировать время прибытия, уведомить брокера в реальном времени, запросить письменное подтверждение detention", "Позвонить получателю с жалобой", "Действовать только после 4 часов — тогда обычно начинается detention"], correctIndex: 1 },
          { id: '7-2-q2-ru', text: "Водитель загрузился и спрашивает \"Могу ехать?\" Чего не хватает до отпуска?", options: ["Ничего — RC подписан, этого достаточно", "Фото груза + BOL отправлены брокеру и получено \"Good to go\" от брокера", "Устное подтверждение водителя что груз не повреждён", "Инвойс брокера по грузу"], correctIndex: 1 },
          { id: '7-2-q3-ru', text: "Водитель сообщает о поломке трака. Какой ПЕРВЫЙ приоритет?", options: ["Немедленно позвонить брокеру", "Сказать водителю медленно ехать до ближайшего съезда", "Убедиться в безопасности водителя (аварийка, безопасное место) и получить точное местоположение", "Найти замену трак"], correctIndex: 2 },
          { id: '7-2-q4-ru', text: "Получатель отказывается принять доставку. Что должен делать водитель?", options: ["Оставить груз и уехать", "Попробовать договориться с получателем", "НЕ выгружать — ждать пока вы немедленно звоните брокеру", "Позвонить грузоотправителю напрямую для решения"], correctIndex: 2 },
          { id: '7-2-q5-ru', text: "Какой документ водитель получает при выгрузке, который становится POD?", options: ["Новый Rate Confirmation на обратный рейс", "BOL с подписью уполномоченного представителя получателя", "Квитанция о доставке из Cargo ETL", "Email с подтверждением оплаты от брокера"], correctIndex: 1 },
          { id: '7-2-q6-ru', text: "Как часто нужно отправлять обновления брокеру на рейсе 1200 миль?", options: ["Один раз при загрузке и один при доставке", "Каждый час", "Каждые 2 часа с текущей позицией и статусом", "Только когда есть проблема"], correctIndex: 2 },
        ],
      },
    },

    '7-3': {
      type: 'text',
      body: `<h2>Demo: Driver Communication in Practice</h2>
<p>This lesson covers the key situations a dispatcher faces when communicating with drivers — from the first dispatch message to collecting the POD at delivery.</p>
<h3>The Complete Dispatch Message</h3>
<p>Every time you dispatch a driver, your message must include:</p>
<ul>
<li>Load number</li>
<li>Pickup: address + appointment time</li>
<li>Delivery: address + window</li>
<li>Broker name</li>
<li>Special notes (if any)</li>
</ul>
<h3>Key Situations and Correct Responses</h3>
<table style="width:100%;border-collapse:collapse">
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Situation</td><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Correct Action</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Driver running late to pickup</td><td style="padding:8px;border:1px solid #e5e7eb">Acknowledge + immediately notify broker with new ETA</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Warehouse won't accept driver</td><td style="padding:8px;border:1px solid #e5e7eb">Driver stays on site — you call broker immediately</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Driver loaded, wants to leave</td><td style="padding:8px;border:1px solid #e5e7eb">Get cargo photos + BOL → forward to broker → wait for "Good to go"</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Detention (waiting 2+ hours)</td><td style="padding:8px;border:1px solid #e5e7eb">Document arrival time → notify broker → get written confirmation</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Breakdown in transit</td><td style="padding:8px;border:1px solid #e5e7eb">Safety first → exact location → notify broker → coordinate help</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Consignee refuses freight</td><td style="padding:8px;border:1px solid #e5e7eb">Don't unload → get contact name → call broker immediately</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Getting POD at delivery</td><td style="padding:8px;border:1px solid #e5e7eb">Signed BOL photo from consignee → send to broker → "Good to go" → release driver</td></tr>
</table>
<h3>Practice: Driver Communication Simulation</h3>
<p>Go through 8 real dispatcher-driver situations. In each step, choose the correct action. Mistakes are learning opportunities — read the feedback and try again.</p>`,
      bodyRu: `<h2>Демо: Общение с водителем на практике</h2>
<p>Этот урок охватывает ключевые ситуации диспетчера при общении с водителями — от первого сообщения об отправке до получения POD при доставке.</p>
<h3>Полное сообщение при отправке</h3>
<p>Каждый раз при отправке водителя ваше сообщение должно содержать:</p>
<ul>
<li>Номер груза</li>
<li>Загрузка: адрес + время аппойнтмента</li>
<li>Выгрузка: адрес + окно</li>
<li>Название брокера</li>
<li>Особые примечания (если есть)</li>
</ul>
<h3>Ключевые ситуации и правильные ответы</h3>
<table style="width:100%;border-collapse:collapse">
<tr style="background:#f9fafb"><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Ситуация</td><td style="padding:8px;border:1px solid #e5e7eb;font-weight:600">Правильное действие</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Водитель опаздывает на загрузку</td><td style="padding:8px;border:1px solid #e5e7eb">Принять информацию + немедленно уведомить брокера с новым ETA</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Склад не пускает водителя</td><td style="padding:8px;border:1px solid #e5e7eb">Водитель остаётся — вы немедленно звоните брокеру</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Водитель загрузился, хочет уехать</td><td style="padding:8px;border:1px solid #e5e7eb">Фото груза + BOL → брокеру → ждёте "Good to go"</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Detention (ждёт 2+ часа)</td><td style="padding:8px;border:1px solid #e5e7eb">Фиксируете время прибытия → уведомляете брокера → письменное подтверждение</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Поломка в пути</td><td style="padding:8px;border:1px solid #e5e7eb">Безопасность → точная позиция → брокеру → организуете помощь</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Получатель отказывается от груза</td><td style="padding:8px;border:1px solid #e5e7eb">Не выгружать → имя контакта → немедленно брокеру</td></tr>
<tr><td style="padding:8px;border:1px solid #e5e7eb">Получение POD при выгрузке</td><td style="padding:8px;border:1px solid #e5e7eb">Фото подписанного BOL от получателя → брокеру → "Good to go" → отпускаете водителя</td></tr>
</table>
<h3>Практика: Симуляция общения с водителем</h3>
<p>Пройдите 8 реальных ситуаций диспетчера с водителем. На каждом шаге выбирайте правильное действие. Ошибки — это возможность учиться: читайте обратную связь и пробуйте снова.</p>`,
      driverChat: true,
      quiz: {
        questions: [
          { id: '7-3-q1', text: "Driver says he'll be 1 hour late to pickup. What do you do first?", options: ["Tell him to go faster", "Acknowledge and immediately notify the broker with the new ETA", "Wait to see if he catches up", "Cancel the load"], correctIndex: 1 },
          { id: '7-3-q2', text: "Driver is loaded and wants to leave. What must happen before he goes?", options: ["Nothing — he can leave when loaded", "Cargo photos + BOL sent to broker, broker's \"Good to go\" received", "You verify the delivery address one more time", "Driver signs the Rate Confirmation again"], correctIndex: 1 },
          { id: '7-3-q3', text: "Truck breaks down mid-route with freight aboard. First action?", options: ["Find a replacement truck immediately", "Call the broker", "Confirm driver safety and get exact location", "Have driver call a tow service himself"], correctIndex: 2 },
          { id: '7-3-q4', text: "Driver is at delivery. Consignee refuses freight. Driver's correct action?", options: ["Leave and call you from the road", "Argue with the consignee", "Stay on site and wait while you call the broker", "Unload the freight and let them figure it out"], correctIndex: 2 },
          { id: '7-3-q5', text: "What creates the POD at delivery?", options: ["Driver's signature on the RC", "The consignee's signature on the BOL — driver takes a photo", "A confirmation email from the broker", "The delivery timestamp in Cargo ETL"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '7-3-q1-ru', text: "Водитель говорит, что опоздает на загрузку на 1 час. Что делаете первым?", options: ["Говорите ехать быстрее", "Принимаете информацию и немедленно уведомляете брокера с новым ETA", "Ждёте, догонит ли он время", "Отменяете груз"], correctIndex: 1 },
          { id: '7-3-q2-ru', text: "Водитель загрузился и хочет уехать. Что должно произойти до отъезда?", options: ["Ничего — загрузился, значит можно ехать", "Фото груза + BOL отправлены брокеру, получено \"Good to go\" от брокера", "Вы ещё раз проверяете адрес выгрузки", "Водитель повторно подписывает Rate Confirmation"], correctIndex: 1 },
          { id: '7-3-q3-ru', text: "Трак ломается в пути с грузом на борту. Первое действие?", options: ["Немедленно искать замену", "Позвонить брокеру", "Убедиться в безопасности водителя и получить точное местоположение", "Пусть водитель сам вызовет эвакуатор"], correctIndex: 2 },
          { id: '7-3-q4-ru', text: "Водитель на выгрузке. Получатель отказывается от груза. Правильное действие водителя?", options: ["Уехать и позвонить вам по дороге", "Спорить с получателем", "Оставаться на месте пока вы звоните брокеру", "Выгрузить груз и пусть сами разбираются"], correctIndex: 2 },
          { id: '7-3-q5-ru', text: "Что создаёт POD при доставке?", options: ["Подпись водителя на RC", "Подпись получателя на BOL — водитель делает фото", "Письмо с подтверждением от брокера", "Временная метка доставки в Cargo ETL"], correctIndex: 1 },
        ],
      },
    },

    '7-4': {
      type: 'text',
      body: `<h2>Chapter 7 — Final Practice Test: Communication with Drivers</h2>
<p>This test covers all aspects of dispatcher-driver communication: dispatching, pickup procedures, detention, transit updates, breakdowns, delivery, and POD. 20 questions. Pass threshold: 18/20.</p>`,
      bodyRu: `<h2>Глава 7 — Итоговый тест: Общение с водителями</h2>
<p>Тест охватывает все аспекты общения диспетчера с водителями: отправка, процедуры загрузки, detention, обновления в пути, поломки, доставка и POD. 20 вопросов. Порог прохождения: 18/20.</p>`,
      quiz: {
        questions: [
          { id: '7-4-q1', text: "What is the minimum information a dispatcher must give when dispatching a driver?", options: ["Pickup address only — driver finds delivery himself", "Load number, pickup address + time, delivery address + window, broker name", "Just the RC PDF and broker phone number", "Pickup address and expected rate per mile"], correctIndex: 1 },
          { id: '7-4-q2', text: "Driver calls to say he'll be 40 minutes late to pickup. What are your two immediate actions?", options: ["Tell the driver to hurry up, then wait", "Acknowledge driver, then immediately notify broker with new ETA and reason", "Call the shipper directly to push the appointment", "Only notify broker if delay exceeds 2 hours"], correctIndex: 1 },
          { id: '7-4-q3', text: "Driver arrives at pickup but warehouse guard says there is no appointment. What must the driver do?", options: ["Leave and come back in 2 hours", "Stay on site while dispatcher resolves the issue with the broker", "Call the broker himself", "Try a different entrance"], correctIndex: 1 },
          { id: '7-4-q4', text: "Why is it important to document the driver's exact arrival time at pickup?", options: ["For Cargo ETL tracking purposes only", "To establish the detention clock — needed to claim detention pay if loading takes too long", "Brokers require arrival times on all loads", "To calculate driver pay per hour at the facility"], correctIndex: 1 },
          { id: '7-4-q5', text: "Driver is loaded. What must you receive from him before sending \"Good to go\"?", options: ["Only the signed BOL", "Cargo photos AND BOL photo — both are required", "A verbal confirmation that everything is fine", "The consignee's signature"], correctIndex: 1 },
          { id: '7-4-q6', text: "After loading, you send cargo photos + BOL to the broker. What are you waiting for?", options: ["Driver's confirmation that he left the facility", "Broker's \"Good to go\" clearance", "The delivery appointment confirmation", "Payment terms for the load"], correctIndex: 1 },
          { id: '7-4-q7', text: "Driver has been waiting at pickup for 3 hours past appointment. You want detention pay. What is required?", options: ["Driver's verbal statement of wait time", "Documented arrival time + real-time broker notification + written broker confirmation of detention", "A photo of the empty loading dock", "Shipper's admission of the delay in writing"], correctIndex: 1 },
          { id: '7-4-q8', text: "A long-haul driver is moving at 65 mph. He's been on the road 2 hours since your last update. What do you send the broker?", options: ["Nothing — only update when there is news", "\"Driver is moving.\" — that's sufficient", "\"Update on load #[X]: current location — [City, State]. Status: Rolling.\"", "\"ETA revised — will send full update at delivery\""], correctIndex: 2 },
          { id: '7-4-q9', text: "Driver sends a blurry BOL photo that's unreadable. What do you do?", options: ["Accept it — any photo is better than nothing", "Ask the driver to take a new clear photo before leaving the facility", "Crop and enhance the photo yourself", "Have the broker accept verbal confirmation instead"], correctIndex: 1 },
          { id: '7-4-q10', text: "Truck breaks down on I-70 in Missouri with freight aboard. Order the correct steps:", options: ["Call broker → find replacement → confirm driver safety", "Confirm driver safety → get exact location → notify broker → coordinate roadside help", "Find replacement truck → call broker → confirm driver safety", "Notify broker → call tow service → inform driver of the plan"], correctIndex: 1 },
          { id: '7-4-q11', text: "Driver is stopped at a weigh station — scale shows truck is 2,000 lbs overweight. What do you do?", options: ["Tell driver to pay the fine and continue", "Notify broker immediately — driver must not proceed until issue is resolved with the shipper", "Ask driver to redistribute cargo himself", "Ignore it — minor overweights are rarely enforced"], correctIndex: 1 },
          { id: '7-4-q12', text: "Consignee at delivery says \"We didn't order this, we're not taking it.\" Driver's correct response?", options: ["Leave the freight at the dock and drive away", "Try to convince the consignee to accept", "Do NOT unload — get consignee contact name and wait while dispatcher calls broker", "Call the shipper directly to resolve"], correctIndex: 2 },
          { id: '7-4-q13', text: "Driver unloaded successfully. What document must he get before leaving the delivery facility?", options: ["A new Rate Confirmation", "The BOL signed by an authorized representative of the consignee", "A warehouse release form", "The broker's delivery confirmation email"], correctIndex: 1 },
          { id: '7-4-q14', text: "Driver sends you the signed BOL photo. What do you do next?", options: ["Release driver — he's done", "Forward the POD to broker, wait for \"Good to go\", then release driver", "Send invoice to broker immediately", "File the POD in Cargo ETL and let broker retrieve it"], correctIndex: 1 },
          { id: '7-4-q15', text: "Mini-case: Driver calls at 14:00 — \"I've been here since 11:00, they just started loading me.\" Appointment was 11:00. What do you do?", options: ["Tell driver to be patient", "Note arrival was 11:00. Notify broker NOW with current wait time. Request written detention pay confirmation.", "Wait until loading is done to address detention", "Tell driver to demand extra pay from the warehouse staff"], correctIndex: 1 },
          { id: '7-4-q16', text: "You dispatched a driver but forgot to include the broker's load number in your message. Why does this matter?", options: ["It doesn't — drivers never need the load number", "The driver needs it at the warehouse to get checked in — missing it causes delays", "It's only needed for Cargo ETL, not for the driver", "The broker will call the driver directly with the number"], correctIndex: 1 },
          { id: '7-4-q17', text: "Driver calls from the road: \"I'm tired and need to stop for 30 minutes.\" This is a 900-mile load with a next-day delivery deadline. What do you say?", options: ["\"No, keep driving — we have a deadline.\"", "\"Ok, rest when needed — safety first. Let me know your location when stopped and I'll update the broker.\"", "\"Stop only if you absolutely must — try to push through.\"", "Transfer the load to another driver immediately"], correctIndex: 1 },
          { id: '7-4-q18', text: "Mini-case: You dispatched the driver at 07:00. It's now 11:00 and he hasn't sent any update. Pickup was at 09:00. What do you do?", options: ["Wait — drivers will call if something is wrong", "Call the driver immediately to get a status update", "Call the broker to ask if they heard anything", "Check Cargo ETL tracking and take no further action"], correctIndex: 1 },
          { id: '7-4-q19', text: "Driver sends POD but his photo shows only half the signature page — the signature is cut off. What do you do?", options: ["Send it to the broker — partial POD is acceptable", "Ask driver to go back inside and get a new signed copy or a better photo", "Crop the image to show more of the signature", "Ask the consignee to email a digital copy"], correctIndex: 1 },
          { id: '7-4-q20', text: "Mini-case: Driver delivered, you sent POD to broker. Broker has not responded in 45 minutes with \"Good to go.\" Driver is eager to leave. What do you do?", options: ["Release the driver — 45 minutes is long enough to wait", "Follow up with the broker: \"Hi, just checking on load #[X] — waiting for your clearance on the POD.\"", "Release driver and tell broker you already cleared him", "Call the shipper to get clearance instead"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '7-4-q1-ru', text: "Минимальная информация, которую диспетчер должен дать при отправке водителя?", options: ["Только адрес загрузки — доставку найдёт сам", "Номер груза, адрес + время загрузки, адрес + окно выгрузки, название брокера", "Просто PDF RC и телефон брокера", "Адрес загрузки и ожидаемая ставка за милю"], correctIndex: 1 },
          { id: '7-4-q2-ru', text: "Водитель звонит — опоздает на 40 минут на загрузку. Ваши два немедленных действия?", options: ["Сказать водителю поторопиться, потом ждать", "Принять информацию от водителя, затем немедленно уведомить брокера с новым ETA и причиной", "Напрямую позвонить грузоотправителю перенести аппойнтмент", "Уведомлять брокера только если задержка больше 2 часов"], correctIndex: 1 },
          { id: '7-4-q3-ru', text: "Водитель прибыл на загрузку, но охрана говорит нет аппойнтмента. Что должен делать водитель?", options: ["Уехать и вернуться через 2 часа", "Оставаться на месте пока диспетчер решает проблему с брокером", "Самому позвонить брокеру", "Попробовать другой въезд"], correctIndex: 1 },
          { id: '7-4-q4-ru', text: "Почему важно фиксировать точное время прибытия водителя на загрузку?", options: ["Только для отслеживания в Cargo ETL", "Для запуска счётчика detention — необходимо для претензии на оплату если загрузка затягивается", "Брокеры требуют время прибытия по всем грузам", "Для расчёта оплаты водителя по часам на объекте"], correctIndex: 1 },
          { id: '7-4-q5-ru', text: "Водитель загрузился. Что нужно получить от него до отправки \"Good to go\"?", options: ["Только подписанный BOL", "Фото груза И фото BOL — необходимы оба", "Устное подтверждение что всё в порядке", "Подпись получателя"], correctIndex: 1 },
          { id: '7-4-q6-ru', text: "После загрузки вы отправили фото груза + BOL брокеру. Чего вы ждёте?", options: ["Подтверждения от водителя что он покинул объект", "\"Good to go\" от брокера", "Подтверждения аппойнтмента на выгрузку", "Условий оплаты по грузу"], correctIndex: 1 },
          { id: '7-4-q7-ru', text: "Водитель ждёт на загрузке 3 часа сверх аппойнтмента. Вы хотите detention pay. Что требуется?", options: ["Устное заявление водителя о времени ожидания", "Зафиксированное время прибытия + уведомление брокера в реальном времени + письменное подтверждение брокером", "Фото пустого погрузочного дока", "Письменное признание задержки грузоотправителем"], correctIndex: 1 },
          { id: '7-4-q8-ru', text: "Водитель дальнобойщик едет 65 миль/ч. Прошло 2 часа с последнего обновления. Что отправляете брокеру?", options: ["Ничего — обновлять только при новостях", "\"Водитель едет.\" — достаточно", "\"Обновление по грузу #[X]: текущая позиция — [Город, Штат]. Статус: Rolling.\"", "\"ETA скорректирован — полное обновление при доставке\""], correctIndex: 2 },
          { id: '7-4-q9-ru', text: "Водитель присылает размытое нечитаемое фото BOL. Что делаете?", options: ["Принять — любое фото лучше чем ничего", "Попросить водителя сделать чёткое фото до выезда с объекта", "Самому обрезать и улучшить фото", "Попросить брокера принять устное подтверждение"], correctIndex: 1 },
          { id: '7-4-q10-ru', text: "Трак ломается на I-70 в Миссури с грузом на борту. Правильный порядок действий:", options: ["Позвонить брокеру → найти замену → убедиться в безопасности водителя", "Убедиться в безопасности водителя → точная позиция → уведомить брокера → организовать помощь", "Найти замену → позвонить брокеру → убедиться в безопасности водителя", "Уведомить брокера → вызвать эвакуатор → сообщить водителю план"], correctIndex: 1 },
          { id: '7-4-q11-ru', text: "Водителя остановили на весовой контрольной — перегруз 2000 фунтов. Что делаете?", options: ["Сказать водителю заплатить штраф и продолжать", "Немедленно уведомить брокера — водитель не должен продолжать до решения с грузоотправителем", "Попросить водителя самому перераспределить груз", "Игнорировать — небольшой перегруз редко применяется"], correctIndex: 1 },
          { id: '7-4-q12-ru', text: "Получатель при выгрузке говорит: \"Мы это не заказывали, не принимаем.\" Правильное действие водителя?", options: ["Оставить груз у дока и уехать", "Постараться убедить получателя принять", "НЕ выгружать — узнать имя контакта и ждать пока диспетчер звонит брокеру", "Напрямую позвонить грузоотправителю для решения"], correctIndex: 2 },
          { id: '7-4-q13-ru', text: "Водитель успешно разгрузился. Какой документ он должен получить до выезда с места выгрузки?", options: ["Новый Rate Confirmation", "BOL с подписью уполномоченного представителя получателя", "Форму выпуска склада", "Email с подтверждением доставки от брокера"], correctIndex: 1 },
          { id: '7-4-q14-ru', text: "Водитель прислал фото подписанного BOL. Что делаете дальше?", options: ["Отпускаете водителя — он выполнил задачу", "Пересылаете POD брокеру, ждёте \"Good to go\", затем отпускаете водителя", "Немедленно выставляете инвойс брокеру", "Загружаете POD в Cargo ETL и ждёте пока брокер сам получит"], correctIndex: 1 },
          { id: '7-4-q15-ru', text: "Кейс: Водитель звонит в 14:00 — \"Я здесь с 11:00, только начали грузить.\" Аппойнтмент был на 11:00. Что делаете?", options: ["Сказать водителю терпеть", "Зафиксировать прибытие в 11:00. Немедленно уведомить брокера с текущим временем ожидания. Запросить письменное подтверждение detention.", "Ждать конца загрузки, потом заниматься detention", "Сказать водителю требовать доплату от складских рабочих"], correctIndex: 1 },
          { id: '7-4-q16-ru', text: "Вы отправили водителя, но забыли указать номер груза брокера. Почему это важно?", options: ["Не важно — номер груза водителям никогда не нужен", "Водителю нужен этот номер на складе для регистрации — без него задержки", "Нужен только для Cargo ETL, не для водителя", "Брокер сам позвонит водителю с номером"], correctIndex: 1 },
          { id: '7-4-q17-ru', text: "Водитель звонит с дороги: \"Устал, нужно остановиться на 30 минут.\" Груз 900 миль, доставка завтра. Что говорите?", options: ["\"Нет, езди — у нас дедлайн.\"", "\"Ок, отдыхай при необходимости — безопасность прежде всего. Сообщи позицию когда остановишься, обновлю брокера.\"", "\"Останавливайся только если совсем нужно — постарайся дотянуть.\"", "Немедленно переводить груз на другого водителя"], correctIndex: 1 },
          { id: '7-4-q18-ru', text: "Кейс: Вы отправили водителя в 07:00. Сейчас 11:00, никаких обновлений. Загрузка была в 09:00. Что делаете?", options: ["Ждать — водители позвонят если что-то не так", "Немедленно позвонить водителю для получения статуса", "Позвонить брокеру спросить не слышал ли он что", "Проверить трекинг в Cargo ETL и больше ничего не делать"], correctIndex: 1 },
          { id: '7-4-q19-ru', text: "Водитель присылает POD, но на фото видна только половина страницы подписи — подпись обрезана. Что делаете?", options: ["Отправить брокеру — частичный POD приемлем", "Попросить водителя вернуться и получить новую подпись или сделать лучшее фото", "Обрезать изображение чтобы показать больше подписи", "Попросить получателя прислать цифровую копию по email"], correctIndex: 1 },
          { id: '7-4-q20-ru', text: "Кейс: Водитель доставил, вы отправили POD брокеру. Брокер не отвечает \"Good to go\" уже 45 минут. Водитель хочет уехать. Что делаете?", options: ["Отпустить водителя — 45 минут достаточно ждать", "Написать брокеру follow-up: \"Hi, just checking on load #[X] — waiting for your clearance on the POD.\"", "Отпустить водителя и сообщить брокеру что уже отпустили", "Запросить разрешение у грузоотправителя вместо брокера"], correctIndex: 1 },
        ],
      },
    },

    '8-1': {
      type: 'text',
      body: `
        <h2>Bidding & Deal Closing</h2>
        <blockquote>
          <strong>Remember:</strong> A dispatcher only earns when a load is booked. The ability to negotiate is your core monetization skill.
        </blockquote>

        <h3>What is Bidding in Logistics?</h3>
        <p><strong>Bidding</strong> is the process of negotiating a freight rate between a dispatcher and a broker. You act as the intermediary: get the driver's rate, add your commission, and offer the final price to the broker.</p>

        <h3>Negotiation Participants</h3>
        <ul>
          <li><strong>Driver</strong> — quotes their base rate for the load</li>
          <li><strong>Dispatcher (you)</strong> — adds commission, negotiates with broker</li>
          <li><strong>Broker</strong> — accepts or rejects your price, may counter-offer</li>
        </ul>

        <h3>Why Bidding is a Critical Skill</h3>
        <p>Every dollar you leave on the negotiating table is money out of your pocket. With an average of $100–$300 revenue per load and 5–10 loads per day, the difference between a skilled and unskilled dispatcher can be thousands of dollars per month.</p>

        <h3>Chapter Goals</h3>
        <ul>
          <li>Master the driver call script to get a rate</li>
          <li>Learn to calculate broker price correctly (target 21% margin)</li>
          <li>Understand how to handle broker counter-offers</li>
          <li>Know the rules for additional payments (detention, TONU, layover)</li>
        </ul>
      <h3>💰 The Margin Formula</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#7c3aed;color:white">
          <th style="padding:12px;text-align:center;border-radius:8px 8px 0 0" colspan="3">BIDDING MATH</th>
        </tr>
        <tr style="background:#f5f3ff"><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>Driver Rate</strong><br/>$750</td><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>+ Commission (21%)</strong><br/>$199</td><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>= Broker Bid</strong><br/>$949</td></tr>
        <tr><td style="padding:10px;text-align:center;border-radius:0 0 8px 8px" colspan="3" style="background:#ede9fe"><strong>Your Revenue: $199</strong> ✅ Above $100 minimum</td></tr>
      </table>

      <h3>Key Rules</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:8px;text-align:left;border-radius:8px 0 0 0">Rule</th>
          <th style="padding:8px;text-align:left;border-radius:0 8px 0 0">Value</th>
        </tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🎯 Target average margin</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>21%</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">📉 Minimum revenue per load</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>$100</strong></td></tr>
        <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📊 Average revenue range</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>$100–$300</strong></td></tr>
        <tr><td style="padding:8px">⚠️ Never bid without</td><td style="padding:8px"><strong>Driver confirmation</strong></td></tr>
      </table>

      <figure><img src="/wikimedia/Business_agreement_handshake_at_coffee_shop.jpg" alt="Business handshake — closing a deal" /><figcaption>Every successful bid ends with a deal — your negotiation skills directly determine your income</figcaption></figure>`,
      bodyRu: `
        <h2>Торги и закрытие сделок</h2>
        <blockquote>
          <strong>Запомните:</strong> Диспетчер зарабатывает только когда груз забронирован. Умение торговаться — ваш главный навык монетизации.
        </blockquote>

        <h3>Что такое торги в логистике?</h3>
        <p><strong>Bidding</strong> (торги) — процесс согласования ставки между диспетчером и брокером за перевозку груза. Вы выступаете посредником: получаете ставку от водителя, добавляете свою комиссию и предлагаете итоговую цену брокеру.</p>

        <h3>Участники переговоров</h3>
        <ul>
          <li><strong>Водитель</strong> — называет свою базовую ставку за груз</li>
          <li><strong>Диспетчер (вы)</strong> — добавляет комиссию, ведёт переговоры с брокером</li>
          <li><strong>Брокер</strong> — принимает или отклоняет вашу цену, может торговаться</li>
        </ul>

        <h3>Почему торги — критический навык?</h3>
        <p>Каждый доллар, который вы оставляете на столе переговоров — это ваши упущенные деньги. При среднем доходе $100–$300 на груз и 5–10 грузах в день разница между умелым и неумелым диспетчером составляет тысячи долларов в месяц.</p>

        <h3>Цели этой главы</h3>
        <ul>
          <li>Освоить скрипт звонка водителю для получения ставки</li>
          <li>Научиться правильно рассчитывать брокерскую цену (целевая маржа 21%)</li>
          <li>Понять как вести переговоры с брокером при получении встречного предложения</li>
          <li>Знать правила дополнительных выплат (detention, TONU, layover)</li>
        </ul>
      <h3>💰 Формула маржи</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#7c3aed;color:white">
        <th style="padding:12px;text-align:center;border-radius:8px 8px 0 0" colspan="3">МАТЕМАТИКА БИДДИНГА</th>
      </tr>
      <tr style="background:#f5f3ff"><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>Ставка водителя</strong><br/>$750</td><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>+ Комиссия (21%)</strong><br/>$199</td><td style="padding:10px;text-align:center;border-bottom:1px solid #ddd6fe"><strong>= Бид брокеру</strong><br/>$949</td></tr>
      <tr><td style="padding:10px;text-align:center;border-radius:0 0 8px 8px" colspan="3" style="background:#ede9fe"><strong>Ваш доход: $199</strong> ✅ Выше минимума $100</td></tr>
    </table>

    <h3>Ключевые правила</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:8px;text-align:left;border-radius:8px 0 0 0">Правило</th>
        <th style="padding:8px;text-align:left;border-radius:0 8px 0 0">Значение</th>
      </tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🎯 Целевая средняя маржа</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>21%</strong></td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">📉 Минимальный доход с груза</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>$100</strong></td></tr>
      <tr style="background:#f8fafc"><td style="padding:8px;border-bottom:1px solid #e2e8f0">📊 Средний диапазон дохода</td><td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>$100–$300</strong></td></tr>
      <tr><td style="padding:8px">⚠️ Никогда не биддить без</td><td style="padding:8px"><strong>Подтверждения водителя</strong></td></tr>
    </table>

    <figure><img src="/wikimedia/Business_agreement_handshake_at_coffee_shop.jpg" alt="Рукопожатие — закрытие сделки" /><figcaption>Каждый успешный бид заканчивается сделкой — навыки переговоров напрямую определяют ваш доход</figcaption></figure>`,
      quiz: {
        questions: [
          { id: '8-1-q1', text: "What is the dispatcher's role in the bidding process?", options: ["Drive the truck and deliver the load", "Get the driver's rate, add commission, and negotiate with the broker", "Set the shipper's price for the load", "Manage the warehouse appointment"], correctIndex: 1 },
          { id: '8-1-q2', text: "What is the target margin a dispatcher should aim for?", options: ["5% average", "10% average", "21% average", "35% average"], correctIndex: 2 },
          { id: '8-1-q3', text: "What is the minimum revenue per load a dispatcher should never go below?", options: ["$50", "$100", "$200", "$300"], correctIndex: 1 },
          { id: '8-1-q4', text: "What happens if you bid without confirming the driver will take the load?", options: ["Nothing — brokers expect some no-shows", "You risk damaging your relationship with the broker", "The load automatically cancels", "The broker finds another truck for you"], correctIndex: 1 },
          { id: '8-1-q5', text: "Average revenue per load for a dispatcher is:", options: ["$10–$50", "$50–$100", "$100–$300", "$500–$1,000"], correctIndex: 2 },
        ],
      },
      quizRu: {
        questions: [
          { id: '8-1-q1-ru', text: "Какова роль диспетчера в процессе торгов?", options: ["Управлять траком и доставлять груз", "Получить ставку водителя, добавить комиссию и вести переговоры с брокером", "Установить цену грузоотправителя", "Управлять складским аппойнтментом"], correctIndex: 1 },
          { id: '8-1-q2-ru', text: "Какова целевая маржа диспетчера?", options: ["В среднем 5%", "В среднем 10%", "В среднем 21%", "В среднем 35%"], correctIndex: 2 },
          { id: '8-1-q3-ru', text: "Ниже какого минимального дохода на груз диспетчер не должен опускаться?", options: ["$50", "$100", "$200", "$300"], correctIndex: 1 },
          { id: '8-1-q4-ru', text: "Что произойдёт если вы подаёте заявку не убедившись что водитель готов взять груз?", options: ["Ничего — брокеры ожидают отказов", "Вы рискуете испортить отношения с брокером", "Груз автоматически отменяется", "Брокер найдёт для вас другой трак"], correctIndex: 1 },
          { id: '8-1-q5-ru', text: "Средний доход диспетчера на груз составляет:", options: ["$10–$50", "$50–$100", "$100–$300", "$500–$1 000"], correctIndex: 2 },
        ],
      },
    },

    '8-2': {
      type: 'text',
      body: `
        <h2>Bidding Strategy & Rates</h2>

        <h3>Step 1: Call the Driver — Get Their Rate</h3>
        <p>Before calling the broker, you must know the driver's rate. Use the script:</p>
        <blockquote>
          <strong>Driver Call Script:</strong><br/>
          "Hello, it's [Sam/Tom/Max] with [Trucking Express]. I see a load from Mosinee, Wisconsin going to Columbia City, Indiana. Pickup as soon as possible, delivery Friday morning. It's about 14 miles from you and 412 loaded miles, 3 pieces, thirty-four hundred pounds. It also requires PPE — personal protective equipment. What do you think?"
        </blockquote>
        <p>If the driver doesn't know what to quote: <em>"We don't have a target for this load — tell me your usual rate and I'll try to get it for you."</em></p>

        <h3>Step 2: Calculate Your Broker Price</h3>
        <p>Your broker price = driver's rate + your commission. Target margin: <strong>21% of broker price on average across all loads</strong>.</p>

        <h3>Calculation Example</h3>
        <ul>
          <li>Driver rate: $700</li>
          <li>Target margin: 21%</li>
          <li>Your commission: $700 × 0.21 / 0.79 ≈ $186</li>
          <li>Broker price: <strong>$886</strong></li>
        </ul>

        <h3>Bidding Rules</h3>
        <ul>
          <li>Minimum revenue: <strong>$100</strong> per load — never go below this</li>
          <li>Average revenue: $100–$300 per load</li>
          <li>More miles = potential for bigger commission</li>
          <li>Never bid without driver confirmation — you risk damaging broker relationships</li>
        </ul>

        <figure>
          <img src="/trucks/warehouse.jpg" alt="Bidding Strategy Playbook" />
          <figcaption>Phase 1: Driver Pitch & Bid | Phase 2: Broker Submission & Closing</figcaption>
        </figure>

        <figure>
          <img src="/trucks/loading-dock.jpg" alt="Rate Guide 2026" />
          <figcaption>Cargo Van / Sprinter Van Rate Guide 2026 — use as a reference baseline</figcaption>
        </figure>

        <h3>VIN Rule</h3>
        <blockquote>
          <strong>⚠️ IMPORTANT:</strong> If a broker asks for the truck's VIN — use the Highway VIN, NOT the real one. Ask in company chat. Shift Line Transit VIN: 1FT7X2B65HEC69262
        </blockquote>

        <h3>Accessorial Charges 2026</h3>
        <p><strong>Detention:</strong> Waiting under 2 hours is unpaid. After that: $25/hour, max $200/day. If the driver had a scheduled time or a "window" between loading and unloading, the clock starts after that window expires.</p>
        <p><strong>Layover:</strong> Paid if the driver waited overnight to be loaded/unloaded. Sprinter: $75, box truck and large straight: $100.</p>
        <p><strong>TONU (Truck Order Not Used):</strong> Paid if the load was cancelled. Amount depends on miles traveled. Exception: cancelled 2 hours before unloading = not paid. Otherwise: $75 per load. Note: Layover and TONU cannot both apply — only one at a time.</p>
        <p><strong>Hand loading/unloading:</strong> After dispatcher agreement — $50 for loads under 500 lbs, $75 for 500–1,000 lbs. All other cases: negotiate with dispatcher.</p>
        <p><strong>Document printing:</strong> Include the cost in your rate before dispatch (Canada loads and airports).</p>

        <h3>Truck Breakdown Under Load</h3>
        <p>If the truck breaks down under a company load — call the main office immediately. A replacement driver must be found. Compensation: the recovery driver gets their required rate; the original driver gets the remainder of the full load rate regardless of distance already covered.</p>
      `,
      bodyRu: `
        <h2>Стратегия торгов и ставки</h2>

        <h3>Шаг 1: Звонок водителю — получить ставку</h3>
        <p>Перед тем как звонить брокеру, вы должны знать ставку водителя. Используйте скрипт:</p>
        <blockquote>
          <strong>Скрипт звонка водителю:</strong><br/>
          «Привет, это [Сэм/Том/Макс] из [Trucking Express]. Вижу груз из Мосини, Висконсин в Колумбию-Сити, Индиана. Загрузка как можно скорее, доставка утром пятницы. От вас примерно 14 миль и 412 загруженных миль, 3 единицы, тридцать четыре сотни фунтов. Также требуется PPE — средства индивидуальной защиты. Что думаете?»
        </blockquote>
        <p>Если водитель не знает что запросить — скажите: <em>«У нас нет таргета по этому грузу — скажите свою обычную ставку, я постараюсь её получить.»</em></p>

        <h3>Шаг 2: Расчёт брокерской цены</h3>
        <p>Ваша цена для брокера = ставка водителя + ваша комиссия. Целевая маржа: <strong>21% от брокерской цены в среднем по всем грузам</strong>.</p>

        <h3>Пример расчёта</h3>
        <ul>
          <li>Ставка водителя: $700</li>
          <li>Целевая маржа: 21%</li>
          <li>Ваша комиссия: $700 × 0,21 / 0,79 ≈ $186</li>
          <li>Цена для брокера: <strong>$886</strong></li>
        </ul>

        <h3>Правила торгов</h3>
        <ul>
          <li>Минимальный доход: <strong>$100</strong> на груз — ниже не торговаться</li>
          <li>Средний доход: $100–$300 на груз</li>
          <li>Чем больше миль — тем больше может быть ваша комиссия</li>
          <li>Не подавайте заявку без подтверждения от водителя — иначе рискуете отношениями с брокером</li>
        </ul>

        <h3>Путеводитель по ставкам 2026 (Cargo Van / Sprinter Van)</h3>

        <figure>
          <img src="/trucks/loading-dock.jpg" alt="Ставки Cargo Van 2026" />
          <figcaption>Ставки Cargo Van / Sprinter Van по километражу — ориентир для расчёта</figcaption>
        </figure>

        <p><strong>Расшифровка таблицы ставок:</strong></p>
        <ul>
          <li>100 миль и менее: $225–$300</li>
          <li>150 миль: $300–$350</li>
          <li>200 миль: $325–$400</li>
          <li>250 миль: $350–$425</li>
          <li>300 миль: $400–$500</li>
          <li>400 миль: $450–$525</li>
          <li>500 миль: $550–$625</li>
          <li>600 миль: $600–$650</li>
          <li>700 миль: $700–$750</li>
          <li>800 миль: $700–$900</li>
          <li>1 000 миль и более: $0,85–$1,00 за милю в среднем</li>
        </ul>

        <h3>Правило VIN</h3>
        <blockquote>
          <strong>⚠️ ВАЖНО:</strong> Если брокер запрашивает VIN трака — используйте Highway VIN, НЕ настоящий. Уточняйте в рабочем чате. VIN компании Shift Line Transit: 1FT7X2B65HEC69262
        </blockquote>

        <h3>Дополнительные выплаты (Accessorial Charges) 2026</h3>
        <p><strong>Detention (простой):</strong> Ожидание до 2 часов не оплачивается. После — $25/час, максимум $200/день. Если у водителя было чёткое время аппойнтмента или «окно» между загрузкой и выгрузкой — отсчёт начинается после истечения этого времени.</p>
        <p><strong>Layover (ночёвка):</strong> Оплачивается если водитель ждал целую ночь для загрузки/выгрузки. Sprinter: $75, box truck и large straight: $100.</p>
        <p><strong>TONU (Truck Order Not Used — трак вызвали, но не использовали):</strong> Оплачивается если груз был отменён. Сумма зависит от пройденных миль. Исключение: отмена за 2 часа до выгрузки — не оплачивается. В остальных случаях: $75 за груз. ВАЖНО: Layover и TONU не применяются одновременно — только одно из двух.</p>
        <p><strong>Ручная погрузка/выгрузка:</strong> После согласования с диспетчером — $50 за груз до 500 фунтов, $75 за 500–1 000 фунтов. Всё остальное — согласовывается индивидуально.</p>
        <p><strong>Печать документов:</strong> Включайте в ставку до отправки (Канада и аэропорты).</p>

        <h3>Поломка трака под грузом</h3>
        <p>Если трак ломается под грузом компании — немедленно позвоните в главный офис. Необходимо найти другого водителя для доставки. Компенсация: водитель который забрал груз получает свою ставку; водитель чей трак сломался получает остаток от общей ставки за этот груз вне зависимости от пройденного расстояния.</p>
      `,
      quiz: {
        questions: [
          { id: '8-2-q1', text: "What should you do BEFORE calling the broker to submit a bid?", options: ["Submit the bid at a standard $500 rate", "Confirm the driver's rate and calculate your broker price", "Ask the broker what their maximum budget is", "Check the load board for similar loads"], correctIndex: 1 },
          { id: '8-2-q2', text: "Driver's rate is $600. With 21% target margin, what is your broker price?", options: ["$600", "$721", "$759", "$850"], correctIndex: 2 },
          { id: '8-2-q3', text: "A broker asks for the truck VIN. What do you provide?", options: ["The real VIN from the truck documents", "Highway VIN (not the real one)", "Refuse to give any VIN", "The VIN of any available truck"], correctIndex: 1 },
          { id: '8-2-q4', text: "When does detention pay START being counted?", options: ["Immediately upon arrival at the facility", "After 2 hours of waiting past the appointment", "After 1 hour of waiting", "When the driver calls you to report the delay"], correctIndex: 1 },
          { id: '8-2-q5', text: "What is TONU?", options: ["A type of freight insurance", "Payment when a booked load is cancelled", "A detention rate for overnight waits", "A penalty for late delivery"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '8-2-q1-ru', text: "Что нужно сделать ПЕРЕД звонком брокеру для подачи заявки?", options: ["Подать заявку по стандартной ставке $500", "Подтвердить ставку водителя и рассчитать брокерскую цену", "Спросить брокера каков его максимальный бюджет", "Проверить биржу на аналогичные грузы"], correctIndex: 1 },
          { id: '8-2-q2-ru', text: "Ставка водителя $600. При целевой марже 21% какова ваша брокерская цена?", options: ["$600", "$721", "$759", "$850"], correctIndex: 2 },
          { id: '8-2-q3-ru', text: "Брокер запрашивает VIN трака. Что предоставляете?", options: ["Настоящий VIN из документов трака", "Highway VIN (не настоящий)", "Отказать в предоставлении VIN", "VIN любого доступного трака"], correctIndex: 1 },
          { id: '8-2-q4-ru', text: "Когда начинает отсчитываться detention?", options: ["Сразу по прибытии на объект", "После 2 часов ожидания сверх аппойнтмента", "После 1 часа ожидания", "Когда водитель звонит вам сообщить о задержке"], correctIndex: 1 },
          { id: '8-2-q5-ru', text: "Что такое TONU?", options: ["Вид грузовой страховки", "Выплата когда забронированный груз отменяется", "Ставка detention за ночное ожидание", "Штраф за позднюю доставку"], correctIndex: 1 },
        ],
      },
    },

    '8-3': {
      type: 'text',
      brokerCall: true,
      body: `<h2>Bidding Simulation — Live Negotiation</h2><p>Welcome to the Negotiation Game. In this simulation, you will practice the complete bidding cycle: evaluating loads, determining rates based on area pricing, negotiating with simulated brokers, and calculating your margin.</p><h3>How It Works</h3><p>You will face 3 rounds of negotiation, each with a different broker personality:</p><ul><li><strong>Budget Brian</strong> — a tough negotiator who starts low. You need strong counter-arguments.</li><li><strong>Fair Fiona</strong> — reasonable, meets in the middle. Standard negotiation.</li><li><strong>Premium Pete</strong> — generous opening, but don't leave money on the table.</li></ul><h3>Your Goal</h3><p>For each round:</p><ol><li>Review the load details (route, miles, equipment type)</li><li>Check the broker's opening offer against market rate</li><li>Set your counter-offer using the slider</li><li>Watch the P&L panel — your carrier cost, margin in dollars, and margin percentage</li><li>Target: 15-25% margin on each deal</li></ol><blockquote><strong>Remember:</strong> Minimum revenue per load is $100. Aim for 21% average margin across all deals. The more miles, the bigger your commission can be.</blockquote><p>Use the Negotiation Game below to practice.</p>`,
      bodyRu: `<h2>Симуляция торгов — живые переговоры</h2><p>Добро пожаловать в Игру переговоров. В этой симуляции вы практикуете полный цикл: оценка грузов, определение ставок по зонам, переговоры с брокерами и расчёт маржи.</p><h3>Как это работает</h3><p>Вас ждут 3 раунда переговоров с разными брокерами:</p><ul><li><strong>Budget Brian</strong> — жёсткий переговорщик, начинает низко. Нужны сильные аргументы.</li><li><strong>Fair Fiona</strong> — разумная, идёт на компромисс. Стандартные переговоры.</li><li><strong>Premium Pete</strong> — щедрое начальное предложение, но не оставляйте деньги на столе.</li></ul><h3>Ваша цель</h3><ol><li>Изучите детали груза (маршрут, мили, тип оборудования)</li><li>Сравните предложение брокера с рыночной ставкой</li><li>Установите встречное предложение ползунком</li><li>Следите за панелью P&L — стоимость перевозчика, маржа в долларах и процентах</li><li>Цель: 15-25% маржа на каждой сделке</li></ol><blockquote><strong>Помните:</strong> Минимальный доход с груза — $100. Целевая средняя маржа — 21%. Чем больше миль, тем выше ваша комиссия.</blockquote>`,
      negotiationGame: true,
    },

    '8-4': {
      type: 'text',
      body: `
        <h2>Final Test — Bidding & Deal Closing</h2>
        <p>This test covers all chapter topics: bidding strategy, commission calculation, rate rules, accessorial charges, and handling broker objections. <strong>Goal: 80% or higher.</strong></p>
      `,
      bodyRu: `
        <h2>Итоговый тест — Торги и закрытие сделок</h2>
        <p>Этот тест охватывает все темы главы: стратегию торгов, расчёт комиссии, правила ставок, дополнительные выплаты и работу с возражениями брокера. <strong>Цель: 80% и выше.</strong></p>
      `,
      quiz: {
        questions: [
          { id: '8-4-q1', text: "You find a load: 380 miles, driver rate $550. What is your broker bid at 21% margin?", options: ["$550", "$665", "$696", "$750"], correctIndex: 2 },
          { id: '8-4-q2', text: "Before submitting a bid to a broker, you must:", options: ["Check the weather along the route", "Confirm the driver will take the load", "Get written authorization from your manager", "Call the shipper to confirm the load"], correctIndex: 1 },
          { id: '8-4-q3', text: "A broker says \"best I can do is $750\" but your driver rate is $700. What do you do?", options: ["Accept $750 — $50 revenue is better than nothing", "Reject and find another load", "Counter at $800 — you need at least $100 revenue", "Ask the driver to lower his rate to $600"], correctIndex: 2 },
          { id: '8-4-q4', text: "When does TONU NOT apply?", options: ["When the load is cancelled 3 hours before unloading", "When the load is cancelled 2 hours before unloading", "When the driver has already driven 200 miles", "When the driver hasn't left yet"], correctIndex: 1 },
          { id: '8-4-q5', text: "Can Layover and TONU be applied to the same load simultaneously?", options: ["Yes, both apply if the driver waited overnight AND the load was cancelled", "No, only one can apply at a time", "Yes, but only for loads over 500 miles", "Only if the broker approves both"], correctIndex: 1 },
          { id: '8-4-q6', text: "A broker asks for the truck VIN during booking. You should:", options: ["Give the real VIN from the truck registration", "Provide the Highway VIN after checking in company chat", "Refuse the load — this is suspicious", "Give any random VIN number"], correctIndex: 1 },
          { id: '8-4-q7', text: "Your target margin across all loads should average:", options: ["5%", "10%", "15%", "21%"], correctIndex: 3 },
          { id: '8-4-q8', text: "A driver says: \"I don't know what to ask for this load, what's your target?\" You respond:", options: ["\"Our target is $800.\"", "\"We don't have a target — tell me your usual rate and I'll try to get it.\"", "\"Ask the broker directly what they're offering.\"", "\"Start at $400 and we'll negotiate.\""], correctIndex: 1 },
          { id: '8-4-q9', text: "Detention pay max per day is:", options: ["$100", "$150", "$200", "$300"], correctIndex: 2 },
          { id: '8-4-q10', text: "Hand loading under 500 lbs pays the driver:", options: ["$25", "$50", "$75", "$100"], correctIndex: 1 },
          { id: '8-4-q11', text: "A truck breaks down under a company load. The recovery driver delivers. Who gets what?", options: ["Recovery driver gets full load rate, original driver gets nothing", "Recovery driver gets their required amount, original driver gets the remainder of the total rate", "They split the rate 50/50", "The company keeps all payment"], correctIndex: 1 },
          { id: '8-4-q12', text: "Document printing costs should be:", options: ["Billed separately after delivery", "Included in your rate before sending to loading (Canada/airports)", "Covered by the broker always", "Deducted from driver pay"], correctIndex: 1 },
          { id: '8-4-q13', text: "Driver had a scheduled 10:00 AM pickup window. Loading started at 10:00 AM but finished at 1:30 PM. When does detention clock start?", options: ["Immediately at 10:00 AM", "At 12:00 PM (after 2 hours from start)", "At 10:00 AM but only after driver calls you", "After 1:30 PM when loading finished"], correctIndex: 1 },
          { id: '8-4-q14', text: "Sprinter van layover payment is:", options: ["$50", "$75", "$100", "$125"], correctIndex: 1 },
          { id: '8-4-q15', text: "Which loads have higher commission potential?", options: ["Short city loads under 100 miles", "High-value freight loads", "Long-haul loads with more miles", "Airport and Canada loads"], correctIndex: 2 },
          { id: '8-4-q16', text: "Broker counters your $900 bid at $820. Your driver rate is $720. What is your revenue at $820?", options: ["$80", "$100", "$120", "$820"], correctIndex: 1 },
          { id: '8-4-q17', text: "Why should you never reveal your target rate to the driver?", options: ["It's confidential company information", "You need the driver's rate first to calculate your margin properly", "Brokers can hear the call", "Drivers will report you to the load board"], correctIndex: 1 },
          { id: '8-4-q18', text: "A load was cancelled. Driver had driven 150 miles. TONU applies. How much does the driver get?", options: ["$0 — TONU doesn't cover miles driven", "$75 for the load", "Full original rate", "$25 per mile driven"], correctIndex: 1 },
          { id: '8-4-q19', text: "Hand loading for 700 lbs cargo is paid at:", options: ["$50", "$75", "Negotiated with dispatcher", "$100"], correctIndex: 2 },
          { id: '8-4-q20', text: "After the broker accepts your bid, the next critical step is:", options: ["Dispatch the driver immediately", "Wait for Rate Confirmation and verify all details match before dispatching", "Call the shipper to confirm pickup time", "Update Cargo ETL with the load information"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: '8-4-q1-ru', text: "Груз 380 миль, ставка водителя $550. Какова ваша заявка брокеру при марже 21%?", options: ["$550", "$665", "$696", "$750"], correctIndex: 2 },
          { id: '8-4-q2-ru', text: "Перед подачей заявки брокеру вы должны:", options: ["Проверить погоду по маршруту", "Подтвердить что водитель возьмёт груз", "Получить письменное разрешение менеджера", "Позвонить грузоотправителю для подтверждения"], correctIndex: 1 },
          { id: '8-4-q3-ru', text: "Брокер говорит \"лучшее что могу — $750\", но ставка вашего водителя $700. Что делаете?", options: ["Принять $750 — $50 лучше чем ничего", "Отказать и найти другой груз", "Встречное предложение $800 — нужно минимум $100 дохода", "Попросить водителя снизить ставку до $600"], correctIndex: 2 },
          { id: '8-4-q4-ru', text: "Когда TONU НЕ применяется?", options: ["Когда груз отменяется за 3 часа до выгрузки", "Когда груз отменяется за 2 часа до выгрузки", "Когда водитель уже проехал 200 миль", "Когда водитель ещё не выехал"], correctIndex: 1 },
          { id: '8-4-q5-ru', text: "Можно ли применить Layover и TONU к одному грузу одновременно?", options: ["Да, оба применяются если водитель ждал ночь И груз отменили", "Нет, только одно из двух", "Да, но только для грузов более 500 миль", "Только если брокер одобряет оба"], correctIndex: 1 },
          { id: '8-4-q6-ru', text: "Брокер запрашивает VIN трака при бронировании. Вы должны:", options: ["Дать настоящий VIN из регистрации трака", "Предоставить Highway VIN после уточнения в рабочем чате", "Отказаться от груза — это подозрительно", "Дать любой случайный VIN"], correctIndex: 1 },
          { id: '8-4-q7-ru', text: "Средняя целевая маржа по всем грузам должна составлять:", options: ["5%", "10%", "15%", "21%"], correctIndex: 3 },
          { id: '8-4-q8-ru', text: "Водитель говорит: \"Не знаю что запросить, какой у вас таргет?\" Вы отвечаете:", options: ["\"Наш таргет $800.\"", "\"У нас нет таргета — скажите свою обычную ставку, я постараюсь её получить.\"", "\"Спросите брокера напрямую что они предлагают.\"", "\"Начните с $400 и будем договариваться.\""], correctIndex: 1 },
          { id: '8-4-q9-ru', text: "Максимальный detention за день составляет:", options: ["$100", "$150", "$200", "$300"], correctIndex: 2 },
          { id: '8-4-q10-ru', text: "Ручная погрузка до 500 фунтов оплачивается водителю:", options: ["$25", "$50", "$75", "$100"], correctIndex: 1 },
          { id: '8-4-q11-ru', text: "Трак ломается под грузом. Водитель-замена доставляет груз. Кто что получает?", options: ["Замена получает всю ставку, оригинальный водитель ничего", "Замена получает свою требуемую сумму, оригинальный водитель получает остаток от полной ставки", "Делят ставку 50/50", "Компания оставляет всю оплату"], correctIndex: 1 },
          { id: '8-4-q12-ru', text: "Расходы на печать документов должны быть:", options: ["Выставлены отдельно после доставки", "Включены в ставку до отправки на загрузку (Канада/аэропорты)", "Всегда покрыты брокером", "Вычтены из оплаты водителя"], correctIndex: 1 },
          { id: '8-4-q13-ru', text: "Аппойнтмент водителя на 10:00, загрузка началась в 10:00 но закончилась в 13:30. Когда начинается отсчёт detention?", options: ["Сразу в 10:00", "В 12:00 (через 2 часа от начала)", "В 10:00 но только после звонка водителя", "После 13:30 когда погрузка закончилась"], correctIndex: 1 },
          { id: '8-4-q14-ru', text: "Layover для Sprinter Van составляет:", options: ["$50", "$75", "$100", "$125"], correctIndex: 1 },
          { id: '8-4-q15-ru', text: "У каких грузов потенциально выше комиссия диспетчера?", options: ["Короткие городские грузы до 100 миль", "Высокоценные грузы", "Дальние грузы с большим количеством миль", "Аэропорты и Канада"], correctIndex: 2 },
          { id: '8-4-q16-ru', text: "Брокер снижает вашу заявку $900 до $820. Ставка водителя $720. Каков ваш доход при $820?", options: ["$80", "$100", "$120", "$820"], correctIndex: 1 },
          { id: '8-4-q17-ru', text: "Почему нельзя раскрывать водителю свой целевой тариф?", options: ["Это конфиденциальная информация компании", "Нужно сначала получить ставку водителя для правильного расчёта маржи", "Брокеры могут слышать звонок", "Водители сообщат на биржу грузов"], correctIndex: 1 },
          { id: '8-4-q18-ru', text: "Груз отменён. Водитель проехал 150 миль. Применяется TONU. Сколько получает водитель?", options: ["$0 — TONU не покрывает пройденные мили", "$75 за груз", "Полную оригинальную ставку", "$25 за каждую пройденную милю"], correctIndex: 1 },
          { id: '8-4-q19-ru', text: "Ручная погрузка груза 700 фунтов оплачивается:", options: ["$50", "$75", "По согласованию с диспетчером", "$100"], correctIndex: 2 },
          { id: '8-4-q20-ru', text: "После того как брокер принял вашу заявку, следующий критический шаг:", options: ["Немедленно отправить водителя", "Дождаться Rate Confirmation и проверить все детали перед отправкой", "Позвонить грузоотправителю для подтверждения времени загрузки", "Обновить Cargo ETL с информацией о грузе"], correctIndex: 1 },
        ],
      },
    },

    '9-1': {
      type: 'text',
      body: `<h2>Recovery & Problem Solving</h2><p>In US trucking, problems are not exceptions — they are part of the daily routine. Loads get cancelled, drivers break down, brokers change delivery addresses mid-route, and drivers sometimes refuse to complete a load after pickup. A dispatcher who cannot handle these situations will lose money, broker relationships, and drivers.</p><blockquote><strong>The golden rule of recovery:</strong> Every problem has a solution. The question is how fast you find it and how much it costs.</blockquote><h3>What Triggers a Recovery Situation</h3><p>Recovery is needed when the original plan fails and you must find an alternative to complete the delivery. The most common triggers are:</p><ul><li><strong>Driver cancellation</strong> — the driver refuses the load before or after pickup</li><li><strong>Truck breakdown</strong> — mechanical failure en route</li><li><strong>Load cancellation by broker</strong> — the shipper cancels or changes the load (TONU situation)</li><li><strong>Driver no-show</strong> — driver doesn't arrive at pickup</li><li><strong>Late delivery risk</strong> — ETA shows the driver will miss the delivery window</li></ul><h3>Why Drivers Cancel</h3><p>Understanding why drivers cancel helps you prevent and handle cancellations:</p><ol><li><strong>Changed their mind</strong> — found a better-paying load elsewhere</li><li><strong>Got tired of waiting</strong> — sat at a facility too long without updates</li><li><strong>Didn't read load details</strong> — realized the load doesn't match their equipment</li><li><strong>Want more money</strong> — trying to renegotiate after booking</li><li><strong>Actual issue</strong> — real breakdown or emergency (rare)</li></ol><h3>The Cardinal Rule</h3><p><strong>BEFORE YOU SIGN THE RATE CON, YOU MUST CALL THE DRIVER AND CONFIRM THEY ARE STILL DOING THE LOAD.</strong> If you sign without confirming and the driver backs out, you've created a recovery situation that was 100% preventable. This is a serious mistake that can result in penalties.</p><h3>Financial Consequences</h3><p>Every recovery situation has costs. Understanding the standard compensation structure helps you make fast decisions:</p><ul><li><strong>TONU (Truck Order Not Used)</strong> — $75 paid to the driver when a load is cancelled. Standard broker TONU is $150.</li><li><strong>Detention</strong> — $25/hour after the first 2 free hours of waiting, maximum $200/day</li><li><strong>Layover</strong> — $75 for sprinter/cargo van, $100 for box truck/large straight, paid when driver waits overnight</li><li><strong>Hand load/unload</strong> — $50 for under 500 lbs, $75 for 500-1000 lbs</li></ul><blockquote><strong>Important:</strong> Layover and TONU cannot be applied to the same load — you get one or the other.</blockquote><h3>Breakdown Compensation</h3><p>When a truck breaks down mid-load:</p><ol><li>The recovery driver gets paid their requested rate to complete the delivery</li><li>The original driver gets the remainder from the total load rate, regardless of how far they drove</li><li>Tolls and accessorials are only paid with documented receipts agreed by the company</li></ol><p>In the following lessons, you will learn the complete recovery playbook: how to verify problems, find replacement drivers, negotiate under pressure, and communicate with brokers during crises.</p><figure><img src="/wikimedia/Tow_truck_-_I-65.jpg" alt="Tow truck on Interstate 65" /><figcaption>When a truck breaks down, the dispatcher coordinates recovery — every minute of delay costs money</figcaption></figure>

      <h3>💵 Compensation Quick Reference</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr style="background:#1e293b;color:white">
          <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Type</th>
          <th style="padding:10px;text-align:center">Amount</th>
          <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">When</th>
        </tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚫 TONU (to driver)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$75</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Load cancelled after driver dispatched</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚫 TONU (from broker)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$150</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Same — broker pays more</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">⏰ Detention</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$25/hr</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">After 2 free hours, max $200/day</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🌙 Layover (Van)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$75</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Overnight wait at facility</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🌙 Layover (Box Truck)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$100</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Overnight wait at facility</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">💪 Hand load <500 lbs</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$50</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Driver loads/unloads manually</td></tr>
        <tr style="background:#fef2f2"><td style="padding:8px">💪 Hand load 500-1000 lbs</td><td style="padding:8px;text-align:center"><strong>$75</strong></td><td style="padding:8px">Driver loads/unloads manually</td></tr>
      </table>
      <blockquote><strong>⚠️ Important:</strong> Layover + TONU = NEVER on same load. Detention + Layover = CAN coexist (waited at facility + overnight).</blockquote>`,
      bodyRu: `<h2>Решение проблем и восстановление рейсов</h2><p>В грузоперевозках США проблемы — не исключение, а часть ежедневной работы. Грузы отменяются, грузовики ломаются, брокеры меняют адрес доставки в пути, а водители иногда отказываются завершать рейс после погрузки. Диспетчер, который не умеет решать такие ситуации, теряет деньги, отношения с брокерами и водителей.</p><blockquote><strong>Золотое правило восстановления:</strong> У каждой проблемы есть решение. Вопрос — как быстро вы его найдёте и сколько оно будет стоить.</blockquote><h3>Что запускает ситуацию восстановления</h3><p>Восстановление нужно, когда первоначальный план срывается и необходимо найти альтернативу для выполнения доставки. Самые частые причины:</p><ul><li><strong>Отказ водителя</strong> — водитель отказывается от груза до или после погрузки</li><li><strong>Поломка грузовика</strong> — механическая неисправность в пути</li><li><strong>Отмена груза брокером</strong> — грузоотправитель отменяет или меняет груз (ситуация TONU)</li><li><strong>Неявка водителя</strong> — водитель не приехал на погрузку</li><li><strong>Риск опоздания</strong> — ETA показывает, что водитель не успеет в окно доставки</li></ul><h3>Почему водители отказываются</h3><p>Понимание причин помогает предотвращать и решать отказы:</p><ol><li><strong>Передумал</strong> — нашёл более выгодный груз в другом месте</li><li><strong>Устал ждать</strong> — просидел на объекте слишком долго без обновлений</li><li><strong>Не прочитал детали</strong> — понял, что груз не подходит его оборудованию</li><li><strong>Хочет больше денег</strong> — пытается пересогласовать ставку после бронирования</li><li><strong>Реальная проблема</strong> — настоящая поломка или ЧП (редко)</li></ol><h3>Главное правило</h3><p><strong>ПРЕЖДЕ ЧЕМ ПОДПИСАТЬ RATE CON, ВЫ ОБЯЗАНЫ ПОЗВОНИТЬ ВОДИТЕЛЮ И ПОДТВЕРДИТЬ, ЧТО ОН ВСЁ ЕЩЁ БЕРЁТ ЭТОТ ГРУЗ.</strong> Если подпишете без подтверждения и водитель откажется — вы создали ситуацию восстановления, которую можно было на 100% предотвратить.</p><h3>Финансовые последствия</h3><p>Каждая ситуация восстановления имеет свою стоимость:</p><ul><li><strong>TONU (Truck Order Not Used)</strong> — $75 компенсация водителю при отмене груза. Стандартный TONU от брокера — $150.</li><li><strong>Detention</strong> — $25/час после первых 2 бесплатных часов ожидания, максимум $200/день</li><li><strong>Layover</strong> — $75 для спринтера, $100 для бокс трака, оплачивается при ночном ожидании</li><li><strong>Ручная погрузка/разгрузка</strong> — $50 до 500 фунтов, $75 за 500-1000 фунтов</li></ul><blockquote><strong>Важно:</strong> Layover и TONU не могут применяться к одному рейсу одновременно.</blockquote><h3>Компенсация при поломке</h3><p>Когда грузовик ломается в пути:</p><ol><li>Recovery-водитель получает свою запрошенную ставку за завершение доставки</li><li>Первоначальный водитель получает остаток от общей ставки рейса, вне зависимости от пройденного расстояния</li><li>Дорожные сборы и дополнительные расходы оплачиваются только при наличии документального подтверждения</li></ol><figure><img src="/wikimedia/Tow_truck_-_I-65.jpg" alt="Эвакуатор на Interstate 65" /><figcaption>При поломке грузовика диспетчер координирует восстановление — каждая минута простоя стоит денег</figcaption></figure>

    <h3>💵 Справочник по компенсациям</h3>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
      <tr style="background:#1e293b;color:white">
        <th style="padding:10px;text-align:left;border-radius:8px 0 0 0">Тип</th>
        <th style="padding:10px;text-align:center">Сумма</th>
        <th style="padding:10px;text-align:left;border-radius:0 8px 0 0">Когда</th>
      </tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚫 TONU (водителю)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$75</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Груз отменён после отправки</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🚫 TONU (от брокера)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$150</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Брокер платит больше</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">⏰ Detention</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$25/час</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">После 2 бесплатных часов, макс $200</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">🌙 Layover (Вэн)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$75</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Ночное ожидание</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px;border-bottom:1px solid #e2e8f0">🌙 Layover (Бокс Трак)</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$100</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Ночное ожидание</td></tr>
      <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">💪 Ручная <500 lbs</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0"><strong>$50</strong></td><td style="padding:8px;border-bottom:1px solid #e2e8f0">Водитель грузит/выгружает</td></tr>
      <tr style="background:#fef2f2"><td style="padding:8px">💪 Ручная 500-1000 lbs</td><td style="padding:8px;text-align:center"><strong>$75</strong></td><td style="padding:8px">Водитель грузит/выгружает</td></tr>
    </table>
    <blockquote><strong>⚠️ Важно:</strong> Layover + TONU = НИКОГДА за один рейс. Detention + Layover = МОЖНО (ждал на объекте + ночевал).</blockquote>`,
      quiz: {
        questions: [
          { id: 'rec-in-q1', text: "What is TONU and when does it apply?", options: ["Toll fee charged at highway exits", "Truck Order Not Used — compensation when a load is cancelled", "A type of insurance claim for damaged freight", "Tax on freight over 10,000 lbs"], correctIndex: 1 },
          { id: 'rec-in-q2', text: "What is the standard TONU payment to the driver?", options: ["$25", "$50", "$75", "$150"], correctIndex: 2 },
          { id: 'rec-in-q3', text: "Can layover and TONU be applied to the same load?", options: ["Yes, they always apply together", "No — you receive one or the other, never both", "Only if the broker agrees to both", "Yes, but only for box trucks"], correctIndex: 1 },
          { id: 'rec-in-q4', text: "What are detention rates after the free period?", options: ["$10/hour, no maximum", "$25/hour after 2 free hours, max $200/day", "$50/hour from the first minute", "$100 flat per incident"], correctIndex: 1 },
          { id: 'rec-in-q5', text: "What is the layover rate for a sprinter vs. box truck?", options: ["$50 / $75", "$75 / $100", "$100 / $150", "$150 / $200"], correctIndex: 1 },
          { id: 'rec-in-q6', text: "What must you do BEFORE signing a Rate Con?", options: ["Upload documents to Google Drive", "Call the driver to confirm they are still taking the load", "Notify the broker about driver ETA", "Send the BOL to the consignee"], correctIndex: 1 },
          { id: 'rec-in-q7', text: "When a truck breaks down mid-load, who gets paid what?", options: ["Both drivers split the rate 50/50", "Recovery driver gets their rate; original driver gets the remainder of the total load rate", "Only the recovery driver gets paid", "The original driver keeps the full rate and the recovery driver bills separately"], correctIndex: 1 },
          { id: 'rec-in-q8', text: "Which is NOT a common reason drivers cancel loads?", options: ["Found a better-paying load", "Got tired of waiting at the facility", "The broker offered them a bonus to stay", "Didn't read load details properly"], correctIndex: 2 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'rec-in-q1', text: "Что такое TONU и когда он применяется?", options: ["Дорожный сбор на выезде с шоссе", "Truck Order Not Used — компенсация при отмене груза", "Вид страхового требования за повреждённый груз", "Налог на грузы свыше 10 000 фунтов"], correctIndex: 1 },
          { id: 'rec-in-q2', text: "Какова стандартная выплата TONU водителю?", options: ["$25", "$50", "$75", "$150"], correctIndex: 2 },
          { id: 'rec-in-q3', text: "Можно ли применить layover и TONU к одному рейсу?", options: ["Да, они всегда применяются вместе", "Нет — получаете одно или другое, не оба", "Только если брокер согласен на оба", "Да, но только для бокс траков"], correctIndex: 1 },
          { id: 'rec-in-q4', text: "Какова ставка detention после бесплатного периода?", options: ["$10/час без максимума", "$25/час после 2 бесплатных часов, максимум $200/день", "$50/час с первой минуты", "$100 фиксированно за инцидент"], correctIndex: 1 },
          { id: 'rec-in-q5', text: "Какова ставка layover для спринтера и бокс трака?", options: ["$50 / $75", "$75 / $100", "$100 / $150", "$150 / $200"], correctIndex: 1 },
          { id: 'rec-in-q6', text: "Что ОБЯЗАТЕЛЬНО сделать до подписания Rate Con?", options: ["Загрузить документы в Google Drive", "Позвонить водителю и подтвердить, что он берёт груз", "Уведомить брокера о ETA водителя", "Отправить BOL грузополучателю"], correctIndex: 1 },
          { id: 'rec-in-q7', text: "При поломке в пути, кто получает сколько?", options: ["Оба водителя делят ставку 50/50", "Recovery-водитель получает свою ставку, оригинальный — остаток от общей суммы", "Только recovery-водитель получает оплату", "Оригинальный водитель сохраняет всю ставку"], correctIndex: 1 },
          { id: 'rec-in-q8', text: "Что НЕ является частой причиной отказа водителей?", options: ["Нашёл более выгодный груз", "Устал ждать на объекте", "Брокер предложил бонус за ожидание", "Не прочитал детали груза"], correctIndex: 2 },
        ],
      },
    },

    '9-2': {
      type: 'text',
      body: `<h2>The Recovery Playbook</h2><p>When a load goes wrong, you need a system — not panic. This lesson covers the complete recovery process: from verifying the problem to finding a replacement driver to closing out the situation professionally.</p><h3>Step 1: Verify the Problem</h3><p>Before you do anything, confirm what actually happened. Drivers can exaggerate, lie, or misunderstand situations.</p><blockquote><strong>Golden rule:</strong> Always ask for proof. There have been cases where drivers sent photos taken from the internet. Google reverse-image-search every breakdown photo before forwarding it to the broker.</blockquote><p>For breakdown claims, request:</p><ul><li>Photo of the truck showing the issue</li><li>Video of the engine/problem area</li><li>Exact location (GPS coordinates or nearest exit)</li></ul><p>For cancellation claims, determine the real reason by asking direct questions. The five common reasons are: changed their mind, tired of waiting, didn't read details, want more money, or actual emergency.</p><h3>Step 2: Find a Recovery Driver</h3><p>Once you confirm a recovery is needed, move fast:</p><ol><li><strong>Search your company's fleet capacity.</strong> Open CargoETL and look for available trucks near the pickup or the driver's current location. Call the owner or driver directly and explain the situation.</li><li><strong>Check with other dispatchers.</strong> Use the group chat: "Is this your driver? Is he reliable? Can I use him for recovery?" Always contact the other dispatcher before calling their driver — the driver may already be booked.</li><li><strong>Post on map.cargoetl.com.</strong> If internal options fail, post the load on the public board. You'll receive offers from external carriers. Talk to them, verify reliability, and get it covered.</li></ol><h3>When Can You Contact Another Dispatcher's Driver Directly?</h3><ul><li><strong>Usually NO</strong> — contact the dispatcher first. The driver may be negotiating another load.</li><li><strong>Exception:</strong> Urgent recovery, dispatcher unavailable (evenings, off-hours). In this case, contact the driver, then immediately notify the dispatcher.</li></ul><h3>Step 3: Handle the Driver</h3><p>Different driver types require different approaches during conflict:</p><h3>Type 1: The Negotiator ("Add $50 and I'll go")</h3><p>Apply pressure first: "You agreed to the terms and gave your rate. You must deliver what you agreed to." If they won't budge and your margin allows it, offer a partial compromise ($25-50). This is cheaper than a full recovery.</p><h3>Type 2: The Honest Mistake ("I bid by mistake")</h3><p>Use logic: "We booked this load for you, the broker is counting on us. Let's make this work." Often these drivers will cooperate if you communicate calmly.</p><h3>Type 3: The Tired Driver (waited too long)</h3><p>This is partly your fault for not managing their wait. Acknowledge the frustration, offer detention compensation, and work with the broker on timing.</p><h3>Type 4: Complete Refusal</h3><p>When nothing works, your options are:</p><ol><li>Tell the broker the truth immediately</li><li>Email to request removal from the load</li><li>Negotiate financially one more time</li><li>Find a recovery driver ASAP</li></ol><h3>The 4 Tools of Persuasion</h3><p>There is no universal script for recovery calls. You rely on four tools:</p><ul><li><strong>Pressure</strong> — "You committed to this load"</li><li><strong>Logic</strong> — "Moving to a better area will make you more money"</li><li><strong>Money</strong> — "I can add $50 if you complete this"</li><li><strong>Human connection</strong> — "I need your help here, you're my last option"</li></ul><h3>Step 4: Communicate with the Broker</h3><p>During any crisis, the broker must be updated continuously. Even if you don't have a solution yet, send an update: "We are aware of the situation and actively working on a resolution. New ETA will be provided within 30 minutes."</p><p>Remember: even major delays can be forgiven if the broker feels informed and your ETA is realistic.</p><figure><img src="/wikimedia/Tow_truck_-_I-65.jpg" alt="Tow truck on Interstate 65" /><figcaption>Roadside recovery — a reality every dispatcher must be prepared to manage</figcaption></figure>`,
      bodyRu: `<h2>Алгоритм восстановления рейсов</h2><p>Когда рейс идёт не по плану, нужна система — не паника. Этот урок охватывает полный процесс восстановления: от проверки проблемы до поиска замены и профессионального закрытия ситуации.</p><h3>Шаг 1: Проверьте проблему</h3><p>Прежде чем что-то делать, подтвердите, что реально произошло. Водители могут преувеличивать, врать или неправильно понимать ситуацию.</p><blockquote><strong>Золотое правило:</strong> Всегда просите доказательства. Были случаи, когда водители отправляли фото из интернета. Проверяйте каждое фото поломки через поиск по изображению в Google.</blockquote><p>При заявлении о поломке запросите:</p><ul><li>Фото грузовика с видимой проблемой</li><li>Видео двигателя/проблемной зоны</li><li>Точное местоположение (GPS-координаты или ближайший съезд)</li></ul><h3>Шаг 2: Найдите recovery-водителя</h3><p>Как только подтвердили необходимость восстановления, действуйте быстро:</p><ol><li><strong>Поищите в парке компании.</strong> Откройте CargoETL и найдите свободные машины рядом. Позвоните владельцу или водителю напрямую.</li><li><strong>Проверьте у других диспетчеров.</strong> В групповом чате: «Это ваш водитель? Он надёжный? Могу использовать для recovery?» Всегда связывайтесь с диспетчером до звонка его водителю.</li><li><strong>Опубликуйте на map.cargoetl.com.</strong> Если внутренние варианты не работают, разместите груз на публичной площадке.</li></ol><h3>Шаг 3: Работа с водителем</h3><h3>Тип 1: Переговорщик («Добавьте $50 и поеду»)</h3><p>Сначала давление: «Вы согласились на эти условия и назвали свою ставку. Вы обязаны доставить груз.» Если не поддаётся и маржа позволяет — предложите компромисс ($25-50).</p><h3>Тип 2: Честная ошибка («Я поставил ставку по ошибке»)</h3><p>Используйте логику: «Мы забронировали этот груз для вас, брокер рассчитывает на нас. Давайте решим это.»</p><h3>Тип 3: Усталый водитель</h3><p>Признайте его фрустрацию, предложите компенсацию за ожидание, договоритесь с брокером по срокам.</p><h3>Тип 4: Полный отказ</h3><p>Когда ничего не работает: сообщите брокеру правду, запросите снятие с рейса, попытайтесь ещё раз финансово, ищите recovery ASAP.</p><h3>4 инструмента убеждения</h3><ul><li><strong>Давление</strong> — «Вы взяли обязательство»</li><li><strong>Логика</strong> — «Переезд в лучшую зону принесёт больше денег»</li><li><strong>Деньги</strong> — «Могу добавить $50 за завершение»</li><li><strong>Человеческий контакт</strong> — «Мне нужна ваша помощь, вы мой последний вариант»</li></ul><h3>Шаг 4: Коммуникация с брокером</h3><p>Во время любого кризиса брокер должен получать обновления непрерывно. Даже если решения ещё нет: «Мы в курсе ситуации и активно работаем. Новый ETA будет предоставлен в течение 30 минут.»</p><figure><img src="/wikimedia/Tow_truck_-_I-65.jpg" alt="Эвакуатор на Interstate 65" /><figcaption>Дорожная эвакуация — реальность, к которой должен быть готов каждый диспетчер</figcaption></figure>`,
      quiz: {
        questions: [
          { id: 'rec-th-q1', text: "What is Step 1 of the recovery process?", options: ["Post the load on map.cargoetl.com", "Call the broker and explain the delay", "Verify the problem — ask for proof (photos, video, location)", "Find a recovery driver from internal fleet"], correctIndex: 2 },
          { id: 'rec-th-q2', text: "How do you verify a driver's breakdown claim is real?", options: ["Trust the driver — they have no reason to lie", "Request photo and video, then Google reverse-image-search the photo", "Ask the broker to verify the location", "Send another driver to check"], correctIndex: 1 },
          { id: 'rec-th-q3', text: "Must you contact another dispatcher before using their driver for recovery?", options: ["No — in emergencies you call the driver directly", "Yes, in most cases — the driver may already be booked", "Only if the driver is a box truck", "Only during business hours"], correctIndex: 1 },
          { id: 'rec-th-q4', text: "What website do you use to post a recovery load externally?", options: ["dat.com", "truckstop.com", "map.cargoetl.com", "freightfinder.com"], correctIndex: 2 },
          { id: 'rec-th-q5', text: "A 'Negotiator' driver wants $50 more to continue. What is your first response?", options: ["Immediately agree to the $50 to avoid delays", "Apply pressure: 'You agreed to the terms and gave your rate'", "Cancel the load and find a recovery driver", "Call the broker and ask for more money"], correctIndex: 1 },
          { id: 'rec-th-q6', text: "What are the 4 tools of persuasion for recovery calls?", options: ["Email, phone, text, fax", "Pressure, logic, money, human connection", "Threats, ultimatums, bribes, guilt", "Documentation, escalation, arbitration, litigation"], correctIndex: 1 },
          { id: 'rec-th-q7', text: "When can you bypass the other dispatcher and call their driver directly?", options: ["Whenever you need a truck urgently", "Never — always go through the dispatcher", "Urgent recovery situations when the dispatcher is unavailable (evenings, off-hours)", "Only with written approval from management"], correctIndex: 2 },
          { id: 'rec-th-q8', text: "What should you tell the broker while still working on a solution?", options: ["Nothing — only call when you have the answer", "We are aware of the situation and actively working on a resolution. New ETA in 30 minutes.", "The load is cancelled — we'll send TONU", "The driver is fine, just running a bit late"], correctIndex: 1 },
          { id: 'rec-th-q9', text: "A driver sends a photo of a broken axle. What do you do before sending it to the broker?", options: ["Send it immediately to show transparency", "Google reverse-image-search to verify it is not from the internet", "Ask the driver to take another photo from a different angle", "Call a mechanic to confirm the damage type"], correctIndex: 1 },
          { id: 'rec-th-q10', text: "What is the correct process when using another dispatcher's available driver?", options: ["Call the driver → book the load → notify the dispatcher later", "Post in group chat → contact dispatcher → confirm availability → get approval → call driver", "Email management → wait for approval → call the driver", "Call the driver directly — dispatchers don't need to coordinate"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'rec-th-q1', text: "Каков шаг 1 процесса восстановления?", options: ["Опубликовать груз на map.cargoetl.com", "Позвонить брокеру и объяснить задержку", "Проверить проблему — запросить доказательства (фото, видео, локация)", "Найти recovery-водителя из своего парка"], correctIndex: 2 },
          { id: 'rec-th-q2', text: "Как проверить, что поломка водителя реальна?", options: ["Доверять водителю — у него нет причин врать", "Запросить фото и видео, затем проверить фото через поиск по изображению в Google", "Попросить брокера проверить локацию", "Отправить другого водителя для проверки"], correctIndex: 1 },
          { id: 'rec-th-q3', text: "Нужно ли связываться с другим диспетчером перед использованием его водителя?", options: ["Нет — в экстренных случаях звоните водителю напрямую", "Да, в большинстве случаев — водитель может быть уже забронирован", "Только если водитель на бокс траке", "Только в рабочее время"], correctIndex: 1 },
          { id: 'rec-th-q4', text: "На каком сайте размещают recovery-груз извне?", options: ["dat.com", "truckstop.com", "map.cargoetl.com", "freightfinder.com"], correctIndex: 2 },
          { id: 'rec-th-q5', text: "Водитель-переговорщик хочет +$50. Ваш первый ответ?", options: ["Сразу согласиться, чтобы избежать задержки", "Давление: «Вы согласились на условия и назвали свою ставку»", "Отменить груз и искать recovery", "Позвонить брокеру и попросить больше денег"], correctIndex: 1 },
          { id: 'rec-th-q6', text: "Каковы 4 инструмента убеждения при recovery?", options: ["Email, телефон, SMS, факс", "Давление, логика, деньги, человеческий контакт", "Угрозы, ультиматумы, взятки, вина", "Документация, эскалация, арбитраж, суд"], correctIndex: 1 },
          { id: 'rec-th-q7', text: "Когда можно звонить водителю другого диспетчера напрямую?", options: ["Когда срочно нужен грузовик", "Никогда", "Срочное восстановление, когда диспетчер недоступен (вечер, нерабочее время)", "Только с письменного одобрения руководства"], correctIndex: 2 },
          { id: 'rec-th-q8', text: "Что сказать брокеру, пока вы ещё ищете решение?", options: ["Ничего — звоните только с готовым ответом", "Мы в курсе ситуации и активно работаем. Новый ETA через 30 минут.", "Груз отменён — оформляем TONU", "Водитель в порядке, просто немного задерживается"], correctIndex: 1 },
          { id: 'rec-th-q9', text: "Водитель прислал фото сломанной оси. Что вы делаете до отправки брокеру?", options: ["Отправляете сразу для прозрачности", "Проверяете через поиск по изображению, что фото не из интернета", "Просите водителя сделать другой ракурс", "Звоните механику для подтверждения"], correctIndex: 1 },
          { id: 'rec-th-q10', text: "Правильный процесс при использовании водителя другого диспетчера?", options: ["Звонок водителю → бронирование → уведомление диспетчера потом", "Сообщение в чат → связь с диспетчером → подтверждение доступности → одобрение → звонок водителю", "Email руководству → ожидание одобрения → звонок водителю", "Звонок водителю напрямую — диспетчерам не нужно координироваться"], correctIndex: 1 },
        ],
      },
    },

    '9-3': {
      type: 'text',
      body: `<h2>Crisis Management — Live Simulation</h2><p>Welcome to the Crisis Dashboard. In real dispatching, problems don't come one at a time — they pile up. You might be handling a driver breakdown while a broker calls about a late delivery and another driver wants to drop their load.</p><p>This simulation puts you in the seat of a dispatcher managing multiple crises simultaneously. You must triage, prioritize, and resolve each situation using the recovery playbook you learned.</p><blockquote><strong>Key principle:</strong> Triage first. The load closest to failure gets your attention first. A driver who is 30 minutes from missing a delivery window is more urgent than a driver who wants $50 more.</blockquote><h3>What You Will Practice</h3><ul><li><strong>Driver no-show</strong> — The pickup is in 15 minutes and the driver isn't answering. Find a replacement.</li><li><strong>Mid-route breakdown</strong> — Verify the claim, find recovery, update the broker.</li><li><strong>Driver wants more money</strong> — Use the 4 persuasion tools to keep the load moving.</li><li><strong>Detention escalation</strong> — Calculate detention owed, calm the driver, update the broker.</li></ul><p>Use the interactive Crisis Dashboard below to practice managing all four crises at once.</p><figure><img src="/wikimedia/Roadside_Assistance_in_New_York.jpg" alt="Roadside assistance on US interstate" /><figcaption>Real-world crisis recovery — every minute counts when freight is on the line</figcaption></figure>`,
      bodyRu: `<h2>Управление кризисами — живая симуляция</h2><p>Добро пожаловать в Кризисный дашборд. В реальной работе диспетчера проблемы не приходят по одной — они накапливаются. Вы можете решать поломку одного водителя, пока брокер звонит по поводу опоздания, а третий водитель хочет бросить груз.</p><p>Эта симуляция помещает вас на место диспетчера, управляющего несколькими кризисами одновременно. Вы должны определить приоритеты и решить каждую ситуацию, используя изученный алгоритм.</p><blockquote><strong>Ключевой принцип:</strong> Сначала триаж. Груз, ближайший к провалу, получает ваше внимание первым. Водитель, который через 30 минут пропустит окно доставки — важнее водителя, который просит +$50.</blockquote><h3>Что вы будете практиковать</h3><ul><li><strong>Неявка водителя</strong> — до погрузки 15 минут, водитель не отвечает. Найдите замену.</li><li><strong>Поломка в пути</strong> — проверьте заявление, найдите recovery, обновите брокера.</li><li><strong>Водитель хочет больше денег</strong> — используйте 4 инструмента убеждения.</li><li><strong>Эскалация detention</strong> — рассчитайте сумму, успокойте водителя, обновите брокера.</li></ul><p>Используйте интерактивный Кризисный дашборд ниже для практики.</p><figure><img src="/wikimedia/Roadside_Assistance_in_New_York.jpg" alt="Дорожная помощь на шоссе США" /><figcaption>Реальное кризисное восстановление — каждая минута на счету</figcaption></figure>`,
      crisisDashboard: true,
      quiz: {
        questions: [
          { id: 'rec-dm-q1', text: "It is 30 minutes before pickup and the driver is not responding. What are your first 3 actions?", options: ["Wait 30 more minutes, then call the broker", "Call driver 3 times → search internal fleet for nearby trucks → notify broker with realistic new ETA", "Email the driver and wait for response", "Cancel the load immediately and request TONU"], correctIndex: 1 },
          { id: 'rec-dm-q2', text: "A driver has waited 4 hours at pickup. How much detention is owed?", options: ["$100 (4 hours × $25)", "$50 (2 paid hours × $25, first 2 hours free)", "$200 (maximum per day)", "$0 (detention only applies at delivery)"], correctIndex: 1 },
          { id: 'rec-dm-q3', text: "A recovery driver wants $500 for a load paying $800. Original driver drove 200 of 600 miles. How does pay split?", options: ["Recovery driver: $500, Original driver: $300 (remainder of $800)", "Recovery driver: $500, Original driver: $0 (they didn't complete)", "Recovery driver: $400, Original driver: $400 (split evenly)", "Recovery driver: $500, Original driver: $200 (proportional to miles)"], correctIndex: 0 },
          { id: 'rec-dm-q4', text: "Your driver refuses to deliver and the broker asks what's happening. What do you say?", options: ["Tell them the driver quit and you have no solution", "We are experiencing a driver issue and actively arranging recovery. I will update you with a new ETA within 30 minutes.", "Blame the driver by name and ask the broker for TONU", "Say nothing until you have a recovery driver confirmed"], correctIndex: 1 },
          { id: 'rec-dm-q5', text: "Which crisis should you handle FIRST: (A) Driver wants $50 more, (B) Driver 30 min from missing delivery window, (C) New driver can't log into app?", options: ["A — money issues can escalate quickly", "B — the delivery window is the most time-critical", "C — the new driver needs help first", "All three simultaneously — dispatchers must multitask"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'rec-dm-q1', text: "До погрузки 30 минут, водитель не отвечает. Ваши первые 3 действия?", options: ["Подождать ещё 30 минут, затем звонить брокеру", "3 звонка водителю → поиск машин в своём парке → уведомление брокера с новым ETA", "Написать email водителю и ждать ответа", "Отменить груз и запросить TONU"], correctIndex: 1 },
          { id: 'rec-dm-q2', text: "Водитель ждёт 4 часа на погрузке. Сколько detention положено?", options: ["$100 (4 часа × $25)", "$50 (2 оплачиваемых часа × $25, первые 2 бесплатно)", "$200 (максимум в день)", "$0 (detention только на доставке)"], correctIndex: 1 },
          { id: 'rec-dm-q3', text: "Recovery-водитель хочет $500 за груз стоимостью $800. Оригинальный проехал 200 из 600 миль. Как делится оплата?", options: ["Recovery: $500, Оригинальный: $300 (остаток от $800)", "Recovery: $500, Оригинальный: $0", "Recovery: $400, Оригинальный: $400", "Recovery: $500, Оригинальный: $200 (пропорционально)"], correctIndex: 0 },
          { id: 'rec-dm-q4', text: "Водитель отказывается доставлять, брокер спрашивает что происходит. Что вы говорите?", options: ["Водитель уволился, решения нет", "У нас возникла проблема с водителем, мы активно организуем recovery. Обновлю ETA в течение 30 минут.", "Назвать водителя по имени и попросить TONU", "Молчать до подтверждения recovery"], correctIndex: 1 },
          { id: 'rec-dm-q5', text: "Какой кризис решать ПЕРВЫМ: (A) Водитель хочет +$50, (B) Водитель через 30 мин пропустит окно доставки, (C) Новый водитель не может зайти в приложение?", options: ["A — денежные вопросы эскалируются быстро", "B — окно доставки самое критичное по времени", "C — новому водителю нужна помощь первому", "Все три одновременно"], correctIndex: 1 },
        ],
      },
    },

    '9-4': {
      type: 'text',
      body: `<h2>Practice — Chapter 9: Recovery & Problem Solving</h2><p>This practice test covers all recovery scenarios from Chapter 9: TONU, detention, layover, breakdown handling, driver conflict types, recovery driver search process, broker communication during crises, and multi-crisis triage.</p><p>The test contains <strong>20 questions</strong> — 15 standard questions and 5 mini-case scenarios.</p><blockquote><strong>Goal:</strong> Score 80% or higher (16 out of 20) to pass.</blockquote>`,
      bodyRu: `<h2>Практика — Глава 9: Решение проблем и восстановление</h2><p>Этот тест охватывает все сценарии восстановления из Главы 9: TONU, detention, layover, обработка поломок, типы конфликтов с водителями, процесс поиска recovery-водителя, коммуникация с брокерами при кризисах и триаж нескольких кризисов.</p><p>Тест содержит <strong>20 вопросов</strong> — 15 стандартных и 5 мини-кейсов.</p><blockquote><strong>Цель:</strong> Набрать 80% и выше (16 из 20).</blockquote>`,
      quiz: {
        questions: [
          { id: 'rec-pr-q1', text: "What is TONU?", options: ["A type of truck insurance", "Truck Order Not Used — compensation paid when a load is cancelled", "Tax on freight crossing state lines", "A trucking industry union"], correctIndex: 1 },
          { id: 'rec-pr-q2', text: "Standard TONU from the broker is:", options: ["$50", "$75", "$100", "$150"], correctIndex: 3 },
          { id: 'rec-pr-q3', text: "Detention starts being paid after:", options: ["30 minutes", "1 hour", "2 hours", "4 hours"], correctIndex: 2 },
          { id: 'rec-pr-q4', text: "Maximum detention per day is:", options: ["$100", "$150", "$200", "Unlimited"], correctIndex: 2 },
          { id: 'rec-pr-q5', text: "Layover for a box truck/large straight is:", options: ["$50", "$75", "$100", "$150"], correctIndex: 2 },
          { id: 'rec-pr-q6', text: "Can layover and TONU be applied to the same load?", options: ["Yes, always", "No, never — one or the other", "Only for loads over 500 miles", "Only with broker approval"], correctIndex: 1 },
          { id: 'rec-pr-q7', text: "Hand loading/unloading for freight under 500 lbs pays:", options: ["$25", "$50", "$75", "$100"], correctIndex: 1 },
          { id: 'rec-pr-q8', text: "What is the FIRST step when a driver claims breakdown?", options: ["Call the broker immediately", "Request photo, video, and exact location as proof", "Find a recovery driver", "Cancel the load"], correctIndex: 1 },
          { id: 'rec-pr-q9', text: "Why should you Google reverse-image-search breakdown photos?", options: ["To find the nearest mechanic", "To verify the photo is real and not taken from the internet", "To estimate repair costs", "To identify the truck model"], correctIndex: 1 },
          { id: 'rec-pr-q10', text: "When internal recovery options fail, where do you post the load?", options: ["Facebook Marketplace", "map.cargoetl.com", "Craigslist", "The company website"], correctIndex: 1 },
          { id: 'rec-pr-q11', text: "A Type 1 'Negotiator' driver wants more money. What is your first approach?", options: ["Immediately agree to their demand", "Apply pressure: you agreed to the terms", "Cancel the load", "Offer double the original rate"], correctIndex: 1 },
          { id: 'rec-pr-q12', text: "What should you tell the broker during an active crisis before you have a solution?", options: ["Nothing until resolved", "We are aware and working on it. New ETA within 30 minutes.", "The load is cancelled", "Blame the driver and provide their phone number"], correctIndex: 1 },
          { id: 'rec-pr-q13', text: "When can you contact another dispatcher's driver directly?", options: ["Anytime you need a truck", "Only in urgent recovery when the dispatcher is unavailable", "Never", "Only on weekdays"], correctIndex: 1 },
          { id: 'rec-pr-q14', text: "What is the correct process for using another dispatcher's driver?", options: ["Call driver → book → tell dispatcher later", "Group chat → contact dispatcher → confirm → get approval → call driver", "Email management for approval", "Post it publicly and let drivers respond"], correctIndex: 1 },
          { id: 'rec-pr-q15', text: "If a truck breaks down, the recovery driver gets:", options: ["Half the original rate", "Their requested rate for completing the delivery", "The full original rate minus fuel costs", "A flat $200 recovery fee"], correctIndex: 1 },
          { id: 'rec-pr-q16', text: "Mini-case: A driver sends a photo of a broken axle. You Google it and find the exact same image on a mechanic's website from 2023. What do you do?", options: ["Accept the photo and tell the broker about the breakdown", "Confront the driver: 'This photo is from the internet. Send me a real photo of YOUR truck right now or I'm reporting this.' If they can't provide proof, treat it as a refusal and start recovery.", "Ignore it and find a recovery driver anyway", "Fire the driver immediately"], correctIndex: 1 },
          { id: 'rec-pr-q17', text: "Mini-case: Original driver cancelled 1 hour before pickup. Recovery driver is 45 min away and wants $100 more than original rate. Your margin was $150. Do you take it?", options: ["No — you'd lose money on the deal", "Yes — $150 margin minus $100 extra still leaves $50 profit, and saves the broker relationship. Take it.", "Only if the broker agrees to pay extra", "Decline and post on map.cargoetl.com instead"], correctIndex: 1 },
          { id: 'rec-pr-q18', text: "Mini-case: Driver arrived at delivery at 5 PM, appointment is 7 AM next day. Is layover applicable?", options: ["No — the driver chose to arrive early", "Yes — the driver must wait overnight (7+ hours) through no fault of their own. Layover applies: $75 sprinter, $100 box truck.", "Only if the broker pre-approved layover", "No — layover only applies at pickup facilities"], correctIndex: 1 },
          { id: 'rec-pr-q19', text: "Mini-case: Broker calls saying 'I'm sending a dry run for the load, they made a mistake setting it up.' Your driver drove 30 miles to pickup. What happens?", options: ["Driver gets nothing — dry runs don't qualify for TONU", "Confirm with broker: 'So we get TONU and this load is cancelled?' Driver receives $75 TONU compensation.", "Driver keeps the full load rate", "You charge the broker for the 30 empty miles at market rate"], correctIndex: 1 },
          { id: 'rec-pr-q20', text: "Mini-case: You have 3 active crises: (A) Load A driver is 2 hours late to delivery, (B) Load B driver wants to drop the load after pickup, (C) Load C broker asking for update but driver tracking stopped. Priority order?", options: ["C, B, A — broker communication always comes first", "B, A, C — loaded freight at risk is most critical, then late delivery, then tracking issue", "A, B, C — late delivery first since the appointment is closest", "Handle all three simultaneously with the same priority"], correctIndex: 1 },
        ],
      },
      quizRu: {
        questions: [
          { id: 'rec-pr-q1', text: "Что такое TONU?", options: ["Вид страховки грузовиков", "Truck Order Not Used — компенсация при отмене груза", "Налог на межштатные грузы", "Профсоюз грузоперевозчиков"], correctIndex: 1 },
          { id: 'rec-pr-q2', text: "Стандартный TONU от брокера:", options: ["$50", "$75", "$100", "$150"], correctIndex: 3 },
          { id: 'rec-pr-q3', text: "Detention начинает оплачиваться после:", options: ["30 минут", "1 часа", "2 часов", "4 часов"], correctIndex: 2 },
          { id: 'rec-pr-q4', text: "Максимум detention за день:", options: ["$100", "$150", "$200", "Без лимита"], correctIndex: 2 },
          { id: 'rec-pr-q5', text: "Layover для бокс трака:", options: ["$50", "$75", "$100", "$150"], correctIndex: 2 },
          { id: 'rec-pr-q6', text: "Можно ли получить layover и TONU за один рейс?", options: ["Да, всегда", "Нет — одно или другое", "Только для рейсов свыше 500 миль", "Только с согласия брокера"], correctIndex: 1 },
          { id: 'rec-pr-q7', text: "Ручная погрузка/разгрузка до 500 фунтов:", options: ["$25", "$50", "$75", "$100"], correctIndex: 1 },
          { id: 'rec-pr-q8', text: "Первый шаг при заявлении водителя о поломке?", options: ["Звонок брокеру", "Запросить фото, видео и точную локацию", "Искать recovery", "Отменить груз"], correctIndex: 1 },
          { id: 'rec-pr-q9', text: "Зачем проверять фото поломки через поиск по изображению?", options: ["Найти ближайшего механика", "Убедиться, что фото реальное, а не из интернета", "Оценить стоимость ремонта", "Определить модель грузовика"], correctIndex: 1 },
          { id: 'rec-pr-q10', text: "Куда публиковать груз, если внутренние варианты исчерпаны?", options: ["Facebook", "map.cargoetl.com", "Craigslist", "Сайт компании"], correctIndex: 1 },
          { id: 'rec-pr-q11', text: "Водитель-переговорщик хочет больше денег. Ваш первый подход?", options: ["Сразу согласиться", "Давление: вы согласились на условия", "Отменить груз", "Предложить двойную ставку"], correctIndex: 1 },
          { id: 'rec-pr-q12', text: "Что сказать брокеру во время кризиса до нахождения решения?", options: ["Ничего до решения", "Мы в курсе и работаем. Новый ETA через 30 минут.", "Груз отменён", "Виноват водитель, вот его телефон"], correctIndex: 1 },
          { id: 'rec-pr-q13', text: "Когда можно звонить водителю другого диспетчера напрямую?", options: ["Когда нужен грузовик", "Только при срочном recovery, когда диспетчер недоступен", "Никогда", "Только в будни"], correctIndex: 1 },
          { id: 'rec-pr-q14', text: "Правильный процесс использования водителя другого диспетчера?", options: ["Звонок водителю → бронирование → сообщить диспетчеру потом", "Чат → связь с диспетчером → подтверждение → одобрение → звонок водителю", "Email руководству", "Публикация и ожидание откликов"], correctIndex: 1 },
          { id: 'rec-pr-q15', text: "При поломке recovery-водитель получает:", options: ["Половину ставки", "Свою запрошенную ставку за завершение доставки", "Полную ставку минус топливо", "Фиксированные $200"], correctIndex: 1 },
          { id: 'rec-pr-q16', text: "Мини-кейс: Водитель прислал фото сломанной оси. Вы нашли это фото на сайте механика 2023 года. Что делаете?", options: ["Принимаете и сообщаете брокеру", "Конфронтация: «Это фото из интернета. Пришлите реальное фото ВАШЕГО грузовика.» Если не может — это отказ, начинаете recovery.", "Игнорируете и ищете recovery", "Увольняете водителя"], correctIndex: 1 },
          { id: 'rec-pr-q17', text: "Мини-кейс: Водитель отменил за 1 час до погрузки. Recovery-водитель в 45 мин, хочет +$100. Ваша маржа $150. Берёте?", options: ["Нет — потеряете деньги", "Да — $150 минус $100 = $50 прибыли, плюс сохранение отношений с брокером", "Только если брокер доплатит", "Нет, публикуем на map.cargoetl.com"], correctIndex: 1 },
          { id: 'rec-pr-q18', text: "Мини-кейс: Водитель прибыл на доставку в 17:00, приём в 7:00 следующего дня. Положен ли layover?", options: ["Нет — водитель приехал рано сам", "Да — водитель ждёт ночь (7+ часов). Layover: $75 спринтер, $100 бокс трак.", "Только с предварительного одобрения брокера", "Нет — layover только на погрузке"], correctIndex: 1 },
          { id: 'rec-pr-q19', text: "Мини-кейс: Брокер говорит «Отправляю dry run, ошиблись при оформлении». Водитель проехал 30 миль до погрузки. Что происходит?", options: ["Водитель ничего не получает", "Подтвердить: «Значит, TONU и груз отменён?» Водитель получает $75.", "Водитель сохраняет полную ставку", "Выставить счёт за 30 порожних миль"], correctIndex: 1 },
          { id: 'rec-pr-q20', text: "Мини-кейс: 3 кризиса: (A) Водитель опаздывает на доставку на 2 часа, (B) Водитель хочет бросить груз после погрузки, (C) Брокер просит обновление, но трекинг остановился. Приоритет?", options: ["C, B, A — коммуникация с брокером всегда первая", "B, A, C — загруженный груз под угрозой самый критичный, затем опоздание, затем трекинг", "A, B, C — опоздание первым", "Все три одновременно"], correctIndex: 1 },
        ],
      },
    },

  };

  return contents[`${chapter}-${lesson}`] ?? { type: 'text', body: `Content for chapter ${chapter}, lesson ${lesson} — coming soon.`, bodyRu: `Контент главы ${chapter}, урок ${lesson} — скоро будет.` };
}

async function main() {
  const hash = (p: string) => bcrypt.hash(p, 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.dev' },
    update: {},
    create: {
      email: 'admin@lms.dev',
      passwordHash: await hash('Admin123!'),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@lms.dev' },
    update: {},
    create: {
      email: 'manager@lms.dev',
      passwordHash: await hash('Manager123!'),
      firstName: 'Anna',
      lastName: 'Manager',
      role: UserRole.MANAGER,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@lms.dev' },
    update: {},
    create: {
      email: 'student@lms.dev',
      passwordHash: await hash('Student123!'),
      firstName: 'Ivan',
      lastName: 'Novikov',
      role: UserRole.STUDENT,
      managerId: manager.id,
    },
  });

  // Reset all progress for test student (clean slate for proper chapter progression)
  await prisma.lessonProgress.deleteMany({ where: { userId: student.id } });
  await prisma.chapterProgress.deleteMany({ where: { userId: student.id } });

  // Course
  const course = await prisma.course.upsert({
    where: { id: 'course-dispatchers-v1' },
    update: {},
    create: {
      id: 'course-dispatchers-v1',
      title: 'Dispatcher Training — US Trucking',
      description: 'From zero to first deal in 21 days.',
      status: ContentStatus.PUBLISHED,
    },
  });

  const chapterTitles = [
    'Introduction to US Trucking',
    'Geography & Time Zones',
    'Equipment Types',
    'Documentation (Rate Con, BOL, POD)',
    'Load Board Platform',
    'Communication with Brokers',
    'Communication with Drivers',
    'Bidding & Deal Closing',
    'Recovery & Problem Solving',
  ];

  for (let i = 0; i < chapterTitles.length; i++) {
    const chapter = await prisma.chapter.upsert({
      where: { id: `chapter-${i + 1}` },
      update: {},
      create: {
        id: `chapter-${i + 1}`,
        courseId: course.id,
        title: chapterTitles[i],
        order: i + 1,
        status: i === 0 ? ContentStatus.PUBLISHED : ContentStatus.PUBLISHED,
        passThreshold: 80,
      },
    });

    const lessonTypes: LessonType[] = [
      LessonType.INTRO,
      LessonType.THEORY,
      LessonType.DEMO,
      LessonType.PRACTICE,
    ];

    // Unlock only first chapter for test student
    if (i === 0) {
      await prisma.chapterProgress.upsert({
        where: { userId_chapterId: { userId: student.id, chapterId: chapter.id } },
        update: { status: ProgressStatus.IN_PROGRESS },
        create: { userId: student.id, chapterId: chapter.id, status: ProgressStatus.IN_PROGRESS },
      });
    }

    for (let j = 0; j < lessonTypes.length; j++) {
      const lesson = await prisma.lesson.upsert({
        where: { id: `lesson-${i + 1}-${j + 1}` },
        update: { content: getContent(i + 1, j + 1) },
        create: {
          id: `lesson-${i + 1}-${j + 1}`,
          chapterId: chapter.id,
          type: lessonTypes[j],
          title: `${lessonTypes[j].charAt(0) + lessonTypes[j].slice(1).toLowerCase()} — ${chapterTitles[i]}`,
          order: j + 1,
          status: ContentStatus.PUBLISHED,
          content: getContent(i + 1, j + 1),
        },
      });

      // Unlock only first lesson of first chapter for test student
      if (i === 0 && j === 0) {
        await prisma.lessonProgress.upsert({
          where: { userId_lessonId: { userId: student.id, lessonId: lesson.id } },
          update: {},
          create: { userId: student.id, lessonId: lesson.id, status: ProgressStatus.IN_PROGRESS },
        });
      }
    }

    // Sample question
    const q = await prisma.question.create({
      data: {
        chapterId: chapter.id,
        text: `Sample question for chapter ${i + 1}?`,
        explanation: 'This is the explanation.',
        order: 1,
      },
    });
    await prisma.questionOption.createMany({
      data: [
        { questionId: q.id, text: 'Correct answer', isCorrect: true, order: 1 },
        { questionId: q.id, text: 'Wrong answer A', isCorrect: false, order: 2 },
        { questionId: q.id, text: 'Wrong answer B', isCorrect: false, order: 3 },
        { questionId: q.id, text: 'Wrong answer C', isCorrect: false, order: 4 },
      ],
      skipDuplicates: true,
    });
  }

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
