import { POST as UniverseRoute } from '../[provider]/route';

export const runtime = 'edge';

export const preferredRegion = [
  'icn1',
  'sin1',
  'hnd1',
  'kix1',
  'bom1',
  'cpt1',
  'pdx1',
  'cle1',
  'syd1',
  'iad1',
  'sfo1',
  'gru1',
];

export const POST = async (req: Request) =>
  UniverseRoute(req, { params: Promise.resolve({ provider: 'openai' }) });
