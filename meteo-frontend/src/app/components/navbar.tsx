import Link from "next/link"
export const Navbar = () => {
	return (
		<div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
			<div className="flex-1">
				<Link className="btn btn-ghost text-xl" href="/">
					WheatherApp
				</Link>
			</div>
			<div className="flex flex-row gap-4">
				<Link className="btn btn-ghost" href="/">
					List reports
				</Link>
				<Link className="btn btn-ghost" href="/edit">
					Add report
				</Link>
			</div>
		</div>
	)
}
