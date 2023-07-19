"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memento = exports.MementosProvider = void 0;
const vscode = require("vscode");
const constants_1 = require("./utils/constants");
class MementosProvider {
    constructor(allMementos) {
        this.allMementos = allMementos;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.allMementos = allMementos;
    }
    addMemento(memento) {
        this.allMementos.push(memento);
    }
    clearMementos() {
        this.allMementos = [];
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        const childrens = [];
        for (let _memento of this.allMementos) {
            childrens.push(new Memento(_memento.label, _memento.description, _memento.lineNumber, _memento.iconPath));
        }
        return childrens;
    }
}
exports.MementosProvider = MementosProvider;
class Memento extends vscode.TreeItem {
    constructor(label, description, lineNumber, iconPath) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.description = description;
        this.lineNumber = lineNumber;
        this.iconPath = iconPath;
        this.command = {
            command: constants_1.MEMENTOS_ACTION_TREEITEM_CLICK,
            title: 'Click',
            arguments: [this], // Pasa el Memento como argumento al comando onclick
        };
        let tooltip = this.label;
        if (this.description) {
            tooltip += ` (${this.description.trim()})`;
        }
        ;
        this.tooltip = tooltip;
        this.iconPath = this.iconPath;
        // @mem:todo this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }
    ;
}
exports.Memento = Memento;
//# sourceMappingURL=mementos.js.map