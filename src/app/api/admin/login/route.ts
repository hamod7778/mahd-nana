import { NextResponse } from 'next/server';
import { verifyAdminCredentials, generateAdminSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'يرجى إدخال اسم المستخدم وكلمة المرور' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username.trim(), password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken();

    const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    
    // Set HTTP-Only Cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return response;
  } catch (error) {
    console.error('Error logging in admin:', error);
    return NextResponse.json({ error: 'حدث خطأ في السيرفر' }, { status: 500 });
  }
}
