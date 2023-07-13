"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memento = exports.DepNodeProvider = void 0;
const vscode = require("vscode");
const path = require("path");
class DepNodeProvider {
    constructor(allMementos) {
        this.allMementos = allMementos;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.allMementos = allMementos;
    }
    addMemento(memento) {
        this.allMementos.push(memento);
    }
    clearmementos() {
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
            childrens.push(new Memento(_memento, "soy una desc"));
        }
        return childrens;
    }
}
exports.DepNodeProvider = DepNodeProvider;
class Memento extends vscode.TreeItem {
    constructor(label, description) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.description = description;
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
        this.contextValue = 'dependency';
        this.tooltip = `${this.label} - ${this.description}`;
    }
}
exports.Memento = Memento;
//# sourceMappingURL=nodeDependencies.js.map