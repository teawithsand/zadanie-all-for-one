import { atom, useAtom, useAtomValue, useSetAtom } from "jotai"
import { atomWithImmer } from "jotai-immer"
import { useHydrateAtoms } from "jotai/utils"
import { useEffect } from "react"
import { API, convertTempToKelvin, WeatherReport } from "../../api/api"
import { NoopFormAtoms } from "../components/noopFormAtoms"
import { WheatherReportList } from "../components/report/list"
import { DefaultSuspenseBoundary } from "../components/supsenseBoundary"
import { useForm } from "../form"
import { useComputed } from "../utils/useComputed"

const rawReportsAtom = atom<Promise<WeatherReport[]>>(Promise.resolve([]))

enum WeatherReportSort {
    ORIGINAL = "original",
    BY_CITY = "by-city",
    BY_DATE = "by-date",
}

type Filter = {
    city: string
    temperatureGT: number
    temperatureLT: number
}

const filterAtom = atomWithImmer<Filter>({
    city: "",
    temperatureGT: -Infinity,
    temperatureLT: Infinity,
})

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
    } else if (sort === WeatherReportSort.BY_DATE) {
        reports.sort((a, b) => {
            return cmp(new Date(a.date).getTime() - new Date(b.date).getTime())
        })
    }

    const filter = get(filterAtom)

    return reports.filter(r => {
        if (
            filter.city &&
            !r.city
                .toLocaleLowerCase()
                .includes(filter.city.toLocaleLowerCase())
        ) {
            return false
        }

        const temp = convertTempToKelvin(r.temperature, r.unit)

        return (isNaN(filter.temperatureLT) || temp < filter.temperatureLT) && (isNaN(filter.temperatureGT) || temp > filter.temperatureGT)
    })
})

const InnerList = ({
    onReportDelete,
}: {
    onReportDelete: (report: WeatherReport) => void
}) => {
    const reportsValue = useAtomValue(reportsAtom)
    return (
        <WheatherReportList
            onReportDelete={onReportDelete}
            reports={reportsValue}
        />
    )
}

const lastModalTargetAtom = atom<WeatherReport | null>(null)
const innerModalTargetAtom = atom<WeatherReport | null>(null)
const modalTargetAtom = atom(
    get => get(innerModalTargetAtom),
    (_get, set, value: WeatherReport | null) => {
        set(innerModalTargetAtom, value)
        if (value) {
            set(lastModalTargetAtom, value)
        }
    },
)

const Filters = () => {
    const [filter, setFilter] = useAtom(filterAtom)

    return (
        <details className="collapse">
            <summary className="collapse-title btn btn-ghost font-semibold">
                Show filters
            </summary>
            <div className="collapse-content mt-2 flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="City filter"
                    className="input w-full"
                    value={filter.city}
                    onChange={e => {
                        setFilter(draft => {
                            draft.city = e.target.value
                        })
                    }}
                />
                <input
                    type="number"
                    placeholder="Temperature greater than"
                    className="input w-full"
                    value={filter.temperatureGT}
                    onChange={e => {
                        setFilter(draft => {
                            draft.temperatureGT = parseFloat(e.target.value)
                        })
                    }}
                />
                <input
                    type="number"
                    placeholder="Temperature lower than"
                    className="input w-full"
                    value={filter.temperatureLT}
                    onChange={e => {
                        setFilter(draft => {
                            draft.temperatureLT = parseFloat(e.target.value)
                        })
                    }}
                />
            </div>
        </details>
    )
}

