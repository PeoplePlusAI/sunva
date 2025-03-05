import {TMessage} from "@/lib/types";
import {memo, useEffect, useRef, useState} from "react";

function Message({item}: { item: TMessage }) {
    const [showOriginal, setShowOriginal] = useState(true);

    useEffect(() => {
        if (item.modified) {
            setShowOriginal(false);
        }
    }, [item.modified]);

    return (
        <>
            <div
                className={`message-box ${
                    showOriginal ? "" : item.type === "concise" ? "summarize" : item.type === "highlight" ? "highlight" : ""
                }`}
                data-type={item.name === "You" ? "You" : "Other"}
            >
                <label className="font-bold block">{item.name}</label>
                <p
                    className="h-auto"
                    dangerouslySetInnerHTML={{
                        __html: showOriginal ? item.original || item.message : item.modified || item.message,
                    }}
                ></p>
            </div>

            {item.modified && (
                <div className="relative w-full text-right h-3">
                    <button
                        className="view-og-btn absolute right-0 top-[-10px]"
                        onClick={() => setShowOriginal(!showOriginal)}
                    >
                        {showOriginal ? (item.type === "concise" ? "Summarized" : "Enhanced") : "Original"}
                    </button>
                </div>
            )}
        </>
    );
}

function MessagesList({messages, onClick, splitOpen}: {
    messages: TMessage[],
    onClick: () => void,
    splitOpen: boolean
}) {
    const section = useRef<HTMLDivElement>(null);

    useEffect(() => {
        section.current?.scrollTo(0, section.current.scrollHeight);
    }, [messages]);

    return (
        <div
            onClick={onClick}
            ref={section}
            className="w-full flex-1 rounded-lg pt-3 gap-2 overflow-y-scroll hide-scrollbar space-y-4 pb-5">

            <div className="flex w-full h-full gap-4">
                <div className="flex-1 space-y-6 border-2 overflow-y-auto h-full rounded-lg p-4">
                    {messages.length === 0 ? (
                            <p className="text-center opacity-30 text-2xl mt-40">Start a conversation</p>
                        ) :
                        messages.map((item, i) => (
                            <Message item={item} key={i}/>
                        ))
                    }
                </div>
                {splitOpen &&
                    <div className="max-md:hidden flex-1 space-y-2 border-2 overflow-y-auto h-full rounded-lg p-4">
                        <h1 className="text-xl text-[#1db7f5]">Original Text</h1>
                        {messages.length === 0 ? (
                                <p className="text-center opacity-30 pt-5">
                                    Press record and speak to start a conversation
                                </p>
                            ) :
                            <div>
                                {messages.map((item, i) =>
                                        <span
                                            className="pt-2"
                                            key={i}
                                        >
                                    {item.message}
                                </span>
                                )}
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default memo(MessagesList);