// Professional flat-design SVG illustrations for dispatch questions
// Clean, industry-appropriate, adult audience

type IllustrationKey =
  | 'supply_chain' | 'rpm_calc' | 'deadhead' | 'ftl_ltl' | 'otr_map'
  | 'lane_route' | 'dispatcher_ops' | 'accessorials' | 'load_board'
  | 'mc_badge' | 'negotiation' | 'timezone_usa' | 'dead_zone'
  | 'freight_zones_map' | 'backhaul' | 'reefer_truck' | 'dry_van'
  | 'flatbed' | 'weight_station' | 'step_deck' | 'liftgate'
  | 'cdl_card' | 'tanker' | 'hotshot' | 'lowboy'
  | 'rate_con' | 'bol_doc' | 'pod_sign' | 'w9_form'
  | 'carrier_packet' | 'detention_timer' | 'damage_claim'
  | 'insurance_doc' | 'invoice_billing' | 'driver_dispatch'
  | 'hos_clock' | 'breakdown_scene' | 'drop_hook'
  | 'bid_process' | 'factoring' | 'double_broker' | 'spot_market';

const SVG = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 280 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="280" height="130" rx="12" fill="#f8fafc" />
    {children}
  </svg>
);

// ─── Supply Chain ─────────────────────────────────────────────────────────────
const SupplyChain = () => (
  <SVG>
    {/* Boxes */}
    {[
      { x: 8, label: 'SHIPPER', color: '#3b82f6', sub: 'Отправитель' },
      { x: 76, label: 'BROKER', color: '#8b5cf6', sub: 'Посредник' },
      { x: 144, label: 'CARRIER', color: '#22c55e', sub: 'Перевозчик' },
      { x: 212, label: 'CONSIGNEE', color: '#f59e0b', sub: 'Получатель' },
    ].map(({ x, label, color, sub }) => (
      <g key={label}>
        <rect x={x} y="30" width="60" height="36" rx="6" fill={color} />
        <text x={x + 30} y="53" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">{label}</text>
        <text x={x + 30} y="84" textAnchor="middle" fontSize="7" fill="#64748b">{sub}</text>
      </g>
    ))}
    {/* Arrows */}
    {[68, 136, 204].map(x => (
      <g key={x}>
        <line x1={x} y1="48" x2={x + 8} y2="48" stroke="#cbd5e1" strokeWidth="1.5" />
        <polygon points={`${x + 8},44 ${x + 8},52 ${x + 13},48`} fill="#cbd5e1" />
      </g>
    ))}
    {/* Dispatcher below */}
    <rect x="100" y="96" width="80" height="26" rx="6" fill="#0ea5e9" />
    <text x="140" y="113" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">DISPATCHER</text>
    {/* Dotted lines to broker and carrier */}
    <line x1="140" y1="96" x2="106" y2="66" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="140" y1="96" x2="174" y2="66" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2" />
    {/* Title */}
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Цепочка грузоперевозок</text>
  </SVG>
);

// ─── RPM Calculation ──────────────────────────────────────────────────────────
const RpmCalc = () => (
  <SVG>
    <rect x="20" y="20" width="240" height="90" rx="10" fill="#1e293b" />
    <text x="140" y="44" textAnchor="middle" fontSize="9" fill="#94a3b8" letterSpacing="2">РАСЧЁТ СТАВКИ</text>
    {/* Formula */}
    <text x="60" y="72" textAnchor="middle" fontSize="20" fontWeight="black" fill="#22c55e">$2,400</text>
    <text x="113" y="72" textAnchor="middle" fontSize="20" fill="#64748b">÷</text>
    <text x="160" y="72" textAnchor="middle" fontSize="20" fontWeight="black" fill="#60a5fa">800 mi</text>
    <text x="210" y="72" textAnchor="middle" fontSize="20" fill="#64748b">=</text>
    <text x="253" y="72" textAnchor="middle" fontSize="18" fontWeight="black" fill="#fbbf24">$3.00</text>
    {/* Labels */}
    <text x="60" y="88" textAnchor="middle" fontSize="7" fill="#64748b">Ставка</text>
    <text x="160" y="88" textAnchor="middle" fontSize="7" fill="#64748b">Мили</text>
    <text x="253" y="88" textAnchor="middle" fontSize="7" fill="#fbbf24">RPM</text>
    {/* Underline */}
    <line x1="190" y1="77" x2="270" y2="77" stroke="#fbbf24" strokeWidth="1" />
    <text x="140" y="118" textAnchor="middle" fontSize="8" fill="#94a3b8">Rate Per Mile = Общая ставка ÷ Расстояние</text>
  </SVG>
);

// ─── Deadhead / Empty Truck ───────────────────────────────────────────────────
const Deadhead = () => (
  <SVG>
    <text x="140" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Deadhead Miles</text>
    {/* Road */}
    <rect x="10" y="88" width="260" height="20" rx="4" fill="#e2e8f0" />
    <line x1="20" y1="98" x2="50" y2="98" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
    <line x1="80" y1="98" x2="110" y2="98" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
    <line x1="140" y1="98" x2="170" y2="98" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
    <line x1="200" y1="98" x2="230" y2="98" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
    {/* Empty trailer */}
    <rect x="40" y="58" width="100" height="32" rx="3" fill="white" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,3" />
    <text x="90" y="79" textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="bold">EMPTY</text>
    {/* Cab */}
    <rect x="140" y="52" width="42" height="38" rx="4" fill="#475569" />
    <rect x="143" y="55" width="18" height="14" rx="3" fill="#bfdbfe" />
    {/* Wheels */}
    <circle cx="60" cy="94" r="7" fill="#334155" /><circle cx="60" cy="94" r="3" fill="#64748b" />
    <circle cx="110" cy="94" r="7" fill="#334155" /><circle cx="110" cy="94" r="3" fill="#64748b" />
    <circle cx="155" cy="94" r="7" fill="#334155" /><circle cx="155" cy="94" r="3" fill="#64748b" />
    <circle cx="172" cy="94" r="7" fill="#334155" /><circle cx="172" cy="94" r="3" fill="#64748b" />
    {/* Cost indicator */}
    <rect x="192" y="52" width="76" height="36" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5" />
    <text x="230" y="68" textAnchor="middle" fontSize="8" fill="#ef4444" fontWeight="bold">Без дохода</text>
    <text x="230" y="80" textAnchor="middle" fontSize="7" fill="#dc2626">Топливо + Износ</text>
    {/* Down arrow */}
    <text x="230" y="96" textAnchor="middle" fontSize="12" fill="#dc2626">↓</text>
    <text x="140" y="120" textAnchor="middle" fontSize="8" fill="#64748b">Езда без груза — расходы без прибыли</text>
  </SVG>
);

// ─── FTL vs LTL ───────────────────────────────────────────────────────────────
const FtlLtl = () => (
  <SVG>
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">FTL vs LTL</text>
    {/* FTL */}
    <rect x="14" y="24" width="116" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
    <text x="72" y="40" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">FTL — Full Truckload</text>
    {/* FTL trailer with one company */}
    <rect x="22" y="48" width="100" height="50" rx="3" fill="white" stroke="#93c5fd" strokeWidth="1.5" />
    {[0,1,2,3,4].map(i => (
      <rect key={i} x={26 + i*18} y="52" width="14" height="40" rx="2" fill="#3b82f6" opacity="0.7" />
    ))}
    <text x="72" y="108" textAnchor="middle" fontSize="7" fill="#1d4ed8">Один отправитель</text>

    {/* LTL */}
    <rect x="150" y="24" width="116" height="90" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
    <text x="208" y="40" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#15803d">LTL — Less Than Truckload</text>
    {/* LTL trailer with multiple companies */}
    <rect x="158" y="48" width="100" height="50" rx="3" fill="white" stroke="#86efac" strokeWidth="1.5" />
    {[
      { x: 162, color: '#3b82f6' },
      { x: 180, color: '#3b82f6' },
      { x: 198, color: '#22c55e' },
      { x: 216, color: '#22c55e' },
      { x: 234, color: '#f59e0b' },
    ].map((b, i) => (
      <rect key={i} x={b.x} y="52" width="14" height="40" rx="2" fill={b.color} opacity="0.7" />
    ))}
    <line x1="212" y1="50" x2="212" y2="96" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="230" y1="50" x2="230" y2="96" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" />
    <text x="208" y="108" textAnchor="middle" fontSize="7" fill="#15803d">3 отправителя вместе</text>
  </SVG>
);

// ─── OTR Highway Map ──────────────────────────────────────────────────────────
const OtrMap = () => (
  <SVG>
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">OTR — Over The Road</text>
    {/* US map outline simplified */}
    <path d="M30 35 L55 28 L100 30 L150 26 L200 30 L240 28 L255 40 L258 70 L245 85 L200 92 L150 94 L100 92 L55 95 L35 85 L25 65 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
    {/* Highway route */}
    <path d="M55 75 Q100 50 140 60 Q190 68 230 45" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeDasharray="6,4" />
    {/* Cities */}
    <circle cx="55" cy="75" r="6" fill="#3b82f6" /><text x="55" y="90" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1e293b">LA</text>
    <circle cx="140" cy="60" r="5" fill="#3b82f6" /><text x="140" y="75" textAnchor="middle" fontSize="7" fill="#1e293b">CHI</text>
    <circle cx="230" cy="45" r="6" fill="#3b82f6" /><text x="230" y="60" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1e293b">NYC</text>
    {/* Arrow on route */}
    <polygon points="175,52 168,46 168,58" fill="#ef4444" />
    {/* Distance badge */}
    <rect x="95" y="95" width="90" height="22" rx="6" fill="#1e293b" />
    <text x="140" y="110" textAnchor="middle" fontSize="8" fill="#fbbf24" fontWeight="bold">2,800+ MILES</text>
  </SVG>
);

