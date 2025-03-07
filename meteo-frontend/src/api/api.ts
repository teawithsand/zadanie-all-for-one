const server =
	process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:3000/api"

export interface WeatherReport {
	id: string
	temperature: number
	unit: TemperatureUnit
	city: string
	date: string
}
export type TemperatureUnit = "C" | "K" | "F"

export const convertTempToKelvin = (
	temp: number,
	unit: TemperatureUnit,
): number => {
	if (unit === "K") {
		return temp
	} else if (unit === "C") {
		return temp + 273.15
	} else if (unit === "F") {
		return ((temp - 32) * 5) / 9 + 273.15
	} else {
		throw new Error("Unsupported temperature unit")
	}
}

export class API {
	private constructor() {}

	public static readonly list = async (): Promise<WeatherReport[]> => {
        const res = await fetch(`${server}/reports`)
        const body = await res.json()
        return body
    }
}