const Sort = () => {
    const setReports = useSetAtom(rawReportsAtom)

    const [reverse, setReverse] = useAtom(reverseAtom)
    const [sort, setSort] = useAtom(sortAtom)

    return (
        <div>
            <h2 className="mb-4 text-center text-3xl font-bold">
                Weather report list
            </h2>
            <fieldset className="flex flex-col justify-center gap-4 align-middle lg:flex-row">
                {
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setReports(API.list())
                        }}
                    >
                        Refresh items
                    </button>
                }

                <div className="mx-auto w-full">
                    <select
                        value={sort}
                        className="select w-full"
                        onChange={e => {
                            setSort(e.target.value as WeatherReportSort)
                        }}
                    >
                        <option value={WeatherReportSort.ORIGINAL}>
                            Random order
                        </option>
                        <option value={WeatherReportSort.BY_CITY}>City</option>
                        <option value={WeatherReportSort.BY_DATE}>Date</option>
                    </select>
                </div>

                <label className="fieldset-label">
                    Reverse
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={reverse}
                        onChange={e => {
                            setReverse(!!e.target.checked)
                        }}
                    />
                </label>
            </fieldset>
        </div>
    )
}

export const WeatherReportListPage = ({
    initialReports,
}: {
    initialReports: WeatherReport[]
}) => {
    const initialReportsPromise = useComputed(() =>
        Promise.resolve(initialReports),
    )
    useHydrateAtoms([[rawReportsAtom, initialReportsPromise]])

    const setRawReports = useSetAtom(rawReportsAtom)
    useEffect(() => {
        setRawReports(Promise.resolve(initialReports))
    }, [initialReports])

    const setModalTarget = useSetAtom(modalTargetAtom)

    return (
        <div>
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                    <Sort />
                    <Filters />
                </div>
            </div>

            <div className="my-8 lg:my-4"></div>
            <DefaultSuspenseBoundary>
                <InnerList
                    onReportDelete={report => {
                        setModalTarget(report)
                    }}
                />
            </DefaultSuspenseBoundary>

            <DeleteModal />
        </div>
    )
}

const DeleteModal = () => {
    const setReports = useSetAtom(rawReportsAtom)

    const setModalTarget = useSetAtom(modalTargetAtom)
    const modalTarget = useAtomValue(lastModalTargetAtom)
    const isOpen = !!useAtomValue(modalTargetAtom)

    const atoms = useComputed(() => new NoopFormAtoms())
    const form = useForm(atoms)

    useEffect(() => {
        if (form.isSubmitting) return

        const listener = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "escape") {
                setModalTarget(null)
            }
        }
        window.addEventListener("keydown", listener)
        return () => {
            window.removeEventListener("keydown", listener)
        }
    }, [form.isSubmitting])

    if (!modalTarget) return <></>

    return (
        <div
            className={`modal ${isOpen ? "modal-open" : ""}`}
            onClick={() => {
                setModalTarget(null)
            }}
        >
            <div
                className="modal-box"
                onClick={e => {
                    // I guess target element checking would be more appropriate
                    // but this works as well
                    e.stopPropagation()
                }}
            >
                {form.lastSubmitError ? (
                    <div className="alert alert-error my-4">
                        Oh no! Something went wrong, when you've tried to delete
                        report! {form.lastSubmitError?.toString()}
                    </div>
                ) : null}
                <button
                    onClick={() => {
                        if (!form.isSubmitting) {
                            setModalTarget(null)
                        }
                    }}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    ✕
                </button>
                <h3 className="text-lg font-bold">Delete report?</h3>
                <p className="py-4">
                    Do you really want to delete report from {modalTarget.city}?
                </p>
                
                {form.isSubmitting ? (
                    <div className="loading loading-spinner loading-lg mx-auto my-4"></div>
                ) : null}
                <div className="join w-full basis-0">
                    <button
                        className="join-item btn btn-success grow"
                        disabled={form.isSubmitting || form.hasErrors}
                        onClick={() => {
                            if (modalTarget) {
                                form.submit(async () => {
                                    await API.delete(modalTarget.id)
                                    setReports(API.list())
                                    setModalTarget(null)
                                })
                            }
                        }}
                    >
                        Yes
                    </button>
                    <button
                        disabled={form.isSubmitting || form.hasErrors}
                        className="join-item btn btn-primary grow"
                        onClick={() => {
                            if (!form.isSubmitting) {
                                setModalTarget(null)
                            }
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}
