import { types, Instance } from 'mobx-state-tree';

const DestinationParams = types.model({
	destination: types.maybe(types.string),
}).actions((self) => ({
	setDestination(destination: string): void {
		self.destination = destination;
	},
}));

export default DestinationParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDestinationParams extends Instance<typeof DestinationParams> {}
