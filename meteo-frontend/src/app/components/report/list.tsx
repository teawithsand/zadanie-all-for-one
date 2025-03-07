import Link from "next/link"
import { convertTempToKelvin, WeatherReport } from "../../../api/api"
import { Dates } from "../../utils/dates"

export const WheatherReportList = ({ reports }: {

    reports: WeatherReport[]
}) => {
    return <ul className="flex flex-col flex-nowrap gap-4">
        {reports.map((item, i) => <li key={i}>
            <WeatherReportListItem item={item} />
        </li>)}
    </ul>
}

export const WeatherReportListItem = ({ item }: {
    item: WeatherReport
}) => {
    return <div>
        <ul>
            <li>
                From: {item.city}
            </li>
            <li>
                Date: {
                    Dates.format(
                        new Date(item.date),
                        "YYYY.MM.DD HH:mm:ss"
                    )
                }
            </li>
            <li>
                Temperature: {
                    Math.round(convertTempToKelvin(item.temperature, item.unit) * 100) / 100
                }K
            </li>
        </ul>
        <Link href={`/edit/${item.id}`} className="btn btn-primary w-full">Edit</Link>
    </div>
}