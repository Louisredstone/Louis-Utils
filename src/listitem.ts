import { 
    App
} from 'obsidian';

import {log, getEditor} from './utils';

export async function cycleListItemType(app: App){
    // # prepare variables
    console.log("prepare variables");
    const editor = getEditor(app);

    // # define convert function
    const processLine = (text: string) => {
        const states = [
            { regex: /^(\s*)-\s+×\s+/, next: '$1- ' },  // 放弃的任务变为普通条目
            { regex: /^(\s*)-\s+\[ \]\s+/, next: '$1- [x] ' },  // 待完成任务变为已完成任务
            { regex: /^(\s*)-\s+\[\w\]\s+/, next: '$1- × ' },  // 已完成任务变为放弃的任务
                { regex: /^(\s*)-\s+/, next: '$1- [ ] ' }  // 普通条目变为待完成任务
        ];
        // 遍历状态列表，找到匹配的状态并返回更新后的文本
        for (let i = 0; i < states.length; i++) {
            if (states[i].regex.test(text)) {
                return text.replace(states[i].regex, states[i].next);
            }
        }

        // 如果没有匹配的，则返回原始文本
        return text;
    }

    // # decide processing range
    if (editor.somethingSelected()){
        // # get cursor start and end
        console.log("Something selected, get lines of selected range");
        const startPosition = editor.getCursor('from');
        const endPosition = editor.getCursor('to');
        startPosition.ch = 0;
        if (endPosition.ch!=0){
            endPosition.line+=1;
            endPosition.ch=0;
        }
        const inputText = editor.getRange(startPosition, endPosition);
        const convertedText = inputText.split('\n').map(line => processLine(line)).join('\n');
        editor.replaceRange(convertedText, startPosition, endPosition);
        editor.setSelection(startPosition, endPosition);
        
    } else {
        // # get current line
        console.log("No selection, get current line");
        const cursorPosition = editor.getCursor();
        const currentLine = editor.getLine(cursorPosition.line);
        const convertedLine = processLine(currentLine);
        editor.setLine(cursorPosition.line, convertedLine);
    }
    log("Listitem type changed", 3);
}
