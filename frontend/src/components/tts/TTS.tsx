import "./style.css"
import {memo, useEffect, useRef} from "react";
import useTTS from "@/lib/hooks/useTTS";
import {SendIcon} from "@/components/Icons";
import {toast} from "sonner";
import {StateSetter, TMessage} from "@/lib/types";
import {useSession} from "@/lib/context/sessionContext";

const TTS_SEND_BTN_ID = "tts-send";

function TTS({setMessages, onClose}: {
    setMessages: StateSetter<TMessage[]>,
    onClose: () => void,
},) {
    const inputElmRef = useRef<HTMLInputElement>(null);
    const [session] = useSession();
    const lang = session?.lang || "en";

    const {text, setText, sendText} = useTTS(lang, () => {
        // When a new text is sent to the server, add the message to the message list;
        setMessages((prev) => [...prev, {name: "You", message: text, id: "" + (Date.now() + Math.random())}]);
    });

    // When opening focus the input element
    useEffect(() => {
        inputElmRef.current?.focus();
    }, []);

    function sendTextOnly() {
        sendText(text);
        setText('');
    }

    function sendTextAndClear() {
        sendTextOnly();
    }

    return <section className="-mb-4">
        <div className="w-full flex gap-2 px-0 mb-4">
            <input type="text" value={text} placeholder="Type something" onChange={(e) => {
                setText(e.target.value);
            }}
                   onKeyDown={(e) => {
                       if (e.key === "Escape")
                           onClose();

                       if (e.key === "Enter" && text) {
                           sendTextAndClear();
                       }
                   }}
                   onBlur={(e) => {
                       // If the event happened due to the send button, do nothing;
                       if (e.relatedTarget && e.relatedTarget.id === TTS_SEND_BTN_ID) {
                           e.target.focus();
                           return;
                       }

                       onClose();
                   }}
                   className="px-2 rounded-lg box-shadow flex-1 border-brand-secondary border-[1px] resize-none"
                   ref={inputElmRef}
            />
            <button id={TTS_SEND_BTN_ID} className="p-2 rounded-xl bg-black" onClick={() => {
                if (text) {
                    sendTextAndClear();
                } else {
                    toast.warning("Please type something first");
                }
            }}>
                <SendIcon size={24} className="fill-white"/>
            </button>
        </div>
    </section>
}

export default memo(TTS);