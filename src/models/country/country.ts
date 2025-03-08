import { CountryService } from "@models/country/service.ts";

/**
 * Represents a country with essential details.
 * @class Country
 */
export class Country {
  // Explicitly declare static properties for each country (uppercase)
  static readonly AF: Country;
  static readonly AX: Country;
  static readonly AL: Country;
  static readonly DZ: Country;
  static readonly AS: Country;
  static readonly AD: Country;
  static readonly AO: Country;
  static readonly AI: Country;
  static readonly AQ: Country;
  static readonly AG: Country;
  static readonly AR: Country;
  static readonly AM: Country;
  static readonly AW: Country;
  static readonly AU: Country;
  static readonly AT: Country;
  static readonly AZ: Country;
  static readonly BS: Country;
  static readonly BH: Country;
  static readonly BD: Country;
  static readonly BB: Country;
  static readonly BY: Country;
  static readonly BE: Country;
  static readonly BZ: Country;
  static readonly BJ: Country;
  static readonly BM: Country;
  static readonly BT: Country;
  static readonly BO: Country;
  static readonly BA: Country;
  static readonly BW: Country;
  static readonly BV: Country;
  static readonly BR: Country;
  static readonly IO: Country;
  static readonly BN: Country;
  static readonly BG: Country;
  static readonly BF: Country;
  static readonly BI: Country;
  static readonly KH: Country;
  static readonly CM: Country;
  static readonly CA: Country;
  static readonly CV: Country;
  static readonly KY: Country;
  static readonly CF: Country;
  static readonly TD: Country;
  static readonly CL: Country;
  static readonly CN: Country;
  static readonly CX: Country;
  static readonly CC: Country;
  static readonly CO: Country;
  static readonly KM: Country;
  static readonly CG: Country;
  static readonly CD: Country;
  static readonly CK: Country;
  static readonly CR: Country;
  static readonly CI: Country;
  static readonly HR: Country;
  static readonly CU: Country;
  static readonly CY: Country;
  static readonly CZ: Country;
  static readonly DK: Country;
  static readonly DJ: Country;
  static readonly DM: Country;
  static readonly DO: Country;
  static readonly EC: Country;
  static readonly EG: Country;
  static readonly SV: Country;
  static readonly GQ: Country;
  static readonly ER: Country;
  static readonly EE: Country;
  static readonly ET: Country;
  static readonly FK: Country;
  static readonly FO: Country;
  static readonly FJ: Country;
  static readonly FI: Country;
  static readonly FR: Country;
  static readonly GF: Country;
  static readonly PF: Country;
  static readonly TF: Country;
  static readonly GA: Country;
  static readonly GM: Country;
  static readonly GE: Country;
  static readonly DE: Country;
  static readonly GH: Country;
  static readonly GI: Country;
  static readonly GR: Country;
  static readonly GL: Country;
  static readonly GD: Country;
  static readonly GP: Country;
  static readonly GU: Country;
  static readonly GT: Country;
  static readonly GG: Country;
  static readonly GN: Country;
  static readonly GW: Country;
  static readonly GY: Country;
  static readonly HT: Country;
  static readonly HM: Country;
  static readonly VA: Country;
  static readonly HN: Country;
  static readonly HK: Country;
  static readonly HU: Country;
  static readonly IS: Country;
  static readonly IN: Country;
  static readonly ID: Country;
  static readonly IR: Country;
  static readonly IQ: Country;
  static readonly IE: Country;
  static readonly IM: Country;
  static readonly IL: Country;
  static readonly IT: Country;
  static readonly JM: Country;
  static readonly JP: Country;
  static readonly JE: Country;
  static readonly JO: Country;
  static readonly KZ: Country;
  static readonly KE: Country;
  static readonly KI: Country;
  static readonly KP: Country;
  static readonly KR: Country;
  static readonly KW: Country;
  static readonly KG: Country;
  static readonly LA: Country;
  static readonly LV: Country;
  static readonly LB: Country;
  static readonly LS: Country;
  static readonly LR: Country;
  static readonly LY: Country;
  static readonly LI: Country;
  static readonly LT: Country;
  static readonly LU: Country;
  static readonly MO: Country;
  static readonly MK: Country;
  static readonly MG: Country;
  static readonly MW: Country;
  static readonly MY: Country;
  static readonly MV: Country;
  static readonly ML: Country;
  static readonly MT: Country;
  static readonly MH: Country;
  static readonly MQ: Country;
  static readonly MR: Country;
  static readonly MU: Country;
  static readonly YT: Country;
  static readonly MX: Country;
  static readonly FM: Country;
  static readonly MD: Country;
  static readonly MC: Country;
  static readonly MN: Country;
  static readonly MS: Country;
  static readonly MA: Country;
  static readonly MZ: Country;
  static readonly MM: Country;
  static readonly NA: Country;
  static readonly NR: Country;
  static readonly NP: Country;
  static readonly NL: Country;
  static readonly AN: Country;
  static readonly NC: Country;
  static readonly NZ: Country;
  static readonly NI: Country;
  static readonly NE: Country;
  static readonly NG: Country;
  static readonly NU: Country;
  static readonly NF: Country;
  static readonly MP: Country;
  static readonly NO: Country;
  static readonly OM: Country;
  static readonly PK: Country;
  static readonly PW: Country;
  static readonly PS: Country;
  static readonly PA: Country;
  static readonly PG: Country;
  static readonly PY: Country;
  static readonly PE: Country;
  static readonly PH: Country;
  static readonly PN: Country;
  static readonly PL: Country;
  static readonly PT: Country;
  static readonly PR: Country;
  static readonly QA: Country;
  static readonly RE: Country;
  static readonly RO: Country;
  static readonly RU: Country;
  static readonly RW: Country;
  static readonly SH: Country;
  static readonly KN: Country;
  static readonly LC: Country;
  static readonly PM: Country;
  static readonly VC: Country;
  static readonly WS: Country;
  static readonly SM: Country;
  static readonly ST: Country;
  static readonly SA: Country;
  static readonly SN: Country;
  static readonly CS: Country;
  static readonly SC: Country;
  static readonly SL: Country;
  static readonly SG: Country;
  static readonly SK: Country;
  static readonly SI: Country;
  static readonly SB: Country;
  static readonly SO: Country;
  static readonly ZA: Country;
  static readonly GS: Country;
  static readonly ES: Country;
  static readonly LK: Country;
  static readonly SD: Country;
  static readonly SR: Country;
  static readonly SJ: Country;
  static readonly SZ: Country;
  static readonly SE: Country;
  static readonly CH: Country;
  static readonly SY: Country;
  static readonly TW: Country;
  static readonly TJ: Country;
  static readonly TZ: Country;
  static readonly TH: Country;
  static readonly TL: Country;
  static readonly TG: Country;
  static readonly TK: Country;
  static readonly TO: Country;
  static readonly TT: Country;
  static readonly TN: Country;
  static readonly TR: Country;
  static readonly TM: Country;
  static readonly TC: Country;
  static readonly TV: Country;
  static readonly UG: Country;
  static readonly UA: Country;
  static readonly AE: Country;
  static readonly GB: Country;
  static readonly US: Country;
  static readonly UM: Country;
  static readonly UY: Country;
  static readonly UZ: Country;
  static readonly VU: Country;
  static readonly VE: Country;
  static readonly VN: Country;
  static readonly VG: Country;
  static readonly VI: Country;
  static readonly WF: Country;
  static readonly EH: Country;
  static readonly YE: Country;
  static readonly ZM: Country;
  static readonly ZW: Country;

