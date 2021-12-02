import fs from 'fs'
import { deepMapObject } from './helpers/deepMapObject'
import { getObjectValueByPath } from './helpers/getObjectValueByPath'
import { readFile } from './helpers/readFile'

type RecursiveObject<T> = { [key: string]: T | RecursiveObject<T> }

type Variables = RecursiveObject<string | string[]>
type Templates = Record<string, string>

interface RenderFileOptions {
	variables: Variables
	templates: Templates
	templateFile: string
	outFile: string
	prefix?: string
	suffix?: string
}

interface RenderContentOptions {
	templateContent: string
	variables: Variables
	templates: Templates
	prefix?: string
	suffix?: string
}

export const renderFile = ({
	variables,
	templates = {},
	templateFile,
	outFile,
	prefix = '',
	suffix = '',
}: RenderFileOptions) => {
	const templateContent = readFile(templateFile)
	const outFileContent = renderContent({
		templateContent,
		variables,
		templates,
		prefix,
		suffix,
	})
	fs.writeFileSync(outFile, outFileContent)
}

export const renderContent = ({
	templateContent,
	variables,
	templates = {},
	prefix = '',
	suffix = '',
}: RenderContentOptions): string => {
	const mappedVariables = deepMapObject(variables, (value) =>
		Array.isArray(value) ? value.join('\n') : value,
	)

	const replacedContent = replaceTemplateMateObjects(
		templateContent,
		mappedVariables,
		templates,
	)

	return prefix + replacedContent + suffix
}

const replaceTemplateMateObjects = (
	templateContent: string,
	variables: Variables,
	templates: Templates,
): string => {
	const regex = /<!--\s*template-mate:\s*({[^}]*}\s*)-->/g
	return templateContent.replace(regex, (match, capture) => {
		const templateMateObject = JSON.parse(capture)
		return (
			getTemplateMateObjectValue(
				templateMateObject,
				variables,
				templates,
			) ?? match
		)
	})
}

const getTemplateMateObjectValue = (
	templateMateObject: Record<string, string>,
	variables: Variables,
	templates: Templates,
): string | null => {
	const { type, name, variablesPath, template } = templateMateObject

	if (type === 'variable' && name) {
		return getObjectValueByPath(variables, name)
	}

	if (type === 'template') {
		const templateVariables = variables?.[variablesPath]
		const filePath = templates[template]
		if (templateVariables && filePath) {
			const templateContent = readFile(filePath)
			return renderContent({
				templateContent,
				variables: templateVariables as Variables,
				templates,
			})
		}
	}

	return null
}