// ─── Lane Route ───────────────────────────────────────────────────────────────
const LaneRoute = () => (
  <SVG>
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Freight Lane — Маршрут</text>
    {/* City A */}
    <circle cx="44" cy="65" r="24" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
    <text x="44" y="62" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1d4ed8">CHI</text>
    <text x="44" y="74" textAnchor="middle" fontSize="7" fill="#3b82f6">CAGO</text>
    {/* City B */}
    <circle cx="236" cy="65" r="24" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
    <text x="236" y="62" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803d">ATL</text>
    <text x="236" y="74" textAnchor="middle" fontSize="7" fill="#22c55e">ANTA</text>
    {/* Route arrow */}
    <line x1="70" y1="65" x2="210" y2="65" stroke="#64748b" strokeWidth="2" strokeDasharray="8,4" />
    <polygon points="210,60 210,70 220,65" fill="#64748b" />
    {/* Truck icon on route */}
    <rect x="122" y="53" width="36" height="15" rx="3" fill="#475569" />
    <rect x="138" y="48" width="16" height="17" rx="3" fill="#334155" />
    <rect x="140" y="50" width="10" height="8" rx="2" fill="#93c5fd" />
    {/* Distance */}
    <rect x="95" y="100" width="90" height="22" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <text x="140" y="115" textAnchor="middle" fontSize="8" fill="#475569">730 miles · CT → ET</text>
  </SVG>
);

// ─── Dispatcher Operations ───────────────────────────────────────────────────
const DispatcherOps = () => (
  <SVG>
    <text x="140" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Диспетчер — Центр управления</text>
    {/* Desk */}
    <rect x="50" y="70" width="180" height="45" rx="6" fill="#334155" />
    {/* Monitor 1 */}
    <rect x="62" y="38" width="60" height="38" rx="4" fill="#1e293b" />
    <rect x="65" y="41" width="54" height="26" rx="2" fill="#0f172a" />
    {[0,1,2].map(i => (
      <rect key={i} x="67" y={43 + i*8} width={20 + i*10} height="5" rx="1" fill={['#22c55e','#60a5fa','#fbbf24'][i]} opacity="0.8" />
    ))}
    <rect x="88" y="76" width="8" height="6" rx="1" fill="#334155" />
    {/* Monitor 2 */}
    <rect x="158" y="38" width="60" height="38" rx="4" fill="#1e293b" />
    <rect x="161" y="41" width="54" height="26" rx="2" fill="#0f172a" />
    <text x="188" y="52" textAnchor="middle" fontSize="6" fill="#22c55e">DAT LOAD BOARD</text>
    {[0,1].map(i => (
      <rect key={i} x="163" y={56 + i*6} width="50" height="4" rx="1" fill="#1e293b" stroke="#22c55e" strokeWidth="0.5" />
    ))}
    <rect x="184" y="76" width="8" height="6" rx="1" fill="#334155" />
    {/* Headset icon */}
    <circle cx="140" cy="55" r="16" fill="#475569" />
    <text x="140" y="58" textAnchor="middle" fontSize="12">🎧</text>
    {/* Phone lines */}
    <text x="140" y="122" textAnchor="middle" fontSize="8" fill="#64748b">Грузы · Брокеры · Водители</text>
  </SVG>
);

// ─── Accessorials ────────────────────────────────────────────────────────────
const Accessorials = () => (
  <SVG>
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Accessorial Charges</text>
    {[
      { icon: '⏱', label: 'Detention', sub: '$50–75/hr', color: '#fef3c7', border: '#fbbf24', y: 28 },
      { icon: '⛽', label: 'Fuel Surcharge (FSC)', sub: '+$0.15–0.30/mi', color: '#eff6ff', border: '#60a5fa', y: 66 },
      { icon: '🏗', label: 'Liftgate', sub: '+$50–150', color: '#f0fdf4', border: '#22c55e', y: 104 },
    ].map(({ icon, label, sub, color, border, y }) => (
      <g key={label}>
        <rect x="14" y={y - 2} width="252" height="30" rx="8" fill={color} stroke={border} strokeWidth="1" />
        <text x="30" y={y + 17} fontSize="14">{icon}</text>
        <text x="55" y={y + 12} fontSize="9" fontWeight="bold" fill="#1e293b">{label}</text>
        <text x="55" y={y + 23} fontSize="8" fill="#64748b">{sub}</text>
        <rect x="224" y={y + 3} width="36" height="18" rx="6" fill={border} opacity="0.2" />
        <text x="242" y={y + 15} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1e293b">+EXTRA</text>
      </g>
    ))}
  </SVG>
);

// ─── Load Board DAT Screen ────────────────────────────────────────────────────
const LoadBoard = () => (
  <SVG>
    {/* Screen frame */}
    <rect x="16" y="12" width="248" height="106" rx="8" fill="#0f172a" />
    {/* Header bar */}
    <rect x="16" y="12" width="248" height="20" rx="8" fill="#1e3a5f" />
    <rect x="16" y="24" width="248" height="8" fill="#1e3a5f" />
    <circle cx="30" cy="22" r="4" fill="#ef4444" />
    <circle cx="44" cy="22" r="4" fill="#fbbf24" />
    <circle cx="58" cy="22" r="4" fill="#22c55e" />
    <text x="158" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#60a5fa">DAT LOAD BOARD</text>
    {/* Column headers */}
    <rect x="18" y="32" width="244" height="14" fill="#1e293b" />
    {['ORIGIN', 'DEST', 'EQUIP', 'MILES', 'RATE', 'DH-O', 'AGE'].map((h, i) => (
      <text key={h} x={24 + i * 34} y="43" fontSize="6" fontWeight="bold" fill="#94a3b8">{h}</text>
    ))}
    {/* Rows */}
    {[
      { orig: 'Chicago, IL', dest: 'Atlanta, GA', eq: 'DV', mi: '730', rate: '$2.80', dh: '12', age: '5m', high: true },
      { orig: 'Dallas, TX', dest: 'Houston, TX', eq: 'RF', mi: '245', rate: '$3.10', dh: '5', age: '12m', high: false },
      { orig: 'LA, CA', dest: 'Phoenix, AZ', eq: 'DV', mi: '372', rate: '$2.40', dh: '22', age: '1h', high: false },
      { orig: 'Nashville, TN', dest: 'NYC, NY', eq: 'DV', mi: '900', rate: '$3.50', dh: '8', age: '2m', high: false },
    ].map((r, i) => (
      <g key={i}>
        <rect x="18" y={46 + i * 16} width="244" height="15" rx="1" fill={r.high ? '#1e3a5f' : i % 2 === 0 ? '#1e293b' : '#0f172a'} />
        {r.high && <rect x="18" y={46 + i * 16} width="3" height="15" fill="#22c55e" />}
        <text x="24" y={57 + i * 16} fontSize="6" fill={r.high ? '#86efac' : '#94a3b8'}>{r.orig}</text>
        <text x="58" y={57 + i * 16} fontSize="6" fill={r.high ? '#86efac' : '#94a3b8'}>{r.dest}</text>
        <text x="94" y={57 + i * 16} fontSize="6" fill={r.high ? '#fbbf24' : '#64748b'}>{r.eq}</text>
        <text x="126" y={57 + i * 16} fontSize="6" fill="#94a3b8">{r.mi}</text>
        <text x="158" y={57 + i * 16} fontSize="6" fontWeight="bold" fill={r.high ? '#22c55e' : '#60a5fa'}>{r.rate}</text>
        <text x="192" y={57 + i * 16} fontSize="6" fill="#94a3b8">{r.dh}</text>
        <text x="222" y={57 + i * 16} fontSize="6" fill={r.age.includes('m') && parseInt(r.age) < 10 ? '#22c55e' : '#94a3b8'}>{r.age}</text>
      </g>
    ))}
    <text x="140" y="122" textAnchor="middle" fontSize="8" fill="#64748b">DH-O = Deadhead miles to pickup</text>
  </SVG>
);

// ─── MC/DOT Badge ─────────────────────────────────────────────────────────────
const McBadge = () => (
  <SVG>
    <text x="140" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Federal Carrier Authority</text>
    <rect x="30" y="24" width="100" height="82" rx="10" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
    <text x="80" y="44" textAnchor="middle" fontSize="7" fill="#93c5fd" letterSpacing="2">FMCSA</text>
    <rect x="40" y="48" width="80" height="3" fill="#3b82f6" opacity="0.5" />
    <text x="80" y="66" textAnchor="middle" fontSize="8" fill="#94a3b8">MC NUMBER</text>
    <text x="80" y="80" textAnchor="middle" fontSize="14" fontWeight="black" fill="#60a5fa">#1234567</text>
    <rect x="40" y="86" width="80" height="3" fill="#3b82f6" opacity="0.5" />
    <text x="80" y="98" textAnchor="middle" fontSize="7" fill="#64748b">INTERSTATE</text>

    <rect x="150" y="24" width="100" height="82" rx="10" fill="#0f2b1a" stroke="#22c55e" strokeWidth="2" />
    <text x="200" y="44" textAnchor="middle" fontSize="7" fill="#86efac" letterSpacing="2">DOT</text>
    <rect x="160" y="48" width="80" height="3" fill="#22c55e" opacity="0.5" />
    <text x="200" y="66" textAnchor="middle" fontSize="8" fill="#94a3b8">DOT NUMBER</text>
    <text x="200" y="80" textAnchor="middle" fontSize="14" fontWeight="black" fill="#22c55e">#9876543</text>
    <rect x="160" y="86" width="80" height="3" fill="#22c55e" opacity="0.5" />
    <text x="200" y="98" textAnchor="middle" fontSize="7" fill="#64748b">SAFETY ID</text>
    <text x="140" y="122" textAnchor="middle" fontSize="8" fill="#64748b">MC# = Перевозка · DOT# = Безопасность</text>
  </SVG>
);

