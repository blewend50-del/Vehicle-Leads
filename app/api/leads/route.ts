import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendSellerConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const zipCode = formData.get('zipCode') as string;
    const year = parseInt(formData.get('year') as string, 10);
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const trim = (formData.get('trim') as string) || null;
    const vin = (formData.get('vin') as string) || '';
    const mileage = parseInt(formData.get('mileage') as string, 10);
    const condition = formData.get('condition') as string;
    const hasAccident = formData.get('hasAccident') === 'true';

    if (!fullName || !phone || !email || !zipCode || !year || !make || !model || !mileage || !condition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Handle optional photo upload
    let photoData: string | null = null;
    let photoName: string | null = null;
    const photoFile = formData.get('photo') as File | null;
    if (photoFile && photoFile.size > 0) {
      const buffer = await photoFile.arrayBuffer();
      photoData = Buffer.from(buffer).toString('base64');
      photoName = photoFile.name;
    }

    const lead = await prisma.lead.create({
      data: {
        fullName,
        phone,
        email,
        zipCode,
        year,
        make,
        model,
        trim,
        vin,
        mileage,
        condition,
        hasAccident,
        photoData,
        photoName,
      },
    });

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    sendSellerConfirmation({ fullName, email, year, make, model, trim }).catch((err) =>
      console.error('Email send failed:', err)
    );

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error('POST /api/leads error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sortBy = (searchParams.get('sortBy') as string) || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const leads = await prisma.lead.findMany({
      where: status && status !== 'all' ? { status } : undefined,
      orderBy: { [sortBy]: order },
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
        photoName: true,
        status: true,
        notes: true,
      },
    });

    return NextResponse.json(leads);
  } catch (err) {
    console.error('GET /api/leads error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
