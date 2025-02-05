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

export function log(msg: string, duration = 0) {
	const notice = new Notice(msg, duration*1000);
	return notice;
}

export function error(msg: string) {
	const notice = new Notice(msg, 0);
	throw new Error(msg);
}

export function max(a: number, b: number): number {
	return a>b? a : b;
}