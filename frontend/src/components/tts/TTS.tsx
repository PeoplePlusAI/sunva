import { memo, useEffect, useRef } from "react";
import useTTS from "@/lib/hooks/useTTS";
import { SendIcon } from "@/components/Icons";
import { toast } from "sonner";
import { StateSetter, TMessage } from "@/lib/types";
import { useSession } from "@/lib/context/sessionContext";
import ChooseVoiceModel from "@/components/ChooseVoiceModel";

const TTS_SEND_BTN_ID = "tts-send";

function TTS({
    setMessages,
    onClose,
}: {
    setMessages: StateSetter<TMessage[]>;
    onClose: () => void;
}) {
    const contElmRef = useRef<HTMLDivElement>(null);
    const inputElmRef = useRef<HTMLInputElement>(null);
    const [session] = useSession();
    const lang = session?.lang || "en";

    const { text, setText, sendText } = useTTS(
        lang,
        () => {
            // Action to take before sending a message (e.g., show loading state)
        },
        (response) => {
            // When the response (enhanced) is received from the server
            const { original, enhanced } = response;

            // Add the original and enhanced message to the list, under "You"
            setMessages((prev) => [
                ...prev,
                {
                    name: "You",
                    message: original,  // The original message sent by the user
                    original: original,  // Store original text for toggling
                    modified: enhanced,  // Store the enhanced version from the server
                    id: "" + (Date.now() + Math.random()), // Generate a unique ID
                    type: "tts",  // Mark as a TTS message
                },
            ]);
        }
    );

    useEffect(() => {
        inputElmRef.current?.focus();
    }, []);

    async function sendTextOnly() {
        // Send the text but don't add it to the message list immediately
        sendText(text);
        setText(""); // Clear the input field after sending
    }

    function sendTextAndClear() {
        sendTextOnly(); // Call the function to send text
    }

    return (
        <section className="-mb-4">
            <div className="w-full flex gap-2 px-0 mb-4" ref={contElmRef}>
            <ChooseVoiceModel/>
                <input
                    type="text"
                    value={text} // Controlled input
                    placeholder="Type something"
                    onChange={(e) => {
                        setText(e.target.value); // Update text as the user types
                    }}
                    onKeyDown={(e) => {
                        // Handle pressing "Enter" to send the message or "Escape" to close
                        if (e.key === "Escape") onClose();
                        if (e.key === "Enter" && text) {
                            sendTextAndClear();
                        }
                    }}
                    onBlur={(e) => {
                        if (e.relatedTarget && e.relatedTarget.id === TTS_SEND_BTN_ID) {
                            e.target.focus(); // Keep focus if clicking the send button
                            return;
                        }
                        onClose(); // Close input if focus is lost
                    }}
                    className="px-2 rounded-lg box-shadow flex-1 border-brand-secondary border-[1px] resize-none"
                    ref={inputElmRef} // Ref for focusing input
                />
                <button
                    id={TTS_SEND_BTN_ID}
                    className="p-2 rounded-xl bg-black"
                    onClick={() => {
                        // Send the message when the button is clicked
                        if (text) {
                            sendTextAndClear();
                        } else {
                            toast.warning("Please type something first");
                        }
                    }}
                >
                    <SendIcon size={24} className="fill-white" />
                </button>
            </div>
        </section>
    );
}

export default memo(TTS);