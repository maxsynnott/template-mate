export const deepMapObject = (
	obj: Record<string, any>,
	fn: (
		value: any,
		key: string,
		object: Record<string, any>,
	) => Record<string, any>,
): Record<string, any> => {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [
			key,
			Object.prototype.toString.call(value) === '[object Object]'
				? deepMapObject(value, fn)
				: fn(value, key, obj),
		]),
	)
}