// ─── Negotiation ─────────────────────────────────────────────────────────────
const Negotiation = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Переговоры о ставке</text>
    {/* Dispatcher side */}
    <rect x="10" y="22" width="110" height="56" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
    <text x="65" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">DISPATCHER</text>
    <text x="65" y="52" textAnchor="middle" fontSize="9" fontWeight="black" fill="#22c55e">"$2.80 RPM"</text>
    <text x="65" y="65" textAnchor="middle" fontSize="7" fill="#3b82f6">+DAT данные</text>
    {/* Arrow right */}
    <polygon points="132,46 132,56 144,51" fill="#94a3b8" />
    {/* Arrow left */}
    <polygon points="148,56 148,46 136,51" fill="#94a3b8" />
    {/* Broker side */}
    <rect x="160" y="22" width="110" height="56" rx="10" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
    <text x="215" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400e">BROKER</text>
    <text x="215" y="52" textAnchor="middle" fontSize="9" fontWeight="black" fill="#ef4444">"$2.30 RPM"</text>
    <text x="215" y="65" textAnchor="middle" fontSize="7" fill="#b45309">best I can do</text>
    {/* Deal box */}
    <rect x="60" y="90" width="160" height="28" rx="8" fill="#1e293b" />
    <text x="140" y="102" textAnchor="middle" fontSize="8" fill="#94a3b8">ИТОГ:</text>
    <text x="140" y="113" textAnchor="middle" fontSize="10" fontWeight="black" fill="#22c55e">DEAL $2.60 RPM ✓</text>
  </SVG>
);

// ─── Timezone USA ─────────────────────────────────────────────────────────────
const TimezoneUsa = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Часовые пояса США</text>
    {/* Map zones */}
    <path d="M22 25 L72 20 L72 100 L22 100 Z" fill="#bfdbfe" stroke="white" strokeWidth="1.5" />
    <path d="M72 20 L122 22 L122 102 L72 100 Z" fill="#bbf7d0" stroke="white" strokeWidth="1.5" />
    <path d="M122 22 L172 24 L172 102 L122 102 Z" fill="#fde68a" stroke="white" strokeWidth="1.5" />
    <path d="M172 24 L228 22 L232 104 L172 102 Z" fill="#fca5a5" stroke="white" strokeWidth="1.5" />
    {/* Clip to map shape roughly */}
    {/* Zone labels */}
    {[
      { x: 47, zone: 'PT', utc: 'UTC−8', color: '#1d4ed8' },
      { x: 97, zone: 'MT', utc: 'UTC−7', color: '#15803d' },
      { x: 147, zone: 'CT', utc: 'UTC−6', color: '#92400e' },
      { x: 200, zone: 'ET', utc: 'UTC−5', color: '#991b1b' },
    ].map(({ x, zone, utc, color }) => (
      <g key={zone}>
        <text x={x} y="58" textAnchor="middle" fontSize="12" fontWeight="black" fill={color}>{zone}</text>
        <text x={x} y="72" textAnchor="middle" fontSize="7" fill={color} opacity="0.8">{utc}</text>
      </g>
    ))}
    {/* Time examples */}
    <rect x="16" y="106" width="248" height="18" rx="6" fill="#1e293b" />
    <text x="140" y="119" textAnchor="middle" fontSize="7.5" fill="#94a3b8">
      PT 09:00 · MT 10:00 · CT 11:00 · ET 12:00
    </text>
  </SVG>
);

// ─── Dead Zone Map ────────────────────────────────────────────────────────────
const DeadZone = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Dead Zones — Мёртвые зоны</text>
    {/* USA outline */}
    <path d="M25 28 L60 22 L115 24 L165 20 L215 24 L248 28 L252 68 L240 82 L205 90 L160 92 L115 90 L65 92 L35 82 L22 65 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
    {/* Dead zones (red) */}
    <ellipse cx="220" cy="70" rx="24" ry="28" fill="#fca5a5" opacity="0.8" />{/* Florida */}
    <ellipse cx="240" cy="38" rx="16" ry="14" fill="#fca5a5" opacity="0.7" />{/* Maine */}
    <ellipse cx="38" cy="55" rx="16" ry="18" fill="#fca5a5" opacity="0.6" />{/* West Coast edge */}
    {/* Good zones (green) */}
    <ellipse cx="130" cy="52" rx="30" ry="22" fill="#bbf7d0" opacity="0.8" />{/* Great Lakes */}
    <ellipse cx="155" cy="68" rx="20" ry="16" fill="#bbf7d0" opacity="0.6" />{/* Industrial Belt */}
    {/* Labels */}
    <text x="220" y="68" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#dc2626">FL</text>
    <text x="240" y="36" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#dc2626">ME</text>
    <text x="130" y="50" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#15803d">✓ GOOD</text>
    {/* Legend */}
    <rect x="20" y="100" width="100" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1" />
    <rect x="26" y="107" width="10" height="8" rx="2" fill="#fca5a5" />
    <text x="40" y="115" fontSize="7" fill="#1e293b">Dead Zone</text>
    <rect x="152" y="100" width="108" height="22" rx="5" fill="white" stroke="#e2e8f0" strokeWidth="1" />
    <rect x="158" y="107" width="10" height="8" rx="2" fill="#bbf7d0" />
    <text x="172" y="115" fontSize="7" fill="#1e293b">Good Area</text>
  </SVG>
);

// ─── Freight Zones Map ────────────────────────────────────────────────────────
const FreightZonesMap = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Фрахтовые зоны США</text>
    {/* USA outline */}
    <path d="M25 28 L60 22 L115 24 L165 20 L215 24 L248 28 L252 68 L240 82 L205 90 L160 92 L115 90 L65 92 L35 82 L22 65 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
    {/* Zones by color */}
    {/* Zone 9 Great Lakes - GREEN */}
    <ellipse cx="135" cy="48" rx="32" ry="20" fill="#22c55e" opacity="0.7" />
    <text x="135" y="51" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">9 ★</text>
    {/* Zone 8 Industrial - LIGHT GREEN */}
    <ellipse cx="162" cy="62" rx="22" ry="16" fill="#86efac" opacity="0.8" />
    <text x="162" y="65" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#15803d">8</text>
    {/* Zone 7 Texas/South - YELLOW */}
    <ellipse cx="110" cy="76" rx="28" ry="15" fill="#fde68a" opacity="0.8" />
    <text x="110" y="79" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#92400e">7 TX</text>
    {/* Zone 1 West Coast - LIGHT BLUE */}
    <ellipse cx="38" cy="52" rx="16" ry="22" fill="#bfdbfe" opacity="0.8" />
    <text x="38" y="55" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1d4ed8">1</text>
    {/* Florida dead - RED */}
    <ellipse cx="220" cy="72" rx="20" ry="22" fill="#fca5a5" opacity="0.7" />
    <text x="220" y="75" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#dc2626">FL ✗</text>
    {/* Legend */}
    <rect x="14" y="100" width="252" height="24" rx="6" fill="#1e293b" />
    {[
      { color: '#22c55e', label: '9=BEST' },
      { color: '#86efac', label: '8=GOOD' },
      { color: '#fde68a', label: '7=NSB' },
      { color: '#bfdbfe', label: '1=NSB' },
      { color: '#fca5a5', label: 'DEAD' },
    ].map(({ color, label }, i) => (
      <g key={label}>
        <rect x={20 + i * 48} y="107" width="10" height="10" rx="2" fill={color} />
        <text x={33 + i * 48} y="116" fontSize="6.5" fill="#94a3b8">{label}</text>
      </g>
    ))}
  </SVG>
);

// ─── Backhaul ────────────────────────────────────────────────────────────────
const Backhaul = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Backhaul — Обратный рейс</text>
    {/* City A */}
    <rect x="14" y="34" width="70" height="30" rx="8" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.5" />
    <text x="49" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1d4ed8">ORIGIN</text>
    {/* City B */}
    <rect x="196" y="34" width="70" height="30" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
    <text x="231" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803d">DEST</text>
    {/* Forward arrow - loaded */}
    <line x1="86" y1="45" x2="194" y2="45" stroke="#22c55e" strokeWidth="3" />
    <polygon points="194,40 194,50 202,45" fill="#22c55e" />
    <rect x="120" y="36" width="44" height="16" rx="4" fill="#22c55e" />
    <text x="142" y="47" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">LOADED ✓</text>
    {/* Return arrow - empty/backhaul */}
    <line x1="194" y1="63" x2="86" y2="63" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
    <polygon points="86,58 86,68 78,63" fill="#f59e0b" />
    <rect x="112" y="56" width="60" height="16" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
    <text x="142" y="67" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">BACKHAUL</text>
    {/* Warning */}
    <rect x="14" y="88" width="252" height="30" rx="8" fill="#fffbeb" stroke="#fcd34d" strokeWidth="1" />
    <text x="140" y="100" textAnchor="middle" fontSize="8" fill="#92400e">⚠ Планируй backhaul до пикапа!</text>
    <text x="140" y="112" textAnchor="middle" fontSize="7" fill="#b45309">Из мёртвых зон обратный груз найти сложно</text>
  </SVG>
);

// ─── Reefer Truck ─────────────────────────────────────────────────────────────
const ReeferTruck = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Reefer — Рефрижератор</text>
    {/* Road */}
    <rect x="10" y="90" width="260" height="16" rx="4" fill="#e2e8f0" />
    {/* Reefer trailer */}
    <rect x="30" y="54" width="120" height="38" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
    {/* Cold unit on top */}
    <rect x="38" y="44" width="30" height="14" rx="3" fill="#1e3a5f" />
    <text x="53" y="54" textAnchor="middle" fontSize="6" fill="#60a5fa">❄ UNIT</text>
    {/* Cab */}
    <rect x="150" y="48" width="50" height="44" rx="4" fill="#334155" />
    <rect x="153" y="51" width="24" height="16" rx="3" fill="#bfdbfe" />
    {/* Temp indicator */}
    <rect x="38" y="58" width="50" height="28" rx="4" fill="#1e3a5f" />
    <text x="63" y="68" textAnchor="middle" fontSize="7" fill="#94a3b8">TEMP</text>
    <text x="63" y="80" textAnchor="middle" fontSize="12" fontWeight="black" fill="#60a5fa">−18°C</text>
    {/* Cargo icons */}
    {['🥩','🥦','💊'].map((icon, i) => (
      <text key={i} x={100 + i * 18} y="80" fontSize="12">{icon}</text>
    ))}
    {/* Wheels */}
    {[50, 100, 160, 180].map(x => (
      <g key={x}><circle cx={x} cy="96" r="7" fill="#1e293b" /><circle cx={x} cy="96" r="3" fill="#475569" /></g>
    ))}
    <text x="140" y="120" textAnchor="middle" fontSize="8" fill="#3b82f6">Продукты · Фармацевтика · Цветы</text>
  </SVG>
);

