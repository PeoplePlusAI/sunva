import {StateSetter} from "@/lib/types";
import {TSessionCtx} from "@/lib/context/sessionContext";
import {useRef, useState} from "react";
import {Dialog} from "@/components/Alerts";
import {toast} from "sonner";

export function SaveAndDeletePrompts({isDelOpen, setIsDelOpen, session}: {
    isDelOpen: boolean,
    setIsDelOpen: StateSetter<boolean>,
    session: TSessionCtx
}) {
    const [isDelConfoOpen, setIsDelConfoOpen] = useState(false);
    const [isSaveOpen, setIsSaveOpen] = useState(false);

    const saveNameRef = useRef<HTMLInputElement>(null);
    return <>
        <Dialog
            title="Do you want to delete this conversation?"
            acceptText="Delete"
            rejectText="Cancel"
            open={isDelConfoOpen}
            setOpen={setIsDelConfoOpen}
            onAccept={() => {
                alert("Coming soon...")
            }}

            onReject={() => {
                setIsDelOpen(false);
                setIsDelConfoOpen(false);
            }}
        >
            <br/>
        </Dialog>

        <Dialog
            title="Do you want to save this conversation?"
            acceptText="Save"
            rejectText="Cancel"
            open={isDelOpen}
            setOpen={setIsDelOpen}
            onAccept={() => {
                setIsDelOpen(false);
                setIsSaveOpen(true);
            }}

            onReject={() => {
                setIsDelOpen(false);
                setIsDelConfoOpen(true);
            }}
        >
            <br/>
        </Dialog>

        <Dialog
            title="Save As"
            acceptText="Save"
            rejectText="Cancel"
            open={isSaveOpen}
            setOpen={setIsSaveOpen}
            onAccept={() => {
                if (!saveNameRef.current?.value) {
                    toast.error("Please enter a name");
                } else {
                    let endpoint = `api/v1/transcription/save?user_id=${encodeURIComponent(session!.user_id!)}`;

                    fetch(endpoint, {
                        method: "POST"
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                        })
                        .catch(e => {
                            toast.error("Couldn't save the conversation");
                            console.error("Error while saving;", e);
                        })
                }
            }}
        >
            <input type="text" ref={saveNameRef}
                   className="my-5 w-full px-2 py-2 rounded-xl border-2 border-brand-secondary"
                   placeholder="Enter here"/>
        </Dialog>
    </>
}