# Obsidian Louis' Utils

This is a plugin for Obsidian (https://obsidian.md).

# Features

This plugin provides the following features as commands (in obsidian):
- Add timestamp to the current line.
- Insert an in-place uppernote.
- Insert a simple annotation link converted from zotero annotation link.
- Insert a new footnote.
- Insert an existing footnote.
- Cycle list item type.
- Convert chinese (full-width) punctuation to half-width.

# Usage

## Add timestamp to the current line

Command: `Louis' Utils: Set Timestamp`

Effect example 1 (add timestamp):
```text
Normal text.
↓
12:34 Normal text.
```

Effect example 2 (update timestamp):
```text
12:34 Normal text.
↓
12:35 Normal text.
```

Effect example 3 (support task items):
```text
- Task item
↓
- 12:34 Task item
```

Effect example 4 (support indent):
```text
    - Task item
↓
    - 12:34 Task item
```

## Insert an in-place uppernote

Command: `Louis' Utils: Insert In-place Uppernote`

Effect example 1:
```text
Normal text. (cursor here)
↓
Normal text. ^[some content] (cursor here)
```

Effect example 2: 
```text
Normal text. (cursor here)
↓
Normal text. ^[(cursor here)]
```
You can insert an empty uppernote by running the command and input a space before pressing enter.
The cursor will be moved into the new uppernote so that you can edit it.

## Insert a simple annotation link converted from zotero annotation link

Command: `Louis' Utils: Insert Simple Annotation Link`

Effect example:
```text
“text” ([Author et. al, 2022](zotero://select/library/items/SQLKEY)) ([pdf](zotero://open-pdf/library/items/SQLKEY?sel=p%3Anth-child(12)&annotation=SQLKEY))
↓
[text](zotero://open-pdf/library/items/SQLKEY?sel=p%3Anth-child(12)&annotation=SQLKEY)
```
Content in the clipboard will be detected automatically. If not detected, an input prompt will be shown.
    

## Insert a new footnote

Command: `Louis' Utils: Insert New Footnote`

Effect example 1 (add a new footnote while the bottom is empty):
```text
Normal text. (cursor here)
...
EOF
↓
Normal text. [^1]
...
[^1]: Footnote content.
EOF
```

Effect example 2 (if there exists footnotes, sort them.):
```text
Normal text. (cursor here)
...
[^3]: Footnote 3.
[^1]: Footnote 1.
[^beef]: Footnote beef.
EOF
↓
Normal text. [^4]
...
[^1]: Footnote 1.
[^3]: Footnote 3.
[^4]: Footnote 4.
[^beef]: Footnote beef.
EOF
```
Need to mention that the new footnote id is increased by 1 from the largest footnote id, even if there are gaps in the id sequence.

Effect example 3 (safety):
```text
Normal text.
...
[^1]: Footnote 1.
[^2]: Footnote 2. (cursor here)
[^3]: Footnote 3.
EOF
↓
<Raise an error>
```

We do not support footnote id inside the footnote content. If you really need to do so, do it manually.

## Insert an existing footnote

Command: `Louis' Utils: Insert Existing Footnote`

Effect example:
```text
Normal text. (cursor here)
...
[^1]: Footnote 1.
[^2]: Footnote 2.
EOF
↓ (User selects footnote 2)
Normal text. [^2]
...
[^1]: Footnote 1.
[^2]: Footnote 2.
EOF
```

Again, we do not support footnote id inside the footnote content. If you really need to do so, do it manually.

## Cycle list item type

Command: `Louis' Utils: Cycle List Item Type`

Effect example:
```text
- Task item
↓
- [ ] Task item
↓
- [x] Task item
↓
- × Task item
↓
- Task item
```

Need to mention that you may select multiple lines and run the command on them all at once.

## Convert chinese (full-width) punctuation to half-width

Command: `Louis' Utils: Convert Full-Width to Half-Width`

Effect example:
```text
祝您身体健康，再见！
↓
祝您身体健康, 再见!
```

This command is useful if you prefers to use half-width punctuation with chinese characters.