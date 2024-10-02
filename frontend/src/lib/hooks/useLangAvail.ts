import {useEffect, useState} from "react";
import {toast} from "sonner";


export default function useLangAvail() {
    const [langList, setLangList] = useState<string[]>(['en']);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/v1/languages`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setLangList(data.languages);
            })
            .catch((e) => {
                toast.error("Error while fetching languages");
                console.error("Error while fetching languages from server:", e);
            })
    }, []);

    return {langList}
}