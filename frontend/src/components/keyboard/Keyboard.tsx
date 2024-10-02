import "./style.css"
import {StateSetter, TInputModes, TKeyboardKeys} from "@/lib/types";
import {BackspaceIcon, CaretLeftIcon, CaretRightIcon} from "@/components/Icons";
import {memo} from "react";
import {insertAtPos} from "@/lib/utils";

export const keyboardKeys: TKeyboardKeys = {
    '1': ['.', ',', '?'],
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
};

const keyboard_keys = Object.keys(keyboardKeys);


function Keyboard({text, setText, handleKeyPress, mode, changeMode, cursor, setCursor}: {
    text: string,
    setText: StateSetter<string>,
    handleKeyPress: (key: string) => void,
    mode: TInputModes,
    changeMode: () => void
    cursor: number,
    setCursor: StateSetter<number>,
}) {
    return <div className="keyboard-cont w-full h-fit">
        <button className="keys" onClick={() => {
            if (cursor > 0)
                setCursor((prevState) => prevState - 1);
        }}>
            <CaretLeftIcon size={24}/>
        </button>
        <button className="keys" onClick={() => {
            if (cursor <= text.length - 1)
                setCursor((prevState) => prevState + 1);
        }}>
            <CaretRightIcon size={24}/>
        </button>
        <button className="keys" onClick={() => {
            setText(text.substring(0, cursor - 1) + text.substring(cursor));
            if (cursor !== 0)
                setCursor((prevState) => prevState - 1);
        }}>
            <BackspaceIcon size={24}/>
        </button>
        {
            keyboard_keys.map((key, i) => {
                let alphabets = keyboardKeys[key].join('');

                return <button className="keys num-keys" key={i} onClick={() => {
                    handleKeyPress(key);
                }}>
                    <span className="value">{key}</span>
                    {alphabets && <span className="subvalues">{alphabets}</span>}
                </button>
            })
        }
        <button className="keys">
            <span className="value">*</span>
            <span className="subvalues"></span>
        </button>
        <button className="keys" onClick={() => {
            if (mode != '123') {
                setText((prevState) => insertAtPos(prevState, cursor, ' '));
                setCursor((prevState) => prevState + 1);
            } else {
                setText((prevState) => insertAtPos(prevState, cursor, '0'));
                setCursor((prevState) => prevState + 1);
            }
        }}>
            <span className="value">0</span>
            <span className="subvalues">⎵</span>
        </button>
        <button className="keys" onClick={() => {
            if (mode != '123') {
                changeMode();
            } else {
                setText((prevState) => insertAtPos(prevState, cursor, '#'));
                setCursor((prevState) => prevState + 1);
            }
        }}>
            <span className="value">#</span>
            <span className="subvalues"></span>
        </button>
    </div>
}

export default memo(Keyboard);