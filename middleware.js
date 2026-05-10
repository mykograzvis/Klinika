import { NextResponse } from 'next/server';

const ADMIN_ONLY = ['/vartotojai', '/gydytoju-valdymas', '/statistika', '/paslaugu-valdymas'];
const GYDYTOJAS_ONLY = ['/gydytojas'];

const PUBLIC_PATHS = ['/prisijungti', '/registracija', '/setup-2fa', '/prisijungti2FA', '/pamirso-slaptazodi', '/keisti-slaptazodi'];

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const role  = request.cookies.get('role')?.value;

  if (!token) {
    const loginUrl = new URL('/prisijungti', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  if (ADMIN_ONLY.some(p => path.startsWith(p)) && role !== 'Adminas') {
    return NextResponse.redirect(new URL('/rezervacija', request.url));
  }

  if (GYDYTOJAS_ONLY.some(p => path.startsWith(p)) &&
      role !== 'Gydytojas' && role !== 'Adminas') {
    return NextResponse.redirect(new URL('/rezervacija', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/pagrindinis/:path*',
    '/rezervacija/:path*',
    '/istorija/:path*',
    '/profilis/:path*',
    '/vartotojai/:path*',
    '/gydytoju-valdymas/:path*',
    '/statistika/:path*',
    '/gydytojas/:path*',
    '/paslaugu-valdymas/:path*',
  ],
};