  // Explicitly declare static properties for each country (lowercase)
  // Excluding JS reserved keywords
  static readonly af: Country;
  static readonly ax: Country;
  static readonly al: Country;
  static readonly dz: Country;
  static readonly as: Country;
  static readonly ad: Country;
  static readonly ao: Country;
  static readonly ai: Country;
  static readonly aq: Country;
  static readonly ag: Country;
  static readonly ar: Country;
  static readonly am: Country;
  static readonly aw: Country;
  static readonly au: Country;
  static readonly at: Country;
  static readonly az: Country;
  static readonly bs: Country;
  static readonly bh: Country;
  static readonly bd: Country;
  static readonly bb: Country;
  static readonly by: Country;
  static readonly be: Country;
  static readonly bz: Country;
  static readonly bj: Country;
  static readonly bm: Country;
  static readonly bt: Country;
  static readonly bo: Country;
  static readonly ba: Country;
  static readonly bw: Country;
  static readonly bv: Country;
  static readonly br: Country;
  static readonly io: Country;
  static readonly bn: Country;
  static readonly bg: Country;
  static readonly bf: Country;
  static readonly bi: Country;
  static readonly kh: Country;
  static readonly cm: Country;
  static readonly ca: Country;
  static readonly cv: Country;
  static readonly ky: Country;
  static readonly cf: Country;
  static readonly td: Country;
  static readonly cl: Country;
  static readonly cn: Country;
  static readonly cx: Country;
  static readonly cc: Country;
  static readonly co: Country;
  static readonly km: Country;
  static readonly cg: Country;
  static readonly cd: Country;
  static readonly ck: Country;
  static readonly cr: Country;
  static readonly ci: Country;
  static readonly hr: Country;
  static readonly cu: Country;
  static readonly cy: Country;
  static readonly cz: Country;
  static readonly dk: Country;
  static readonly dj: Country;
  static readonly dm: Country;
  // 'do' is reserved, using full name
  static readonly dominican: Country;
  static readonly ec: Country;
  static readonly eg: Country;
  static readonly sv: Country;
  static readonly gq: Country;
  static readonly er: Country;
  static readonly ee: Country;
  static readonly et: Country;
  static readonly fk: Country;
  static readonly fo: Country;
  static readonly fj: Country;
  static readonly fi: Country;
  static readonly fr: Country;
  static readonly gf: Country;
  static readonly pf: Country;
  static readonly tf: Country;
  static readonly ga: Country;
  static readonly gm: Country;
  static readonly ge: Country;
  static readonly de: Country;
  static readonly gh: Country;
  static readonly gi: Country;
  static readonly gr: Country;
  static readonly gl: Country;
  static readonly gd: Country;
  static readonly gp: Country;
  static readonly gu: Country;
  static readonly gt: Country;
  static readonly gg: Country;
  static readonly gn: Country;
  static readonly gw: Country;
  static readonly gy: Country;
  static readonly ht: Country;
  static readonly hm: Country;
  static readonly va: Country;
  static readonly hn: Country;
  static readonly hk: Country;
  static readonly hu: Country;
  // 'is' is reserved, using full name
  static readonly iceland: Country;
  // 'in' is reserved, using full name
  static readonly india: Country;
  static readonly ir: Country;
  static readonly iq: Country;
  static readonly ie: Country;
  static readonly im: Country;
  static readonly il: Country;
  static readonly it: Country;
  static readonly jm: Country;
  static readonly jp: Country;
  static readonly je: Country;
  static readonly jo: Country;
  static readonly kz: Country;
  static readonly ke: Country;
  static readonly ki: Country;
  static readonly kp: Country;
  static readonly kr: Country;
  static readonly kw: Country;
  static readonly kg: Country;
  static readonly la: Country;
  static readonly lv: Country;
  static readonly lb: Country;
  static readonly ls: Country;
  static readonly lr: Country;
  static readonly ly: Country;
  static readonly li: Country;
  static readonly lt: Country;
  static readonly lu: Country;
  static readonly mo: Country;
  static readonly mk: Country;
  static readonly mg: Country;
  static readonly mw: Country;
  static readonly my: Country;
  static readonly mv: Country;
  static readonly ml: Country;
  static readonly mt: Country;
  static readonly mh: Country;
  static readonly mq: Country;
  static readonly mr: Country;
  static readonly mu: Country;
  static readonly yt: Country;
  static readonly mx: Country;
  static readonly fm: Country;
  static readonly md: Country;
  static readonly mc: Country;
  static readonly mn: Country;
  static readonly ms: Country;
  static readonly ma: Country;
  static readonly mz: Country;
  static readonly mm: Country;
  static readonly na: Country;
  static readonly nr: Country;
  static readonly np: Country;
  static readonly nl: Country;
  static readonly an: Country;
  static readonly nc: Country;
  static readonly nz: Country;
  static readonly ni: Country;
  static readonly ne: Country;
  static readonly ng: Country;
  static readonly nu: Country;
  static readonly nf: Country;
  static readonly mp: Country;
  static readonly no: Country;
  static readonly om: Country;
  static readonly pk: Country;
  static readonly pw: Country;
  static readonly ps: Country;
  static readonly pa: Country;
  static readonly pg: Country;
  static readonly py: Country;
  static readonly pe: Country;
  static readonly ph: Country;
  static readonly pn: Country;
  static readonly pl: Country;
  static readonly pt: Country;
  static readonly pr: Country;
  static readonly qa: Country;
  static readonly re: Country;
  static readonly ro: Country;
  static readonly ru: Country;
  static readonly rw: Country;
  static readonly sh: Country;
  static readonly kn: Country;
  static readonly lc: Country;
  static readonly pm: Country;
  static readonly vc: Country;
  static readonly ws: Country;
  static readonly sm: Country;
  static readonly st: Country;
  static readonly sa: Country;
  static readonly sn: Country;
  static readonly cs: Country;
  static readonly sc: Country;
  static readonly sl: Country;
  static readonly sg: Country;
  static readonly sk: Country;
  static readonly si: Country;
  static readonly sb: Country;
  static readonly so: Country;
  static readonly za: Country;
  static readonly gs: Country;
  static readonly es: Country;
  static readonly lk: Country;
  static readonly sd: Country;
  static readonly sr: Country;
  static readonly sj: Country;
  static readonly sz: Country;
  static readonly se: Country;
  static readonly ch: Country;
  static readonly sy: Country;
  static readonly tw: Country;
  static readonly tj: Country;
  static readonly tz: Country;
  static readonly th: Country;
  static readonly tl: Country;
  static readonly tg: Country;
  static readonly tk: Country;
  static readonly to: Country;
  static readonly tt: Country;
  static readonly tn: Country;
  static readonly tr: Country;
  static readonly tm: Country;
  static readonly tc: Country;
  static readonly tv: Country;
  static readonly ug: Country;
  static readonly ua: Country;
  static readonly ae: Country;
  static readonly gb: Country;
  static readonly us: Country;
  static readonly um: Country;
  static readonly uy: Country;
  static readonly uz: Country;
  static readonly vu: Country;
  static readonly ve: Country;
  static readonly vn: Country;
  static readonly vg: Country;
  static readonly vi: Country;
  static readonly wf: Country;
  static readonly eh: Country;
  static readonly ye: Country;
  static readonly zm: Country;
  static readonly zw: Country;

