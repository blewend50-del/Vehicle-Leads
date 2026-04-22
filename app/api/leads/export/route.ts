import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const leads = await prisma.lead.findMany({
    where: status && status !== 'all' ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      fullName: true,
      phone: true,
      email: true,
      zipCode: true,
      year: true,
      make: true,
      model: true,
      trim: true,
      mileage: true,
      condition: true,
      hasAccident: true,
      status: true,
      notes: true,
    },
  });

  const headers = [
    'ID',
    'Date',
    'Full Name',
    'Phone',
    'Email',
    'ZIP',
    'Year',
    'Make',
    'Model',
    'Trim',
    'Mileage',
    'Condition',
    'Accident',
    'Status',
    'Notes',
  ];

  const rows = leads.map((lead) => [
    lead.id,
    new Date(lead.createdAt).toLocaleString('en-US'),
    lead.fullName,
    lead.phone,
    lead.email,
    lead.zipCode,
    lead.year,
    lead.make,
    lead.model,
    lead.trim ?? '',
    lead.mileage,
    lead.condition,
    lead.hasAccident ? 'Yes' : 'No',
    lead.status,
    lead.notes ?? '',
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
