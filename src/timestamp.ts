import { 
    App
} from 'obsidian';

import {log, error,  getEditor} from './utils';

export async function setTimestamp(app: App){
    // # prepare variables
    console.log("prepare variables");
    const editor = getEditor(app);

    // # get timestamp (like '10:34')
    console.log("Get timestamp");
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // # get current line
    console.log("Get current line");
    const cursorPosition = editor.getCursor();
    const currentLine = editor.getLine(cursorPosition.line);
    // currentLine should match `- ...` or `- [ ] ...`
    const taskLineMatch = currentLine.match(/^(\s*)-\s+(\[[\s\w]\]\s+)?(\d{2}\:\d{2}\s+)?(.*)/);
    const normalLineMatch = currentLine.match(/^(\s*)(\d{2}\:\d{2}\s+)?(.*)/);
    var newLine: string;
    if (taskLineMatch){
        const indent = taskLineMatch[1];
        var checkbox = taskLineMatch[2];
        if (checkbox) checkbox = checkbox.trim();
        const oldTimestamp = taskLineMatch[3];
        const content = taskLineMatch[4];
    
        newLine = `${indent}- ${checkbox? checkbox+' ':''}${timestamp} ${content}`;
        editor.setLine(cursorPosition.line, newLine);
        editor.setCursor({line: cursorPosition.line, ch: cursorPosition.ch+timestamp.length+1-(oldTimestamp?oldTimestamp.length:0)});
    }
    else if (normalLineMatch){
        const indent = normalLineMatch[1];
        const oldTimestamp = normalLineMatch[2];
        const content = normalLineMatch[3];
        newLine = `${indent}${timestamp} ${content}`;
        editor.setLine(cursorPosition.line, newLine);
        editor.setCursor({line: cursorPosition.line, ch: cursorPosition.ch+timestamp.length+1-(oldTimestamp?oldTimestamp.length:0)});
    }
    else{
        error("Weired Error: Current line is not a task line or normal line");
        return;
    }

    log(`Successfully added timestamp ${timestamp}`, 3);
}
