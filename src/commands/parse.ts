import { Arguments, CommandBuilder } from 'yargs'
import fs from 'fs'
import template from 'just-template'

interface Options {
	varsPath: string
	prePath: string
	postPath: string
}

export const builder: CommandBuilder<Options, Options> = (yargs) => {
	return yargs.options({
		varsPath: {
			type: 'string',
			default: 'vars.md.json',
		},
		prePath: {
			type: 'string',
			demandOption: true,
		},
		postPath: {
			type: 'string',
			demandOption: true,
		},
	})
}

export const handler = ({
	varsPath,
	prePath,
	postPath,
}: Arguments<Options>) => {
	console.log({ varsPath, prePath, postPath })
	const vars = JSON.parse(readFile(varsPath))
	const preFileContent = readFile(prePath)
	const postFileContent = template(preFileContent, vars)
	writeFile(postPath, postFileContent)
	console.log({ vars, preFileContent, postFileContent })
	process.exit(0)
}

const readFile = (path: string) => fs.readFileSync(path, 'utf8')
const writeFile = (path: string, content: string) =>
	fs.writeFileSync(path, content)
