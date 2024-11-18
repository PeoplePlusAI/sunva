import type {Metadata} from "next";
import "./globals.css";
import {inter} from "@/lib/font";
import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "@/lib/context/sessionContext";


export const metadata: Metadata = {
    title: "Sunva AI",
    description: "Seamless conversation loop for the deaf",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>
            {children}
        </SessionProvider>
        <Toaster richColors theme="light" closeButton position="top-center"/>
        </body>
        </html>
    );
}
