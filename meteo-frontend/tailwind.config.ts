/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss"
import { addDynamicIconSelectors } from "@iconify/tailwind"

export default {	
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
        addDynamicIconSelectors()
	],
	content: [
		"./src/**/*.{html,js,ts,jsx,tsx}"
	],
	theme: {
		extend: {},
	},
} satisfies Config
