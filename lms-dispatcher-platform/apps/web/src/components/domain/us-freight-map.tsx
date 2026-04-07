'use client';
import { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import * as Dialog from '@radix-ui/react-dialog';
import { ZoomIn, X } from 'lucide-react';
import { useLang } from '@/lib/i18n/lang-context';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const FIPS: Record<string, string> = {
  '01':'AL','02':'AK','04':'AZ','05':'AR','06':'CA','08':'CO','09':'CT',
  '10':'DE','12':'FL','13':'GA','15':'HI','16':'ID','17':'IL','18':'IN',
  '19':'IA','20':'KS','21':'KY','22':'LA','23':'ME','24':'MD','25':'MA',
  '26':'MI','27':'MN','28':'MS','29':'MO','30':'MT','31':'NE','32':'NV',
  '33':'NH','34':'NJ','35':'NM','36':'NY','37':'NC','38':'ND','39':'OH',
  '40':'OK','41':'OR','42':'PA','44':'RI','45':'SC','46':'SD','47':'TN',
  '48':'TX','49':'UT','50':'VT','51':'VA','53':'WA','54':'WV','55':'WI',
  '56':'WY',
};

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas',
  KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts',
  MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana',
  NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico',
  NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
  OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
};

// ── Time zones ─────────────────────────────────────────────────────────────────
type TZ = 'PT' | 'MT' | 'CT' | 'ET';

const STATE_TZ: Record<string, TZ> = {
  WA:'PT', OR:'PT', CA:'PT', NV:'PT',
  ID:'MT', MT:'MT', WY:'MT', UT:'MT', CO:'MT', AZ:'MT', NM:'MT',
  ND:'CT', SD:'CT', NE:'CT', KS:'CT', OK:'CT', TX:'CT',
  MN:'CT', IA:'CT', MO:'CT', AR:'CT', LA:'CT', WI:'CT', IL:'CT', MS:'CT', AL:'CT',
  ME:'ET', VT:'ET', NH:'ET', MA:'ET', RI:'ET', CT:'ET', NY:'ET', NJ:'ET',
  PA:'ET', DE:'ET', MD:'ET', VA:'ET', WV:'ET', NC:'ET', SC:'ET', GA:'ET',
  FL:'ET', OH:'ET', IN:'ET', KY:'ET', MI:'ET', TN:'ET',
};

const TZ_META: Record<TZ, { en: string; ru: string; offset: string }> = {
  PT: { en: 'Pacific',  ru: 'Тихоокеанское', offset: 'UTC−8/−7' },
  MT: { en: 'Mountain', ru: 'Горное',         offset: 'UTC−7/−6' },
  CT: { en: 'Central',  ru: 'Центральное',    offset: 'UTC−6/−5' },
  ET: { en: 'Eastern',  ru: 'Восточное',      offset: 'UTC−5/−4' },
};

// Badge % position aligns with radial gradient center in SVG
const TZ_LEFT_PCT: Record<TZ, number> = { PT: 11, MT: 30, CT: 51, ET: 77 };

// Clock accent color, soft beam color, and normalized hour-hand direction
// Hour hand angle: 8 o'clock for PT, 9 for MT, 10 for CT, 11 for ET
const TZ_CONFIG: Record<TZ, { accent: string; beam: string; hx: number; hy: number }> = {
  PT: { accent: '#60a5fa', beam: '#bfdbfe', hx: -0.866, hy:  0.5   }, // 8:00
  MT: { accent: '#2dd4bf', beam: '#99f6e4', hx: -1.0,   hy:  0.0   }, // 9:00
  CT: { accent: '#fbbf24', beam: '#fde68a', hx: -0.866, hy: -0.5   }, // 10:00
  ET: { accent: '#f43f5e', beam: '#fda4af', hx: -0.5,   hy: -0.866 }, // 11:00
};

// Badge x-position in SVG 800×500 space (aligns with TZ_LEFT_PCT% of 800)
const TZ_BADGE_X: Record<TZ, number> = { PT: 88, MT: 240, CT: 408, ET: 616 };

