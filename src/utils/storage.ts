const basename = 'ble.';

// in case localStorage is blocked
// https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem#Exceptions

// sure ESLint, I don't refer to the FakeStorage directly, but I like to keep its name as a 'tag' on my class if I ever need to inspect it in the debugger
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeStorage = new (class FakeStorage{
	private storage: {
		[key: string]: string;
	};

	constructor() {
		this.storage = {};
	}
	getItem(key: string): string | null {
		return this.storage.hasOwnProperty(key) ? this.storage[key] : null; // eslint-disable-line no-prototype-builtins
	}
	setItem(key: string, value: string): void {
		this.storage[key] = value;
	}
})();

export function getStorage(key: string): unknown | null {
	const fullKey = basename + key;
	let value;
	try {
		value = window.localStorage.getItem(fullKey);
		if (value === null) {
			// this is needed if the storage is full because values will be in put fakeStorage
			// but accessing localStorage won't throw
			value = fakeStorage.getItem(fullKey);
		}
	} catch (err) {
		value = fakeStorage.getItem(fullKey);
	}

	if (value === null) {
		return null;
	}

	return JSON.parse(value);
}

export function setStorage(key: string, value: unknown): void {
	const fullKey = basename + key;
	const val = JSON.stringify(value);
	try {
		window.localStorage.setItem(fullKey, val);
	} catch (err) {
		fakeStorage.setItem(fullKey, val);
	}
}

export function initialSetStorage(key: string, defaultValue: unknown): void {
	if (getStorage(key)) return;

	setStorage(key, defaultValue);
}
