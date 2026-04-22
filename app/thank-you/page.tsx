import Link from 'next/link';
import { formatCurrency } from '@/lib/estimate';

interface Props {
  searchParams: { name?: string; make?: string; model?: string; year?: string; low?: string; high?: string };
}

export default function ThankYouPage({ searchParams }: Props) {
  const { name, make, model, year, low, high } = searchParams;
  const hasEstimate = low && high && Number(low) > 0;
  const vehicle = [year, make, model].filter(Boolean).join(' ');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            You&rsquo;re all set{name ? `, ${name}` : ''}!
          </h1>
          <p className="text-gray-500 mb-6">
            We received your request{vehicle ? ` for your ${vehicle}` : ''} and a specialist will contact you within{' '}
            <strong className="text-gray-700">1 business hour</strong>.
          </p>

          {/* What to expect */}
          <div className="bg-blue-50 rounded-xl p-4 text-left mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 text-sm uppercase tracking-wide">What happens next</h3>
            <ul className="space-y-2">
              {[
                'Check your email for a confirmation',
                'A specialist reviews your vehicle details',
                'You get a call or text with a cash offer',
                'Accept → we handle free pickup & payment',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="font-bold text-blue-500 shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Estimate range */}
          {hasEstimate && (
            <div className="border-2 border-orange-200 bg-orange-50 rounded-xl p-5 mb-6">
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">
                Estimated Market Value
              </div>
              <div className="text-3xl font-extrabold text-gray-900">
                {formatCurrency(Number(low))} – {formatCurrency(Number(high))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is a rough estimate based on year, make, mileage, and condition. Your actual offer may vary after inspection.
              </p>
            </div>
          )}

          <Link
            href="/"
            className="inline-block text-sm text-blue-600 hover:underline"
          >
            ← Submit another vehicle
          </Link>
        </div>

        {/* Trust footer */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
          <span>🛡️ No obligation</span>
          <span>📞 Calls Mon–Sat</span>
          <span>⚡ Fast offers</span>
        </div>
      </div>
    </main>
  );
}