  /**
   * Creates a new Country instance.
   * @param {string} _name - The full name of the country
   * @param {string} _code - The ISO country code
   */
  constructor(
    private readonly _name: string,
    private readonly _code: string,
  ) {}

  /**
   * Gets the full name of the country.
   * @returns {string} The full name of the country
   */
  get name(): string {
    return this._name;
  }

  /**
   * Gets the ISO code of the country.
   * @returns {string} The ISO code of the country
   */
  get code(): string {
    return this._code;
  }

  /**
   * Creates a string representation of the country.
   * @returns {string} String representation of the country
   */
  toString(): string {
    return `${this.name} (${this.code})`;
  }

  // Private static fields for lookup
  private static readonly _countriesByCode = new Map<string, Country>();
  private static readonly _countriesByName = new Map<string, Country>();
  private static _initialized = false;

  /**
   * Initializes the static country properties
   */
  private static initialize(): void {
    if (this._initialized) return;

    // Create Country instances for each entry
    for (const data of CountryService.getInstance().getAll()) {
      const country = new Country(data.name, data.code);

      // Add to lookup maps
      this._countriesByCode.set(data.code.toUpperCase(), country);
      this._countriesByName.set(data.name.toUpperCase(), country);

      const upperCode = data.code.toUpperCase();
      const lowerCode = data.code.toLowerCase();

      // Set the uppercase static property
      // deno-lint-ignore no-explicit-any
      (this as any)[upperCode] = country;
      // Set the lowercase static property
      // deno-lint-ignore no-explicit-any
      (this as any)[lowerCode] = country;

      // set the lowercase static property for countries with lowercase codes that are reserved keywords
      // deno-lint-ignore no-explicit-any
      (this as any)["dominican"] = CountryService.getInstance().fromCode("DO");
      // deno-lint-ignore no-explicit-any
      (this as any)["iceland"] = CountryService.getInstance().fromCode("IS");
      // deno-lint-ignore no-explicit-any
      (this as any)["india"] = CountryService.getInstance().fromCode("IN");
    }

    this._initialized = true;
  }

