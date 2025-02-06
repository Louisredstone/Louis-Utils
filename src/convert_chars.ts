import { 
    App
} from 'obsidian';

import {log, getEditor} from './utils';

export async function convertToHalfWidthCharacters(app: App){
    // # prepare variables
    console.log("prepare variables");
    const editor = getEditor(app);

    // # prepare dictionary
    console.log("prepare dictionary");
    const dictionary_left: Record<string, string> = {
        '（': '(', '【': '[', '〈': '<', '“': '"', "‘": "'"
    }
    const dictionary_right: Record<string, string> = {
        '，': ',', '。': '.', '、': '/', '；': ';', '：': ':', '？': '?', '！': '!',
        '）': ')', '】': ']', '〉': '>', '”': '"', "’": "'"
    }
    const dictionary_direct: Record<string, string> = {
        "…": "..."
    }
    const convert = (text: string) => {
        for (const fwch in dictionary_left){
            const hwch = dictionary_left[fwch];
            const pattern = new RegExp("[ \\t]*" + fwch, "g");
            text = text.replace(pattern, " " + hwch);
        }
        for (const fwch in dictionary_right){
            const hwch = dictionary_right[fwch];
            const pattern = new RegExp(fwch + "[ \\t]*", "g");
            text = text.replace(pattern, hwch + " ");
        }
        for (const fwch in dictionary_direct){
            const hwch = dictionary_right[fwch];
            text = text.replace(fwch, hwch);
        }
        return text;
    }

    if (editor.somethingSelected()){
        // # get selected text
        console.log("Something selected, get selected text");
        const selectedText = editor.getSelection();
        const convertedText = convert(selectedText);
        editor.replaceSelection(convertedText);
    } else {
        // # get current line
        console.log("No selection, get current line");
        const cursorPosition = editor.getCursor();
        const currentLine = editor.getLine(cursorPosition.line);
        const convertedLine = convert(currentLine);
        editor.setLine(cursorPosition.line, convertedLine);
    }

    log("Full-width chars successfully converted to half-width", 3);
}
