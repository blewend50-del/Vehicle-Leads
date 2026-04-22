import Image from 'next/image';
import LeadForm from '@/components/LeadForm';

const TRUST_BADGES = ['No Obligation', 'Free Offer in Minutes', '500+ Cars Purchased'];

const REVIEWS = [
  {
    name: 'Kelly Martin',
    text: 'This company was excellent to do business with. Would highly recommend them.',
  },
  {
    name: 'Doug Gauert',
    text: 'Blake was incredible to work with on the purchase of my dream car. He was very professional and thorough with answering my questions and providing the steps I needed to follow on finalizing my purchase and having the car delivered. Blake made my experience purchasing a high end car excellent. Thank You Blake.',
  },
  {
    name: 'Isaac Rodriguez',
    text: 'Blake sold me a 2016 Nissan 370z Nismo and it has been an awesome experience with the car. The buying process for this vehicle was super super simple and Blake has made that experience enjoyable. He never felt like a pushy salesman at any point in the sale. He was also very patient and checked in regularly when I was getting all the finances straightened out. Thank you Blake and I highly recommend working with him.',
  },
  {
    name: 'Christopher Calloway',
    text: 'I have had almost every "high end" car one could ask for and have dealt with dealerships across the US and South Florida in particular. The experience I had buying my Maserati from Tom at Progressive Motors was very positive. There was none of the high pressure sales, lying and games it seems 80% of car dealerships engage in. They honestly answered any questions and concerns, and were fair in pricing. There is comfort in knowing going in it will be a pleasant and fair car buying experience.',
  },
];

export default function HomePage() {
  return (
    <main className="bg-white">

      {/* Header */}
      <header className="border-b border-gray-100 py-5 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Image
            src="/logo.png"
            alt="Progressive Motors"
            width={200}
            height={65}
            className="object-contain"
            priority
          />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">

        {/* Left — copy */}
        <div className="lg:pt-4">
          <h1
            className="font-bold text-[#1B2B4B] leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(36px, 4vw, 52px)' }}
          >
            Get a Fast, Fair Cash Offer for Your Car
          </h1>
          <p className="text-[20px] text-[#6B7280] font-light leading-relaxed mb-12">
            Progressive Motors has been buying cars for over 40 years. Submit your vehicle and our expert will personally reach out with a real offer — no spam, no pressure.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 mb-12 pb-12 border-b border-[#F3F4F6]">
            {[
              { value: '40+', label: 'Years in Business' },
              { value: '500+', label: 'Cars Purchased' },
              { value: '1:1', label: 'Personal Outreach' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-[#1B2B4B]">{s.value}</div>
                <div className="text-sm text-[#6B7280] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Why us */}
          <div className="space-y-4">
            {[
              { title: 'Real buyers, not a lead reseller', body: 'Your information goes directly to our in-house car buying expert — not a call center or third-party database.' },
              { title: 'We never spam you', body: 'Submit once, hear from one person. We will never sell your contact info or sign you up for anything.' },
              { title: 'Family-owned for over 40 years', body: 'Progressive Motors has been a trusted name in our community since the 1980s.' },
              { title: 'Personal, in-person offers', body: 'Our buyer reaches out directly and works with you one-on-one to make a fair offer on your vehicle.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#2ECC71]/15 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#2ECC71]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-[#1A1A1A] text-sm">{item.title}</div>
                  <div className="text-[#6B7280] text-sm mt-0.5 leading-relaxed">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:sticky lg:top-8">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {TRUST_BADGES.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                <svg className="w-4 h-4 text-[#2ECC71] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {badge}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-8">
            <h2 className="text-xl font-bold text-[#1B2B4B] mb-1">Get Your Free Cash Offer</h2>
            <p className="text-sm text-[#6B7280] mb-7">Fill out the form — our expert will reach out personally</p>
            <LeadForm />
          </div>

          <p className="text-center text-xs text-[#6B7280] mt-4">
            Join 500+ sellers who got a fair cash offer from Progressive Motors
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-[#F3F4F6] h-px max-w-[1100px] mx-auto" />

      {/* Google Reviews */}
      <section className="max-w-[1100px] mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">Google Reviews</p>
          <h2 className="text-3xl font-bold text-[#1B2B4B]">What our customers say</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#1A1A1A] text-sm leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B2B4B] flex items-center justify-center text-white text-xs font-bold">
                  {r.name.charAt(0)}
                </div>
                <div className="text-sm font-semibold text-[#1A1A1A]">{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="bg-[#F3F4F6] h-px max-w-[1100px] mx-auto" />

      {/* How It Works */}
      <section className="max-w-[1100px] mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">The Process</p>
          <h2 className="text-3xl font-bold text-[#1B2B4B]">How It Works</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-10">
          {[
            { step: '01', title: 'Submit Your Vehicle', body: 'Fill out the quick form with your vehicle details. It takes about 2 minutes and there is no cost or obligation.' },
            { step: '02', title: 'Hear From Our Expert', body: 'Our car buying specialist personally reviews your information and contacts you directly with a real cash offer.' },
            { step: '03', title: 'Get Paid', body: 'Accept the offer and we handle everything from there. Fast, fair, and completely hassle-free.' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col">
              <div className="text-5xl font-black text-[#F3F4F6] mb-4 leading-none">{item.step}</div>
              <h3 className="text-lg font-bold text-[#1B2B4B] mb-2">{item.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F3F4F6] py-12 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="Progressive Motors"
            width={140}
            height={46}
            className="object-contain opacity-70"
          />
          <div className="text-center sm:text-right">
            <p className="text-sm text-[#6B7280]">© {new Date().getFullYear()} Progressive Motors. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">Family-owned car buyers for over 40 years. Offers subject to vehicle inspection.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
