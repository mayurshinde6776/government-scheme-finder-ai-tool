/**
 * scraper.ts
 *
 * Fetches scheme data from the MyScheme.gov.in public API (paginated).
 * Falls back to the bundled schemes_fallback.json when the API is
 * unreachable or returns an error.
 *
 * Exported:
 *   scrapeSchemes(): Promise<SchemeRaw[]>
 */

import axios, { AxiosError } from 'axios';
import path from 'path';
import fs from 'fs';
import type { SchemeRaw, SchemeCategory } from './types';

// ---------------------------------------------------------------------------
// MyScheme API config
// ---------------------------------------------------------------------------
const API_BASE = 'https://www.myscheme.gov.in/api/v1/schemes';
const PAGE_SIZE = 50;
const REQUEST_TIMEOUT_MS = 10_000;

// ---------------------------------------------------------------------------
// Category mapping: MyScheme tags → our SchemeCategory enum
// ---------------------------------------------------------------------------
const CATEGORY_MAP: Record<string, SchemeCategory> = {
  agriculture: 'agriculture',
  farming: 'agriculture',
  'animal husbandry': 'agriculture',
  fisheries: 'agriculture',
  housing: 'housing',
  shelter: 'housing',
  education: 'education',
  scholarship: 'education',
  skill: 'education',
  health: 'health',
  healthcare: 'health',
  medical: 'health',
  insurance: 'social_welfare',
  pension: 'social_welfare',
  'social welfare': 'social_welfare',
  'social security': 'social_welfare',
  employment: 'employment',
  labour: 'employment',
  'self employment': 'employment',
  'women and child': 'women_children',
  'women & child': 'women_children',
  women: 'women_children',
  children: 'women_children',
  girl: 'women_children',
};

function normaliseCategory(tags: string[]): SchemeCategory {
  for (const tag of tags) {
    const lower = tag.toLowerCase().trim();
    for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(key)) return cat;
    }
  }
  return 'social_welfare'; // safe default
}

// ---------------------------------------------------------------------------
// Shape returned by the MyScheme API (partial — we only need what we use)
// ---------------------------------------------------------------------------
interface ApiScheme {
  schemeId?: string;
  schemeName?: string;
  schemeShortTitle?: string;
  ministry?: string;
  department?: string;
  state?: string | null;
  tags?: string[];
  briefDescription?: string;
  benefitDescription?: string;
  eligibilityDescription?: string;
  eligibilityCriteria?: string[];
  documentsRequired?: string[];
  applicationUrl?: string;
  schemeUrl?: string;
}

interface ApiResponse {
  data?: {
    schemes?: ApiScheme[];
    totalCount?: number;
    page?: number;
    pageSize?: number;
  };
  success?: boolean;
}

function toSchemeRaw(api: ApiScheme): SchemeRaw {
  const eligParts: string[] = [];
  if (api.eligibilityDescription) eligParts.push(api.eligibilityDescription);
  if (api.eligibilityCriteria?.length) {
    eligParts.push(api.eligibilityCriteria.join(' '));
  }

  return {
    name: (api.schemeName ?? api.schemeShortTitle ?? 'Unknown Scheme').trim(),
    ministry: (api.ministry ?? api.department ?? 'Government of India').trim(),
    category: normaliseCategory(api.tags ?? []),
    state: api.state?.trim() || null,
    description: (api.briefDescription ?? '').trim(),
    eligibility_text: eligParts.join('\n\n').trim() || (api.briefDescription ?? '').trim(),
    benefits_text: (api.benefitDescription ?? '').trim(),
    documents_required: api.documentsRequired ?? [],
    apply_url: (api.applicationUrl ?? api.schemeUrl ?? 'https://www.myscheme.gov.in/').trim(),
  };
}

// ---------------------------------------------------------------------------
// Primary: paginated API fetch
// ---------------------------------------------------------------------------
async function fetchFromApi(): Promise<SchemeRaw[]> {
  const schemes: SchemeRaw[] = [];
  let page = 1;
  let totalPages = 1;

  console.log('[scraper] Attempting to fetch from MyScheme API…');

  while (page <= totalPages) {
    const url = `${API_BASE}?page=${page}&pageSize=${PAGE_SIZE}`;
    const { data: body } = await axios.get<ApiResponse>(url, {
      timeout: REQUEST_TIMEOUT_MS,
      headers: { Accept: 'application/json' },
    });

    if (!body?.success || !body?.data?.schemes) {
      throw new Error('[scraper] API returned unexpected shape');
    }

    const pageSchemes = body.data.schemes.map(toSchemeRaw);
    schemes.push(...pageSchemes);

    const total = body.data.totalCount ?? pageSchemes.length;
    totalPages = Math.ceil(total / PAGE_SIZE);
    console.log(`[scraper] Fetched page ${page}/${totalPages} (${pageSchemes.length} schemes)`);
    page++;
  }

  return schemes;
}

// ---------------------------------------------------------------------------
// Fallback: local JSON file
// ---------------------------------------------------------------------------
function loadFallback(): SchemeRaw[] {
  const fallbackPath = path.resolve(__dirname, 'schemes_fallback.json');
  console.log(`[scraper] Loading fallback from ${fallbackPath}`);
  if (!fs.existsSync(fallbackPath)) {
    throw new Error(`[scraper] Fallback file not found: ${fallbackPath}`);
  }
  const raw = fs.readFileSync(fallbackPath, 'utf8');
  const parsed = JSON.parse(raw) as SchemeRaw[];
  console.log(`[scraper] Loaded ${parsed.length} schemes from fallback`);
  return parsed;
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export async function scrapeSchemes(): Promise<SchemeRaw[]> {
  try {
    const schemes = await fetchFromApi();
    if (schemes.length === 0) throw new Error('[scraper] API returned 0 schemes');
    console.log(`[scraper] ✓ Fetched ${schemes.length} schemes from API`);
    return schemes;
  } catch (err) {
    const msg = err instanceof AxiosError
      ? `${err.code ?? err.message} (status: ${err.response?.status ?? 'none'})`
      : err instanceof Error ? err.message : String(err);
    console.warn(`[scraper] API fetch failed (${msg}). Falling back to local JSON.`);
    return loadFallback();
  }
}
