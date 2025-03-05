import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Languages, LogOut, Settings, UserRound} from "lucide-react";
import {useSession} from "@/lib/context/sessionContext";
import useLangAvail from "@/lib/hooks/useLangAvail";
import {langDict} from "@/lib/lang";
import Link from "next/link";

export default function NavbarMenu() {
    const [session, setSession] = useSession();
    const {langList} = useLangAvail();

    return <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full bg-white relative">
            <UserRound/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel className="flex items-center gap-2">
                <img src="/sunva.webp" className="size-8" alt="Sunva Logo"/>
                <img src="/sunva-text.webp" className="h-4" alt="Sunva"/>
            </DropdownMenuLabel>
            <p className="px-2 text-sm max-w-[230px] text-gray-500">Seamless conversation loop for the
                deaf</p>
            <DropdownMenuSeparator/>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Languages/>
                    Languages
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                            value={session?.lang}
                            onValueChange={(e) => setSession({...session!, lang: e})}
                        >
                            {langList.map((langCode) => {
                                return <DropdownMenuRadioItem key={langCode} value={langCode}>
                                    {langDict[langCode]}
                                </DropdownMenuRadioItem>
                            })}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
                <Link className="flex gap-2 items-center" href="/settings">
                    <Settings/>
                    Settings
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
                <LogOut/>
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

}