// ─── Dry Van Dimensions ───────────────────────────────────────────────────────
const DryVan = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Dry Van — 53 ft Trailer</text>
    {/* Trailer outline */}
    <rect x="20" y="30" width="180" height="60" rx="4" fill="white" stroke="#475569" strokeWidth="2" />
    {/* Pallets inside */}
    {Array.from({ length: 6 }).map((_, i) => (
      <rect key={i} x={26 + i * 28} y="35" width="22" height="50" rx="2" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
    ))}
    {/* Dimension arrows */}
    {/* Width */}
    <line x1="20" y1="22" x2="200" y2="22" stroke="#ef4444" strokeWidth="1.5" />
    <polygon points="20,18 20,26 14,22" fill="#ef4444" />
    <polygon points="200,18 200,26 206,22" fill="#ef4444" />
    <rect x="88" y="16" width="44" height="14" rx="4" fill="#ef4444" />
    <text x="110" y="26" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">53 FEET</text>
    {/* Height */}
    <line x1="210" y1="30" x2="210" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
    <polygon points="206,30 214,30 210,24" fill="#3b82f6" />
    <polygon points="206,90 214,90 210,96" fill="#3b82f6" />
    <rect x="215" y="52" width="42" height="14" rx="4" fill="#3b82f6" />
    <text x="236" y="62" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">9 FEET</text>
    {/* Info */}
    <rect x="20" y="96" width="180" height="24" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <text x="110" y="107" textAnchor="middle" fontSize="7" fill="#475569">Ширина: 8.5 ft · До 26 паллет · Max 44,000 lbs</text>
    <text x="110" y="117" textAnchor="middle" fontSize="7" fill="#475569">Сухие грузы · Без температурного контроля</text>
  </SVG>
);

// ─── Flatbed with Cargo ───────────────────────────────────────────────────────
const Flatbed = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Flatbed — Открытая платформа</text>
    {/* Road */}
    <rect x="10" y="100" width="260" height="16" rx="4" fill="#e2e8f0" />
    {/* Platform */}
    <rect x="20" y="82" width="170" height="12" rx="2" fill="#475569" />
    {/* Steel beams on flatbed */}
    {[0,1,2].map(i => (
      <rect key={i} x="25" y={60 - i * 7} width="158" height="5" rx="1" fill="#94a3b8" />
    ))}
    {/* Straps */}
    {[50, 100, 150].map(x => (
      <g key={x}>
        <line x1={x} y1="40" x2={x - 4} y2="82" stroke="#f59e0b" strokeWidth="2" />
        <line x1={x} y1="40" x2={x + 4} y2="82" stroke="#f59e0b" strokeWidth="2" />
      </g>
    ))}
    {/* Cab */}
    <rect x="188" y="56" width="52" height="38" rx="4" fill="#334155" />
    <rect x="191" y="59" width="24" height="16" rx="3" fill="#bfdbfe" />
    {/* Wheels */}
    {[40, 90, 195, 215].map(x => (
      <g key={x}><circle cx={x} cy="104" r="8" fill="#1e293b" /><circle cx={x} cy="104" r="3" fill="#475569" /></g>
    ))}
    {/* Label */}
    <rect x="14" y="118" width="252" height="8" rx="3" fill="transparent" />
    <text x="140" y="124" textAnchor="middle" fontSize="7.5" fill="#64748b">Балки · Трубы · Техника · Строй­материалы</text>
  </SVG>
);

// ─── Weight Station ───────────────────────────────────────────────────────────
const WeightStation = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Federal Weight Limit</text>
    {/* Main sign */}
    <rect x="40" y="22" width="200" height="80" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
    <rect x="46" y="28" width="188" height="68" rx="8" fill="#0f172a" />
    {/* DOT shield */}
    <path d="M70 44 L90 38 L110 44 L110 74 L90 82 L70 74 Z" fill="#3b82f6" />
    <text x="90" y="58" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">DOT</text>
    <text x="90" y="69" textAnchor="middle" fontSize="6" fill="#bfdbfe">FMCSA</text>
    {/* Weight info */}
    <text x="188" y="48" textAnchor="middle" fontSize="8" fill="#94a3b8">FEDERAL LIMIT</text>
    <text x="188" y="66" textAnchor="middle" fontSize="20" fontWeight="black" fill="#ef4444">80,000</text>
    <text x="188" y="80" textAnchor="middle" fontSize="8" fill="#fbbf24">POUNDS</text>
    {/* Post */}
    <rect x="130" y="102" width="20" height="20" rx="2" fill="#475569" />
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">~36 тонн · Превышение = Разрешение</text>
  </SVG>
);

// ─── Step Deck ────────────────────────────────────────────────────────────────
const StepDeck = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Step Deck vs Standard Flatbed</text>
    {/* Standard Flatbed */}
    <text x="70" y="28" textAnchor="middle" fontSize="8" fill="#64748b">Standard Flatbed</text>
    <rect x="14" y="32" width="112" height="8" rx="2" fill="#64748b" />
    <rect x="50" y="18" width="70" height="16" rx="2" fill="#94a3b8" opacity="0.5" />
    <text x="85" y="29" textAnchor="middle" fontSize="6" fill="#475569">10ft high</text>
    <line x1="120" y1="18" x2="120" y2="40" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
    <text x="127" y="30" fontSize="6" fill="#ef4444">MAX</text>
    {/* Step Deck */}
    <text x="210" y="28" textAnchor="middle" fontSize="8" fill="#3b82f6">Step Deck ✓</text>
    <rect x="154" y="32" width="50" height="8" rx="2" fill="#3b82f6" />
    <rect x="154" y="46" width="112" height="8" rx="2" fill="#3b82f6" />
    {/* Taller cargo */}
    <rect x="158" y="14" width="44" height="34" rx="2" fill="#bfdbfe" />
    <text x="180" y="33" textAnchor="middle" fontSize="6" fill="#1d4ed8">11ft OK</text>
    {/* Arrow showing extra height */}
    <line x1="205" y1="14" x2="205" y2="48" stroke="#22c55e" strokeWidth="1.5" />
    <polygon points="201,14 209,14 205,8" fill="#22c55e" />
    <polygon points="201,48 209,48 205,54" fill="#22c55e" />
    <text x="218" y="34" fontSize="6" fill="#22c55e">+2ft</text>
    {/* Wheels */}
    {[30, 80, 168, 240].map(x => (
      <g key={x}><circle cx={x} cy="44" r="6" fill="#1e293b" /><circle cx={x} cy="44" r="2.5" fill="#475569" /></g>
    ))}
    <text x="140" y="120" textAnchor="middle" fontSize="8" fill="#64748b">Пониженная платформа = выше груз без разрешения</text>
  </SVG>
);

// ─── Liftgate ────────────────────────────────────────────────────────────────
const Liftgate = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Liftgate — Гидравлический подъёмник</text>
    {/* Truck back */}
    <rect x="80" y="30" width="100" height="60" rx="4" fill="#475569" />
    <rect x="85" y="35" width="90" height="50" rx="2" fill="#334155" />
    {/* Floor level */}
    <rect x="80" y="90" width="100" height="4" fill="#94a3b8" />
    {/* Liftgate platform */}
    <rect x="80" y="92" width="100" height="10" rx="2" fill="#64748b" />
    {/* Pallet on liftgate */}
    <rect x="98" y="78" width="40" height="14" rx="2" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
    <text x="118" y="88" textAnchor="middle" fontSize="6" fill="#92400e">BOX</text>
    {/* Arrow indicating lowering */}
    <line x1="200" y1="50" x2="200" y2="90" stroke="#22c55e" strokeWidth="2" />
    <polygon points="196,90 204,90 200,96" fill="#22c55e" />
    <text x="218" y="74" fontSize="7" fill="#22c55e">DOWN</text>
    {/* Ground */}
    <rect x="14" y="106" width="252" height="8" rx="2" fill="#e2e8f0" />
    {/* Charge badge */}
    <rect x="14" y="116" width="252" height="10" rx="3" fill="transparent" />
    <text x="140" y="124" textAnchor="middle" fontSize="8" fill="#64748b">Нет loading dock → +$50–150 accessorial</text>
  </SVG>
);

// ─── CDL License Card ─────────────────────────────────────────────────────────
const CdlCard = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">CDL — Commercial Driver's License</text>
    {/* Card */}
    <rect x="40" y="22" width="200" height="96" rx="10" fill="#1e3a5f" />
    <rect x="46" y="28" width="188" height="30" rx="6" fill="#1e293b" />
    <text x="100" y="48" textAnchor="middle" fontSize="8" fill="#94a3b8">CLASS A CDL</text>
    <text x="210" y="44" textAnchor="middle" fontSize="22" fill="#fbbf24">🪪</text>
    {/* Fields */}
    <text x="54" y="72" fontSize="7" fill="#94a3b8">NAME:</text>
    <text x="86" y="72" fontSize="8" fontWeight="bold" fill="white">JOHN DRIVER</text>
    <text x="54" y="84" fontSize="7" fill="#94a3b8">CLASS:</text>
    <rect x="80" y="76" width="30" height="12" rx="4" fill="#3b82f6" />
    <text x="95" y="85" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">CLASS A</text>
    <text x="54" y="96" fontSize="7" fill="#94a3b8">GVWR:</text>
    <text x="86" y="96" fontSize="7" fill="#60a5fa">&gt; 26,001 lbs</text>
    <text x="54" y="108" fontSize="7" fill="#94a3b8">STATE:</text>
    <text x="86" y="108" fontSize="7" fill="#22c55e">ILLINOIS · CDL-A</text>
    <text x="140" y="128" textAnchor="middle" fontSize="7.5" fill="#64748b">Обязателен свыше 26,001 lbs GVWR</text>
  </SVG>
);

