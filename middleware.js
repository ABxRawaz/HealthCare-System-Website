import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"; // Replace with the same secret key used in the login API

export async function middleware(request) {
    const token = request.cookies.get("token")?.value;


    // For other routes, verify the token
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded); // Debugging

        // Redirect based on role
        if (request.nextUrl.pathname.startsWith("/doctor") && decoded.role !== "doctor") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (request.nextUrl.pathname.startsWith("/patient") && decoded.role !== "patient") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Invalid token:", error); // Debugging
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/doctor/:path*", "/patient/:path*"],
};