  /**
   * Retrieves a country by its ISO code.
   * @param {string} code The ISO code of the country.
   * @returns {Country | undefined} The country corresponding to the ISO code or `undefined` if not found.
   */
  static fromCode(code: string): Country | undefined {
    this.initialize();
    return this._countriesByCode.get(code.toUpperCase());
  }

  /**
   * Retrieves a country by its name.
   * @param {string} countryName The name of the country.
   * @returns {Country | undefined} The country corresponding to the name or `undefined` if not found.
   */
  static fromName(countryName: string): Country | undefined {
    this.initialize();
    // First try direct lookup
    const country = this._countriesByName.get(countryName.toUpperCase());
    if (country) return country;

    // If not found, try more lenient matching
    for (const [name, countryObj] of this._countriesByName.entries()) {
      if (
        name.includes(countryName.toUpperCase()) ||
        countryName.toUpperCase().includes(name)
      ) {
        return countryObj;
      }
    }

    return undefined;
  }

  /**
   * Returns all available countries.
   * @returns {Country[]} Array of all countries
   */
  static getAll(): Country[] {
    this.initialize();
    return Array.from(this._countriesByCode.values());
  }

  /**
   * Validates if a given ISO country code is valid
   * @param code The country code to validate
   * @returns True if the country code is valid
   */
  static isValidCode(code?: string | null): boolean {
    if (!code) return false;
    const country = Country.fromCode(code);
    return !!country;
  }

