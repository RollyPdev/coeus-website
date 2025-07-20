// Default data for Philippines regions, provinces, cities, and barangays

export const defaultRegions = [
  { code: 'NCR', name: 'National Capital Region' },
  { code: 'CAR', name: 'Cordillera Administrative Region' },
  { code: 'R1', name: 'Region I: Ilocos Region' },
  { code: 'R2', name: 'Region II: Cagayan Valley' },
  { code: 'R3', name: 'Region III: Central Luzon' },
  { code: 'R4A', name: 'Region IV-A: CALABARZON' },
  { code: 'R4B', name: 'Region IV-B: MIMAROPA' },
  { code: 'R5', name: 'Region V: Bicol Region' },
  { code: 'R6', name: 'Region VI: Western Visayas' },
  { code: 'R7', name: 'Region VII: Central Visayas' },
  { code: 'R8', name: 'Region VIII: Eastern Visayas' },
  { code: 'R9', name: 'Region IX: Zamboanga Peninsula' },
  { code: 'R10', name: 'Region X: Northern Mindanao' },
  { code: 'R11', name: 'Region XI: Davao Region' },
  { code: 'R12', name: 'Region XII: SOCCSKSARGEN' },
  { code: 'R13', name: 'Region XIII: Caraga' },
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' }
];

export const defaultProvinces = {
  'NCR': [
    { code: 'PH133900000', name: 'Metro Manila', regionCode: 'NCR' }
  ],
  'CAR': [
    { code: 'PH140100000', name: 'Abra', regionCode: 'CAR' },
    { code: 'PH141100000', name: 'Benguet', regionCode: 'CAR' },
    { code: 'PH142700000', name: 'Ifugao', regionCode: 'CAR' },
    { code: 'PH143200000', name: 'Kalinga', regionCode: 'CAR' },
    { code: 'PH144400000', name: 'Mountain Province', regionCode: 'CAR' },
    { code: 'PH148100000', name: 'Apayao', regionCode: 'CAR' }
  ],
  'R1': [
    { code: 'PH012800000', name: 'Ilocos Norte', regionCode: 'R1' },
    { code: 'PH012900000', name: 'Ilocos Sur', regionCode: 'R1' },
    { code: 'PH013300000', name: 'La Union', regionCode: 'R1' },
    { code: 'PH015500000', name: 'Pangasinan', regionCode: 'R1' }
  ],
  'R6': [
    { code: 'PH060400000', name: 'Capiz', regionCode: 'R6' },
    { code: 'PH060500000', name: 'Iloilo', regionCode: 'R6' },
    { code: 'PH060600000', name: 'Negros Occidental', regionCode: 'R6' },
    { code: 'PH060200000', name: 'Antique', regionCode: 'R6' },
    { code: 'PH060300000', name: 'Aklan', regionCode: 'R6' },
    { code: 'PH061900000', name: 'Guimaras', regionCode: 'R6' }
  ]
};

export const defaultMunicipalities = {
  'PH060400000': [
    { code: 'PH060401000', name: 'Roxas City', provinceCode: 'PH060400000' },
    { code: 'PH060402000', name: 'Cuartero', provinceCode: 'PH060400000' },
    { code: 'PH060403000', name: 'Dao', provinceCode: 'PH060400000' },
    { code: 'PH060404000', name: 'Dumalag', provinceCode: 'PH060400000' },
    { code: 'PH060405000', name: 'Dumarao', provinceCode: 'PH060400000' },
    { code: 'PH060406000', name: 'Ivisan', provinceCode: 'PH060400000' },
    { code: 'PH060407000', name: 'Jamindan', provinceCode: 'PH060400000' },
    { code: 'PH060408000', name: 'Ma-ayon', provinceCode: 'PH060400000' },
    { code: 'PH060409000', name: 'Mambusao', provinceCode: 'PH060400000' },
    { code: 'PH060410000', name: 'Panay', provinceCode: 'PH060400000' },
    { code: 'PH060411000', name: 'Panitan', provinceCode: 'PH060400000' },
    { code: 'PH060412000', name: 'Pilar', provinceCode: 'PH060400000' },
    { code: 'PH060413000', name: 'Pontevedra', provinceCode: 'PH060400000' },
    { code: 'PH060414000', name: 'President Roxas', provinceCode: 'PH060400000' },
    { code: 'PH060415000', name: 'Sapian', provinceCode: 'PH060400000' },
    { code: 'PH060416000', name: 'Sigma', provinceCode: 'PH060400000' },
    { code: 'PH060417000', name: 'Tapaz', provinceCode: 'PH060400000' }
  ],
  'PH133900000': [
    { code: 'PH133901000', name: 'Manila', provinceCode: 'PH133900000' },
    { code: 'PH133902000', name: 'Quezon City', provinceCode: 'PH133900000' },
    { code: 'PH133903000', name: 'Makati', provinceCode: 'PH133900000' },
    { code: 'PH133904000', name: 'Pasig', provinceCode: 'PH133900000' },
    { code: 'PH133905000', name: 'Taguig', provinceCode: 'PH133900000' }
  ]
};

export const defaultBarangays = {
  'PH060401000': [
    { code: 'PH060401001', name: 'Balijuagan', municipalityCode: 'PH060401000' },
    { code: 'PH060401002', name: 'Banica', municipalityCode: 'PH060401000' },
    { code: 'PH060401003', name: 'Bolo', municipalityCode: 'PH060401000' },
    { code: 'PH060401004', name: 'Culajao', municipalityCode: 'PH060401000' },
    { code: 'PH060401005', name: 'Punta Tabuc', municipalityCode: 'PH060401000' },
    { code: 'PH060401006', name: 'Tiza', municipalityCode: 'PH060401000' },
    { code: 'PH060401007', name: 'Baybay', municipalityCode: 'PH060401000' }
  ],
  'PH133901000': [
    { code: 'PH133901001', name: 'Barangay 1', municipalityCode: 'PH133901000' },
    { code: 'PH133901002', name: 'Barangay 2', municipalityCode: 'PH133901000' },
    { code: 'PH133901003', name: 'Barangay 3', municipalityCode: 'PH133901000' }
  ]
};