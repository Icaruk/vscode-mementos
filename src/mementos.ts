import * as vscode from 'vscode';
import { MEMENTOS_ACTION_TREEITEM_CLICK } from './utils/constants';



export class MementosProvider implements vscode.TreeDataProvider<Memento> {

	private _onDidChangeTreeData: vscode.EventEmitter<Memento | undefined | void> = new vscode.EventEmitter<Memento | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Memento | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private allMementos: IMemento[]) {
		this.allMementos = allMementos;
	}
	
	addMemento(memento: IMemento): void {
		this.allMementos.push(memento);
	}
	clearMementos(): void {
		this.allMementos = [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Memento): Memento[] {
		
		const childrens = [];
		
		for (let _memento of this.allMementos) {
			childrens.push(
				new Memento(
					_memento.label,
					_memento.description,
					_memento.lineNumber,
					_memento.iconPath
				)
			);
		}
		
		return childrens;
	}

}

export interface IMemento {
	label: string;
	description: string;
	lineNumber: number;
	iconPath?: vscode.Uri;
}

export class Memento extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly description: string,
		public readonly lineNumber: number,
		public readonly iconPath?: vscode.Uri
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		let tooltip = this.label;
		if (this.description) {
			tooltip += ` (${this.description.trim()})`;
		};
		
		this.tooltip = tooltip;
		this.iconPath = this.iconPath;
		
		// @mem:todo this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		
	};
	
	command = {
		command: MEMENTOS_ACTION_TREEITEM_CLICK,
		title: 'Click',
		arguments: [this], // Pasa el Memento como argumento al comando onclick
	};

}