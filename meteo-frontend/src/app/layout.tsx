import { Roboto } from 'next/font/google';
import "./globals.css";

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
});

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${roboto.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}