// Approximate geographic center of each TZ silhouette in SVG space
const TZ_CENTER: Record<TZ, { x: number; y: number }> = {
  PT: { x: 100, y: 195 },
  MT: { x: 205, y: 200 },
  CT: { x: 398, y: 248 },
  ET: { x: 572, y: 268 },
};

// ── Freight zones ──────────────────────────────────────────────────────────────
type ZoneType = 'GOOD' | 'NSB' | 'DEAD' | 'UNKNOWN';

// Layer 1: Saturated solid fill (primary – freight quality)
const ZONE_FILL: Record<ZoneType, { base: string; hover: string }> = {
  GOOD:    { base: '#4ade80', hover: '#22c55e' },
  NSB:     { base: '#fbbf24', hover: '#f59e0b' },
  DEAD:    { base: '#f87171', hover: '#ef4444' },
  UNKNOWN: { base: '#e2e8f0', hover: '#cbd5e1' },
};

const ZONE_BADGE: Record<ZoneType, { ru: string; en: string; dot: string; cls: string }> = {
  GOOD:    { ru:'Хорошая зона (G)',    en:'Good Area (G)',    dot:'#16a34a', cls:'bg-green-100 text-green-800 border border-green-300' },
  NSB:     { ru:'Средняя зона (NSB)',  en:'Not So Bad (NSB)', dot:'#d97706', cls:'bg-amber-100 text-amber-800 border border-amber-300' },
  DEAD:    { ru:'Мёртвая зона (D)',    en:'Dead Area (D)',    dot:'#dc2626', cls:'bg-red-100 text-red-700 border border-red-300'       },
  UNKNOWN: { ru:'Нет данных',           en:'No Data',          dot:'#94a3b8', cls:'bg-gray-100 dark:bg-[#2c2c2e] text-gray-500 dark:text-[#a1a1a6]'                           },
};

interface ZoneInfo {
  type: ZoneType; area: number;
  titleRu: string; titleEn: string;
  descRu: string;  descEn: string;
  avgRate: string; states: string[];
}

