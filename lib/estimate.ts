const makeBaseValues: Record<string, number> = {
  acura: 28000,
  'alfa romeo': 32000,
  audi: 32000,
  bentley: 95000,
  bmw: 35000,
  buick: 24000,
  cadillac: 38000,
  chevrolet: 22000,
  chrysler: 20000,
  dodge: 22000,
  ford: 22000,
  genesis: 36000,
  gmc: 28000,
  honda: 22000,
  hyundai: 20000,
  infiniti: 30000,
  jaguar: 45000,
  jeep: 28000,
  kia: 19000,
  'land rover': 52000,
  lexus: 40000,
  lincoln: 38000,
  mazda: 22000,
  'mercedes-benz': 45000,
  mini: 24000,
  mitsubishi: 18000,
  nissan: 20000,
  porsche: 65000,
  ram: 30000,
  subaru: 24000,
  tesla: 52000,
  toyota: 26000,
  volkswagen: 26000,
  volvo: 34000,
};

const conditionMultiplier: Record<string, number> = {
  excellent: 1.15,
  good: 1.0,
  fair: 0.75,
  poor: 0.5,
};

export interface EstimateResult {
  low: number;
  high: number;
  mid: number;
}

export function estimateVehicleValue(
  year: number,
  make: string,
  mileage: number,
  condition: string,
  hasAccident: boolean
): EstimateResult {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  const baseValue = makeBaseValues[make.toLowerCase()] ?? 22000;

  // Age depreciation: ~15% year 1, ~10% each year after
  const ageMultiplier = age === 0 ? 1.0 : Math.max(0.1, Math.pow(0.88, age));

  // Mileage penalty relative to 12k/year average
  const expectedMileage = age * 12000;
  const excessMileage = mileage - expectedMileage;
  const mileageMultiplier = Math.max(0.45, 1 - Math.max(0, excessMileage) / 250000);

  const condMult = conditionMultiplier[condition.toLowerCase()] ?? 1.0;
  const accidentMult = hasAccident ? 0.82 : 1.0;

  const mid = baseValue * ageMultiplier * mileageMultiplier * condMult * accidentMult;

  return {
    low: Math.round((mid * 0.88) / 100) * 100,
    mid: Math.round(mid / 100) * 100,
    high: Math.round((mid * 1.12) / 100) * 100,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
