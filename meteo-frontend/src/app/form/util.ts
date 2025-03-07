import { atom, Atom } from "jotai"
import { FormDataBase, FormFieldsDataAtoms } from "./defines"
import { atomWithImmer } from "jotai-immer"

export class FormsAtomsUtil {
	private constructor() {}

	public static readonly getValue = <T extends FormDataBase>(
		dataAtoms: FormFieldsDataAtoms<T>,
	): Atom<T> => {
		return atom(
			get =>
				Object.fromEntries(
					Object.entries(dataAtoms).map(([k, v]) => [k, get(v)]),
				) as T,
		)
	}

	public static readonly getFormFieldsData = <T extends FormDataBase>(
		initialValues: T,
	): FormFieldsDataAtoms<T> => {
		return Object.fromEntries(
			Object.entries(initialValues).map(([k, v]) => [
				k,
				atomWithImmer(v),
			]),
		) as FormFieldsDataAtoms<T>
	}
}
