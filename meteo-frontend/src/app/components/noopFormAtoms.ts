import { FormAtomsBuilder, FormAtomsDelegateBase } from "../form"
import { inPlaceCall } from "../utils/lang"

export class NoopFormAtoms extends FormAtomsDelegateBase<
	Record<string, never>
> {
	constructor() {
		super(
			inPlaceCall(() => {
				const builder = FormAtomsBuilder.fromDefaultValues<
					Record<string, never>
				>({})

				return builder.buildForm()
			}),
		)
	}
}
