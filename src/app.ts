import { Application, SCALE_MODES } from 'pixi.js';

import ps2p from 'static/font/ps2p.fnt';
import 'static/font/ps2p_0.png';
import { store } from 'src/models/';

const app = new Application({
	backgroundColor: 0x121f1f,
	resizeTo: document.body,
});
app.loader.add('pressstart2p', ps2p)
	.load((loader, resources) => {
		if (!resources.pressstart2p) return;

		resources.pressstart2p.children.forEach((child) => {
			if (!child.texture) return;
			child.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
		});
		store.editor.setFontLoaded();
	});
// see https://stackoverflow.com/a/12886479
app.view.setAttribute('tabindex', '-1');
// has to be put in the DOM manually
// https://github.com/michalochman/react-pixi-fiber/blob/844c01709d4ffda925aca2263b522253a4ac0ffb/src/Stage.js#L121
document.body.appendChild(app.view);

export default app;
