import fs from 'fs'
import { deepMapObject } from './helpers/deepMapObject'
import { getObjectValueByPath } from './helpers/getObjectValueByPath'
import { readFile } from './helpers/readFile'

type RecursiveObject<T> = { [key: string]: T | RecursiveObject<T> }

type Variables = RecursiveObject<string | string[]> & {
	templates?: Record<string, string>
}

interface CreateFileOptions {
	variables: Variables
	templateFile: string
	outFile: string
}

interface RenderOptions {
	templateContent: string
	variables: Variables
}

export const renderFile = ({
	variables,
	templateFile,
	outFile,
}: CreateFileOptions) => {
	const templateContent = readFile(templateFile)
	const outFileContent = renderContent({
		templateContent,
		variables,
	})
	fs.writeFileSync(outFile, outFileContent)
}

export const renderContent = ({
	templateContent,
	variables,
}: RenderOptions): string => {
	const mappedVariables = deepMapObject(variables, (value) =>
		Array.isArray(value) ? value.join('\n') : value,
	)

	return replaceTemplateMateObjects(templateContent, mappedVariables)
}

const replaceTemplateMateObjects = (
	templateContent: string,
	variables: Variables,
): string => {
	const regex = /<!--\s*template-mate:\s*({.*}\s*)-->/g
	return templateContent.replace(regex, (match, capture) => {
		const templateMateObject = JSON.parse(capture)
		return (
			getTemplateMateObjectValue(templateMateObject, variables) ?? match
		)
	})
}

const getTemplateMateObjectValue = (
	templateMateObject: Record<string, string>,
	variables: Variables,
): string | null => {
	const { type, name, variablesPath, template } = templateMateObject

	if (type === 'variable' && name) {
		return getObjectValueByPath(variables, name)
	}

	if (type === 'template') {
		const templateVariables = variables?.[variablesPath]
		const filePath = variables?.templates?.[template]
		if (templateVariables && filePath) {
			const templateContent = readFile(filePath)
			return renderContent({
				templateContent,
				variables: templateVariables as Variables,
			})
		}
	}

	return null
}
