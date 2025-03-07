import { Atom } from "jotai"
import { FormAtoms, FormDataBase, FormFieldsAtoms } from "./defines"
import { FormErrorBag } from "./error"
import { Loadable } from "../utils/jotai"
import { WritableAtom } from "jotai"

export abstract class FormAtomsDelegateBase<T extends FormDataBase>
	implements FormAtoms<T>
{
	public readonly fields: FormFieldsAtoms<T>
	public readonly data: Atom<T>
	public readonly globalValidationErrors: Atom<FormErrorBag>
	public readonly submitPromise: Atom<Promise<void>>
	public readonly submitPromiseLoadable: Atom<Loadable<void>>
	public readonly submit: WritableAtom<
		void,
		[callback: (data: T) => Promise<void>],
		Promise<void>
	>
	public readonly hasErrors: Atom<boolean>

	protected constructor(formAtoms: FormAtoms<T>) {
		this.fields = formAtoms.fields
		this.data = formAtoms.data
		this.globalValidationErrors = formAtoms.globalValidationErrors
		this.submitPromise = formAtoms.submitPromise
		this.submitPromiseLoadable = formAtoms.submitPromiseLoadable
		this.submit = formAtoms.submit
		this.hasErrors = formAtoms.hasErrors
	}
}
