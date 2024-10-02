"use client";

import {useEffect, useState} from "react";
import {Slider} from "@/components/ui/slider";
import Link from "next/link";

export default function TextSize() {
    const [size, setSize] = useState(16);
    const [weight, setWeight] = useState(400);
    const [minSize, maxSize] = [14, 28];
    const [minWeight, maxWeight] = [200, 800];


    useEffect(() => {
        let css_var = document.querySelector(':root') as HTMLDivElement;

        if(!css_var)
            return;

        css_var.style.setProperty('--font-size', size + "px");
        css_var.style.setProperty('--font-weight',  weight.toString());

    }, [size, weight]);

    return <section className="page flex justify-between flex-col gap-4">
        <div className="flex-1 text-[#66696D] leading-[28px] flex items-center justify-center">
            <p className="accessibility">Test your text size here...</p>
        </div>
        <div className="bg-white rounded-lg p-4">
            <label className="text-sm">Font Size</label>
            <div className="flex items-center gap-2">
                <span className="text-[14px]">A</span>
                <Slider defaultValue={[16]} min={minSize} max={maxSize} step={1} value={[size]}
                        onValueChange={(e) => setSize(e[0])}
                />
                <span className="text-[30px]">A</span>
            </div>
            <br/>
            <label className="text-sm block mb-2">Font Weight</label>
            <div className="flex items-center gap-2">
                <span className="text-[20px] font-[200]">A</span>
                <Slider defaultValue={[400]} min={minWeight} max={maxWeight} step={50} value={[weight]}
                        onValueChange={(e) => setWeight(e[0])}
                />
                <span className="text-[20px] font-[800]">A</span>
            </div>
        </div>
        <Link href="/home" className="btn-primary mx-4 flex items-center justify-center">
            Continue
        </Link>
    </section>
}