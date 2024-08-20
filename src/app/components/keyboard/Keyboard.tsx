import "./style.css"
import {StateSetter, TInputModes, TKeyboardKeys} from "@/lib/types";
import {BackspaceIcon, CaretLeftIcon, CaretRightIcon} from "@/app/components/Icons";
import {memo} from "react";

export const keyboardKeys: TKeyboardKeys = {
    '1': ['.', ','],
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

function Keyboard({text, setText, handleKeyPress, mode, cursor, setCursor}: {
    text: string,
    setText: StateSetter<string>,
    handleKeyPress: (key: string) => void,
    mode: TInputModes,
    cursor: number,
    setCursor: StateSetter<number>,
}) {


    return <div className="keyboard-cont w-full h-fit">
        <button className="keys" onClick={() => {
            console.log(cursor, "condition: ", cursor > 0)
            if (cursor > 0)
                setCursor((prevState) => prevState - 1);
            console.log("After: ", cursor)

        }}>
            <CaretLeftIcon/>
        </button>
        <button className="keys" onClick={() => {
            if (cursor <= text.length - 1)
                setCursor((prevState) => prevState + 1);
        }}>
            <CaretRightIcon/>
        </button>
        <button className="keys" onClick={() => {
            setText(text.slice(0, -1));
            if (cursor !== 0)
                setCursor((prevState) => prevState - 1);
        }}>
            <BackspaceIcon/>
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
                setText((prevState) => prevState + ' ');
                setCursor((prevState) => prevState + 1);
            } else {
                setText((prevState) => prevState + '0');
                setCursor((prevState) => prevState + 1);
            }

        }}>
            <span className="value">0</span>
            <span className="subvalues">⎵</span>
        </button>
        <button className="keys">
            <span className="value">#</span>
            <span className="subvalues"></span>
        </button>
    </div>
}

export default memo(Keyboard);