import "./user.css";
import {useState} from "react";
import {toast} from "sonner";
import {TPages} from "@/lib/types";
import {PasswordInput} from "@/components/PasswordInput";
import {useRouter} from "next/navigation";


export default function Signup({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();


    return <section className="w-full h-full flex items-center justify-center px-8">
        <form className="flex flex-col items-center justify-center login-form gap-4 w-full">
            <div className="unit">
                <label htmlFor="email" className="block">Email</label>
                <input type="email" name="email" placeholder="abc@xyz.com" className="border-[2px] rounded-lg w-full"
                       value={email} onChange={(e) => setEmail(e.target.value)}
                       required
                />
            </div>
            <div className="unit">
                <label htmlFor="password" className="block">Password</label>
                <PasswordInput password={password} setPassword={setPassword}/>
            </div>
            <div className="unit">
                <label htmlFor="confirm-password" className="block">Confirm password</label>
                <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} name="confirm-password"
                               placeholder="Retype password"/>
            </div>
            <button type="submit" className="mt-5 btn-primary px-10" onClick={(e) => {
                e.preventDefault();
                if (password != confirmPassword) {
                    toast.warning("Passwords don't match");
                    return;
                }

                fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/register`, {
                    method: 'POST',
                    headers: {'Content-Type': ''},
                    body: JSON.stringify({
                        "email": email,
                        "password": password,
                        "language": "en"
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Return data:", data);

                        if (data.detail) {
                            toast.error(data.detail);
                            return;
                        }
                        try {
                            router.push("?page=login");
                        } catch (e) {
                        }
                    })
                    .catch(e => {
                        console.error("ERROR:", e);
                        toast.error("Couldn't create the account");
                    });
            }}>
                Signup
            </button>
        </form>
        <p className="text-sm absolute bottom-10">
            Already have an account?
            <button className="text-blue-600 underline ml-1" onClick={(e) => {
                e.preventDefault();
                pageSetter("login");
            }}>Login now.</button>
        </p>
    </section>
}