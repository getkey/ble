import { css } from '@emotion/react';
import { color } from 'd3-color';
import { utils } from 'pixi.js';

import { darkSlateGray, primaryColor, selectColor } from 'src/config';

const accentColorStr = utils.hex2string(selectColor);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const accentColorShadow = color(utils.hex2string(selectColor))!;
accentColorShadow.opacity = 0.8;
const accentColorShadowStr = accentColorShadow.formatRgb();

const darkSlateGrayStr = utils.hex2string(darkSlateGray);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const primaryColorShadow = color(utils.hex2string(primaryColor))!;
primaryColorShadow.opacity = 0.3;
const primaryColorShadowStr = primaryColorShadow.formatRgb();

// has to be darkenend to look good against a clear background
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const primaryColorDarkStr = color(utils.hex2string(primaryColor))!.darker(0.75).formatRgb();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const primaryColorDarkerStr = color(utils.hex2string(primaryColor))!.darker(2).formatRgb();

export const activeButtonCss = css`
	background-color: ${primaryColorDarkStr};
	color: ${darkSlateGrayStr};
`;

export const buttonCss = css`
	border: 2px solid ${primaryColorDarkStr};
	margin: 5px;
	padding: 8px;
	font-size: 0.9em;
	color: ${primaryColorDarkerStr};
	background-color: transparent;
	border-radius: 4px;
	cursor: pointer;
    transition: background-color 0.1s, color 0.1s, transform 0.05s;
	font-family: sans;
	box-shadow: 0 0 5px ${primaryColorShadowStr}, inset 0 0 5px ${primaryColorShadowStr};

	&:hover {
		transform: scale(1.05);
	}

	&:active {
		${activeButtonCss}
	}

	&:disabled {
		border-color: grey;
		color: grey;
		box-shadow: none;
	}
`;

export const primaryButtonCss = css`
	${buttonCss}
	background-color: ${accentColorStr};
	border-color: ${accentColorStr};
	color: white;
	box-shadow: 0 0 5px ${accentColorShadowStr};
`;
