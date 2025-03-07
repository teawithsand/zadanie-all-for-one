import { useEffect, useRef, useState } from "react"

/**
 * Works like useMemo with empty argument list, but it's guaranteed not to "forget" computed value.
 *
 * @param computer Function computing value. Note: if it changes, it won't retrigger. Only deps count.
 */
export const useComputed = <T>(computer: () => T): T => {
	const [value, setValue] = useState(computer)
	const isFirst = useRef(true)
	useEffect(() => {
		if (!isFirst.current) {
			setValue(computer())
			isFirst.current = false
		}
	}, [])

	return value
}
