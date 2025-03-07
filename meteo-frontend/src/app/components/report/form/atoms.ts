import { atom } from "jotai"
import { WeatherReport } from "../../../../api/api"
import {
	FormAtomsBuilder,
	FormAtomsDelegateBase,
	FormErrorBagBuilder,
} from "../../../form"
import { inPlaceCall } from "../../../utils/lang"

export class WeatherReportFormAtoms extends FormAtomsDelegateBase<WeatherReport> {
	public readonly setWeatherReport
	constructor() {
		super(
			inPlaceCall(() => {
				const builder =
					FormAtomsBuilder.fromDefaultValues<WeatherReport>({
						id: "",
						city: "",
						date: "",
						temperature: 0,
						unit: "C",
					})

				builder.setFieldValidator("temperature", temperature =>
					atom(get =>
						FormErrorBagBuilder.empty()
							.addErrorTruthy(
								!isFinite(get(temperature))
									? "Enter valid temperature"
									: "",
							)
							.build(),
					),
				)
				builder.setFieldValidator("city", city =>
					atom(get =>
						FormErrorBagBuilder.empty()
							.addErrorTruthy(
								get(city).trim() === ""
									? "Valid city must be provided"
									: "",
							)
							.build(),
					),
				)
				builder.setFieldValidator("date", date =>
					atom(get =>
						FormErrorBagBuilder.empty()
							.addErrorTruthy(
								get(date).trim() === ""
									? "Valid date must be provided"
									: "",
							)
							.build(),
					),
				)

				return builder.buildForm()
			}),
		)

		this.setWeatherReport = atom(
			null,
			(_get, set, report: WeatherReport) => {
				set(this.fields.id.value, report.id)
				set(this.fields.city.value, report.city)
				set(this.fields.date.value, report.date)
				set(this.fields.temperature.value, report.temperature)
				set(this.fields.unit.value, report.unit)
			},
		)
	}
}
