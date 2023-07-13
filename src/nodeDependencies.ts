import * as vscode from 'vscode';
import * as path from 'path';

export class DepNodeProvider implements vscode.TreeDataProvider<Memento> {

	private _onDidChangeTreeData: vscode.EventEmitter<Memento | undefined | void> = new vscode.EventEmitter<Memento | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Memento | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private allMementos: []) {
		this.allMementos = allMementos;
	}
	
	addMemento(memento: string): void {
		this.allMementos.push(memento);
	}
	clearmementos(): void {
		this.allMementos = [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Memento): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Memento): Memento[] {
		
		const childrens = [];
		
		for (let _memento of this.allMementos) {
			childrens.push(new Memento(_memento, "soy una desc"));
		}
		
		return childrens;
	}

}

export class Memento extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly description: string,
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.tooltip = `${this.label} - ${this.description}`;

	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}