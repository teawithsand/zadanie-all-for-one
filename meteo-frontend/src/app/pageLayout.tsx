import { Suspense } from "react"
import { Navbar } from "./components/navbar"

import "./globals.css"

export const DefaultPageLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<>
			<Navbar />
			<div className="my-4"></div>
			<Suspense
				fallback={
					<div className="text-center">
						<span className="loading loading-spinner loading-xl"></span>
					</div>
				}
			>
				<div className="mx-auto max-w-[700px] px-4">{children}</div>
			</Suspense>
		</>
	)
}
