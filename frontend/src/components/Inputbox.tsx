"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface InputBoxProps {
    type?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    label: string
    id?: string
    className?: string
    labelClass?: string
    parentClass?: string
}

export default function InputBox({ type = "text", startIcon, endIcon, label, id, className, labelClass, parentClass, ...props }: InputBoxProps) {
    const [isActive, setIsActive] = useState(false)

    return (
        <div className={cn("relative w-full max-w-2xl", parentClass)}>
            <div
                className={`relative border rounded-lg transition-colors duration-200 flex justify-center items-center ${
                    isActive ? "border-gray-400" : "border-gray-200"
                }`}
            >
                {/* Label with Tailwind transitions instead of Framer Motion */}
                <label
                    className={cn(
                        "absolute left-3 -top-2.5 px-1 text-sm text-gray-500 bg-white transition-all duration-200 ease-in-out",
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
                        labelClass,
                    )}
                >
                    {label}
                </label>
                <div className="ps-4">{startIcon}</div>
                <input
                    type={type}
                    className={
                        "w-full px-2 py-4 text-base bg-transparent outline-none rounded-lg text-gray-900 placeholder-gray-400 " +
                        className
                    }
                    placeholder={isActive ? "" : label}
                    {...props}
                    onFocus={() => setIsActive(true)}
                    onBlur={(e) => {
                        if (e.target.value === "") {
                            setIsActive(false)
                        }
                    }}
                />
                <div className="px-4">{endIcon}</div>
            </div>
        </div>
    )
}

