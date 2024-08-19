import type {Metadata} from "next";
import "./globals.css";
import {inter} from "@/lib/font";
import {Toaster} from "@/components/ui/sonner";


export const metadata: Metadata = {
    title: "Sunva AI",
    description: "TODO",
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>)
{
    return (
        <html lang="en">
        <body className={inter.className}>
            {children}
            <Toaster richColors theme="light" closeButton/>
        </body>
        </html>
    );
}