// Zones from URSA EXPRESS guide (Map.txt + hand-drawn map image)
const ZONES: ZoneInfo[] = [
  { type:'NSB', area:1,
    titleRu:'Зона 1 — Западное побережье', titleEn:'Zone 1 — West Coast',
    descRu:'Много грузов, но и много машин. Высокая конкуренция снижает ставки.',
    descEn:'Plenty of loads but high truck competition keeps rates low.',
    avgRate:'$0.65–0.85/mile', states:['CA','NV','AZ'] },
  { type:'NSB', area:2,
    titleRu:'Зона 2 — Техас / Юго-Запад', titleEn:'Zone 2 — Texas / Southwest',
    descRu:'Огромный рынок, очень высокая конкуренция. Хороший плацдарм для движения в лучшие зоны.',
    descEn:'Massive freight market, very competitive. Good launchpad toward better zones.',
    avgRate:'$0.65–0.80/mile', states:['TX','NM'] },
  { type:'DEAD', area:3,
    titleRu:'Зона 3 — Мёртвая (Глубокий Юг)', titleEn:'Zone 3 — Dead (Deep South)',
    descRu:'Мало грузов, много машин. Водители застревают. Нужно вывести как можно быстрее.',
    descEn:'Few loads, too many trucks. Drivers get stuck. Get out ASAP.',
    avgRate:'$0.65–0.90/mile', states:['LA','MS','AL'] },
  { type:'DEAD', area:4,
    titleRu:'Зона 4 — Мёртвая (Флорида)', titleEn:'Zone 4 — Dead (Florida)',
    descRu:'Полуостров-ловушка. Грузы приходят, выехать крайне сложно.',
    descEn:'Peninsula trap — freight comes in but outbound is very weak.',
    avgRate:'$0.60–0.90/mile', states:['FL'] },
  { type:'NSB', area:5,
    titleRu:'Зона 5 — Юго-Восток', titleEn:'Zone 5 — Southeast',
    descRu:'Достаточно грузов, средние ставки. Хорошая точка для движения на север.',
    descEn:'Decent loads, average rates. Good regrouping point before heading north.',
    avgRate:'$0.70–0.95/mile', states:['GA','SC','NC','TN','WV','VA'] },
  { type:'NSB', area:6,
    titleRu:'Зона 6 — Северо-Восток', titleEn:'Zone 6 — Northeast',
    descRu:'Высокая плотность грузов, ставки выше среднего. Минус — пробки и сложная логистика.',
    descEn:'High load density, above-average rates. Downside: traffic and complex delivery.',
    avgRate:'$0.70–0.95/mile', states:['PA','NJ','NY','DE','MD','RI','MA','NH','CT','VT'] },
  { type:'DEAD', area:7,
    titleRu:'Зона 7 — Мёртвая (Мэн)', titleEn:'Zone 7 — Dead (Maine)',
    descRu:'Удалённый регион. Войти легко — выехать крайне сложно.',
    descEn:'Remote region. Easy to enter — very hard to exit.',
    avgRate:'$0.65–0.85/mile', states:['ME'] },
  { type:'NSB', area:8,
    titleRu:'Зона 8 — Промышленный пояс', titleEn:'Zone 8 — Industrial Belt',
    descRu:'Производственный пояс США. Много грузов, ставки выше среднего.',
    descEn:'US manufacturing belt. Many loads, above-average rates.',
    avgRate:'$0.80–0.95/mile', states:['OH','IN','KY'] },
  { type:'GOOD', area:9,
    titleRu:'Зона 9 — Лучшая (Великие Озёра)', titleEn:'Zone 9 — Best (Great Lakes)',
    descRu:'Лучшая зона США. Максимум грузов, высокие ставки, возможна двойная загрузка.',
    descEn:'Best dispatcher zone. Top load density, highest rates, double-load opportunities.',
    avgRate:'$0.85–1.00/mile', states:['IL','WI','MI'] },
  { type:'NSB', area:10,
    titleRu:'Зона 10 — Северный Средний Запад', titleEn:'Zone 10 — Upper Midwest',
    descRu:'Хороший рынок, ставки выше среднего в направлении промышленных зон.',
    descEn:'Good market, above-average rates toward industrial zones.',
    avgRate:'$0.75–1.00/mile', states:['MN','IA'] },
  { type:'DEAD', area:11,
    titleRu:'Зона 11 — Мёртвая (Запад и Центр)', titleEn:'Zone 11 — Dead (West & Central)',
    descRu:'Огромная территория, редкие города, минимальный грузопоток. Загрузиться крайне сложно.',
    descEn:'Vast territory, sparse cities, minimal freight. Extremely hard to reload.',
    avgRate:'$0.65–0.85/mile',
    states:['WA','OR','ID','MT','WY','UT','CO','ND','SD','NE','KS','OK','MO','AR'] },
];

const STATE_TO_ZONE: Record<string, ZoneInfo> = {};
ZONES.forEach(z => z.states.forEach(s => { STATE_TO_ZONE[s] = z; }));

const CENTROIDS: Record<string, [number, number]> = {
  AL:[-86.8,32.8], AK:[-153.4,64.2], AZ:[-111.7,34.3], AR:[-92.4,34.9],
  CA:[-119.5,37.3], CO:[-105.5,39.0], CT:[-72.7,41.6], DE:[-75.5,39.0],
  FL:[-81.5,28.0], GA:[-83.4,32.7], HI:[-157.5,20.5], ID:[-114.5,44.3],
  IL:[-89.2,40.0], IN:[-86.3,40.3], IA:[-93.5,42.0], KS:[-98.4,38.5],
  KY:[-84.3,37.7], LA:[-91.8,31.2], ME:[-69.4,45.4], MD:[-76.8,39.0],
  MA:[-71.8,42.3], MI:[-85.4,44.3], MN:[-94.6,46.4], MS:[-89.7,32.7],
  MO:[-92.4,38.4], MT:[-110.4,47.0], NE:[-99.9,41.5], NV:[-116.7,39.5],
  NH:[-71.6,43.9], NJ:[-74.5,40.1], NM:[-106.1,34.5], NY:[-75.5,42.8],
  NC:[-79.4,35.6], ND:[-100.5,47.5], OH:[-82.8,40.4], OK:[-97.5,35.6],
  OR:[-120.6,43.9], PA:[-77.8,40.9], RI:[-71.5,41.7], SC:[-80.9,33.8],
  SD:[-100.3,44.4], TN:[-86.7,35.9], TX:[-99.3,31.5], UT:[-111.5,39.3],
  VT:[-72.7,44.1], VA:[-78.5,37.8], WA:[-120.5,47.4], WV:[-80.6,38.6],
  WI:[-89.9,44.8], WY:[-107.6,43.1],
};

