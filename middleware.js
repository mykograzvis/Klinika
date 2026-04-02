import { NextResponse } from 'next/server';

const ADMIN_ONLY = ['/vartotojai', '/gydytoju-valdymas', '/statistika'];
const GYDYTOJAS_ONLY = ['/gydytojas'];

// Šie puslapiai VISIŠKAI praleidžiami – middleware neveikia
const PUBLIC_PATHS = ['/login', '/registracija', '/setup-2fa', '/login2FA'];

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // 1. Praleiski viešus puslapius be jokio tikrinimo
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const role  = request.cookies.get('role')?.value;

  // 2. Nėra tokeno → login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Išsaugom kur norėjo eiti, kad po login nukreiptume atgal
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Admin puslapiai
  if (ADMIN_ONLY.some(p => path.startsWith(p)) && role !== 'Adminas') {
    return NextResponse.redirect(new URL('/rezervacija', request.url));
  }

  // 4. Gydytojo puslapiai
  if (GYDYTOJAS_ONLY.some(p => path.startsWith(p)) &&
      role !== 'Gydytojas' && role !== 'Adminas') {
    return NextResponse.redirect(new URL('/rezervacija', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Tikrina tik dashboard puslapius – NERODO login, api, static failų
  matcher: [
    '/pagrindinis/:path*',
    '/rezervacija/:path*',
    '/istorija/:path*',
    '/profilis/:path*',
    '/vartotojai/:path*',
    '/gydytoju-valdymas/:path*',
    '/statistika/:path*',
    '/gydytojas/:path*',
  ],
};