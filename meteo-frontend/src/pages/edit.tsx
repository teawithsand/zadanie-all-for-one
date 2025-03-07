import { useHydrateAtoms } from "jotai/utils"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { API, WeatherReport } from "../api/api"
import { WeatherReportFormAtoms } from "../app/components/report/form/atoms"
import { WeatherReportForm } from "../app/components/report/form/form"
import { DefaultPageLayout } from "../app/pageLayout"
import { useComputed } from "../app/utils/useComputed"
import { generateUUID } from "../app/utils/uuid"
import { DefaultMetadata } from "../misc/metadata"

export const getServerSideProps = (async context => {
    const id = (context.query.id ?? "").toString()

    if (!id) {
        return {
            props: {
                report: null,
            },
        }
    } else {
        const report = await API.get(id)
        if (!report) {
            return {
                notFound: true,
                props: {
                    report: null,
                },
            }
        } else {
            return {
                props: {
                    report,
                },
            }
        }
    }
}) satisfies GetServerSideProps<{ report: WeatherReport | null }>

export const metadata = DefaultMetadata

export default function Home({
    report: originalReport,
}: {
    report: WeatherReport | null
}) {
    const atoms = useComputed(() => new WeatherReportFormAtoms())
    useHydrateAtoms([
        [
            atoms.setWeatherReport,
            originalReport ?? {
                id: generateUUID(),
                city: "",
                date: "",
                temperature: 0,
                unit: "C",
            },
        ],
    ])

    const router = useRouter()

    return (
        <DefaultPageLayout>
            <WeatherReportForm
                atoms={atoms}
                onSubmit={async report => {
                    if (originalReport) {
                        await API.edit(report)
                    } else {
                        await API.create(report)
                    }
                    router.push("/", undefined, {
                        shallow: false
                    })
                }}
            />
        </DefaultPageLayout>
    )
}