const SKIP_LABEL = new Set(['RI','DE','NJ','MD','CT','VT','NH','MA']);

// ── Clock badge icon ───────────────────────────────────────────────────────────
function ClockBadge({ tz, large }: { tz: TZ; large: boolean }) {
  const cfg   = TZ_CONFIG[tz];
  const R     = large ? 26 : 17;
  const stemH = large ? 8  : 5;
  const hourLen = R * 0.55;
  const minLen  = R * 0.72;
  const svgW  = (R + 2) * 2;
  const svgH  = (R + 2) * 2 + stemH;
  const vbX   = -(R + 2);
  const vbY   = -(R + 2) - stemH;

  return (
    <div className="flex flex-col items-center" style={{ gap: 2 }}>
      {/* Clock face */}
      <svg
        width={svgW} height={svgH}
        viewBox={`${vbX} ${vbY} ${svgW} ${svgH}`}
        style={{ overflow: 'visible' }}
      >
        {/* Pin/stem at top */}
        <rect
          x={-3} y={-R - stemH}
          width={6} height={stemH + 3}
          rx={2}
          fill="#1e293b"
          stroke={cfg.accent}
          strokeWidth="1.5"
        />
        {/* Outer glow ring */}
        <circle cx={0} cy={0} r={R + 2} fill={cfg.beam} opacity={0.35} />
        {/* Clock body */}
        <circle cx={0} cy={0} r={R} fill="#1e293b" />
        {/* Accent border */}
        <circle cx={0} cy={0} r={R} fill="none" stroke={cfg.accent} strokeWidth={large ? 2.5 : 2} />
        {/* Tick marks at 12 / 3 / 6 / 9 */}
        {[0, 90, 180, 270].map(deg => {
          const rd = deg * Math.PI / 180;
          const tickOuter = R - 1.5;
          const tickInner = R - (large ? 6 : 4);
          return (
            <line
              key={deg}
              x1={Math.sin(rd) * tickOuter} y1={-Math.cos(rd) * tickOuter}
              x2={Math.sin(rd) * tickInner} y2={-Math.cos(rd) * tickInner}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={large ? 2 : 1.5}
              strokeLinecap="round"
            />
          );
        })}
        {/* Hour hand */}
        <line
          x1={0} y1={0}
          x2={cfg.hx * hourLen} y2={cfg.hy * hourLen}
          stroke={cfg.accent}
          strokeWidth={large ? 3 : 2}
          strokeLinecap="round"
        />
        {/* Minute hand (12 o'clock) */}
        <line
          x1={0} y1={0}
          x2={0} y2={-minLen}
          stroke="white"
          strokeWidth={large ? 2 : 1.5}
          strokeLinecap="round"
        />
        {/* Center cap */}
        <circle cx={0} cy={0} r={large ? 3.5 : 2.5} fill={cfg.accent} />
      </svg>

      {/* TZ abbreviation */}
      <span
        className={`font-black tracking-widest leading-none ${large ? 'text-sm' : 'text-[10px]'}`}
        style={{ color: cfg.accent }}
      >
        {tz}
      </span>

      {/* UTC offset */}
      <span className={`text-slate-400 font-medium leading-none ${large ? 'text-[10px]' : 'text-[7px]'}`}>
        {TZ_META[tz].offset}
      </span>

      {/* Arrow toward beam */}
      <div
        style={{
          width: 0, height: 0, marginTop: 2,
          borderLeft:  `${large ? 7 : 5}px solid transparent`,
          borderRight: `${large ? 7 : 5}px solid transparent`,
          borderTop:   `${large ? 9 : 6}px solid ${cfg.beam}`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

// ── TZ badge row ───────────────────────────────────────────────────────────────
function TzBadgeRow({ large }: { large: boolean }) {
  return (
    <div className="relative w-full h-full">
      {(['PT','MT','CT','ET'] as TZ[]).map(tz => (
        <div
          key={tz}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: `${TZ_LEFT_PCT[tz]}%`, transform: 'translateX(-50%)' }}
        >
          <ClockBadge tz={tz} large={large} />
        </div>
      ))}
    </div>
  );
}

// ── Legend ─────────────────────────────────────────────────────────────────────
function Legend({ ru }: { ru: boolean }) {
  return (
    <div className="px-4 py-3 bg-gray-50 dark:bg-[#1c1c1e] border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] space-y-2">
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-[#636366] uppercase tracking-wider mb-1.5">
          {ru ? 'Фрахтовые зоны (заливка)' : 'Freight Zones (fill)'}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {(['GOOD','NSB','DEAD'] as ZoneType[]).map(t => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded shadow-sm flex-shrink-0"
                style={{ backgroundColor: ZONE_FILL[t].base }} />
              <span className="text-xs text-gray-700 dark:text-[#a1a1a6] font-medium">
                {ru ? ZONE_BADGE[t].ru : ZONE_BADGE[t].en}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-[#636366] uppercase tracking-wider mb-1.5">
          {ru ? 'Часовые пояса (световые лучи)' : 'Time Zones (light beams)'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {(['PT','MT','CT','ET'] as TZ[]).map(tz => (
            <div key={tz} className="flex items-center gap-1.5">
              <div className="w-4 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: TZ_CONFIG[tz].beam, opacity: 0.9 }} />
              <span className="text-xs font-bold" style={{ color: TZ_CONFIG[tz].accent }}>{tz}</span>
              <span className="text-[10px] text-gray-400 dark:text-[#636366]">{TZ_META[tz].offset}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MapSvg ─────────────────────────────────────────────────────────────────────
interface MapSvgProps { labelSize: number; onSelect: (zone: ZoneInfo, state: string) => void }

function MapSvg({ labelSize, onSelect }: MapSvgProps) {
  return (
    <ComposableMap
      width={800} height={500}
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 880 }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Layer 1: Freight zone fill */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => {
            const abbr  = FIPS[geo.id] ?? '';
            const zone  = STATE_TO_ZONE[abbr];
            const ztype: ZoneType = zone?.type ?? 'UNKNOWN';
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => zone && onSelect(zone, abbr)}
                style={{
                  default: { fill: ZONE_FILL[ztype].base,  stroke: '#fff', strokeWidth: 0.7, outline: 'none', cursor: zone ? 'pointer' : 'default' },
                  hover:   { fill: ZONE_FILL[ztype].hover, stroke: '#fff', strokeWidth: 0.7, outline: 'none', cursor: zone ? 'pointer' : 'default' },
                  pressed: { fill: ZONE_FILL[ztype].hover, stroke: '#fff', strokeWidth: 0.7, outline: 'none' },
                }}
              />
            );
          })
        }
      </Geographies>

      {/* Layer 2: State abbreviations */}
      {Object.entries(CENTROIDS).map(([abbr, coords]) => {
        if (SKIP_LABEL.has(abbr)) return null;
        return (
          <Marker key={abbr} coordinates={coords}>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                fontFamily: 'Inter,system-ui,sans-serif',
                fontSize: `${labelSize}px`,
                fontWeight: '800',
                fill: '#1e293b',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {abbr}
            </text>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}

// ── ZonePopup ─────────────────────────────────────────────────────────────────
interface PopupProps { zone: ZoneInfo; state: string; ru: boolean; onClose: () => void }

function ZonePopup({ zone, state, ru, onClose }: PopupProps) {
  const tz    = STATE_TZ[state] as TZ | undefined;
  const badge = ZONE_BADGE[zone.type];
  return (
    <div className="bg-white dark:bg-[#2c2c2e] p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-[#f5f5f7] text-base leading-tight">
            {STATE_NAMES[state]}
            <span className="font-normal text-gray-400 dark:text-[#636366] text-sm ml-1.5">({state})</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-[#636366] mb-2.5">{ru ? zone.titleRu : zone.titleEn}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge.cls}`}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: badge.dot }} />
              {ru ? badge.ru : badge.en}
            </span>
            {tz && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700"
                style={{ color: TZ_CONFIG[tz].accent }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TZ_CONFIG[tz].beam }} />
                {tz} · {ru ? TZ_META[tz].ru : TZ_META[tz].en} ({TZ_META[tz].offset})
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-[#a1a1a6] leading-relaxed">{ru ? zone.descRu : zone.descEn}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 dark:bg-[#1c1c1e] rounded-xl px-3 py-1.5">
            <span className="text-xs text-gray-400 dark:text-[#636366]">{ru ? 'Средняя ставка:' : 'Avg rate:'}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-[#f5f5f7]">{zone.avgRate}</span>
          </div>
        </div>
        <button onClick={onClose}
          className="shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-gray-400 dark:text-[#636366] hover:bg-gray-200 dark:hover:bg-[#3a3a3c] transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export function USFreightMap() {
  const { lang } = useLang();
  const ru = lang === 'ru';
  const [selected, setSelected]       = useState<{ zone: ZoneInfo; state: string } | null>(null);
  const [expanded, setExpanded]       = useState(false);
  const [expandedSel, setExpandedSel] = useState<{ zone: ZoneInfo; state: string } | null>(null);

  return (
    <>
      {/* ── Normal card ── */}
      <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)]">
          <div>
            <p className="font-bold text-gray-900 dark:text-[#f5f5f7] text-sm">{ru ? 'Карта зон США' : 'US Freight Zones Map'}</p>
            <p className="text-xs text-gray-400 dark:text-[#636366] mt-0.5">{ru ? 'Нажмите на штат для деталей' : 'Click a state for details'}</p>
          </div>
          <button onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
            {ru ? 'Увеличить' : 'Zoom In'}
          </button>
        </div>

        <Legend ru={ru} />

        {/* Clock badge row */}
        <div className="relative bg-slate-50" style={{ height: 72 }}>
          <TzBadgeRow large={false} />
        </div>

        {/* Map */}
        <div className="relative bg-slate-50" style={{ paddingTop: '62%' }}>
          <div className="absolute inset-0">
            <MapSvg labelSize={5.5} onSelect={(z, s) => setSelected({ zone: z, state: s })} />
          </div>
          {selected && (
            <div className="absolute bottom-2 right-2 z-10 w-72 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e]">
              <ZonePopup zone={selected.zone} state={selected.state} ru={ru} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded modal ── */}
      <Dialog.Root open={expanded} onOpenChange={v => { setExpanded(v); if (!v) setExpandedSel(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">
            <Dialog.Content
              className="bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              style={{ width: 'min(96vw, 960px)', maxHeight: '90vh' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[rgba(255,255,255,0.06)] shrink-0">
                <p className="font-bold text-gray-900 dark:text-[#f5f5f7] text-sm">{ru ? 'Карта зон США' : 'US Freight Zones Map'}</p>
                <Dialog.Close asChild>
                  <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2c2c2e] flex items-center justify-center text-gray-500 dark:text-[#a1a1a6] hover:bg-gray-200 dark:hover:bg-[#3a3a3c]">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
              <div className="shrink-0"><Legend ru={ru} /></div>

              {/* Clock badge row */}
              <div className="relative bg-slate-50 shrink-0" style={{ height: 106 }}>
                <TzBadgeRow large={true} />
              </div>

              {/* Map */}
              <div className="flex-1 bg-slate-50 relative min-h-0" style={{ minHeight: '300px' }}>
                <MapSvg labelSize={11} onSelect={(z, s) => setExpandedSel({ zone: z, state: s })} />
                {expandedSel && (
                  <div className="absolute bottom-4 right-4 z-10 w-80 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#2c2c2e]">
                    <ZonePopup zone={expandedSel.zone} state={expandedSel.state} ru={ru} onClose={() => setExpandedSel(null)} />
                  </div>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
