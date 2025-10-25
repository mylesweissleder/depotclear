/**
 * Maps ZIP codes to metro areas for newsletter segmentation
 * Users with ZIPs outside our service areas get null metro = generic newsletter
 */

// Metro area definitions based on ZIP code prefixes
// Source: USPS ZIP code allocation
const ZIP_TO_METRO_MAP: Record<string, { metro: string; region: string }> = {
  // San Francisco Bay Area (940-941, 943-945)
  '940': { metro: 'san-francisco', region: 'bay-area' },
  '941': { metro: 'san-francisco', region: 'bay-area' },
  '943': { metro: 'oakland', region: 'bay-area' },
  '944': { metro: 'san-rafael', region: 'bay-area' },
  '945': { metro: 'oakland', region: 'bay-area' },

  // San Jose / South Bay (950-951)
  '950': { metro: 'san-jose', region: 'bay-area' },
  '951': { metro: 'san-jose', region: 'bay-area' },

  // East Bay - Walnut Creek (946)
  '946': { metro: 'walnut-creek', region: 'bay-area' },

  // Los Angeles (900-908)
  '900': { metro: 'los-angeles', region: 'socal' },
  '901': { metro: 'los-angeles', region: 'socal' },
  '902': { metro: 'los-angeles', region: 'socal' },
  '903': { metro: 'los-angeles', region: 'socal' },
  '904': { metro: 'santa-monica', region: 'socal' },
  '905': { metro: 'long-beach', region: 'socal' },
  '906': { metro: 'long-beach', region: 'socal' },
  '907': { metro: 'long-beach', region: 'socal' },
  '908': { metro: 'long-beach', region: 'socal' },

  // San Diego (920-921)
  '920': { metro: 'san-diego', region: 'socal' },
  '921': { metro: 'san-diego', region: 'socal' },

  // Sacramento (956-958)
  '956': { metro: 'sacramento', region: 'california' },
  '957': { metro: 'sacramento', region: 'california' },
  '958': { metro: 'sacramento', region: 'california' },

  // Orange County / Irvine (926-927)
  '926': { metro: 'irvine', region: 'socal' },
  '927': { metro: 'irvine', region: 'socal' },

  // Santa Cruz (950)
  '950': { metro: 'santa-cruz', region: 'california' },

  // San Luis Obispo (934)
  '934': { metro: 'san-luis-obispo', region: 'california' },

  // Seattle (981-982, 980)
  '980': { metro: 'seattle', region: 'pacific-northwest' },
  '981': { metro: 'seattle', region: 'pacific-northwest' },
  '982': { metro: 'seattle', region: 'pacific-northwest' },

  // Tacoma (983-984)
  '983': { metro: 'tacoma', region: 'pacific-northwest' },
  '984': { metro: 'tacoma', region: 'pacific-northwest' },

  // Portland (970-972)
  '970': { metro: 'portland', region: 'pacific-northwest' },
  '971': { metro: 'portland', region: 'pacific-northwest' },
  '972': { metro: 'portland', region: 'pacific-northwest' },

  // New York (100-104)
  '100': { metro: 'new-york', region: 'northeast' },
  '101': { metro: 'new-york', region: 'northeast' },
  '102': { metro: 'new-york', region: 'northeast' },
  '103': { metro: 'new-york', region: 'northeast' },
  '104': { metro: 'new-york', region: 'northeast' },

  // Boston (021-024)
  '021': { metro: 'boston', region: 'northeast' },
  '022': { metro: 'boston', region: 'northeast' },
  '023': { metro: 'boston', region: 'northeast' },
  '024': { metro: 'boston', region: 'northeast' },

  // Washington DC (200-205)
  '200': { metro: 'washington', region: 'northeast' },
  '201': { metro: 'washington', region: 'northeast' },
  '202': { metro: 'washington', region: 'northeast' },
  '203': { metro: 'washington', region: 'northeast' },
  '204': { metro: 'washington', region: 'northeast' },
  '205': { metro: 'washington', region: 'northeast' },

  // Philadelphia (190-191)
  '190': { metro: 'philadelphia', region: 'northeast' },
  '191': { metro: 'philadelphia', region: 'northeast' },

  // Baltimore (212)
  '212': { metro: 'baltimore', region: 'northeast' },

  // Chicago (606-608)
  '606': { metro: 'chicago', region: 'midwest' },
  '607': { metro: 'chicago', region: 'midwest' },
  '608': { metro: 'chicago', region: 'midwest' },

  // Minneapolis (554-555)
  '554': { metro: 'minneapolis', region: 'midwest' },
  '555': { metro: 'minneapolis', region: 'midwest' },

  // Madison (537)
  '537': { metro: 'madison', region: 'midwest' },

  // Ann Arbor (481)
  '481': { metro: 'ann-arbor', region: 'midwest' },

  // Denver (802-803)
  '802': { metro: 'denver', region: 'mountain' },
  '803': { metro: 'denver', region: 'mountain' },

  // Boulder (803)
  '803': { metro: 'boulder', region: 'mountain' },

  // Salt Lake City (841-842)
  '841': { metro: 'salt-lake-city', region: 'mountain' },
  '842': { metro: 'salt-lake-city', region: 'mountain' },

  // Austin (787)
  '787': { metro: 'austin', region: 'southwest' },

  // Dallas (752-753)
  '752': { metro: 'dallas', region: 'southwest' },
  '753': { metro: 'dallas', region: 'southwest' },

  // Houston (770-772)
  '770': { metro: 'houston', region: 'southwest' },
  '771': { metro: 'houston', region: 'southwest' },
  '772': { metro: 'houston', region: 'southwest' },

  // San Antonio (782)
  '782': { metro: 'san-antonio', region: 'southwest' },

  // Phoenix (850-853)
  '850': { metro: 'phoenix', region: 'southwest' },
  '851': { metro: 'phoenix', region: 'southwest' },
  '852': { metro: 'phoenix', region: 'southwest' },
  '853': { metro: 'phoenix', region: 'southwest' },

  // Las Vegas (890-891)
  '890': { metro: 'las-vegas', region: 'southwest' },
  '891': { metro: 'las-vegas', region: 'southwest' },

  // Albuquerque (870-871)
  '870': { metro: 'albuquerque', region: 'southwest' },
  '871': { metro: 'albuquerque', region: 'southwest' },

  // Miami (330-332)
  '330': { metro: 'miami', region: 'southeast' },
  '331': { metro: 'miami', region: 'southeast' },
  '332': { metro: 'miami', region: 'southeast' },

  // Atlanta (303-304)
  '303': { metro: 'atlanta', region: 'southeast' },
  '304': { metro: 'atlanta', region: 'southeast' },

  // Nashville (372)
  '372': { metro: 'nashville', region: 'southeast' },

  // Charlotte (282)
  '282': { metro: 'charlotte', region: 'southeast' },

  // Raleigh (276)
  '276': { metro: 'raleigh', region: 'southeast' },

  // Tampa (336)
  '336': { metro: 'tampa', region: 'southeast' },

  // Orlando (328)
  '328': { metro: 'orlando', region: 'southeast' },
};

