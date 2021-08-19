import { types, Instance } from 'mobx-state-tree';

export const doorDestinationRegex = /(?:(?:https:\/\/)?bombhopper\.io\/\?level=)?([0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})/;

const DestinationParams = types.model({
	destination: types.maybe(types.string),
}).actions((self) => ({
	setDestination(destination?: string): void {
		if (destination === undefined) {
			self.destination = undefined;
			return;
		}

		const doorIdMatches = doorDestinationRegex.exec(destination);

		if (doorIdMatches === null || doorIdMatches.length < 1) return;

		self.destination = doorIdMatches[1];
	},
}));

export default DestinationParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDestinationParams extends Instance<typeof DestinationParams> {}
