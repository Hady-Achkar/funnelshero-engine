export default (term: string): string => {
	return `${process.env.REDIS_SUFFIX}${term}`
}
