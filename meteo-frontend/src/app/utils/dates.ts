export class BadDateError extends Error {
	public name = "DateFormatError"
}

export class Dates {
	private constructor() {}

	public static readonly formatter = (
		format: string,
	): ((date: Date) => string) => {
		return (date: Date) => {
			if (isNaN(date.getTime())) {
				throw new BadDateError(
					`Date has invalid value and can't be formatted`,
				)
			}

			const year: string = date.getFullYear().toString()
			const month: string = String(date.getMonth() + 1).padStart(2, "0") // Months are zero-based
			const fullMonth: string = date.toLocaleString("default", {
				month: "long",
			}) // Full month name
			const shortMonth: string = date.toLocaleString("default", {
				month: "short",
			}) // Abbreviated month name
			const day: string = String(date.getDate()).padStart(2, "0")
			const hour: string = String(date.getHours()).padStart(2, "0")
			const minute: string = String(date.getMinutes()).padStart(2, "0")
			const second: string = String(date.getSeconds()).padStart(2, "0")
			const ampm: string = date.getHours() >= 12 ? "PM" : "AM" // AM/PM
			const hour12: string = String(date.getHours() % 12 || 12).padStart(
				2,
				"0",
			) // 12-hour format hour
			const weekday: string = date.toLocaleString("default", {
				weekday: "long",
			}) // Full weekday name
			const shortWeekday: string = date.toLocaleString("default", {
				weekday: "short",
			}) // Abbreviated weekday name

			// TODO(teawithsand): instead of series of replaces, here:
			//  1. split input string into tokens
			//  2. Handle each token individually
			return format
				.replace(/YYYY/g, year)
				.replace(/YY/g, year.slice(-2)) // Last two digits of the year
				.replace(/MMMM/g, fullMonth)
				.replace(/MMM/g, shortMonth)
				.replace(/MM/g, month)
				.replace(/DD/g, day)
				.replace(/HH/g, hour)
				.replace(/hh/g, hour12)
				.replace(/mm/g, minute)
				.replace(/ss/g, second)
				.replace(/A/g, ampm) // AM/PM
				.replace(/dddd/g, weekday) // Full weekday name
				.replace(/ddd/g, shortWeekday) // Abbreviated weekday name
		}
	}

	public static readonly format = (date: Date, formatString: string) => {
		return this.formatter(formatString)(date)
	}
}
