import Link from "next/link"
import { convertTempToKelvin, WeatherReport } from "../../../api/api"
import { Dates } from "../../utils/dates"

export const WheatherReportList = ({
	reports,
	onReportDelete,
}: {
	reports: WeatherReport[]
	onReportDelete: (report: WeatherReport) => void
}) => {
	return (
		<ul className="flex flex-col flex-nowrap gap-4">
			{reports.map((item, i) => (
				<li key={i}>
					<WeatherReportListItem
						item={item}
						onReportDelete={onReportDelete}
					/>
				</li>
			))}
		</ul>
	)
}

export const WeatherReportListItem = ({
	item,
	onReportDelete,
}: {
	item: WeatherReport
	onReportDelete: (report: WeatherReport) => void
}) => {
	return (
		<div className="bg-base-100 rounded p-4 shadow-sm">
			<ul>
				<li>From: {item.city}</li>
				<li>
					Date:{" "}
					{Dates.format(new Date(item.date), "YYYY.MM.DD HH:mm:ss")}
				</li>
				<li>
					Temperature:{" "}
					{Math.round(
						convertTempToKelvin(item.temperature, item.unit) * 100,
					) / 100}
					K
				</li>
			</ul>

			<div className="my-2"></div>

			<div className="join join-vertical lg:join-horizontal w-full">
				<Link
					href={`/edit?id=${encodeURIComponent(item.id)}`}
					className="join-item btn btn-primary grow"
				>
					Edit
				</Link>
				<button
					onClick={() => {
						onReportDelete(item)
					}}
					className="join-item btn btn-error grow"
				>
					Delete
				</button>
			</div>
		</div>
	)
}
