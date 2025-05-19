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
import { insertInplaceUppernote, insertNewFootNote, insertExistFootnote as insertExistingFootnote, insertVocabularyFromZotero } from './insert';
import { convertToHalfWidthCharacters } from './convert_chars';
import { cycleListItemType } from './listitem';
import { setTimestamp } from './timestamp';

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
		// const ribbonIconEl = this.addRibbonIcon('pocket-knife', 'Louis\' Utils', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('Debugging!'); // DELETEME
		// 	insertNewFootNote(this.app);
		// 	// TODO: Provide all commands and functionality in a modal (panel).
		// });
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
			id: 'insert-inplace-uppernote',
			name: 'Insert In-place Uppernote',
			callback: () => {
				insertInplaceUppernote(this.app);
			}
		})

		this.addCommand({
			id: 'insert-vocabulary-from-zotero',
			name: 'Insert Vocabulary from Zotero',
			callback: () => {
				insertVocabularyFromZotero(this.app); 
			}
		})

		this.addCommand({
			id: 'insert-new-footnote',
			name: 'Insert New Footnote',
			callback: () => {
				insertNewFootNote(this.app);
			}
		});

		this.addCommand({
			id: 'insert-existing-footnote',
			name: 'Insert Existing Footnote',
			callback: () => {
				insertExistingFootnote(this.app);
			}
		});

		this.addCommand({
			id: 'convert-full-width-to-half-width',
			name: 'Convert Full-Width to Half-Width',
			callback: () => {
				convertToHalfWidthCharacters(this.app);
			}
		});

		this.addCommand({
			id: 'cycle-list-item-type',
			name: 'Cycle List Item Type',
			callback: () => {
				cycleListItemType(this.app);
			}
		})

		this.addCommand({
			id:'set-timestamp',
			name: 'Set Timestamp',
			callback: () => {
				setTimestamp(this.app);
			}
		})

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new LouisUtilsSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

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
