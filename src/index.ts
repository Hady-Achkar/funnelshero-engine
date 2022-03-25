import express from 'express'
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import {RealIp, Validateuser} from './middlewares'
import {Getter, Setter} from './router'
import {connectDB} from './lib'
const main = async () => {
	dotenv.config()
	connectDB()
	const app = express()
	app.use(cors())
	app.use(morgan('dev'))
	app.use(
		express.json({
			limit: '50mb',
		})
	)

	app.use(bodyParser.json())
	app.use('*', RealIp)
	app.use('/set', Validateuser, Setter)
	app.use('/', Getter)

	app.listen(process.env.MAIN_PORT, () => {
		console.log(`[i] Server is listening on port ${process.env.MAIN_PORT}`)
	})
}
main()
