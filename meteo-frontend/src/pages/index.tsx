import { API, WeatherReport } from "../api/api";
import { DefaultPageLayout } from "../app/pageLayout";
import { WeatherReportListPage } from "../app/pages/list";
import { DefaultMetadata } from "../misc/metadata";

export const getServerSideProps = (async () => {
    return {
        props: {
            reports: await API.list()
        }
    }
})

export const metadata = DefaultMetadata


export default function Home({ reports }: {
    reports: WeatherReport[]
}) {

    return <DefaultPageLayout>
        <WeatherReportListPage initialReports={reports} />
    </DefaultPageLayout>
}
