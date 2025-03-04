import "./user.css";
import {useState} from "react";
import {toast} from "sonner";
import {TPages} from "@/lib/types";
import {PasswordInput} from "@/components/PasswordInput";
import {useRouter} from "next/navigation";
import {Loader} from "lucide-react";


export default function Signup({pageSetter}: { pageSetter: (val: TPages) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    return <section className="auth-bg w-full h-full flex items-center justify-center px-8">

        <form className="flex flex-col items-center justify-center login-form gap-4 w-full"
              onSubmit={(e) => {
                  e.preventDefault();
                  if (password != confirmPassword) {
                      toast.warning("Passwords don't match");
                      return;
                  }

                  setLoading(true);
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
                      })
                      .finally(() => {
                          setLoading(false);
                      });
              }
              }
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-[400px]">
                <div className="w-full text-center flex items-center justify-center mb-7">
                    <img src="/logo.png" className="h-[80px]" alt="Sunva Logo - People+ai; An EkStep initiative"
                         draggable={false}/>
                </div>

                <div className="unit mb-4">
                    <label htmlFor="email" className="text-gray-500">Email</label>
                    <input type="email" name="email" placeholder="abc@xyz.com"
                           className="border-[2px] rounded-lg w-full"
                           value={email} onChange={(e) => setEmail(e.target.value)}
                           required
                    />
                </div>
                <div className="unit mb-4">
                    <label htmlFor="password" className="text-gray-500">Password</label>
                    <PasswordInput password={password} setPassword={setPassword} placeholder="Strong password"/>
                </div>
                <div className="unit mb-4">
                    <label htmlFor="confirm-password" className="text-gray-500">Confirm password</label>
                    <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} name="confirm-password"
                                   placeholder="Retype password"/>
                </div>
                <div className="w-full text-center">
                    <button
                        type="submit" className="mx-auto mt-5 btn-primary bg-[#468ca0] px-10"
                        disabled={loading}
                    >
                        {loading && <Loader className="animate-spin "/>}
                        Signup
                    </button>
                </div>
            </div>
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