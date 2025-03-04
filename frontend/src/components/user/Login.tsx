"use client";

import "./user.css";
import {useState} from "react";
import {toast} from "sonner";
import {TPages} from "@/lib/types";
import {PasswordInput} from "@/components/PasswordInput";
import {useRouter} from "next/navigation";
import {useSession} from "@/lib/context/sessionContext";
import {Loader} from "lucide-react";

export default function Login({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [_, setSession] = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return <section className="auth-bg w-full h-full flex items-center justify-center px-8">
        <form
            className="flex flex-col items-center justify-center login-form gap-4 w-full"
            onSubmit={(e) => {
                e.preventDefault();

                setLoading(true);
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

                        if (data.detail) {
                            toast.error(data.detail);
                            return;
                        }

                        setSession({
                            email: data.email,
                            lang: data.language,
                            user_id: data.user_id,
                            voice_model: data.voice_model
                        })
                        setTimeout(() => {
                            console.log("Done")
                            router.push("/home");
                        }, 1000);
                    })
                    .catch(e => {
                        console.error(e);
                        toast.error("Couldn't create the account");
                    }).finally(() => {
                        setLoading(false);
                    });
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[400px]">
                <div className="w-full text-center flex items-center justify-center mb-7">
                    <img src="/logo.png" className="h-[80px]" alt="Sunva Logo - People+ai; An EkStep initiative"
                         draggable={false}/>
                </div>
                <div className="unit mb-4">
                    <label htmlFor="email" className="text-gray-500">Email</label>
                    <input type="email" name="email" placeholder="hello@demo.com"
                           className="border-[2px] rounded-lg w-full"
                           value={email} onChange={(e) => setEmail(e.target.value)}
                           required
                    />
                </div>
                <div className="unit">
                    <label htmlFor="password" className="text-gray-500">Password</label>
                    <PasswordInput password={password} placeholder="your password" setPassword={setPassword}/>
                </div>
                <div className="w-full text-center mt-3">
                    <button type="submit"
                            className="flex items-center justify-center gap-3 mx-auto mt-5 btn-primary bg-[#468ca0] px-10"
                            disabled={loading}>
                        {loading && <Loader className="animate-spin "/>}
                        Login
                    </button>
                </div>
                <p className="text-sm absolute left-0 bottom-10 text-center w-full">
                    Don&apos;t have an account?
                    <button className="text-blue-600 underline ml-1" onClick={(e) => {
                        e.preventDefault();
                        pageSetter("signup");
                    }}>
                        Create one.
                    </button>
                </p>
            </div>

        </form>
    </section>
}