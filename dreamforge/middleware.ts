import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

export async function middleware(request: NextRequest) {
    const session = await auth()
    const protectedPrefixes = ['/dashboard', '/map', '/tree', '/interview', '/lab', '/profile', '/onboarding'];
    const isProtectedRoute = protectedPrefixes.some(prefix => request.nextUrl.pathname.startsWith(prefix));

    if (isProtectedRoute && !session?.user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
