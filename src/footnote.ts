import { 
	App, 
	Editor,
	htmlToMarkdown
} from 'obsidian';

import {inputPrompt} from './gui/inputPrompt'
import {suggester} from './gui/suggester'
import {log, error, max, getEditor} from './utils';

export async function insertNewFootNote(app: App){
    const editor = getEditor(app);
    const lastLine = editor.lastLine();
    const {startOfFootnotes, endOfFootnotes, endOfText} = parseTail(editor);
    const footnotes = parseFootnotes(editor, startOfFootnotes, endOfFootnotes);
    var footnotes_txtid = footnotes.filter(f =>  isNaN(Number(f.id)));
    var footnotes_nid = footnotes.filter(f => !isNaN(Number(f.id)));
    footnotes_txtid.sort((a, b) => a.id.localeCompare(b.id));
    footnotes_nid.sort((a, b) => a.id.localeCompare(b.id));

    // # check cursor position
    console.log("check cursor position");
    const {line: cursorLine, ch: cursorCh} = editor.getCursor()
    if (cursorLine>=startOfFootnotes) {
        error("Cursor should not be in the region of footnotes.");
    }

    // # calculate next footnote id
    console.log("calculate next footnote id");
    var newId = 1;
    if (footnotes_nid.length>0)
        newId = parseInt(footnotes_nid[footnotes_nid.length-1].id)+1;

    var defaultNewFootnoteText = await getAndExpandClipboardText();
    var newFootnoteText = await inputPrompt("Insert New Footnote", "Enter the text of the new footnote:", "", defaultNewFootnoteText, "");
    if (newFootnoteText==null || newFootnoteText.trim()=="" && defaultNewFootnoteText==""){
        console.log("Operation canceled by user.");
        log("Operation canceled by user.", 5);
        return;
    } else if (newFootnoteText.trim()==""){
        newFootnoteText = defaultNewFootnoteText;
    }

    const insertion = `[^${newId}]`;
    const footnotesText = 
        footnotes_nid.map(f => `[^${f.id}]: ${f.text}`).concat([`[^${newId}]: ${newFootnoteText.trim()}`]).concat(footnotes_txtid.map(f => `[^${f.id}]: ${f.text}`)).join("\n");
    editor.replaceRange(insertion, {line: cursorLine, ch: cursorCh}); // insert [^newId]
    editor.replaceRange("\n"+footnotesText, {line: max(endOfText, cursorLine+1), ch: 0}, {line: lastLine+1, ch: 0})
    editor.setCursor({line: cursorLine, ch: cursorCh+insertion.length});

    log(`New footnote [^${newId}] inserted successfully.`, 5);
}

function parseTail(editor: Editor){
    // Prepare indices. Explanation:
    // Some text...     
    // (empty lines)    <- endOfText
    // [^1]: footnote 1 <- start (of footnotes)
    // [^2]: footnote 2
    // [^3]: footnote 3 
    // (empty line)     <- end (of footnotes)
    // (empty line)     <- lastLine
    //                  <- lastLine+1
    const lastLine = editor.lastLine();
    var startOfFootnotes = -1;
    var endOfFootnotes = -1;
    var endOfText = -1;
    for (var p = lastLine; p>=0; ){
        var line = editor.getLine(p);
        var isEmpty = line.trim()=="";
        var match = line.match(/\[\^([\d\w]+)\]\:/);
        // e.g.: [^1]: footnote
        if (endOfFootnotes==-1) {
            if (!isEmpty) endOfFootnotes = p+1;
            else p--;
        } else if (startOfFootnotes==-1){
            if (!match) startOfFootnotes = p+1;
            else p--;
        } else if (endOfText==-1) {
            if (!isEmpty) endOfText = p+1;
            else p--;
        } else break;
    }
    return {startOfFootnotes, endOfFootnotes, endOfText};
}

function parseFootnotes(editor: Editor, start: number, end: number){
    var footnotes = [];
    for (var i = start; i < end; i++){
        var line = editor.getLine(i);
        // e.g.: [^1]: text
        var match = line.match(/\[\^([\d\w]+)\]\:(.*)/);
        if (match) {
            var footnoteId = match[1];
            var footnoteText = match[2].trim();
            footnotes.push({id: footnoteId, text: footnoteText});
        }
        else error("Invalid footnote format. Weird error.");
    }
    return footnotes;
}

async function getAndExpandClipboardText(): Promise<string> {
    console.log("get content from clipboard");
    if (navigator.clipboard){
        var item = await navigator.clipboard.read();
        var clipHTML = item[0].types.includes('text/html')? (await (await item[0].getType('text/html')).text()).trim() : "";
        var clipText = item[0].types.includes('text/plain')? (await (await item[0].getType('text/plain')).text()).trim() : "";
        var clipHTMLtoText = htmlToMarkdown(clipHTML).trim()
        var clip = clipText.length>clipHTMLtoText.length? clipText : clipHTMLtoText;
        var clipLines = clip.split("\n");
        return clipLines.join("<br>");
    }
    return "";
}

export async function insertExistFootnote(app: App){
    const editor = getEditor(app);
    const lastLine = editor.lastLine();
    const {startOfFootnotes, endOfFootnotes, endOfText} = parseTail(editor);
    const footnotes = parseFootnotes(editor, startOfFootnotes, endOfFootnotes);
    var footnotes_txtid = footnotes.filter(f =>  isNaN(Number(f.id)));
    var footnotes_nid = footnotes.filter(f => !isNaN(Number(f.id)));
    footnotes_txtid.sort((a, b) => a.id.localeCompare(b.id));
    footnotes_nid.sort((a, b) => a.id.localeCompare(b.id));

    // # check cursor position
    console.log("check cursor position");
    const {line: cursorLine, ch: cursorCh} = editor.getCursor()
    if (cursorLine>=startOfFootnotes) {
        error("Cursor should not be in the region of footnotes.");
    }

    // # select footnote
    console.log("select footnote");
    const pickedId = await suggester(
        app,
        footnotes.map((footnote) => `[^${footnote.id}]: ${footnote.text}`),
        footnotes.map((footnote) => footnote.id)
    );
    if (pickedId==null){
        console.log("Operation canceled by user.");
        log("Operation canceled by user.", 5);
        return;
    }

    const insertion = `[^${pickedId}]`;
    editor.replaceRange(insertion, {line: cursorLine, ch: cursorCh}); // insert [^newId]
    editor.setCursor({line: cursorLine, ch: cursorCh+insertion.length});

    log(`Footnote [^${pickedId}] added successfully.`, 5);
}