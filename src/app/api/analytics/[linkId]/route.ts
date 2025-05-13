import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

import { requireAuth } from '@/lib/middleware/authMiddleware';
import { Link } from '@/model/Link';
import { Analytics } from '@/model/Analytics';

export async function GET(
  req: NextRequest,
  { params }: { params: { linkId: string } }
) {
  await connectDB();

  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const link = await Link.findOne({ _id: params.linkId, userId: auth.userId });

  if (!link) return new NextResponse('Link not found or unauthorized', { status: 404 });

  const data = await Analytics.find({ linkId: link._id }).sort({ timestamp: -1 });

  return NextResponse.json(data);
}
