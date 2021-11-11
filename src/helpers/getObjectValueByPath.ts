export const getObjectValueByPath = (object: any, path: string): string => {
	const pathParts = path.split('.')
	let value = object
	for (let i = 0; i < pathParts.length; i++) {
		value = value[pathParts[i]]
	}
	return value
}
