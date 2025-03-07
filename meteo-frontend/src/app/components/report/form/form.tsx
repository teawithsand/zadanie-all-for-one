import {
	convertKelvinToTempUnit,
	convertTempToKelvin,
	TemperatureUnit,
	WeatherReport,
} from "../../../../api/api"
import { FormErrorBag, useForm, useFormField } from "../../../form"
import { WeatherReportFormAtoms } from "./atoms"

const ErrorsDisplay = ({ bag }: { bag: FormErrorBag }) => {
	if (bag.isEmpty) return <></>

	return (
		<ul className="text-error ml-4 list-disc">
			{bag.toArray().map((e, i) => (
				<li key={i}>{e.toString()}</li>
			))}
		</ul>
	)
}

// TODO(teawithsand): make this accept atoms
export const WeatherReportForm = ({
	atoms,
	onSubmit,
}: {
	atoms: WeatherReportFormAtoms
	onSubmit: (data: WeatherReport) => Promise<void>
}) => {
	const form = useForm(atoms)
	const id = useFormField(atoms.fields.id)
	const city = useFormField(atoms.fields.city)
	const date = useFormField(atoms.fields.date)
	const temperature = useFormField(atoms.fields.temperature)
	const unit = useFormField(atoms.fields.unit)

	return (
		<form
			className="grid grid-cols-[1fr] justify-center gap-4 lg:grid-cols-[400px]"
			onSubmit={e => {
				e.preventDefault()
				if (!form.hasErrors || form.isSubmitting) {
					form.submit(async report => {
						await onSubmit({
							...report,
							city: report.city.trim(),
						})
					})
				}
			}}
		>
			{form.lastSubmitError ? (
				<div className="alert alert-error">
					Oh no! Something went wrong, when you've tried to save
					report! {form.lastSubmitError?.toString()}
				</div>
			) : null}

			<fieldset className="fieldset">
				<legend className="fieldset-legend">City name</legend>
				<input
					type="text"
					value={city.value}
					onChange={e => {
						city.set(e.target.value)
					}}
					className={`input w-full ${city.errors.isEmpty ? "" : "input-error"}`}
					placeholder="City name"
				/>
				<ErrorsDisplay bag={city.errors} />
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Date</legend>
				<input
					type="date"
					className={`input w-full ${date.errors.isEmpty ? "" : "input-error"}`}
					value={date.value}
					onChange={e => {
						date.set(e.target.value)
					}}
					placeholder="Date"
				/>
				<ErrorsDisplay bag={date.errors} />
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Temperature</legend>
				<input
					type="number"
					inputMode="numeric"
					className={`input w-full ${temperature.errors.isEmpty ? "" : "input-error"}`}
					value={temperature.value}
					onChange={e => {
						temperature.set(parseFloat(e.target.value))
					}}
					placeholder="Temperature"
				/>
				<ErrorsDisplay bag={temperature.errors} />
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Temperature Unit</legend>
				<select
					value={unit.value}
					className="select w-full"
					onChange={e => {
						const newUnit = e.target.value as TemperatureUnit
						const currentTemp = convertTempToKelvin(
							temperature.value,
							unit.value,
						)
						const newCurrentTemp = convertKelvinToTempUnit(
							currentTemp,
							newUnit,
						)
						temperature.set(newCurrentTemp)
						unit.set(newUnit)
					}}
				>
					<option value="C">Celcuis degrees</option>
					<option value="F">Farenheit degrees</option>
					<option value="K">Kelvin degrees</option>
				</select>
				<ErrorsDisplay bag={temperature.errors} />
			</fieldset>

			{form.isSubmitting ? (
				<div className="loading loading-spinner loading-lg mx-auto"></div>
			) : null}

			<input
				type="submit"
				value="Save"
				className="btn btn-success w-full"
				disabled={form.hasErrors || form.isSubmitting}
			/>
		</form>
	)
}
