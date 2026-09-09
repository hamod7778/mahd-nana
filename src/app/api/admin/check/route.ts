import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (sessionToken && sessionToken.length > 10) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false });
}
