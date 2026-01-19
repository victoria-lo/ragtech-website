export async function convertFromSGD(target: string, amount = 1): Promise<number> {
  if (!target || target.toUpperCase() === 'SGD') return amount;

  try {
    const url = `/.netlify/functions/exchange-rate?target=${encodeURIComponent(target)}&amount=${encodeURIComponent(String(amount))}`;
    const res = await fetch(url);
    if (!res.ok) return amount;
    
    const data = await res.json();
    if (data && typeof data.convertedAmount === 'number') {
      return data.convertedAmount;
    }
  } catch (err) {
    console.error('convertFromSGD error', err);
  }

  return amount;
}

export function formatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(value as number);
  } catch (err) {
    return `${currency}${value.toFixed(currency === 'JPY' ? 0 : 2)}`;
  }
}
