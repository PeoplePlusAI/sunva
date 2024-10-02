/**
 * Formats a string containing text. Finds and replaces text wrapped in asterisks (*) with HTML <b> tags
 * @param text
 */
export function formatProcessedText(text: string) {
    return text.replace(/\*(.*?)\*/g, '<b>$1</b>');
}

/**
 * The arrayBufferToBase64 function converts an ArrayBuffer (which is often used to represent binary data) into a Base64 encoded string.
 * @param buffer
 */
export function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



