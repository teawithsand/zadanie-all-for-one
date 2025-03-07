export const inPlaceCall = <T>(fun: () => T): T => fun()
export const throwExpression = (e: any): never => {
	throw e
}
