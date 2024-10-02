"use client";

import {useCallback} from "react";
import Login from "@/components/user/Login";
import SelectLanguage from "@/components/SelectLanguage";
import TextSize from "@/components/TextSize";
import {TPages} from "@/lib/types";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Signup from "@/components/user/Signup";


function ShowPage({currPage, pageSetter}: { currPage: TPages, pageSetter: (value: TPages) => void }) {
    switch (currPage) {
        default:
        case "login":
            return <Login pageSetter={pageSetter}/>;
        case "signup":
            return <Signup pageSetter={pageSetter}/>;
        case "lang":
            return <SelectLanguage pageSetter={pageSetter}/>;
        case "accessibility":
            return <TextSize/>
    }
}

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currPage = searchParams.get("page") as TPages || "signup";

    const changePage = useCallback((value: TPages) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", value);
        let ps = params.toString();
        router.push(pathname + '?' + ps);
    }, [pathname, router, searchParams]);

    return (
        <main className="w-full h-full">
            <ShowPage currPage={currPage} pageSetter={changePage}/>
        </main>
    );
}
