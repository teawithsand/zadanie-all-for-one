import { GetServerSideProps } from "next"
import { API, WeatherReport } from "../api/api"
import { DefaultPageLayout } from "../app/pageLayout"
import { WeatherReportListPage } from "../app/pages/list"
import { DefaultMetadata } from "../misc/metadata"

export const getServerSideProps = (async () => {
	return {
		props: {
			// fetching error here is a good use case for HTTP 500
			// no other sensbile thing can be done here
			reports: await API.list(),
		},
	}
}) satisfies GetServerSideProps<{
	reports: WeatherReport[]
}>

export const metadata = DefaultMetadata

export default function Home({ reports }: { reports: WeatherReport[] }) {
	return (
		<DefaultPageLayout>
			<WeatherReportListPage initialReports={reports} />
		</DefaultPageLayout>
	)
}
