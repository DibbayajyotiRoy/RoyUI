export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'paid' | 'refunded' | 'pending' | 'failed';
  placedAt: Date;
  channel: 'Web' | 'Mobile' | 'API' | 'In-store';
};

const FIRST_NAMES = [
  'Aarav', 'Mira', 'Theo', 'Yuna', 'Kofi', 'Lila', 'Otto', 'Zara',
  'Hugo', 'Asha', 'Bram', 'Cleo', 'Dax', 'Esme', 'Frey', 'Gita',
  'Idris', 'Juno', 'Kian', 'Lior', 'Maya', 'Niko', 'Orla', 'Pia',
  'Rashid', 'Suri', 'Tomi', 'Uma', 'Vela', 'Wren', 'Xen', 'Yael',
];

const LAST_NAMES = [
  'Okafor', 'Lindqvist', 'Reyes', 'Tanaka', 'Mendez', 'Chen', 'Petrov', 'Diallo',
  'Halim', 'Ito', 'Costa', 'Hassan', 'Park', 'Lima', 'Berg', 'Singh',
  'Vargas', 'Khoury', 'Romero', 'Yamada', 'Asante', 'Becker', 'Nazaria', 'Olsen',
];

const STATUSES: Order['status'][] = ['paid', 'refunded', 'pending', 'failed'];
const CHANNELS: Order['channel'][] = ['Web', 'Mobile', 'API', 'In-store'];

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rand: () => number, arr: T[]): T =>
  arr[Math.floor(rand() * arr.length)] as T;

export function makeOrders(count = 60, seed = 42): Order[] {
  const rand = mulberry32(seed);
  const now = new Date();
  const out: Order[] = [];
  for (let i = 0; i < count; i++) {
    const first = pick(rand, FIRST_NAMES);
    const last = pick(rand, LAST_NAMES);
    const customer = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
    const daysAgo = Math.floor(rand() * 90);
    const hours = Math.floor(rand() * 24);
    const minutes = Math.floor(rand() * 60);
    const placedAt = new Date(now);
    placedAt.setDate(placedAt.getDate() - daysAgo);
    placedAt.setHours(hours, minutes, 0, 0);
    out.push({
      id: `INV-${(4200 + i).toString()}`,
      customer,
      email,
      total: Math.round(rand() * 95000) / 100 + 5,
      status: pick(rand, STATUSES),
      placedAt,
      channel: pick(rand, CHANNELS),
    });
  }
  return out;
}
