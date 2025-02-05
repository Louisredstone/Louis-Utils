import { 
	App, 
	Editor, 
	MarkdownView, 
	Modal, 
	Notice, 
	Plugin, 
	PluginSettingTab, 
	Setting, 
	htmlToMarkdown
} from 'obsidian';
import {insertNewFootNote} from './footnote';

// Remember to rename these classes and interfaces!

interface LouisUtilsPluginSettings {
	louisUtilsPluginSetting: string;
}

const DEFAULT_SETTINGS: LouisUtilsPluginSettings = {
	louisUtilsPluginSetting: 'default'
}

function log(msg: string, duration = 0) {
	var notice = new Notice(msg, duration*1000);
	return notice;
}

export default class LouisUtilsPlugin extends Plugin {
	settings: LouisUtilsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('pocket-knife', 'Louis\' Utils', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Debugging!'); // DELETEME
			insertNewFootNote(this.app);
			// TODO: Provide all commands and functionality in a modal (panel).
		});
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('louis-utils-plugin-ribbon-class'); // css, if needed

		// DELETEME
		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// DEV MEMO:
		// Add footnote
		// Add Timestamp
		// Change List Item Type
		// Convert Full-Width Characters to Half-Width Characters
		// Insert Exist Footnote

		this.addCommand({
			id: 'insert-new-footnote',
			name: 'Insert New Footnote',
			callback: () => {
				insertNewFootNote(this.app);
			}
		});

		this.addCommand({
			id: 'debug-function',
			name: 'Debug Function',
			callback: () => {
				const activeEditor = this.app.workspace.activeEditor!;
				const editor = activeEditor.editor!;
				new Notice('lastLine: '+editor.lastLine());
				new Notice('lastLineText: '+editor.getLine(editor.lastLine()))
			}
		});


		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new LouisUtilsModal(this.app).open();
			}
		});
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new LouisUtilsModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LouisUtilsSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// async function add_footnote(app: App){
// 	// # prepare global variables
//     console.log("prepare global variables");
//     var vault = app.vault;
//     var cache = app.metadataCache;

//     // # get current note
//     console.log("get current note");
//     var activeEditor = app.workspace.activeEditor!;
//     var editor = activeEditor.editor!;
//     const currentNoteTFile = activeEditor.file;
//     if (currentNoteTFile == null) {
//         log("No active note found, please open a note first.");
//         return;
//     }
//     console.log("current note: " + currentNoteTFile.path);

//     // # read note content
//     console.log("read note content");
//     var fileContent = await vault.read(currentNoteTFile);
//     fileContent = fileContent.trimEnd();
//     // var frontMatterInfo = obsidian.getFrontMatterInfo(fileContent);
//     // var noteContent = fileContent.substring(frontMatterInfo.to).trimEnd();
//     var lines = fileContent.split("\n");

//     // # find footnotes
//     var footnotes=[];
//     var lineIndex = 0;
//     for (var lineIndex=lines.length-1; lineIndex>=0; lineIndex--){
//         var line = lines[lineIndex];
//         // e.g.: [^1]: text
//         var match = line.match(/\[\^([\d\w]+)\]\:/);
//         if (match) {
//             var footnoteId = match[1];
//             var footnoteText = line.substring(match.index!+match[0].length).trim();
//             footnotes.push({id: footnoteId, text: footnoteText});
//         }
//         else break;
//     }
//     var footnotes_txtid = footnotes.filter(f =>  isNaN(Number(f.id)));
//     var footnotes_nid = footnotes.filter(f => !isNaN(Number(f.id)));
//     footnotes_txtid.sort((a, b) => a.id.localeCompare(b.id));
//     footnotes_nid.sort((a, b) => a.id.localeCompare(b.id));

//     // # check cursor position
//     console.log("check cursor position");
//     const {line: cursorLine, ch: cursorCh} = editor.getCursor()
//     if (cursorLine>=lineIndex+1) {
//         log("Cursor should not be in the region of footnotes.");
//         return;
//     }

//     // # calculate next footnote id
//     console.log("calculate next footnote id");
//     var newId = 1;
//     if (footnotes_nid.length>0)
//         newId = parseInt(footnotes_nid[footnotes_nid.length-1].id)+1;

//     // # get content from clipboard
//     console.log("get content from clipboard");
//     var defaultFootnoteText = "";
//     if (navigator.clipboard){
//         var item = await navigator.clipboard.read();
//         var clipHTML = item[0].types.includes('text/html')? (await (await item[0].getType('text/html')).text()).trim() : "";
//         var clipText = item[0].types.includes('text/plain')? (await (await item[0].getType('text/plain')).text()).trim() : "";
//         var clipHTMLtoText = htmlToMarkdown(clipHTML).trim()
//         var clip = clipText.length>clipHTMLtoText.length? clipText : clipHTMLtoText;
//         var clipLines = clip.split("\n");
//         if (clipLines.length==1)
//             defaultFootnoteText = clip;
//     }

//     // # add new footnote
//     console.log("add new footnote");
//     var str = await quickAddApi.inputPrompt("Please input the footnote text", defaultFootnoteText, '');

//     if (str==null || str.trim()=="" && defaultFootnoteText==""){
//         console.log("Operation canceled by user.");
//         log("Operation canceled by user.", 5);
//         return;
//     } else if (str.trim()==""){
//         str = defaultFootnoteText;
//     }
//     var newFileLines = lines.slice(0, lineIndex+1);
//     if (footnotes.length==0){
//         newFileLines = newFileLines.join("\n").trimEnd().split("\n");
//         newFileLines.push('');
//     }
//     newFileLines = newFileLines.concat(footnotes_nid.map(f => `[^${f.id}]: ${f.text}`));
//     newFileLines = newFileLines.concat([`[^${newId}]: ${str.trim()}`]);
//     newFileLines = newFileLines.concat(footnotes_txtid.map(f => `[^${f.id}]: ${f.text}`));
//     var insertion = `[^${newId}]`;
//     newFileLines[cursorLine] =
//         newFileLines[cursorLine].substring(0, cursorCh)
//         + insertion
//         + newFileLines[cursorLine].substring(cursorCh);
//     var newFileContent = newFileLines.join("\n");
//     await vault.modify(currentNoteTFile, newFileContent);
    
//     editor.setCursor({line: cursorLine, ch: cursorCh+insertion.length});

//     log(`Footnote [^${newId}] added successfully.`, 5);
// }

class LouisUtilsModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Greetings! But this modal has no functionality yet.');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class LouisUtilsSettingTab extends PluginSettingTab {
	plugin: LouisUtilsPlugin;

	constructor(app: App, plugin: LouisUtilsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting Placeholder #1')
			.setDesc('It\'s from template. No functionality yet.')
			.addText(text => text
				.setPlaceholder('Enter your value')
				.setValue(this.plugin.settings.louisUtilsPluginSetting)
				.onChange(async (value) => {
					this.plugin.settings.louisUtilsPluginSetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
