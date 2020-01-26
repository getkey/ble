import * as pan from 'src/epics/pan';
import * as zoom from 'src/epics/zoom';
import * as edit from 'src/epics/edit';

export default [
	...Object.values(pan),
	...Object.values(zoom),
	...Object.values(edit),
];