// ─── Tanker ───────────────────────────────────────────────────────────────────
const Tanker = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Tanker — Цистерна</text>
    {/* Road */}
    <rect x="10" y="96" width="260" height="16" rx="4" fill="#e2e8f0" />
    {/* Tank body */}
    <ellipse cx="110" cy="70" rx="90" ry="22" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
    <ellipse cx="110" cy="70" rx="86" ry="18" fill="#cbd5e1" />
    {/* Tank rings */}
    {[50, 90, 130, 170].map(x => (
      <line key={x} x1={x} y1="50" x2={x} y2="90" stroke="#94a3b8" strokeWidth="1.5" />
    ))}
    {/* Hazmat diamond */}
    <rect x="86" y="56" width="48" height="28" rx="2" fill="#ef4444" transform="rotate(0 110 70)" />
    <text x="110" y="68" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">HAZMAT</text>
    <text x="110" y="78" textAnchor="middle" fontSize="6" fill="white">FLAMMABLE</text>
    {/* Cab */}
    <rect x="194" y="56" width="48" height="40" rx="4" fill="#334155" />
    <rect x="197" y="59" width="22" height="14" rx="3" fill="#bfdbfe" />
    {/* Wheels */}
    {[40, 90, 200, 220].map(x => (
      <g key={x}><circle cx={x} cy="100" r="7" fill="#1e293b" /><circle cx={x} cy="100" r="3" fill="#475569" /></g>
    ))}
    <text x="140" y="122" textAnchor="middle" fontSize="7.5" fill="#64748b">Топливо · Химикаты · Пищевые жидкости</text>
  </SVG>
);

// ─── Hotshot Pickup ───────────────────────────────────────────────────────────
const Hotshot = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Hotshot — Срочная малая доставка</text>
    {/* Road */}
    <rect x="10" y="98" width="260" height="16" rx="4" fill="#e2e8f0" />
    {/* Pickup truck */}
    <rect x="148" y="58" width="72" height="40" rx="4" fill="#ef4444" />
    <rect x="182" y="48" width="38" height="22" rx="4" fill="#dc2626" />
    <rect x="185" y="51" width="20" height="14" rx="3" fill="#bfdbfe" />
    {/* Gooseneck trailer */}
    <path d="M 148 75 Q 130 75 128 65 L 22 65 L 22 85 L 148 85 Z" fill="#475569" />
    {/* Small cargo on trailer */}
    <rect x="28" y="52" width="90" height="14" rx="2" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
    <text x="73" y="62" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">URGENT CARGO</text>
    {/* Wheels */}
    {[50, 100, 155, 195].map(x => (
      <g key={x}><circle cx={x} cy="100" r="7" fill="#1e293b" /><circle cx={x} cy="100" r="3" fill="#475569" /></g>
    ))}
    {/* Speed lines */}
    {[10, 18, 26].map(y => (
      <line key={y} x1="10" y1={y + 60} x2="22" y2={y + 60} stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
    ))}
    <text x="140" y="124" textAnchor="middle" fontSize="7.5" fill="#64748b">1-ton pickup + gooseneck · Нефтяная отрасль</text>
  </SVG>
);

// ─── Lowboy Trailer ────────────────────────────────────────────────────────────
const Lowboy = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Lowboy — Тяжёлая техника</text>
    {/* Road */}
    <rect x="10" y="102" width="260" height="16" rx="4" fill="#e2e8f0" />
    {/* Very low platform */}
    <rect x="20" y="88" width="180" height="10" rx="2" fill="#334155" />
    {/* Heavy equipment on platform */}
    <rect x="30" y="48" width="100" height="42" rx="4" fill="#fbbf24" />
    <rect x="30" y="56" width="40" height="34" rx="3" fill="#d97706" />
    {/* Excavator arm */}
    <path d="M60 56 L90 30 L120 40 L110 56" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
    <path d="M110 56 L128 70 L118 76 L100 62" fill="#d97706" />
    <text x="160" y="74" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#475569">EXCAVATOR</text>
    {/* Cab */}
    <rect x="196" y="58" width="52" height="44" rx="4" fill="#334155" />
    <rect x="199" y="61" width="24" height="16" rx="3" fill="#bfdbfe" />
    {/* Low wheels */}
    {[40, 70, 120, 200, 220].map(x => (
      <g key={x}><circle cx={x} cy="104" r="8" fill="#1e293b" /><circle cx={x} cy="104" r="3.5" fill="#475569" /></g>
    ))}
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">18-24 дюйма от земли · Бульдозеры · Краны</text>
  </SVG>
);

// ─── Rate Con Document ────────────────────────────────────────────────────────
const RateCon = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Rate Confirmation (Rate Con)</text>
    {/* Document */}
    <rect x="30" y="20" width="220" height="98" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    {/* Header */}
    <rect x="30" y="20" width="220" height="24" rx="8" fill="#1e3a5f" />
    <rect x="30" y="36" width="220" height="8" fill="#1e3a5f" />
    <text x="140" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">RATE CONFIRMATION</text>
    {/* Fields */}
    {[
      { label: 'Pickup:', value: 'Chicago, IL · Mon 08:00 CT', y: 58 },
      { label: 'Delivery:', value: 'Atlanta, GA · Tue 18:00 ET', y: 70 },
      { label: 'Equipment:', value: 'Dry Van 53\'', y: 82 },
      { label: 'Rate/Pay:', value: '$2,300.00 ALL-IN', y: 94, highlight: true },
    ].map(({ label, value, y, highlight }) => (
      <g key={label}>
        <text x="38" y={y} fontSize="7.5" fill="#64748b">{label}</text>
        <text x="88" y={y} fontSize="7.5" fontWeight={highlight ? 'bold' : 'normal'} fill={highlight ? '#22c55e' : '#1e293b'}>{value}</text>
        {highlight && <rect x="84" y={y - 11} width="150" height="14" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />}
        {highlight && <text x="88" y={y} fontSize="7.5" fontWeight="bold" fill="#15803d">{value}</text>}
      </g>
    ))}
    {/* Signature line */}
    <line x1="38" y1="110" x2="160" y2="110" stroke="#94a3b8" strokeWidth="1" />
    <text x="98" y="118" textAnchor="middle" fontSize="6.5" fill="#94a3b8">Подпись carrier</text>
    <rect x="172" y="100" width="68" height="18" rx="4" fill="#22c55e" />
    <text x="206" y="112" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">SIGN ✓</text>
    <text x="140" y="128" textAnchor="middle" fontSize="7.5" fill="#64748b">Юридический контракт · Подпись до пикапа</text>
  </SVG>
);

// ─── Bill of Lading ───────────────────────────────────────────────────────────
const BolDoc = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Bill of Lading (BOL)</text>
    <rect x="30" y="20" width="220" height="98" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    <rect x="30" y="20" width="220" height="24" rx="8" fill="#4f46e5" />
    <rect x="30" y="36" width="220" height="8" fill="#4f46e5" />
    <text x="140" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">BILL OF LADING</text>
    {/* Content */}
    {[
      { label: 'Shipper:', value: 'ABC Manufacturing, Chicago' },
      { label: 'Consignee:', value: 'XYZ Retail, Atlanta' },
      { label: 'Description:', value: 'Electronics · 18 pallets' },
      { label: 'Weight:', value: '24,500 lbs' },
    ].map(({ label, value }, i) => (
      <g key={label}>
        <text x="38" y={58 + i * 12} fontSize="7.5" fill="#64748b">{label}</text>
        <text x="88" y={58 + i * 12} fontSize="7.5" fill="#1e293b">{value}</text>
      </g>
    ))}
    {/* Two signature blocks */}
    <rect x="38" y="102" width="90" height="14" rx="3" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1" />
    <text x="83" y="112" textAnchor="middle" fontSize="6.5" fill="#1d4ed8">Shipper signature</text>
    <rect x="140" y="102" width="100" height="14" rx="3" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
    <text x="190" y="112" textAnchor="middle" fontSize="6.5" fill="#15803d">Consignee signature</text>
    <text x="140" y="128" textAnchor="middle" fontSize="7.5" fill="#64748b">Подписывается при погрузке и доставке</text>
  </SVG>
);

// ─── POD Signature ────────────────────────────────────────────────────────────
const PodSign = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Proof of Delivery (POD)</text>
    {/* Tablet/pad */}
    <rect x="60" y="22" width="160" height="88" rx="10" fill="#1e293b" />
    <rect x="64" y="26" width="152" height="74" rx="8" fill="#0f172a" />
    {/* Screen content */}
    <text x="140" y="44" textAnchor="middle" fontSize="8" fill="#94a3b8">DELIVERY CONFIRMED</text>
    <text x="140" y="56" textAnchor="middle" fontSize="18">✅</text>
    <rect x="68" y="64" width="144" height="28" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
    {/* Signature line */}
    <path d="M 76 84 Q 90 72 100 82 Q 112 92 124 78 Q 136 70 148 80" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Status badge */}
    <rect x="74" y="68" width="80" height="10" rx="3" fill="#022c22" />
    <text x="114" y="76" textAnchor="middle" fontSize="6" fill="#22c55e">DELIVERED · SIGNED</text>
    {/* Home button */}
    <circle cx="140" cy="104" r="5" fill="#475569" />
    {/* Warning */}
    <rect x="14" y="118" width="252" height="10" rx="3" fill="transparent" />
    <text x="140" y="126" textAnchor="middle" fontSize="8" fill="#64748b">Без POD → Брокер не оплатит счёт</text>
  </SVG>
);

// ─── W-9 Form ─────────────────────────────────────────────────────────────────
const W9Form = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">W-9 Tax Form — IRS</text>
    <rect x="30" y="20" width="220" height="96" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    {/* IRS Header */}
    <rect x="30" y="20" width="220" height="22" rx="8" fill="#dc2626" />
    <rect x="30" y="34" width="220" height="8" fill="#dc2626" />
    <text x="140" y="35" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">IRS FORM W-9</text>
    <text x="140" y="47" textAnchor="middle" fontSize="7" fill="#dc2626">Request for Taxpayer Identification</text>
    {/* Fields */}
    {[
      { label: 'Business Name:', value: 'Fast Freight LLC' },
      { label: 'EIN / Tax ID:', value: '12-3456789' },
      { label: 'Address:', value: '100 Main St, Chicago IL' },
      { label: 'Signature:', value: '___________________' },
    ].map(({ label, value }, i) => (
      <g key={label}>
        <text x="38" y={60 + i * 13} fontSize="7" fill="#64748b">{label}</text>
        <text x="108" y={60 + i * 13} fontSize="7.5" fontWeight={i === 1 ? 'bold' : 'normal'} fill={i === 1 ? '#dc2626' : '#1e293b'}>{value}</text>
      </g>
    ))}
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">Broker запрашивает W-9 при настройке carrier</text>
  </SVG>
);

