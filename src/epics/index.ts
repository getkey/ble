import * as pan from 'src/epics/pan';
import * as zoom from 'src/epics/zoom';
import * as select from 'src/epics/select';
import * as deleteEpics from 'src/epics/delete'; // ay delete is a JS keyword
import * as add from 'src/epics/add';
import * as clipboard from 'src/epics/clipboard';
import * as timeTravel from 'src/epics/timeTravel';

export default [
	...Object.values(pan),
	...Object.values(zoom),
	...Object.values(select),
	...Object.values(deleteEpics),
	...Object.values(add),
	...Object.values(clipboard),
	...Object.values(timeTravel),
];
