//@ts-nocheck
import mongoose from 'mongoose'
import redis from 'redis'
import util from 'util'

const retry_strategy = (options) => {
	if (
		options.error &&
		(options.error.code === 'ECONNREFUSED' ||
			options.error.code === 'NR_CLOSED')
	) {
		//  reconnecting every 5 seconds
		console.error(
			'[i] The Redis Cache Server refused the connection. Retrying connection...'
		)
		return 5000
	}
	if (options.total_retry_time > 1000 * 60 * 60) {
		// End reconnecting after a specific timeout and flush all commands with an individual error
		return new Error('Ending trials')
	}
	// reconnect after
	return Math.min(options.attempt * 100, 3000)
}

const client = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
	retry_strategy: retry_strategy,
})
client.on('connect', function (_) {
	console.error(`[i] Connected to Cache Server`)
})

client.hget = util.promisify(client.hget)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (
	options = {
		time: 60,
	}
) {
	this.useCache = true
	this.time = options.time
	this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name)

	return this
}

mongoose.Query.prototype.exec = async function () {
	if (!this.useCache) {
		return await exec.apply(this, arguments)
	}

	const key = JSON.stringify({
		...this.getQuery(),
	})
	const cacheValue = await client.hget(this.hashKey, key)
	if (cacheValue) {
		const doc = JSON.parse(cacheValue)
		console.log('Response from Redis')
		if (doc) {
			return doc
		}
		// return Array.isArray(doc)
		// 	? doc.map((d) => new this.model(d))
		// 	: new this.model(doc)
	}

	const result = await exec.apply(this, arguments)
	client.hset(this.hashKey, key, JSON.stringify(result.toObject()))
	client.expire(this.hashKey, this.time)

	console.log('Response from MongoDB')
	if (result) {
		const objectiFiedResult = result.toObject()
		return objectiFiedResult
	}
}

const clearKey = (hashKey) => {
	client.del(JSON.stringify(hashKey))
}
export default clearKey
