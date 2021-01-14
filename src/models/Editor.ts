import { types, OnReferenceInvalidatedEvent } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import Vertex, { IVertex } from 'src/models/Vertex';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';
import { AddType } from 'src/types/entity';
import Entity, { IEntity } from 'src/models/Entity';
import Block from 'src/models/Block';

const Editor = types.model({
	position: types.optional(Point, {
		x: 400,
		y: 600,
	}),
	scale: 1,
	mode: types.optional(
		types.enumeration(Object.values(EditorMode)),
		EditorMode.select,
	),
	panning: false,
	gridCellSize: 60,
	selectedEntity: types.union(
		types.safeReference(Entity, {
			// TODO: remove @ts-ignore when https://github.com/mobxjs/mobx-state-tree/pull/1610 is merged
			// @ts-ignore
			onInvalidated({ parent }: OnReferenceInvalidatedEvent<IEntity>) {
				parent.setMode(EditorMode.select);
			},
		}),
		types.safeReference(Vertex),
	),
	clipboard: types.maybe(Entity),
	addType: types.optional(
		types.enumeration(Object.values(AddType)),
		AddType.normalBlock,
	),
	screen: types.optional(
		types.model({
			width: types.number,
			height: types.number,
		}),
		{
			width: window.innerWidth,
			height: window.innerHeight,
		}
	),
	fontLoaded: false,
}).actions((self) => ({
	setScale(scale: number): void {
		self.scale = scale;
	},
	setMode(mode: EditorMode): void {
		self.mode = mode;
	},
	setPanning(panning: boolean): void {
		self.panning = panning;
	},
	setGridCellSize(cellSize: number): void {
		self.gridCellSize = cellSize;
	},
	setAddType(addType: AddType): void {
		self.addType = addType;
	},
	setScreenSize(width: number, height: number): void {
		self.screen.width = width;
		self.screen.height = height;
	},
	setFontLoaded(): void {
		self.fontLoaded = true;
	},
	setClipboard(copied: IEntity): void {
		self.clipboard = copied;
	},
})).actions((self) => ({
	setSelectedEntity(selected: IEntity | IVertex | undefined): void {
		if (selected === self.selectedEntity) return;

		// before setting the new selected entity, we cleanup the previous one,
		// which is potentially in an invalid state (likely because it was being created)

		const replacedBySibling = Vertex.is(selected) && Vertex.is(self.selectedEntity) && selected.parentBlock === self.selectedEntity.parentBlock;
		const replacedByParent = Vertex.is(self.selectedEntity) && self.selectedEntity.parentBlock === selected;

		if (Vertex.is(self.selectedEntity) && !replacedBySibling && !replacedByParent) {
			self.selectedEntity.parentBlock.cleanInvalid();
		}

		// do not delete if we replace a block by one of its vertices
		const replacedByChild = Vertex.is(selected) && Block.is(self.selectedEntity) && selected.parentBlock === self.selectedEntity;
		if (self.selectedEntity !== undefined && 'cleanInvalid' in self.selectedEntity && !replacedByChild) {
			self.selectedEntity.cleanInvalid();
		}

		// now we can cary on normally

		if (selected === undefined && self.mode === EditorMode.addVertex) {
			self.setMode(EditorMode.select);
		}

		self.selectedEntity = selected;
	},
})).views((self) => ({
	get cameraPos(): GenericPoint {
		return {
			x: Math.round(self.screen.width/2),
			y: Math.round(self.screen.height/2),
		};
	},
	get globalCursor(): string {
		if (self.panning) return 'all-scroll';

		switch(self.mode) {
			case EditorMode.addBlock:
			case EditorMode.addVertex:
				return 'crosshair';
				break;
		}

		return 'auto';
	},
	get availableModes(): Array<EditorMode> {
		if (Block.is(self.selectedEntity)) {
			return Object.values(EditorMode);
		}

		return Object.values(EditorMode).filter((mode) => mode !== EditorMode.addVertex);
	},
})).views((self) => ({
	screenToWorld(screenPos: GenericPoint): GenericPoint {
		return {
			x: self.position.x + (screenPos.x - self.cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - self.cameraPos.y) * (1/self.scale),
		};
	},
	get scaleAsPixiPoint(): PixiPoint {
		return new PixiPoint(self.scale, self.scale);
	},
}));
export default Editor;