// ─── Carrier Packet ───────────────────────────────────────────────────────────
const CarrierPacket = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Carrier Packet — Setup Documents</text>
    {/* Stack of documents */}
    {[
      { y: 88, color: '#e2e8f0', label: 'Carrier Agreement' },
      { y: 74, color: '#dbeafe', label: 'W-9 Form' },
      { y: 60, color: '#dcfce7', label: 'Insurance (COI)' },
      { y: 46, color: '#fff7ed', label: 'MC Certificate' },
    ].map(({ y, color, label }, i) => (
      <g key={label}>
        <rect x={20 + i * 4} y={y - i * 2} width="200" height="30" rx="4" fill={color} stroke="#e2e8f0" strokeWidth="1" />
        <text x={30 + i * 4} y={y + 17 - i * 2} fontSize="8" fontWeight="bold" fill="#334155">{label}</text>
        <text x={208 + i * 4} y={y + 17 - i * 2} textAnchor="end" fontSize="8" fill="#22c55e">✓</text>
      </g>
    ))}
    {/* Arrow to broker */}
    <rect x="14" y="106" width="252" height="18" rx="6" fill="#1e3a5f" />
    <text x="140" y="119" textAnchor="middle" fontSize="8" fill="#60a5fa">→ Отправить брокеру для первичной настройки</text>
  </SVG>
);

// ─── Detention Timer ──────────────────────────────────────────────────────────
const DetentionTimer = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Detention — Оплата за простой</text>
    {/* Clock */}
    <circle cx="88" cy="68" r="44" fill="#1e293b" />
    <circle cx="88" cy="68" r="40" fill="#0f172a" />
    {/* Clock marks */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const r1 = 34, r2 = 38;
      return <line key={i} x1={88 + r1 * Math.cos(angle)} y1={68 + r1 * Math.sin(angle)} x2={88 + r2 * Math.cos(angle)} y2={68 + r2 * Math.sin(angle)} stroke="#475569" strokeWidth="1.5" />;
    })}
    {/* Hour hand pointing to 2 (2 hours) */}
    <line x1="88" y1="68" x2="108" y2="56" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    {/* Minute hand pointing to 12 */}
    <line x1="88" y1="68" x2="88" y2="40" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="88" cy="68" r="3" fill="#ef4444" />
    {/* 2hr label */}
    <text x="88" y="78" textAnchor="middle" fontSize="6" fill="#94a3b8">FREE TIME</text>
    {/* Dollar info */}
    <rect x="152" y="24" width="108" height="88" rx="10" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
    <text x="206" y="44" textAnchor="middle" fontSize="8" fill="#92400e">FREE TIME</text>
    <text x="206" y="56" textAnchor="middle" fontSize="13" fontWeight="black" fill="#1e293b">2 часа</text>
    <line x1="160" y1="62" x2="252" y2="62" stroke="#fcd34d" strokeWidth="1" />
    <text x="206" y="76" textAnchor="middle" fontSize="8" fill="#92400e">ПОСЛЕ 2 ЧАСОВ</text>
    <text x="206" y="90" textAnchor="middle" fontSize="13" fontWeight="black" fill="#22c55e">$50–75</text>
    <text x="206" y="102" textAnchor="middle" fontSize="8" fill="#15803d">в час</text>
    <text x="140" y="126" textAnchor="middle" fontSize="8" fill="#64748b">Фиксируй время прибытия · Уведомляй брокера</text>
  </SVG>
);

// ─── Damage Claim ─────────────────────────────────────────────────────────────
const DamageClaim = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">OS&D Report — Повреждения</text>
    {/* Damaged box */}
    <rect x="20" y="28" width="80" height="72" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="2" />
    {/* Damage marks */}
    <path d="M30 38 L60 68 M60 38 L30 68" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 80 Q60 72 70 80 Q80 88 90 80" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" />
    <text x="60" y="92" textAnchor="middle" fontSize="7" fill="#dc2626">DAMAGED</text>
    {/* Report form */}
    <rect x="118" y="24" width="142" height="80" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
    <rect x="118" y="24" width="142" height="18" rx="6" fill="#ef4444" />
    <rect x="118" y="34" width="142" height="8" fill="#ef4444" />
    <text x="189" y="35" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">OS&D REPORT</text>
    <text x="126" y="52" fontSize="7" fill="#64748b">Over:</text><text x="156" y="52" fontSize="7" fill="#1e293b">0 units</text>
    <text x="126" y="64" fontSize="7" fill="#64748b">Short:</text><text x="156" y="64" fontSize="7" fill="#ef4444">2 boxes</text>
    <text x="126" y="76" fontSize="7" fill="#64748b">Damaged:</text><text x="168" y="76" fontSize="7" fill="#ef4444">YES</text>
    <line x1="126" y1="88" x2="252" y2="88" stroke="#e2e8f0" strokeWidth="1" />
    <text x="126" y="96" fontSize="6.5" fill="#64748b">Signature: ____________</text>
    <text x="140" y="120" textAnchor="middle" fontSize="7.5" fill="#64748b">Фиксируй в BOL + фото перед отъездом</text>
  </SVG>
);

// ─── Insurance Certificate ────────────────────────────────────────────────────
const InsuranceDoc = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Certificate of Insurance (COI)</text>
    <rect x="24" y="20" width="232" height="96" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    <rect x="24" y="20" width="232" height="22" rx="8" fill="#0f766e" />
    <rect x="24" y="34" width="232" height="8" fill="#0f766e" />
    <text x="140" y="35" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="white">CERTIFICATE OF INSURANCE</text>
    {/* Coverage types */}
    {[
      { type: 'Cargo Insurance', amount: '$100,000', required: true },
      { type: 'Liability Insurance', amount: '$750,000', required: true },
      { type: 'Physical Damage', amount: '$50,000', required: false },
    ].map(({ type, amount, required }, i) => (
      <g key={type}>
        <rect x="32" y={50 + i * 20} width="210" height="16" rx="4" fill={required ? '#f0fdf4' : '#f8fafc'} stroke={required ? '#86efac' : '#e2e8f0'} strokeWidth="1" />
        <text x="40" y={62 + i * 20} fontSize="7.5" fill="#1e293b">{type}</text>
        <text x="230" y={62 + i * 20} textAnchor="end" fontSize="8" fontWeight="bold" fill="#22c55e">{amount}</text>
        {required && <text x="222" y={62 + i * 20} fontSize="7" fill="#15803d">✓</text>}
      </g>
    ))}
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">Broker требует COI при первичной настройке</text>
  </SVG>
);

// ─── Invoice Billing ──────────────────────────────────────────────────────────
const InvoiceBilling = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Invoice — Счёт за перевозку</text>
    <rect x="24" y="20" width="232" height="96" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    <rect x="24" y="20" width="232" height="22" rx="8" fill="#1e293b" />
    <rect x="24" y="34" width="232" height="8" fill="#1e293b" />
    <text x="80" y="35" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">INVOICE</text>
    <text x="220" y="35" textAnchor="middle" fontSize="8" fill="#94a3b8">#INV-2024-001</text>
    {/* Line items */}
    {[
      { desc: 'Freight Service · 730 mi', amount: '$2,300.00' },
      { desc: 'Fuel Surcharge (FSC)', amount: '$0.00 incl.' },
      { desc: 'Detention (2.5 hrs)', amount: '$37.50' },
    ].map(({ desc, amount }, i) => (
      <g key={desc}>
        <text x="32" y={55 + i * 14} fontSize="7.5" fill="#64748b">{desc}</text>
        <text x="248" y={55 + i * 14} textAnchor="end" fontSize="7.5" fill="#1e293b">{amount}</text>
      </g>
    ))}
    <line x1="32" y1="98" x2="248" y2="98" stroke="#e2e8f0" strokeWidth="1.5" />
    <text x="32" y="110" fontSize="9" fontWeight="bold" fill="#1e293b">TOTAL:</text>
    <text x="248" y="110" textAnchor="end" fontSize="11" fontWeight="black" fill="#22c55e">$2,337.50</text>
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">Выставляется после получения POD · NET 30</text>
  </SVG>
);

// ─── HOS Clock ────────────────────────────────────────────────────────────────
const HosClock = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">HOS — Hours of Service</text>
    {/* Main gauge */}
    <circle cx="88" cy="68" r="48" fill="#1e293b" />
    <circle cx="88" cy="68" r="44" fill="#0f172a" />
    {/* Arc - used hours (red) */}
    <path d="M 88 24 A 44 44 0 1 1 42 94" stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
    {/* Arc - remaining (green) */}
    <path d="M 42 94 A 44 44 0 0 1 60 28" stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" />
    <text x="88" y="60" textAnchor="middle" fontSize="8" fill="#94a3b8">DRIVING</text>
    <text x="88" y="74" textAnchor="middle" fontSize="18" fontWeight="black" fill="#ef4444">11h</text>
    <text x="88" y="86" textAnchor="middle" fontSize="7" fill="#64748b">max limit</text>
    {/* Rules panel */}
    <rect x="148" y="20" width="118" height="96" rx="8" fill="#1e293b" />
    <text x="207" y="36" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#94a3b8">HOS RULES</text>
    {[
      { rule: '11h', desc: 'вождение', color: '#ef4444' },
      { rule: '14h', desc: 'рабочий день', color: '#f59e0b' },
      { rule: '30m', desc: 'перерыв/8h', color: '#60a5fa' },
      { rule: '34h', desc: 'недельный reset', color: '#22c55e' },
    ].map(({ rule, desc, color }, i) => (
      <g key={rule}>
        <rect x="156" y={44 + i * 17} width="28" height="12" rx="4" fill={color} />
        <text x="170" y={54 + i * 17} textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">{rule}</text>
        <text x="190" y={54 + i * 17} fontSize="7" fill="#94a3b8">{desc}</text>
      </g>
    ))}
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">Нарушение HOS = штраф + CSA violation</text>
  </SVG>
);

