import fs from 'fs'
import template from 'just-template'
import { deepMapObject } from './helpers/deepMapObject'

type Variables = { [key: string]: string | string[] | Variables }

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
	const templateContent = fs.readFileSync(templateFile, 'utf8')
	const outFileContent = renderContent({
		templateContent,
		variables,
	})
	fs.writeFileSync(outFile, outFileContent)
}

export const renderContent = ({
	templateContent,
	variables,
}: RenderOptions) => {
	const mappedVariables = deepMapObject(variables, (value) =>
		Array.isArray(value) ? value.join('\n') : value,
	)
	return template(templateContent, mappedVariables)
}
