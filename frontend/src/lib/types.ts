export type TPages = "login" | "signup" | "lang" | "accessibility";

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type TMessage = {
    name: string;
    message: string;
    original?: string;
    modified?: string;
    type?: "concise" | "highlight" | "tts";
    id: string
}

export type TInputModes = 'abc' | 'ABC' | '123';

export type TKeyboardKeys = { [key: string]: string[] };

export type TServerStates = "active" | "inactive";