  /**
   * Validates if a given country name is valid
   * @param countryName The country name to validate
   * @returns True if the country name is valid
   */
  static isValidName(countryName?: string | null): boolean {
    if (!countryName) return false;
    const country = Country.fromName(countryName);
    return !!country;
  }

  /**
   * Checks the validity of the country data
   * @returns true if the country information is available and valid
   */
  public validate(): boolean {
    try {
      return (
        Country.fromName(this._name) !== undefined &&
        Country.fromCode(this._code) !== undefined
      );
    } catch (_) {
      return false;
    }
  }

  /**
   * Attempts to create a Country instance from a country name or ISO code
   * @param input The country name or ISO code
   * @returns A Country instance if valid input, undefined otherwise
   */
  public static from(input: string): Country | undefined {
    if (Country.canConstruct(input)) {
      const country1 = Country.fromName(input);
      if (country1) return country1;

      const country2 = Country.fromCode(input);
      if (country2) return country2;
    }

    return undefined;
  }

  /**
   * Validates if the input can be used to construct a valid Country instance
   * @param input The country name or ISO code to validate
   * @returns True if input can construct a valid country, false otherwise
   */
  public static canConstruct(input?: string | null): boolean {
    if (!input || typeof input !== "string") return false;

    const text = input.trim();
    if (text.length === 0) return false;

    const countryFromCode = Country.fromCode(text);
    const countryFromName = Country.fromName(text);

    return countryFromCode !== undefined || countryFromName !== undefined;
  }

  /**
   * Checks if an unknown value is a Country instance
   * @param obj The value to validate
   * @returns Type predicate indicating if the value is a valid Country
   */
  public static is(obj: unknown): obj is Country {
    if (!obj || typeof obj !== "object") return false;

    const maybeCountry = obj as Record<string, unknown>;

    // Check private properties exist with correct types
    if (typeof maybeCountry._name !== "string") return false;
    if (typeof maybeCountry._code !== "string") return false;

    // Validate against known countries
    const countryFromCode = Country.from(maybeCountry._code as string);
    const countryFromName = Country.from(maybeCountry._name as string);

    return Boolean(
      countryFromCode &&
        countryFromName &&
        countryFromCode.code === countryFromName.code,
    );
  }
}

// Initialize the static properties when the module is loaded
Country["initialize"]();
