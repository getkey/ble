import React, { FunctionComponent, useContext, useMemo } from 'react';
import { Graphics, RenderTexture, Renderer, SCALE_MODES } from 'pixi.js';
import { TilingSprite, AppContext } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';

function makeTilingSprite(snapping: number, scale: number, renderer: Renderer): RenderTexture {
	const graphics = new Graphics();
	const lineWidth = Math.ceil(1/scale); // the grid lines should grow when small scale so they don't disapear
	graphics.lineStyle(lineWidth, 0xffffff, 0.25, 0);

	graphics.moveTo(0, snapping);
	graphics.lineTo(0, 0);
	graphics.lineTo(snapping, 0);

	const rt = RenderTexture.create({
		width: snapping,
		height: snapping,
		scaleMode: SCALE_MODES.NEAREST, // it should always look sharp
	});
	renderer.render(graphics, rt);

	return rt;
}

const Level: FunctionComponent = () => {
	const { editor } = useStore();

	const { renderer } = useContext(AppContext);
	const dispatch = useDispatch();

	const { x, y } = editor.screenToWorld({ x: 0, y: 0});
	const gridPos = {
		x: Math.round(x/editor.gridCellSize) * editor.gridCellSize,
		y: Math.round(y/editor.gridCellSize) * editor.gridCellSize,
	};

	const texture = useMemo(() => {
		return makeTilingSprite(editor.gridCellSize, editor.scale, renderer);
	}, [editor.gridCellSize, editor.scale, renderer]);

	const width = renderer.width * (1/editor.scale);
	const height = renderer.height * (1/editor.scale);

	return (
		<TilingSprite
			position={gridPos}
			texture={texture}
			width={width}
			height={height}
			interactive
			pointerdown={(ev): void => dispatch({ type: 'backgroundClick', ev })}
		/>
	);
};
export default observer(Level);
