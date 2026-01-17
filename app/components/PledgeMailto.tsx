'use client';

import { useEffect, useState } from 'react';
import { convertFromSGD, formatCurrency } from '../techie-taboo/getExchangeRate';

type Props = {
  amountSGD?: number;
  onClose?: () => void;
};

const SUPPORTED = ['USD','EUR','GBP','AUD','CAD','NZD','JPY','SGD'];

export default function PledgeMailto({ amountSGD = 1, onClose }: Props) {
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('');
  const [converted, setConverted] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchRate = async () => {
      setLoading(true);
      try {
        const val = await convertFromSGD(currency, amountSGD);
        if (!cancelled) setConverted(val);
      } catch (err) {
        if (!cancelled) setConverted(amountSGD);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRate();
    return () => { cancelled = true };
  }, [currency, amountSGD]);

  const buildAndOpenMail = () => {
    const display = converted != null ? formatCurrency(converted, currency) : `${currency}${amountSGD}`;
    const subject = `Techie Taboo Pledge - ${country}`;
    const body = `Hi ragTech Team,\n\nI'm interested in pledging for Techie Taboo.\n\nCountry: ${country}\nCurrency: ${currency}\nPledge amount: ${display}\n\nFor international shipping costs to my country, I am willing/not willing to cover it.\n\nAdditional questions or comments I have:\n\n\nLooking forward to hearing from you!`;

    const mailto = `mailto:hello@ragtechdev.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border-2 border-primary">
      <h3 className="text-2xl font-bold mb-4 text-brownDark dark:text-brown">International Pledge</h3>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-4 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Your pledge amount</p>
        <p className="text-3xl font-bold text-primary dark:text-primary-light">
          {loading ? 'Calculating...' : converted != null ? formatCurrency(converted, currency) : '--'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-brownDark dark:text-brown">Country I&apos;m living in</label>
          <input 
            value={country} 
            onChange={(e)=>setCountry(e.target.value)} 
            placeholder="e.g., United States" 
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary focus:outline-none transition-colors" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-brownDark dark:text-brown">Currency I want to pledge in</label>
          <select 
            value={currency} 
            onChange={(e)=>setCurrency(e.target.value)} 
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary focus:outline-none transition-colors"
          >
            {SUPPORTED.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-6 py-3 bg-white dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 rounded-full font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={buildAndOpenMail} 
          disabled={!country}
          className="px-6 py-3 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Pledge
        </button>
      </div>
    </div>
  );
}
