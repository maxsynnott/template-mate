import fs from 'fs'
import template from 'just-template'
import { deepMapObject } from './helpers/deepMapObject'

type Variables = { [key: string]: string | string[] | Variables }

interface RenderFileOptions {
	variables: Variables
	templateFile: string
	outFile: string
	prefix?: string
	suffix?: string
}

interface RenderContentOptions {
	templateContent: string
	variables: Variables
	prefix?: string
	suffix?: string
}

export const renderFile = ({
	variables,
	templateFile,
	outFile,
	prefix,
	suffix,
}: RenderFileOptions): void => {
	const templateContent = fs.readFileSync(templateFile, 'utf8')
	const outFileContent = renderContent({
		templateContent,
		variables,
		prefix,
		suffix,
	})
	fs.writeFileSync(outFile, outFileContent)
}

export const renderContent = ({
	templateContent,
	variables,
	prefix = '',
	suffix = '',
}: RenderContentOptions): string => {
	const mappedVariables = deepMapObject(variables, (value) =>
		Array.isArray(value) ? value.join('\n') : value,
	)
	const templatedContent = template(templateContent, mappedVariables)
	return prefix + templatedContent + suffix
}
