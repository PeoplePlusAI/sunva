"use client";

import "./user.css";
import {useState} from "react";
import {toast} from "sonner";
import {TPages} from "@/lib/types";
import {PasswordInput} from "@/components/PasswordInput";
import {useRouter} from "next/navigation";
import {useSession} from "@/lib/context/sessionContext";

export default function Login({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setSession] = useSession();
    const router = useRouter();

    return <section className="w-full h-full flex items-center justify-center px-8">
        <form className="flex flex-col items-center justify-center login-form gap-4 w-full" onSubmit={(e) => {
            e.preventDefault();

            fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                'credentials': 'include',
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(router);

                    if(data.detail) {
                        toast.error(data.detail);
                        return;
                    }

                    setSession({
                        email: data.email as string,
                        lang: data.language as string,
                        user_id: data.user_id as string
                    })
                        setTimeout(() => {
                            console.log("Done")
                            router.push("/home");
                        }, 1000);
                    })
                    .catch(e => {
                        console.error(e);
                        toast.error("Couldn't create the account");
                    })
        }}>
            <div className="unit">
                <label htmlFor="email" className="block">Email</label>
                <input type="email" name="email" placeholder="Enter here" className="border-[2px] rounded-lg w-full"
                       value={email} onChange={(e) => setEmail(e.target.value)}
                       required
                />
            </div>
            <div className="unit">
                <label htmlFor="password" className="block">Password</label>
                <PasswordInput password={password} setPassword={setPassword}/>
            </div>
            <button type="submit" className="mt-5 btn-primary px-10">
                Login
            </button>

            <p className="text-sm absolute bottom-10">
                Don&apos;t have an account?
                <button className="text-blue-600 underline ml-1" onClick={(e) => {
                    e.preventDefault();
                    pageSetter("signup");
                }}>Create one.</button>
            </p>
        </form>
    </section>
}