// ─── Breakdown Scene ──────────────────────────────────────────────────────────
const BreakdownScene = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Breakdown — Поломка в пути</text>
    {/* Road */}
    <rect x="10" y="86" width="260" height="20" rx="4" fill="#e2e8f0" />
    {/* Broken truck */}
    <rect x="30" y="50" width="100" height="38" rx="3" fill="#475569" />
    <rect x="130" y="44" width="40" height="44" rx="4" fill="#334155" />
    <rect x="133" y="47" width="22" height="14" rx="3" fill="#bfdbfe" />
    {/* Wheel with X */}
    <circle cx="60" cy="92" r="8" fill="#1e293b" />
    <text x="60" y="95" textAnchor="middle" fontSize="8" fill="#ef4444">✗</text>
    <circle cx="100" cy="92" r="8" fill="#1e293b" /><circle cx="100" cy="92" r="3" fill="#475569" />
    <circle cx="143" cy="92" r="8" fill="#1e293b" /><circle cx="143" cy="92" r="3" fill="#475569" />
    {/* Warning triangle */}
    <path d="M 185 85 L 210 45 L 235 85 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
    <text x="210" y="74" textAnchor="middle" fontSize="14" fontWeight="black" fill="#1e293b">!</text>
    {/* Action steps */}
    <rect x="14" y="110" width="252" height="14" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
    <text x="140" y="121" textAnchor="middle" fontSize="7.5" fill="#92400e">1. Безопасность  2. Звонок диспетчеру  3. Координаты</text>
  </SVG>
);

// ─── Drop and Hook ────────────────────────────────────────────────────────────
const DropHook = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Drop & Hook — Обмен прицепами</text>
    {/* Step 1: Arrive with loaded */}
    <text x="65" y="28" textAnchor="middle" fontSize="7" fill="#64748b">Привёз загруженный</text>
    <rect x="14" y="32" width="50" height="22" rx="3" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="39" y="46" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1d4ed8">LOADED</text>
    <rect x="60" y="38" width="30" height="12" rx="3" fill="#334155" />
    {/* Arrow */}
    <polygon points="96,44 88,40 88,48" fill="#22c55e" />
    <text x="112" y="46" textAnchor="middle" fontSize="18" fill="#22c55e">↔</text>
    {/* Step 2: Pick up empty */}
    <text x="188" y="28" textAnchor="middle" fontSize="7" fill="#64748b">Забрал порожний</text>
    <rect x="158" y="32" width="50" height="22" rx="3" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
    <text x="183" y="46" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#92400e">EMPTY</text>
    <rect x="204" y="38" width="30" height="12" rx="3" fill="#334155" />
    {/* Benefits */}
    <rect x="14" y="62" width="252" height="50" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
    <text x="140" y="78" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#15803d">✓ Преимущества Drop & Hook</text>
    <text x="50" y="94" fontSize="7.5" fill="#334155">• Нет ожидания погрузки</text>
    <text x="160" y="94" fontSize="7.5" fill="#334155">• Экономия HOS</text>
    <text x="50" y="106" fontSize="7.5" fill="#334155">• Больше рейсов/день</text>
    <text x="160" y="106" fontSize="7.5" fill="#334155">• Нет detention</text>
    <text x="140" y="126" textAnchor="middle" fontSize="7.5" fill="#64748b">Противоположность: Live Load (ожидание погрузки)</text>
  </SVG>
);

// ─── Bid Process ─────────────────────────────────────────────────────────────
const BidProcess = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Bid — Процесс торгов</text>
    {/* Timeline */}
    <line x1="20" y1="68" x2="260" y2="68" stroke="#e2e8f0" strokeWidth="2" />
    {[
      { x: 40, label: 'Видишь груз', sub: 'на load board', color: '#60a5fa', y: 50 },
      { x: 100, label: 'Рассчитай', sub: 'мин. RPM', color: '#fbbf24', y: 50 },
      { x: 160, label: 'Позвони', sub: '$2.50 bid', color: '#22c55e', y: 50 },
      { x: 220, label: 'DEAL', sub: '$2.35 ✓', color: '#22c55e', y: 50 },
    ].map(({ x, label, sub, color, y }) => (
      <g key={label}>
        <circle cx={x} cy="68" r="8" fill={color} />
        <text x={x} y={y} textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1e293b">{label}</text>
        <text x={x} y={y + 10} textAnchor="middle" fontSize="6.5" fill="#64748b">{sub}</text>
        {label === 'DEAL' && (
          <rect x={x - 20} y="78" width="40" height="14" rx="4" fill="#22c55e" />
        )}
        {label === 'DEAL' && (
          <text x={x} y="89" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">DONE ✓</text>
        )}
      </g>
    ))}
    {/* Key rule */}
    <rect x="14" y="106" width="252" height="18" rx="6" fill="#1e3a5f" />
    <text x="140" y="119" textAnchor="middle" fontSize="8" fill="#60a5fa">Начинай на 10–15% выше желаемой ставки</text>
  </SVG>
);

// ─── Factoring ────────────────────────────────────────────────────────────────
const Factoring = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Factoring — Быстрая оплата</text>
    {/* Normal flow */}
    <rect x="14" y="24" width="60" height="28" rx="6" fill="#475569" />
    <text x="44" y="41" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">CARRIER</text>
    <rect x="206" y="24" width="60" height="28" rx="6" fill="#1e3a5f" />
    <text x="236" y="41" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#60a5fa">BROKER</text>
    {/* Without factoring - slow */}
    <path d="M74 33 L204 33" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
    <text x="139" y="30" textAnchor="middle" fontSize="6.5" fill="#ef4444">30–45 дней ⏳</text>
    {/* Factoring company */}
    <rect x="90" y="62" width="100" height="30" rx="8" fill="#22c55e" />
    <text x="140" y="75" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="white">FACTORING CO.</text>
    <text x="140" y="85" textAnchor="middle" fontSize="7" fill="#dcfce7">Платит сразу</text>
    {/* Arrows */}
    <path d="M44 52 Q44 78 88 78" stroke="#22c55e" strokeWidth="2" fill="none" />
    <polygon points="88,74 88,82 96,78" fill="#22c55e" />
    <text x="55" y="72" fontSize="6.5" fill="#22c55e">$2,230</text>
    <text x="55" y="81" fontSize="6" fill="#64748b">−2% fee</text>
    {/* Factoring buys invoice */}
    <path d="M192 78 Q240 78 236 52" stroke="#60a5fa" strokeWidth="2" fill="none" />
    <polygon points="232,52 240,52 236,44" fill="#60a5fa" />
    <text x="220" y="72" fontSize="6.5" fill="#60a5fa">Invoice</text>
    <rect x="14" y="108" width="252" height="14" rx="4" fill="#1e293b" />
    <text x="140" y="119" textAnchor="middle" fontSize="8" fill="#94a3b8">Carrier: 95–98% сразу · Factoring взыскивает с Broker</text>
  </SVG>
);

// ─── Double Broker ────────────────────────────────────────────────────────────
const DoubleBroker = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ef4444">⚠ Double Broker — Мошенничество</text>
    {/* Chain */}
    <rect x="14" y="30" width="55" height="28" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="41" y="47" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#1d4ed8">SHIPPER</text>
    <line x1="69" y1="44" x2="88" y2="44" stroke="#64748b" strokeWidth="2" />
    <rect x="88" y="30" width="55" height="28" rx="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
    <text x="115" y="42" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#dc2626">BROKER 1</text>
    <text x="115" y="52" textAnchor="middle" fontSize="6" fill="#ef4444">мошенник</text>
    <line x1="143" y1="44" x2="162" y2="44" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
    <rect x="162" y="30" width="55" height="28" rx="6" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
    <text x="189" y="42" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#c2410c">BROKER 2</text>
    <text x="189" y="52" textAnchor="middle" fontSize="6" fill="#f97316">перекуп</text>
    <line x1="217" y1="44" x2="236" y2="44" stroke="#64748b" strokeWidth="2" />
    <rect x="236" y="30" width="30" height="28" rx="6" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
    <text x="251" y="47" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#15803d">CAR</text>
    {/* Warning boxes */}
    <rect x="14" y="70" width="252" height="20" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
    <text x="140" y="84" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#dc2626">Carrier рискует не получить оплату!</text>
    <rect x="14" y="96" width="252" height="22" rx="6" fill="#1e293b" />
    <text x="140" y="106" textAnchor="middle" fontSize="7.5" fill="#94a3b8">Проверяй: MC# на FMCSA · Рейтинг DAT</text>
    <text x="140" y="114" textAnchor="middle" fontSize="7.5" fill="#94a3b8">Carrier411 · Carrier Agreement</text>
  </SVG>
);

// ─── Spot Market ─────────────────────────────────────────────────────────────
const SpotMarket = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Spot Market vs Contract</text>
    {/* Chart bars for spot market prices */}
    <rect x="14" y="20" width="120" height="86" rx="8" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
    <text x="74" y="34" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">SPOT MARKET</text>
    <text x="74" y="44" textAnchor="middle" fontSize="6.5" fill="#3b82f6">Цена меняется ежедневно</text>
    {/* Volatile bar chart */}
    {[
      { h: 20, color: '#60a5fa' },
      { h: 38, color: '#3b82f6' },
      { h: 14, color: '#60a5fa' },
      { h: 45, color: '#1d4ed8' },
      { h: 28, color: '#3b82f6' },
      { h: 42, color: '#1d4ed8' },
    ].map(({ h, color }, i) => (
      <rect key={i} x={20 + i * 17} y={96 - h} width="12" height={h} rx="2" fill={color} />
    ))}
    {/* Contract side */}
    <rect x="146" y="20" width="120" height="86" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
    <text x="206" y="34" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#15803d">CONTRACT LANE</text>
    <text x="206" y="44" textAnchor="middle" fontSize="6.5" fill="#22c55e">Фиксированная ставка</text>
    {/* Flat line */}
    <line x1="155" y1="72" x2="260" y2="72" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
    <rect x="168" y="60" width="76" height="16" rx="6" fill="#dcfce7" />
    <text x="206" y="72" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#15803d">$2.40/mi ●</text>
    <text x="206" y="88" textAnchor="middle" fontSize="7" fill="#64748b">Стабильность</text>
    <text x="140" y="122" textAnchor="middle" fontSize="7.5" fill="#64748b">Большинство диспетчеров работают на Spot Market</text>
  </SVG>
);

