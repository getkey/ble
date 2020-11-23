import { css } from '@emotion/react';
import chroma from 'chroma-js';

import { darkSlateGray, primaryColor, selectColor } from 'src/config';

const accentColorHex = chroma(selectColor).hex();
const accentColorShadowHex = chroma(selectColor).alpha(0.8).hex();
const darkSlateGrayHex = chroma(darkSlateGray).hex();
const primaryColorShadowHex = chroma(primaryColor).alpha(0.3).hex();
// has to be darkenend to look good against a clear background
const primaryColorDarkHex = chroma(primaryColor).darken(1).hex();
const primaryColorDarkerHex = chroma(primaryColor).darken(2.5).hex();

export const activeButtonCss = css`
	background-color: ${primaryColorDarkHex};
	color: ${darkSlateGrayHex};
`;

export const buttonCss = css`
	border: 2px solid ${primaryColorDarkHex};
	margin: 5px;
	padding: 8px;
	font-size: 0.9em;
	color: ${primaryColorDarkerHex};
	background-color: transparent;
	border-radius: 4px;
	cursor: pointer;
    transition: background-color 0.1s, color 0.1s, transform 0.05s;
	font-family: sans;
	box-shadow: 0 0 5px ${primaryColorShadowHex}, inset 0 0 5px ${primaryColorShadowHex};

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
	background-color: ${accentColorHex};
	border-color: ${accentColorHex};
	color: white;
	box-shadow: 0 0 5px ${accentColorShadowHex};
`;
