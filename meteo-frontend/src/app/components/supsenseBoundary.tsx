import { ReactNode, Suspense } from "react"

export const DefaultSuspenseBoundary = ({ children }: { children?: ReactNode }) => {
    return <Suspense fallback={
        <div className="text-center mx-auto">
            <span className="loading loading-spinner loading-xl"></span>
        </div>
    }>
        {children}
    </Suspense>
}