interface Transaction {
  merchant_name?: string;
  name?: string;
  category?: string[];
  amount: number;
}

const MAP = [
  { key: /uber|lyft|ola|rapido/i, cat: 'Transport' },
  { key: /zomato|swiggy|ubereats|doordash|foodpanda/i, cat: 'Food' },
  { key: /amazon|flipkart|myntra|ajio/i, cat: 'Shopping' },
  { key: /netflix|spotify|prime/i, cat: 'Entertainment' },
  { key: /shell|bp|indianoil|hpcl|petro/i, cat: 'Fuel' },
  { key: /rent|landlord|property/i, cat: 'Rent' },
  { key: /salary|payroll|payout/i, cat: 'Income' }
];

export default function categorize(t: Transaction): string {
  const base = (t.merchant_name || t.name || '').toString();
  for (const r of MAP) {
    if (r.key.test(base)) return r.cat;
  }

  if (Array.isArray(t.category) && t.category.length) {
    const text = t.category.join(' ');
    if (/income/i.test(text)) return 'Income';
    if (/food|restaurant/i.test(text)) return 'Food';
    if (/transport|travel/i.test(text)) return 'Transport';
    if (/shopping|retail/i.test(text)) return 'Shopping';
    if (/entertainment/i.test(text)) return 'Entertainment';
  }
  
  return t.amount < 0 ? 'Refund' : 'Other';
}
