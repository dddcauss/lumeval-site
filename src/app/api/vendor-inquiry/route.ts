import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface VendorInquiryInput {
  companyName: string
  contactName: string
  contactEmail: string
  productName: string
  modality: string
  bodyParts: string
  intendedUse: string
  regulatoryStatus?: string
  notes?: string
}

export async function POST(req: Request) {
  let body: VendorInquiryInput
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const required = ['companyName', 'contactName', 'contactEmail', 'productName']
  for (const f of required) {
    if (!body[f as keyof VendorInquiryInput] || !String(body[f as keyof VendorInquiryInput]).trim()) {
      return NextResponse.json({ error: `${f} is required` }, { status: 400 })
    }
  }

  try {
    const inquiry = await db.vendorInquiry.create({
      data: {
        companyName: body.companyName.trim(),
        contactName: body.contactName.trim(),
        contactEmail: body.contactEmail.trim(),
        productName: body.productName.trim(),
        modality: body.modality || 'Unspecified',
        bodyParts: body.bodyParts || 'Unspecified',
        intendedUse: body.intendedUse?.trim() || '',
        regulatoryStatus: body.regulatoryStatus || null,
        notes: body.notes?.trim() || null,
        stage: 'inquiry',
      },
    })
    return NextResponse.json({ ok: true, inquiryId: inquiry.id })
  } catch (e) {
    console.error('[/api/vendor-inquiry]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const recent = await db.vendorInquiry.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      companyName: true,
      productName: true,
      modality: true,
      stage: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ inquiries: recent })
}
