import { 
	App, 
	Editor,
	htmlToMarkdown
} from 'obsidian';

import {inputPrompt} from './gui/inputPrompt'
import {suggester} from './gui/suggester'
import {log, error, max, getEditor} from './utils';