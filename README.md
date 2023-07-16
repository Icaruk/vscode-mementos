![](src\icons\logo.png)

**Mementos** is a VS Code extension that ehances productivity by providing visual cues and easy navigation to important areas with specific and configurable comments.


# Table of contents

[TOC]

# Features

- 👁️ Provides **visual cue** for specific comments.
- 🦘Sidebar view to **jump** between mementos on the active file.
- 🗑️ Delete mementos with 1 click to keep your **code clean**.
- ✅ Mementos are **shared with your team** because they are `//comments`.


 **Visual cues**
![](https://i.gyazo.com/5c456d33d01a756db72becbf495d9ffb.png)

**Sidebar view**
![](https://i.gyazo.com/685615854e0312c527dbfde2fed21665.png)

**Navigate with 1 click**
![](https://i.gyazo.com/a592f556328817affd7c9d8ee72bb73b.gif)

**Colorizable mementos**
> It can be disabled
> 
![](https://i.gyazo.com/356ea1008e44ec8966081dfb154b7702.png)
![](https://i.gyazo.com/24e17192a24d5b05dd73beae1c0efff5.png)

**Easy deletable**
![](https://i.gyazo.com/57e90b0b498aba237e535a5ae0419704.gif)



# Extension Settings

This extension contributes the following settings:

* `mementos.comment.triggerWord`: The trigger word that determines if the comment is a memento. The default structure is: `// @mem:title`.
* `mementos.comment.triggerWordSeparator`: The separator between the trigger word and the title. The default structure is: `// @mem:title`.
* `mementos.comment.colorizeComment`: Whether or not to colorize the memento text. Default is `true`.
* `mementos.gutter.defaultColor`: Default RGB color for mementos that don't fit a text criteria. Default is `220,220,220`. The color should be in the format 'R,G,B', where R, G, and B are integers between 0 and 255.
* `mementos.gutter.mementoTitles.red`: A list of trigger words. When any of these words is found in a memento, it will become red.
* `mementos.gutter.mementoTitles.orange`: A list of trigger words. When any of these words is found in a memento, it will become orange.
* `mementos.gutter.mementoTitles.yellow`: A list of trigger words. When any of these words is found in a memento, it will become yellow.
* `mementos.gutter.mementoTitles.blue`: A list of trigger words. When any of these words is found in a memento, it will become blue.
* `mementos.gutter.mementoTitles.green`: A list of trigger words. When any of these words is found in a memento, it will become green.
* `mementos.gutter.mementoTitles.cyan`: A list of trigger words. When any of these words is found in a memento, it will become cyan.
* `mementos.gutter.mementoTitles.purple`: A list of trigger words. When any of these words is found in a memento, it will become purple.
* `mementos.gutter.mementoTitles.pink`: A list of trigger words. When any of these words is found in a memento, it will become pink.

These settings allow you to customize the appearance and behavior of the Mementos extension according to your preferences. You can modify these values from your editor's settings to adjust the extension's functionality.

# Known Issues

.