/**
 * Maps a 5-digit ZIP code to a metro area
 * Returns null for ZIPs outside our service areas (generic newsletter)
 */
export function zipToMetro(zipCode: string | null | undefined): { metro: string; region: string } | null {
  if (!zipCode || zipCode.length !== 5) {
    return null;
  }

  // Try 3-digit prefix first (most specific)
  const prefix3 = zipCode.substring(0, 3);
  if (ZIP_TO_METRO_MAP[prefix3]) {
    return ZIP_TO_METRO_MAP[prefix3];
  }

  // Try 2-digit prefix (less specific)
  const prefix2 = zipCode.substring(0, 2);
  if (ZIP_TO_METRO_MAP[prefix2]) {
    return ZIP_TO_METRO_MAP[prefix2];
  }

  // ZIP not in our service areas -> generic newsletter
  return null;
}

/**
 * Get a human-readable metro name
 */
export function getMetroDisplayName(metro: string | null): string {
  const displayNames: Record<string, string> = {
    'san-francisco': 'San Francisco Bay Area',
    'oakland': 'Oakland',
    'san-jose': 'San Jose',
    'san-rafael': 'San Rafael',
    'walnut-creek': 'Walnut Creek',
    'los-angeles': 'Los Angeles',
    'santa-monica': 'Santa Monica',
    'long-beach': 'Long Beach',
    'san-diego': 'San Diego',
    'irvine': 'Irvine',
    'sacramento': 'Sacramento',
    'santa-cruz': 'Santa Cruz',
    'san-luis-obispo': 'San Luis Obispo',
    'seattle': 'Seattle',
    'tacoma': 'Tacoma',
    'portland': 'Portland',
    'new-york': 'New York City',
    'boston': 'Boston',
    'washington': 'Washington DC',
    'philadelphia': 'Philadelphia',
    'baltimore': 'Baltimore',
    'chicago': 'Chicago',
    'minneapolis': 'Minneapolis',
    'madison': 'Madison',
    'ann-arbor': 'Ann Arbor',
    'denver': 'Denver',
    'boulder': 'Boulder',
    'salt-lake-city': 'Salt Lake City',
    'austin': 'Austin',
    'dallas': 'Dallas',
    'houston': 'Houston',
    'san-antonio': 'San Antonio',
    'phoenix': 'Phoenix',
    'las-vegas': 'Las Vegas',
    'albuquerque': 'Albuquerque',
    'miami': 'Miami',
    'atlanta': 'Atlanta',
    'nashville': 'Nashville',
    'charlotte': 'Charlotte',
    'raleigh': 'Raleigh',
    'tampa': 'Tampa',
    'orlando': 'Orlando',
  };

  return metro ? (displayNames[metro] || metro) : 'Nationwide';
}
