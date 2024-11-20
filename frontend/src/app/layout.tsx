import type {Metadata} from "next";
import "./globals.css";
import {inter} from "@/lib/font";
import {Toaster} from "@/components/ui/sonner";
import {SessionProvider} from "@/lib/context/sessionContext";


export const metadata: Metadata = {
    title: "Sunva AI",
    description: "TODO",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={inter.className}>

        <a
            className="banner right-top"
            href="https://github.com/PeoplePlusAI/sunva-ai"
            data-ribbon="Fork Me"
            title="Made with ❤️ for 🇮🇳 by People+AI"
        />


        <SessionProvider>
            {children}
        </SessionProvider>
        <Toaster richColors theme="light" closeButton position="top-center"/>
        </body>
        </html>
    );
}
