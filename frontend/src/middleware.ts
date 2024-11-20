import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'


const LOGIN_ROUTE = '/?page=login';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token');

    if (!token) {
        return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
    }

    try {
        const url = new URL('/user/verify', process.env.NEXT_PUBLIC_BACKEND);
        await fetch(url, {
            credentials: 'include',
            headers: {
                'Cookie': token.name + '=' + token.value
            }
        });

        // If okay do nothing (eat a 5 star!)
        return NextResponse.next();
    } catch (error) {
        // If not okay, redirect to login
        console.log(error)
        return NextResponse.redirect(new URL(LOGIN_ROUTE, req.url));
    }
}

export const config = {
    // Only run this middleware when the following paths are encountered
    matcher: ['/home', '/settings'],
}