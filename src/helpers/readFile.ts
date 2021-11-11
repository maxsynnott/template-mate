import fs from 'fs'

export const readFile = (path: string): string => fs.readFileSync(path, 'utf8')
