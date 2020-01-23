import * as pan from 'src/epics/pan';
import * as zoom from 'src/epics/zoom';

export default [
	...Object.values(pan),
	...Object.values(zoom),
];
