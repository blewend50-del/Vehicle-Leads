'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { estimateVehicleValue } from '@/lib/estimate';

const MAKES = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet',
  'Chrysler', 'Dodge', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai',
  'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln',
  'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Porsche',
  'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo', 'Other',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

const CONDITIONS = [
  { value: 'excellent', label: 'Excellent', desc: 'Like new, no issues' },
  { value: 'good', label: 'Good', desc: 'Minor wear, runs great' },
  { value: 'fair', label: 'Fair', desc: 'Some issues or high mileage' },
  { value: 'poor', label: 'Poor', desc: 'Major issues or damage' },
];

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  vin: string;
  mileage: string;
  condition: string;
  hasAccident: string;
  photo: File | null;
}

const INITIAL: FormState = {
  fullName: '', phone: '', email: '', zipCode: '',
  year: '', make: '', model: '', trim: '', vin: '',
  mileage: '', condition: '', hasAccident: '',
  photo: null,
};

export default function LeadForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.zipCode.match(/^\d{5}$/)) e.zipCode = 'Valid 5-digit ZIP required';
    if (!form.year) e.year = 'Year is required';
    if (!form.make) e.make = 'Make is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (!form.mileage || isNaN(Number(form.mileage))) e.mileage = 'Mileage is required';
    if (!form.condition) e.condition = 'Condition is required';
    if (!form.hasAccident) e.hasAccident = 'Please select an option';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'photo') return;
      data.append(k, String(v));
    });
    if (form.photo) data.append('photo', form.photo);

    try {
      const res = await fetch('/api/leads', { method: 'POST', body: data });
      if (!res.ok) throw new Error('Submission failed');

      const est = estimateVehicleValue(
        parseInt(form.year),
        form.make,
        parseInt(form.mileage),
        form.condition,
        form.hasAccident === 'true'
      );

      const params = new URLSearchParams({
        name: form.fullName.split(' ')[0],
        make: form.make,
        model: form.model,
        year: form.year,
        low: String(est.low),
        high: String(est.high),
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-[#1B2B4B] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
          Your Contact Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Jane Smith"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          <div>
            <label className="form-label">Phone Number *</label>
            <input
              className="form-input"
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          <div>
            <label className="form-label">Email Address *</label>
            <input
              className="form-input"
              type="email"
              placeholder="jane@email.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="form-label">ZIP Code *</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="90210"
              value={form.zipCode}
              onChange={(e) => set('zipCode', e.target.value.replace(/\D/g, ''))}
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div>
        <h3 className="text-sm font-semibold text-[#1B2B4B] uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
          About Your Vehicle
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Year *</label>
            <select
              className="form-input"
              value={form.year}
              onChange={(e) => set('year', e.target.value)}
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>
          <div>
            <label className="form-label">Make *</label>
            <select
              className="form-input"
              value={form.make}
              onChange={(e) => set('make', e.target.value)}
            >
              <option value="">Select make</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.make && <p className="mt-1 text-sm text-red-600">{errors.make}</p>}
          </div>
          <div>
            <label className="form-label">Model *</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Camry, F-150, Civic"
              value={form.model}
              onChange={(e) => set('model', e.target.value)}
            />
            {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
          </div>
          <div>
            <label className="form-label">Trim <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. SE, XLT, Limited"
              value={form.trim}
              onChange={(e) => set('trim', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">VIN <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. 1HGBH41JXMN109186"
              maxLength={17}
              value={form.vin}
              onChange={(e) => set('vin', e.target.value.toUpperCase())}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Mileage *</label>
            <input
              className="form-input"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 85000"
              value={form.mileage}
              onChange={(e) => set('mileage', e.target.value.replace(/\D/g, ''))}
            />
            {errors.mileage && <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>}
          </div>
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="form-label">Vehicle Condition *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all
                ${form.condition === c.value
                  ? 'border-[#1B2B4B] bg-[#1B2B4B]/5 ring-2 ring-[#1B2B4B]/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={form.condition === c.value}
                onChange={(e) => set('condition', e.target.value)}
                className="sr-only"
              />
              <div className="font-semibold text-sm text-gray-800">{c.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
            </label>
          ))}
        </div>
        {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
      </div>

      {/* Accidents */}
      <div>
        <label className="form-label">Any accidents on the vehicle? *</label>
        <div className="flex gap-4">
          {[{ value: 'false', label: 'No Accidents' }, { value: 'true', label: 'Yes, Has Accidents' }].map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 cursor-pointer rounded-xl border-2 py-3 px-4 text-center font-semibold text-sm transition-all
                ${form.hasAccident === opt.value
                  ? 'border-[#1B2B4B] bg-[#1B2B4B]/5 text-[#1B2B4B] ring-2 ring-[#1B2B4B]/20'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
            >
              <input
                type="radio"
                name="hasAccident"
                value={opt.value}
                checked={form.hasAccident === opt.value}
                onChange={(e) => set('hasAccident', e.target.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.hasAccident && <p className="mt-1 text-sm text-red-600">{errors.hasAccident}</p>}
      </div>

      {/* Photo Upload */}
      <div>
        <label className="form-label">
          Vehicle Photo <span className="text-gray-400 font-normal">(optional — helps us give a better offer)</span>
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50 transition-all p-6 text-center"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Vehicle preview" className="mx-auto max-h-40 rounded-lg object-cover" />
          ) : (
            <>
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-gray-500">Click to upload a photo of your vehicle</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC — max 8MB</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
        {form.photo && (
          <p className="mt-1 text-xs text-gray-500">
            {form.photo.name}{' '}
            <button
              type="button"
              onClick={() => { setForm((p) => ({ ...p, photo: null })); setPhotoPreview(null); }}
              className="text-red-500 hover:underline ml-1"
            >
              Remove
            </button>
          </p>
        )}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : (
          'Get My Cash Offer →'
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to be contacted about your vehicle. No obligation to accept any offer.
      </p>
    </form>
  );
}
