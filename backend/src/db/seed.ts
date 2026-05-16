/**
 * seed.ts
 * Inserts 10 sample government schemes into the `schemes` table.
 * Embeddings are left NULL — the embedding pipeline should fill them later.
 *
 * Usage:
 *   npx ts-node src/db/seed.ts
 *   -- or --
 *   npm run seed
 */

import 'dotenv/config';
import pool from './index';

interface SchemeSeed {
  name: string;
  ministry: string;
  category:
    | 'agriculture'
    | 'housing'
    | 'education'
    | 'health'
    | 'social_welfare'
    | 'employment'
    | 'women_children';
  state: string | null;
  description: string;
  eligibility_text: string;
  benefits_text: string;
  documents_required: string[];
  apply_url: string;
}

const schemes: SchemeSeed[] = [
  // ── 1. PM-KISAN ──────────────────────────────────────────────────────────
  {
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'agriculture',
    state: null,
    description:
      'PM-KISAN is a Central Sector Scheme that provides income support to all landholding farmers\' families across the country to supplement their financial needs for procuring inputs related to agriculture and allied activities.',
    eligibility_text:
      'The scheme is open to all landholder farmer families in India whose names appear in the land records maintained by the respective State or Union Territory governments. ' +
      'A farmer family is defined as a husband, wife, and their minor children who collectively own cultivable land. ' +
      'The following categories are excluded: (a) Former and present holders of Constitutional posts; (b) Former and present Ministers, Members of Parliament, Members of State Legislative Assemblies, Mayors, and District Panchayat Chairpersons; ' +
      '(c) Serving and retired officers and employees of Central or State Government Ministries, Departments, and Field Offices, including those of attached and subordinate offices and autonomous institutions under the Government, as well as regular employees of Local Bodies (excluding Multi-Tasking Staff/Group-D/Group-IV employees); ' +
      '(d) All superannuated and retired pensioners whose monthly pension is Rs. 10,000 or more; ' +
      '(e) All persons who paid Income Tax in the last assessment year; ' +
      '(f) Professionals such as Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with professional bodies and carrying out their profession by practice.',
    benefits_text:
      'Eligible farmer families receive a financial benefit of Rs. 6,000 per year, paid in three equal installments of Rs. 2,000 each, directly into their Aadhaar-linked bank accounts through Direct Benefit Transfer (DBT) every four months.',
    documents_required: [
      'Aadhaar Card',
      'Land ownership documents / Khatian / ROR (Record of Rights)',
      'Bank account passbook (Aadhaar-linked)',
      'Mobile number linked to Aadhaar',
    ],
    apply_url: 'https://pmkisan.gov.in/',
  },

  // ── 2. PMAY (Urban) ───────────────────────────────────────────────────────
  {
    name: 'Pradhan Mantri Awas Yojana – Urban (PMAY-U)',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'housing',
    state: null,
    description:
      'PMAY-Urban aims to provide affordable housing to the urban poor by 2022 through financial assistance for construction or enhancement of houses and Credit Linked Subsidy Scheme (CLSS) for the middle-income group.',
    eligibility_text:
      'The scheme covers urban households belonging to Economically Weaker Section (EWS), Low Income Group (LIG), and Middle Income Group (MIG) categories. ' +
      'EWS households are those with an annual household income up to Rs. 3 lakh. LIG households have an annual income between Rs. 3 lakh and Rs. 6 lakh. ' +
      'MIG-I households have an annual income between Rs. 6 lakh and Rs. 12 lakh, and MIG-II households have an annual income between Rs. 12 lakh and Rs. 18 lakh. ' +
      'The beneficiary family must not own a pucca house in their or any family member\'s name anywhere in India. ' +
      'For EWS and LIG categories, the female head of household or joint ownership with a female member is mandatory unless the household has no adult female member. ' +
      'Scheduled Castes (SC), Scheduled Tribes (ST), Other Backward Classes (OBC), Minorities, Persons with Disabilities, and transgender persons are given preference.',
    benefits_text:
      'Under the Credit Linked Subsidy Scheme (CLSS), beneficiaries receive an interest subsidy on housing loans: EWS/LIG: 6.5% subsidy on loans up to Rs. 6 lakh for a maximum loan tenure of 20 years. ' +
      'MIG-I: 4% subsidy on loans up to Rs. 9 lakh. MIG-II: 3% subsidy on loans up to Rs. 12 lakh. ' +
      'Under the Beneficiary Led Construction (BLC) and Affordable Housing in Partnership (AHP) verticals, EWS beneficiaries receive a central assistance of Rs. 1.5 lakh per house.',
    documents_required: [
      'Aadhaar Card',
      'Income certificate from competent authority',
      'Caste certificate (for SC/ST/OBC)',
      'BPL card (if applicable)',
      'Bank account details',
      'Proof of current residence',
      'Affidavit declaring no pucca house ownership',
      'Photograph (passport size)',
    ],
    apply_url: 'https://pmaymis.gov.in/',
  },

  // ── 3. Sukanya Samriddhi Yojana ──────────────────────────────────────────
  {
    name: 'Sukanya Samriddhi Yojana (SSY)',
    ministry: 'Ministry of Finance',
    category: 'women_children',
    state: null,
    description:
      'Sukanya Samriddhi Yojana is a small-deposit savings scheme for the girl child, introduced as part of the Beti Bachao Beti Padhao campaign, offering attractive interest rates and tax benefits.',
    eligibility_text:
      'The scheme is open to the parents or legal guardians of a girl child who is a resident Indian citizen. The account can be opened from birth until the girl child attains the age of 10 years. ' +
      'Only one account is permitted per girl child, and a maximum of two accounts may be opened per family — one for each girl child. ' +
      'In the case of twin girls born in the second birth or if the first birth results in three girl children, a third account is permissible with documentary proof of multiple births. ' +
      'Non-Resident Indians (NRIs) are not eligible to open a Sukanya Samriddhi account. If the account holder subsequently becomes an NRI or loses Indian citizenship, the account shall be deemed closed from the date of change of status.',
    benefits_text:
      'The account earns an attractive government-mandated interest rate (currently 8.2% per annum, compounded annually and revised quarterly). ' +
      'A minimum deposit of Rs. 250 per year is required to keep the account active, and the maximum deposit allowed per year is Rs. 1.5 lakh. ' +
      'The account matures 21 years from the date of opening, or upon the girl\'s marriage after she attains the age of 18. ' +
      'Partial withdrawal of up to 50% of the balance is permitted after the girl attains the age of 18, for higher education expenses. ' +
      'Tax benefits: Deposits qualify for deduction under Section 80C of the Income Tax Act; interest earned and maturity amount are fully tax-exempt (EEE status).',
    documents_required: [
      'Birth certificate of the girl child',
      'Identity proof of parent/guardian (Aadhaar Card, PAN Card, Passport)',
      'Address proof of parent/guardian',
      'Photograph of parent/guardian and girl child',
    ],
    apply_url: 'https://www.india.gov.in/sukanya-samriddhi-account',
  },

  // ── 4. PMJJBY ────────────────────────────────────────────────────────────
  {
    name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    ministry: 'Ministry of Finance',
    category: 'social_welfare',
    state: null,
    description:
      'PMJJBY is a government-backed life insurance scheme offering renewable one-year term life cover of Rs. 2 lakh on death due to any cause, at a very low premium.',
    eligibility_text:
      'Any individual aged between 18 years and 50 years (age at last birthday) who holds a savings bank or post office account is eligible to enrol under this scheme. ' +
      'The subscriber must give their consent to auto-debit of the annual premium from their linked savings bank account. ' +
      'A person with multiple savings bank accounts in one or different banks can enrol in the scheme through only one savings bank account. ' +
      'Individuals who exit the scheme at any point can re-join subject to payment of full annual premium and submission of a declaration of good health. ' +
      'Life cover terminates on: (a) attainment of age 55 years; (b) closure of bank account; or (c) insufficient balance for premium auto-debit.',
    benefits_text:
      'Death benefit of Rs. 2,00,000 (Rs. 2 lakh) payable to the nominee upon the death of the insured from any cause. ' +
      'The annual premium is Rs. 436 per annum per member (as revised for 2023-24), auto-debited from the subscriber\'s bank account in one installment on or before 31st May of each annual coverage period (1st June to 31st May).',
    documents_required: [
      'Savings bank account (Aadhaar-linked recommended)',
      'Aadhaar Card',
      'Consent-cum-declaration form',
      'Nominee details',
    ],
    apply_url: 'https://jansuraksha.gov.in/',
  },

  // ── 5. Ayushman Bharat – PMJAY ────────────────────────────────────────────
  {
    name: 'Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'health',
    state: null,
    description:
      'AB-PMJAY is the world\'s largest government-funded health assurance scheme, providing health coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalisation.',
    eligibility_text:
      'Eligibility is determined based on the Socio-Economic Caste Census (SECC) 2011 database and is occupation-based for urban families. ' +
      'For rural areas, families are included based on deprivation criteria such as: households with no adult member between 16-59 years, households with a disabled member and no able-bodied adult member, SC/ST households, landless households deriving a major part of income from manual casual labour, and households living in a single room with no pucca walls or roof. ' +
      'For urban areas, eligible occupational categories include: rag pickers, beggars, domestic workers, street vendors and cobblers, construction workers, plumbers, masons, painters, sweepers, sanitation workers, tailors, transport workers such as drivers and conductors, shop workers and assistants, home-based workers, artisans and handicraft workers, electricians, mechanics and washermen, and helpers and peons in shops and restaurants. ' +
      'There is no cap on family size or age, and the benefit cover is portable across India at any empanelled hospital.',
    benefits_text:
      'Health cover of Rs. 5,00,000 (Rs. 5 lakh) per family per year on a floater basis, covering all pre-existing diseases from day one. ' +
      'Covers up to 3 days of pre-hospitalisation and 15 days of post-hospitalisation expenses including diagnostics and medicines. ' +
      'Over 1,929 medical procedures across 27 specialities are covered. Treatment is cashless and paperless at any of the 25,000+ empanelled government and private hospitals across India.',
    documents_required: [
      'Aadhaar Card or any government-issued photo ID',
      'Ration card',
      'SECC database inclusion confirmation / Ayushman Card',
    ],
    apply_url: 'https://pmjay.gov.in/',
  },

  // ── 6. MGNREGA ───────────────────────────────────────────────────────────
  {
    name: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)',
    ministry: 'Ministry of Rural Development',
    category: 'employment',
    state: null,
    description:
      'MGNREGA is a landmark rights-based legislation that guarantees 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.',
    eligibility_text:
      'Any adult member of a rural household who is willing to do unskilled manual work is eligible to register under the scheme. ' +
      '\'Adult\' means a person who has completed 18 years of age. The household must be a rural household — residing in a Gram Panchayat area as per the definitions applicable to the respective State. ' +
      'The household must register with the local Gram Panchayat by submitting an application with details of adult members willing to work. ' +
      'There is no income limit or caste restriction for eligibility. Priority is given to Scheduled Castes, Scheduled Tribes, women, and persons with disabilities. ' +
      'There is no restriction on the number of registrations per household; however, the entitlement of 100 days of employment is per household per financial year.',
    benefits_text:
      'Guaranteed 100 days of wage employment per rural household per financial year. ' +
      'Statutory minimum wages are paid, varying by state (e.g., Rs. 236–357 per day as of 2024-25), paid directly into the worker\'s bank or post office account within 15 days of completion of work. ' +
      'If employment is not provided within 15 days of demand, the applicant is entitled to an unemployment allowance. ' +
      'Works undertaken include water conservation structures, rural connectivity, land development, flood control, and rural sanitation.',
    documents_required: [
      'MGNREGA Job Card (obtained from Gram Panchayat upon registration)',
      'Aadhaar Card',
      'Bank account or Post Office account linked to Aadhaar (for wage payment)',
      'Proof of residence in the rural area (voter ID, ration card)',
    ],
    apply_url: 'https://nrega.nic.in/',
  },

  // ── 7. Beti Bachao Beti Padhao ───────────────────────────────────────────
  {
    name: 'Beti Bachao Beti Padhao (BBBP)',
    ministry: 'Ministry of Women and Child Development',
    category: 'women_children',
    state: null,
    description:
      'Beti Bachao Beti Padhao is a tri-ministerial initiative to address the declining Child Sex Ratio (CSR) and the empowerment of girl children through education and awareness campaigns.',
    eligibility_text:
      'The scheme is aimed at all families, communities, and institutions across India, with a focus on districts with a low Child Sex Ratio (CSR below 918 girls per 1000 boys as per the last census). ' +
      'The primary target group is families expecting or having girl children aged 0 to 18 years. ' +
      'The scheme operates through awareness campaigns, community mobilisation, and inter-sectoral convergence with schemes such as Sukanya Samriddhi Yojana, ICDS, and school education programmes. ' +
      'While there are no income-based restrictions on participation in awareness activities, associated financial benefits (such as Sukanya Samriddhi Yojana accounts) are open to all families with girl children regardless of income.',
    benefits_text:
      'The scheme does not provide direct cash transfers but facilitates access to: improved sex ratio at birth; enrolment and retention of girl children in schools; ' +
      'institutional delivery and post-natal care for girl children; convergence with Sukanya Samriddhi Yojana for financial security; ' +
      'scholarships for meritorious girl students; and protection against gender-biased sex-selective elimination.',
    documents_required: [
      'Birth certificate of the girl child',
      'Aadhaar Card of parents/guardians',
      'School enrolment records (for education-related benefits)',
    ],
    apply_url: 'https://wcd.nic.in/bbbp-schemes',
  },

  // ── 8. National Scholarship Portal ──────────────────────────────────────
  {
    name: 'National Scholarship Portal (NSP) – Central Schemes',
    ministry: 'Ministry of Electronics and Information Technology (NIC)',
    category: 'education',
    state: null,
    description:
      'The National Scholarship Portal is a one-stop digital platform for students to apply for central government scholarships including pre-matric and post-matric scholarships for SC, ST, OBC, minorities, and merit-based national scholarships.',
    eligibility_text:
      'Eligibility varies by the individual scholarship scheme hosted on the portal, but common criteria include: ' +
      'The applicant must be an Indian citizen enrolled in a recognised school, college, or university. ' +
      'For Pre-Matric Scholarships (Class 1 to 10): family income must not exceed Rs. 2.5 lakh per annum for minority communities; SC/ST pre-matric scholarships are for Class 9 and 10 students whose parental income does not exceed Rs. 2.5 lakh per annum. ' +
      'For Post-Matric Scholarships (Class 11 and above including professional courses): SC/ST students must have secured at least 50% marks in the previous examination, and parental income must not exceed Rs. 2.5 lakh per annum for SC and Rs. 2.5 lakh per annum for ST. ' +
      'For OBC Post-Matric Scholarships: family income must not exceed Rs. 1.5 lakh per annum. ' +
      'For Central Sector Scheme of Scholarships for College & University Students (merit-based): applicants must have scored above the 80th percentile in the Class 12 board examination and family income must not exceed Rs. 8 lakh per annum. ' +
      'A student can avail of only one scholarship at a time through the NSP.',
    benefits_text:
      'Scholarship amounts vary by scheme and level of study. Examples: ' +
      'SC Post-Matric Scholarship: maintenance allowance of Rs. 1,200–3,000 per month plus actual tuition fees. ' +
      'Central Sector Merit Scholarship: Rs. 10,000 per year for undergraduate students and Rs. 20,000 per year for postgraduate students. ' +
      'All amounts are disbursed directly into the student\'s Aadhaar-linked bank account through DBT.',
    documents_required: [
      'Aadhaar Card',
      'Income certificate from competent authority (not older than 6 months)',
      'Caste/community certificate (SC/ST/OBC/Minority)',
      'Previous class marksheet / admit card',
      'Bank account passbook (Aadhaar-linked)',
      'Bonafide student certificate from current institution',
      'Domicile certificate (for state-specific quotas)',
      'Passport-size photograph',
    ],
    apply_url: 'https://scholarships.gov.in/',
  },

  // ── 9. PM SVANidhi ───────────────────────────────────────────────────────
  {
    name: 'PM Street Vendor\'s AtmaNirbhar Nidhi (PM SVANidhi)',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'employment',
    state: null,
    description:
      'PM SVANidhi is a micro-credit scheme that provides affordable working capital loans to street vendors affected by the Covid-19 pandemic, enabling them to resume their livelihoods.',
    eligibility_text:
      'Any street vendor who was vending in an urban area on or before 24th March, 2020, is eligible to apply under the scheme. ' +
      'The following categories of vendors are covered: ' +
      '(a) Vendors with a Certificate of Vending (CoV) or an Identity Card issued by Urban Local Bodies (ULBs); ' +
      '(b) Vendors identified in the survey conducted by ULBs but not yet issued a CoV or Identity Card — such vendors are given a Letter of Recommendation (LoR) by the ULB or Town Vending Committee (TVC); ' +
      '(c) Vendors who were left out of the ULB survey or who started vending after the survey — such vendors are also given an LoR by the ULB or TVC; ' +
      '(d) Vendors from surrounding development or peri-urban or rural areas who vend in the geographical limits of the ULB. ' +
      'There is no income limit for eligibility. All genders, castes, and communities are eligible.',
    benefits_text:
      'Initial working capital loan of Rs. 10,000. Upon timely repayment, eligibility for an enhanced loan of Rs. 20,000, and subsequently Rs. 50,000. ' +
      'Interest subsidy of 7% per annum on timely or early repayment is credited quarterly directly to the beneficiary\'s bank account. ' +
      'Incentive for digital transactions: monthly cash-back incentives of up to Rs. 1,200 per year for vendors who adopt digital payments. ' +
      'Access to social security schemes under PM Jeevan Jyoti Bima Yojana, PM Suraksha Bima Yojana, and PM Jan Dhan Yojana.',
    documents_required: [
      'Certificate of Vending / Identity Card issued by ULB, OR Letter of Recommendation from ULB/TVC',
      'Aadhaar Card',
      'Bank account passbook (Aadhaar-linked)',
      'Mobile number linked to Aadhaar',
      'Photograph (passport size)',
    ],
    apply_url: 'https://pmsvanidhi.mohua.gov.in/',
  },

  // ── 10. PM Ujjwala Yojana ─────────────────────────────────────────────────
  {
    name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
    ministry: 'Ministry of Petroleum and Natural Gas',
    category: 'social_welfare',
    state: null,
    description:
      'PMUY aims to safeguard the health of women and children in BPL households by providing free LPG connections, replacing unclean cooking fuels such as wood, dung cakes, and coal with clean LPG.',
    eligibility_text:
      'The scheme is open to adult women who belong to Below Poverty Line (BPL) households and do not already have an LPG connection in their name or in the name of any family member at the same address. ' +
      'The applicant must be 18 years of age or older. ' +
      'Priority is given to women from the following categories: ' +
      '(a) Beneficiaries of Pradhan Mantri Awas Yojana – Gramin (PMAY-G); ' +
      '(b) Antyodaya Anna Yojana (AAY) ration card holders; ' +
      '(c) Households with a member listed as Most Backward Classes (SECC); ' +
      '(d) Tea Garden and Ex-Tea Garden Tribe beneficiaries in Assam; ' +
      '(e) People residing in Forest-Dweller categories; ' +
      '(f) Residents of islands and river islands; ' +
      '(g) SC/ST households; ' +
      '(h) Households covered under the PM Garib Kalyan Yojana. ' +
      'The applicant must not have received PMUY benefits previously. The connection must be in the name of the adult female member of the household.',
    benefits_text:
      'One free LPG connection (consisting of a pressure regulator, booklet, safety hose, and a cylinder) provided free of cost. ' +
      'Under Ujjwala 2.0, a first refill and a hot plate (stove) are also provided free of charge. ' +
      'The deposit for the cylinder and pressure regulator is covered by the government through the Oil Marketing Company (OMC) on behalf of the beneficiary. ' +
      'Beneficiaries are also entitled to subsidised LPG refills as per the government\'s PAHAL-DBTL scheme.',
    documents_required: [
      'BPL ration card OR Antyodaya Anna Yojana (AAY) card OR SECC 2011 data printout',
      'Aadhaar Card of the adult female applicant',
      'Bank account passbook (Aadhaar-linked) of the female applicant',
      'Photograph (passport size) of the applicant',
      'Self-declaration of no existing LPG connection in the household',
    ],
    apply_url: 'https://www.pmuy.gov.in/',
  },
];

async function seed(): Promise<void> {
  console.log('[seed] Starting seed operation…');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const scheme of schemes) {
      const { rows } = await client.query<{ id: string }>(
        'SELECT id FROM schemes WHERE name = $1 LIMIT 1',
        [scheme.name]
      );

      if (rows.length > 0) {
        console.log(`[seed] – Skipping (already exists): ${scheme.name}`);
        continue;
      }

      await client.query(
        `INSERT INTO schemes
           (name, ministry, category, state, description,
            eligibility_text, benefits_text, documents_required, apply_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          scheme.name,
          scheme.ministry,
          scheme.category,
          scheme.state,
          scheme.description,
          scheme.eligibility_text,
          scheme.benefits_text,
          scheme.documents_required,
          scheme.apply_url,
        ]
      );
      console.log(`[seed] ✓ Inserted: ${scheme.name}`);
    }

    await client.query('COMMIT');
    console.log(`[seed] Done — ${schemes.length} schemes processed.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[seed] Error, rolling back:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('[seed] Fatal error:', err);
  process.exit(1);
});
