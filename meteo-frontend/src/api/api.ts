// This Line is a hack
// in the frontend int evalutates to "/api"
// on the backend it evalutes to whatever is this env var
// But redirecting is set up in a way, that each valid endpoint of this frontend server is a valid endpoint of the backend server
// so this works
const server =
	process?.env?.BACKEND_SERVER_ENDPOINT || "/api"

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

export const convertKelvinToTempUnit = (
	temp: number,
	unit: TemperatureUnit,
): number => {
	if (unit === "K") {
		return temp
	} else if (unit === "C") {
		return temp - 273.15
	} else if (unit === "F") {
		return (temp - 273.15) * (9 / 5) + 32
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

	public static readonly get = async (
		id: string,
	): Promise<WeatherReport | null> => {
		if (!/^[a-zA-Z0-9-_]*$/.test(id)) {
			throw new Error(`Invalid ID provided`)
		}

		const res = await fetch(`${server}/reports/${id}`)
		if (!res.ok) {
			return null
		}
		const body = await res.json()
		return body
	}

	public static readonly edit = async (
		report: WeatherReport,
	): Promise<void> => {
		if (!/^[a-zA-Z0-9-_]*$/.test(report.id)) {
			throw new Error(`Invalid ID provided`)
		}
		await fetch(`${server}/reports/${report.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(report),
		})
	}

	public static readonly create = async (
		report: WeatherReport,
	): Promise<void> => {
		await fetch(`${server}/reports`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(report),
		})
	}

	public static readonly delete = async (id: string): Promise<void> => {
		if (!/^[a-zA-Z0-9-_]*$/.test(id)) {
			throw new Error(`Invalid ID provided`)
		}

		await fetch(`${server}/reports/${id}`, {
			method: "DELETE",
		})
	}
}
