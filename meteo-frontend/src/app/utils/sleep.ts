/**
 * Warning: leaks promises, if user drops them without waiting for them.
 */
export const simpleSleep = (ms: number): Promise<void> =>
	new Promise(resolve => setTimeout(resolve, ms))
