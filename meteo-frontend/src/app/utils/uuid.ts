const isBrowser = typeof crypto !== "undefined"

/**
 * Generates UUID as string. Uses crypto.getRandomValues by default. Fallbacks to Math.random if not available,
 * thus this function is not suitable for secure usage in general.
 */
export const generateUUID = () => {
	if (isBrowser) {
		return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11)
			.toString()
			.replace(/[018]/g, (c: any) =>
				(
					c ^
					(crypto.getRandomValues(new Uint8Array(1))[0] &
						(15 >> (c / 4)))
				).toString(16),
			) as string
	} else {
		let d = new Date().getTime() //Timestamp
		let d2 =
			(typeof performance !== "undefined" &&
				performance.now &&
				performance.now() * 1000) ||
			0 //Time in microseconds since page-load or 0 if unsupported
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				let r = Math.random() * 16 //random number between 0 and 16
				if (d > 0) {
					//Use timestamp until depleted
					r = (d + r) % 16 | 0
					d = Math.floor(d / 16)
				} else {
					//Use microseconds since page-load if supported
					r = (d2 + r) % 16 | 0
					d2 = Math.floor(d2 / 16)
				}
				return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
			},
		)
	}
}

export const generateUUIDSecure = () => {
	if (!isBrowser)
		throw new Error(
			"Can't access crypto global required to generate UUId securely",
		)
	return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11)
		.toString()
		.replace(/[018]/g, (c: any) =>
			(
				c ^
				(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
			).toString(16),
		) as string
}
