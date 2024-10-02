import {StateSetter} from "@/lib/types";
import {useState} from "react";
import {HideEyeIcon, ViewEyeIcon} from "@/components/Icons";

/**
 * Password input component, has the ability to hide/show password
 * @param password State variable to hold the current password value
 * @param setPassword State setter to change the current password.
 * @param name The `name` for labeling (html form)
 * @param placeholder The placeholder text for the input (defaults to "Password here")
 * @param required If the input is required or not (defaults to true)
 * @constructor
 */
export function PasswordInput({password, setPassword, name, placeholder, required}: {
    password: string,
    setPassword: StateSetter<string>,
    name?: string,
    placeholder?: string,
    required?: boolean
}) {
    const [hidePass, setHidePass] = useState(true);

    return <div className="flex w-full">
        <input type={hidePass ? "password" : "text"}
               className="border-[2px] w-[calc(100%-44px)] rounded-l-lg border-r-0"
               name={name || "password"} placeholder={placeholder || "Password here"}

               required={required || true}
               value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button
            className="size-[44px] bg-white flex items-center justify-center border-[2px] border-l-0 border-opacity-50 border-brand-secondary rounded-r-lg"
            onClick={(e) => {
                e.preventDefault();
                setHidePass(!hidePass);
            }}
        >
            {hidePass ? <HideEyeIcon/> : <ViewEyeIcon/>}
        </button>
    </div>
}