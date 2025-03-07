import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { useHydrateAtoms } from "jotai/utils"
import { API, WeatherReport } from "../../api/api"
import { WheatherReportList } from "../components/report/list"
import { DefaultSuspenseBoundary } from "../components/supsenseBoundary"
import { useComputed } from "../utils/useComputed"

const rawReportsAtom = atom<Promise<WeatherReport[]>>(Promise.resolve([]))

enum WeatherReportSort {
    ORIGINAL = "original",
    BY_CITY = "by-city",
}

const sortAtom = atom<WeatherReportSort>(WeatherReportSort.ORIGINAL)
const reverseAtom = atom(false)
const reportsAtom = atom(async get => {
    const reports = await get(rawReportsAtom)
    const sort = get(sortAtom)

    let reverse = get(reverseAtom)
    const cmp = (x: number) => {
        return reverse ? -x : x
    }

    if (sort === WeatherReportSort.BY_CITY) {
        reports.sort((a, b) => {
            return cmp(a.city.localeCompare(b.city))
        })
    }

    return reports
})

const InnerList = () => {

    const reportsValue = useAtomValue(reportsAtom)
    return <WheatherReportList reports={reportsValue} />
}

export const WeatherReportListPage = ({ initialReports }: {
    initialReports: WeatherReport[]
}) => {
    const initialReportsPromise = useComputed(() => Promise.resolve(initialReports))
    useHydrateAtoms(
        [[rawReportsAtom, initialReportsPromise]]
    );

    const setReports = useSetAtom(rawReportsAtom)

    const [reverse, setReverse] = useAtom(reverseAtom)
    const [sort, setSort] = useAtom(sortAtom)

    return (<div>
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <h2 className="text-center text-3xl mb-4 font-bold">Weather report list</h2>
                <fieldset className="flex flex-col lg:flex-row gap-4 align-middle justify-center">
                    {<button className="btn btn-primary" onClick={() => {
                        setReports(API.list())
                    }}>Refresh items</button>}

                    <div className="mx-auto w-full">
                        <select value={sort} className="select w-full" onChange={(e) => {
                            setSort(e.target.value as WeatherReportSort)
                        }}>
                            <option value={WeatherReportSort.ORIGINAL}>Sort</option>
                            <option value={WeatherReportSort.BY_CITY}>City</option>
                        </select>
                    </div>

                    <label className="fieldset-label">
                        Reverse
                        <input type="checkbox" className="checkbox"
                            checked={reverse}
                            onChange={(e) => {
                                setReverse(!!e.target.checked)
                            }} />
                    </label>
                </fieldset>
            </div>
        </div>

        <div className="my-8 lg:my-4"></div>
        <DefaultSuspenseBoundary>
            <InnerList />
        </DefaultSuspenseBoundary>
    </div>);
}