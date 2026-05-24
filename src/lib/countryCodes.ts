export interface CountryCode {
  code: string;
  label: string;
}

export const countryCodes: CountryCode[] = [
  { code: "+91", label: "+91 IND (India)" },
  { code: "+1", label: "+1 US (USA & Canada)" },
  { code: "+44", label: "+44 UK (United Kingdom)" },
  { code: "+61", label: "+61 AUS (Australia)" },
  { code: "+64", label: "+64 NZ (New Zealand)" },
  { code: "+65", label: "+65 SG (Singapore)" },
  { code: "+971", label: "+971 UAE (United Arab Emirates)" },
  { code: "+49", label: "+49 GER (Germany)" },
  { code: "+33", label: "+33 FRA (France)" },
  { code: "+81", label: "+81 JPN (Japan)" },
  { code: "+86", label: "+86 CHN (China)" },
  { code: "+39", label: "+39 ITA (Italy)" },
  { code: "+34", label: "+34 ESP (Spain)" },
  { code: "+31", label: "+31 NLD (Netherlands)" },
  { code: "+41", label: "+41 SUI (Switzerland)" },
  { code: "+46", label: "+46 SWE (Sweden)" },
  { code: "+27", label: "+27 RSA (South Africa)" },
  { code: "+55", label: "+55 BRA (Brazil)" },
  { code: "+7", label: "+7 RUS (Russia)" },
  { code: "+966", label: "+966 KSA (Saudi Arabia)" },
  { code: "+20", label: "+20 EGY (Egypt)" },
  { code: "+234", label: "+234 NGA (Nigeria)" },
  { code: "+254", label: "+254 KEN (Kenya)" },
  { code: "+353", label: "+353 IRE (Ireland)" },
  { code: "+351", label: "+351 POR (Portugal)" },
  { code: "+32", label: "+32 BEL (Belgium)" },
  { code: "+43", label: "+43 AUT (Austria)" },
  { code: "+45", label: "+45 DEN (Denmark)" },
  { code: "+47", label: "+47 NOR (Norway)" },
  { code: "+358", label: "+358 FIN (Finland)" },
  { code: "+30", label: "+30 GRE (Greece)" },
  { code: "+48", label: "+48 POL (Poland)" },
  { code: "+90", label: "+90 TUR (Turkey)" },
  { code: "+60", label: "+60 MAS (Malaysia)" },
  { code: "+62", label: "+62 INA (Indonesia)" },
  { code: "+66", label: "+66 THA (Thailand)" },
  { code: "+84", label: "+84 VIE (Vietnam)" },
  { code: "+63", label: "+63 PHI (Philippines)" },
  { code: "+82", label: "+82 KOR (South Korea)" },
  { code: "+92", label: "+92 PAK (Pakistan)" },
  { code: "+880", label: "+880 BAN (Bangladesh)" },
  { code: "+94", label: "+94 SRI (Sri Lanka)" },
  { code: "+977", label: "+977 NEP (Nepal)" },
  { code: "+965", label: "+965 KUW (Kuwait)" },
  { code: "+974", label: "+974 QAT (Qatar)" },
  { code: "+968", label: "+968 OMA (Oman)" },
  { code: "+973", label: "+973 BAH (Bahrain)" },
  { code: "+52", label: "+52 MEX (Mexico)" },
  { code: "+54", label: "+54 ARG (Argentina)" },
  { code: "+56", label: "+56 CHI (Chile)" },
  { code: "+57", label: "+57 COL (Colombia)" },
];

export const parsePhone = (fullPhone: string) => {
  if (!fullPhone) return { code: "+91", number: "" };
  // Sort country codes by descending length to match longest code first (e.g. +971 vs +9)
  const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
  const matched = sortedCodes.find(c => fullPhone.startsWith(c.code));
  if (matched) {
    return { code: matched.code, number: fullPhone.slice(matched.code.length) };
  }
  return { code: "+91", number: fullPhone };
};
