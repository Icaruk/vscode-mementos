import * as vscode from 'vscode';
import { MEMENTOS_ACTION_TREEITEM_CLICK } from './utils/constants';
import {semanticColors, getSemanticColor} from './utils/colors/semanticColors';
import { generateSvg } from './utils/generateSvg';


export interface ICategoryData {
	id: "ALL" | "CURRENT_FILE" | string;
	label: string;
	type: "file" | "color";
	iconPath?: vscode.Uri | vscode.ThemeIcon;
};

export interface IMementoData {
	id: string,
	label: string;
	description: string;
	lineNumber: number;
	filePath: string;
	iconPath?: vscode.Uri;
};



const defaultCategories: ICategoryData[] = [
	{
		id: "CURRENT_FILE",
		label: "Current file",
		type: "file",
		iconPath: new vscode.ThemeIcon("file"),
	},
	// {
	// 	id: "ALL",
	// 	label: "All",
	// 	iconPath: new vscode.ThemeIcon("folder"),
	// },
	{
		id: "RED",
		label: "Red",
		type: "color",
	},
	{
		id: "ORANGE",
		label: "Orange",
		type: "color",
	},
	{
		id: "YELLOW",
		label: "Yellow",
		type: "color",
	},
	{
		id: "GREEN",
		label: "Green",
		type: "color",
	},
	{
		id: "BLUE",
		label: "Blue",
		type: "color",
	},
	{
		id: "PURPLE",
		label: "Purple",
		type: "color",
	},
	{
		id: "PINK",
		label: "Pink",
		type: "color",
	}
];



defaultCategories.forEach( _category => {
	
	const allColors = Object.keys(semanticColors);
	
	if (allColors.includes(_category.id.toLowerCase())) {
		const color = _category.id.toLowerCase();
		
		const {rgb} = getSemanticColor(color);
	
		const svg = generateSvg({
			text: "",
			fillRgb: rgb,
		});
		const iconPath = vscode.Uri.parse(`data:image/svg+xml,${encodeURIComponent(svg)}`);
		
		_category.iconPath = iconPath;
	} else {
		
		// https://code.visualstudio.com/api/references/icons-in-labels#icon-listing
		// const themeIcon = new vscode.ThemeIcon("folder");
		
		// _category.iconPath = themeIcon;
		
	}
	
});



function filterMementosByColor(color: string, mementosList: IMementoData[]): Memento[] {
	
	color = color.toLowerCase();
	const filteredList: Memento[] = [];
	
	mementosList.filter( _memento => _memento.id === color).forEach( _memento => {
		filteredList.push(
			new Memento(
				_memento.label,
				_memento.description,
				_memento.lineNumber,
				_memento.iconPath
			)
		);
	});
	
	return filteredList;
};



export class MementosProvider implements vscode.TreeDataProvider<Category | Memento> {

	private _onDidChangeTreeData: vscode.EventEmitter<Memento | undefined | void> = new vscode.EventEmitter<Memento | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Memento | undefined | void> = this._onDidChangeTreeData.event;
	private categories: ICategoryData[] = [];
	private allMementos: IMementoData[] = [];
	
	constructor() {
		this.categories = defaultCategories;
	};
	
	addMemento(memento: IMementoData): void {
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

	getChildren(element?: Category | Memento): (Category | Memento)[] {
		
		let childrens: (Category | Memento)[] = [];
		const allColors = Object.keys(semanticColors);
		
		// Should show category
		if (!element) {
			for (let _category of this.categories) {
				
				const categoryColor: string = _category.id.toLowerCase();
				
				if (
					allColors.includes(categoryColor) &&
					filterMementosByColor(categoryColor, this.allMementos).length === 0
				) {
					continue;
				};
				
				
				const collapsibleState = _category.id === "CURRENT_FILE" ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
				const iconPath = _category.iconPath;
				
				childrens.push(
					new Category(
						_category.id,
						_category.label,
						iconPath,
						collapsibleState,
					)
				);
			}
		};
		
		// Show show memento
		if (element instanceof Category) {
			
			const categoryColor: string = element.id.toLowerCase();
			
			if (allColors.includes(categoryColor)) {
				for (const _color of Object.keys(semanticColors)) {
					childrens = filterMementosByColor(categoryColor, this.allMementos);
				};
			};
			
			
			if (element.id === "CURRENT_FILE") {
				for (let _memento of this.allMementos) {
					
					const memento = new Memento(
						_memento.label,
						_memento.description,
						_memento.lineNumber,
						_memento.iconPath
					);
					
					childrens.push(memento);
				};
			};
			
		};
		
		return childrens;
		
	};

};

export class Category extends vscode.TreeItem {

	description?: string;
	
	constructor(
		public readonly id: ICategoryData["id"],
		public readonly label: ICategoryData["label"],
		public readonly iconPath?: ICategoryData["iconPath"],
		public readonly collapsibleState?: vscode.TreeItemCollapsibleState,
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		let tooltip = this.label;
		if (this.description) {
			tooltip += ` (${this.description.trim()})`;
		};
		
		this.tooltip = tooltip;
		this.iconPath = this.iconPath;
		
		this.collapsibleState = this.collapsibleState;
		
	};

};

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
		
	};
	
	command = {
		command: MEMENTOS_ACTION_TREEITEM_CLICK,
		title: 'Click',
		arguments: [this], // Pasa el Memento como argumento al comando onclick
	};

}