// ─── Driver Dispatch Info ─────────────────────────────────────────────────────
const DriverDispatch = () => (
  <SVG>
    <text x="140" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Dispatch Info — Инструктаж водителя</text>
    {/* Checklist */}
    {[
      { item: 'Адрес пикапа + Gate/Door #', done: true },
      { item: 'Время appointment (с часовым поясом)', done: true },
      { item: 'Контакт shipper/receiver', done: true },
      { item: 'BOL # / PO # / Load #', done: true },
      { item: 'Тип груза + инструкции', done: true },
      { item: 'Контакт брокера', done: true },
    ].map(({ item, done }, i) => (
      <g key={item}>
        <rect x="14" y={22 + i * 16} width="252" height="14" rx="4" fill={i % 2 === 0 ? '#f8fafc' : 'white'} />
        <rect x="18" y={25 + i * 16} width="10" height="8" rx="2" fill={done ? '#22c55e' : '#e2e8f0'} />
        <text x="24" y={32 + i * 16} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{done ? '✓' : ''}</text>
        <text x="34" y={32 + i * 16} fontSize="7.5" fill="#334155">{item}</text>
      </g>
    ))}
    <rect x="14" y="122" width="252" height="0" />
  </SVG>
);

// ─────────────────────────────────────────────────────────────────────────────
// Illustration Registry
// ─────────────────────────────────────────────────────────────────────────────
const ILLUSTRATIONS: Record<IllustrationKey, () => React.ReactNode> = {
  supply_chain: () => <SupplyChain />,
  rpm_calc: () => <RpmCalc />,
  deadhead: () => <Deadhead />,
  ftl_ltl: () => <FtlLtl />,
  otr_map: () => <OtrMap />,
  lane_route: () => <LaneRoute />,
  dispatcher_ops: () => <DispatcherOps />,
  accessorials: () => <Accessorials />,
  load_board: () => <LoadBoard />,
  mc_badge: () => <McBadge />,
  negotiation: () => <Negotiation />,
  timezone_usa: () => <TimezoneUsa />,
  dead_zone: () => <DeadZone />,
  freight_zones_map: () => <FreightZonesMap />,
  backhaul: () => <Backhaul />,
  reefer_truck: () => <ReeferTruck />,
  dry_van: () => <DryVan />,
  flatbed: () => <Flatbed />,
  weight_station: () => <WeightStation />,
  step_deck: () => <StepDeck />,
  liftgate: () => <Liftgate />,
  cdl_card: () => <CdlCard />,
  tanker: () => <Tanker />,
  hotshot: () => <Hotshot />,
  lowboy: () => <Lowboy />,
  rate_con: () => <RateCon />,
  bol_doc: () => <BolDoc />,
  pod_sign: () => <PodSign />,
  w9_form: () => <W9Form />,
  carrier_packet: () => <CarrierPacket />,
  detention_timer: () => <DetentionTimer />,
  damage_claim: () => <DamageClaim />,
  insurance_doc: () => <InsuranceDoc />,
  invoice_billing: () => <InvoiceBilling />,
  driver_dispatch: () => <DriverDispatch />,
  hos_clock: () => <HosClock />,
  breakdown_scene: () => <BreakdownScene />,
  drop_hook: () => <DropHook />,
  bid_process: () => <BidProcess />,
  factoring: () => <Factoring />,
  double_broker: () => <DoubleBroker />,
  spot_market: () => <SpotMarket />,
};

// ─────────────────────────────────────────────────────────────────────────────
// Question → Illustration mapping
// ─────────────────────────────────────────────────────────────────────────────
const Q_MAP: Record<string, IllustrationKey> = {
  // Chapter 1
  c1q01: 'supply_chain', c1q02: 'rpm_calc', c1q03: 'supply_chain',
  c1q04: 'deadhead', c1q05: 'ftl_ltl', c1q06: 'ftl_ltl',
  c1q07: 'supply_chain', c1q08: 'otr_map', c1q09: 'lane_route',
  c1q10: 'dispatcher_ops', c1q11: 'accessorials', c1q12: 'load_board',
  c1q13: 'mc_badge', c1q14: 'negotiation', c1q15: 'ftl_ltl',
  c1q16: 'load_board', c1q17: 'rpm_calc', c1q18: 'supply_chain',
  c1q19: 'rpm_calc', c1q20: 'mc_badge',
  // Chapter 2
  c2q01: 'timezone_usa', c2q02: 'timezone_usa', c2q03: 'timezone_usa',
  c2q04: 'dead_zone', c2q05: 'freight_zones_map', c2q06: 'dead_zone',
  c2q07: 'timezone_usa', c2q08: 'backhaul', c2q09: 'timezone_usa',
  c2q10: 'freight_zones_map', c2q11: 'otr_map', c2q12: 'dead_zone',
  c2q13: 'timezone_usa', c2q14: 'timezone_usa', c2q15: 'timezone_usa',
  c2q16: 'freight_zones_map', c2q17: 'timezone_usa', c2q18: 'freight_zones_map',
  c2q19: 'reefer_truck', c2q20: 'timezone_usa',
  // Chapter 3
  c3q01: 'dry_van', c3q02: 'reefer_truck', c3q03: 'flatbed',
  c3q04: 'weight_station', c3q05: 'deadhead', c3q06: 'step_deck',
  c3q07: 'liftgate', c3q08: 'cdl_card', c3q09: 'tanker',
  c3q10: 'hotshot', c3q11: 'dry_van', c3q12: 'flatbed',
  c3q13: 'step_deck', c3q14: 'reefer_truck', c3q15: 'dry_van',
  c3q16: 'flatbed', c3q17: 'dry_van', c3q18: 'detention_timer',
  c3q19: 'dry_van', c3q20: 'lowboy',
  // Chapter 4
  c4q01: 'rate_con', c4q02: 'bol_doc', c4q03: 'pod_sign',
  c4q04: 'w9_form', c4q05: 'carrier_packet', c4q06: 'rate_con',
  c4q07: 'bol_doc', c4q08: 'damage_claim', c4q09: 'insurance_doc',
  c4q10: 'detention_timer', c4q11: 'detention_timer', c4q12: 'rate_con',
  c4q13: 'pod_sign', c4q14: 'bol_doc', c4q15: 'pod_sign',
  c4q16: 'rate_con', c4q17: 'bol_doc', c4q18: 'invoice_billing',
  c4q19: 'invoice_billing', c4q20: 'carrier_packet',
  // Chapter 5
  c5q01: 'load_board', c5q02: 'load_board', c5q03: 'load_board',
  c5q04: 'load_board', c5q05: 'load_board', c5q06: 'load_board',
  c5q07: 'lane_route', c5q08: 'spot_market', c5q09: 'double_broker',
  c5q10: 'mc_badge', c5q11: 'load_board', c5q12: 'load_board',
  c5q13: 'rate_con', c5q14: 'load_board', c5q15: 'load_board',
  c5q16: 'accessorials', c5q17: 'load_board', c5q18: 'load_board',
  c5q19: 'spot_market', c5q20: 'negotiation',
  // Chapter 6
  c6q01: 'negotiation', c6q02: 'negotiation', c6q03: 'negotiation',
  c6q04: 'accessorials', c6q05: 'negotiation', c6q06: 'negotiation',
  c6q07: 'negotiation', c6q08: 'negotiation', c6q09: 'rate_con',
  c6q10: 'negotiation', c6q11: 'rate_con', c6q12: 'damage_claim',
  c6q13: 'load_board', c6q14: 'rate_con', c6q15: 'bid_process',
  c6q16: 'negotiation', c6q17: 'load_board', c6q18: 'mc_badge',
  c6q19: 'carrier_packet', c6q20: 'bid_process',
  // Chapter 7
  c7q01: 'driver_dispatch', c7q02: 'detention_timer', c7q03: 'breakdown_scene',
  c7q04: 'hos_clock', c7q05: 'hos_clock', c7q06: 'driver_dispatch',
  c7q07: 'drop_hook', c7q08: 'driver_dispatch', c7q09: 'driver_dispatch',
  c7q10: 'hos_clock', c7q11: 'detention_timer', c7q12: 'breakdown_scene',
  c7q13: 'drop_hook', c7q14: 'detention_timer', c7q15: 'detention_timer',
  c7q16: 'driver_dispatch', c7q17: 'otr_map', c7q18: 'driver_dispatch',
  c7q19: 'accessorials', c7q20: 'otr_map',
  // Chapter 8
  c8q01: 'bid_process', c8q02: 'rpm_calc', c8q03: 'carrier_packet',
  c8q04: 'rate_con', c8q05: 'factoring', c8q06: 'carrier_packet',
  c8q07: 'negotiation', c8q08: 'negotiation', c8q09: 'negotiation',
  c8q10: 'bid_process', c8q11: 'negotiation', c8q12: 'negotiation',
  c8q13: 'accessorials', c8q14: 'invoice_billing', c8q15: 'factoring',
  c8q16: 'negotiation', c8q17: 'rate_con', c8q18: 'bid_process',
  c8q19: 'load_board', c8q20: 'negotiation',
  // Chapter 9
  c9q01: 'breakdown_scene', c9q02: 'breakdown_scene', c9q03: 'damage_claim',
  c9q04: 'breakdown_scene', c9q05: 'detention_timer', c9q06: 'damage_claim',
  c9q07: 'breakdown_scene', c9q08: 'driver_dispatch', c9q09: 'double_broker',
  c9q10: 'damage_claim', c9q11: 'breakdown_scene', c9q12: 'detention_timer',
  c9q13: 'breakdown_scene', c9q14: 'driver_dispatch', c9q15: 'damage_claim',
  c9q16: 'breakdown_scene', c9q17: 'invoice_billing', c9q18: 'driver_dispatch',
  c9q19: 'double_broker', c9q20: 'damage_claim',
};

// ─────────────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────────────
export function QuestionIllustration({ questionId }: { questionId: string }) {
  const key = Q_MAP[questionId];
  if (!key) return null;
  const render = ILLUSTRATIONS[key];
  return (
    <div className="w-full h-28 rounded-2xl overflow-hidden shadow-sm">
      {render()}
    </div>
  );
}
