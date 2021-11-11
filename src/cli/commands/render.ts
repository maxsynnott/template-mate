import { Arguments, CommandBuilder } from 'yargs'
import { renderFile } from '../../index'
import fs from 'fs'

interface Options {
	varsFile: string
	templateFile: string
	outFile: string
}

export const builder: CommandBuilder<Options, Options> = (yargs) => {
	return yargs.options({
		varsFile: {
			type: 'string',
			default: 'template-mate.json',
		},
		templateFile: {
			type: 'string',
			demandOption: true,
		},
		outFile: {
			type: 'string',
			demandOption: true,
		},
	})
}

export const handler = ({
	varsFile,
	templateFile,
	outFile,
}: Arguments<Options>) => {
	const variables = JSON.parse(fs.readFileSync(varsFile, 'utf8'))
	renderFile({ variables, templateFile, outFile })
	process.exit(0)
}
