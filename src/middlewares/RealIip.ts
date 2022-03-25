import {NextFunction, Request, Response} from 'express'
export default async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userIp = req.headers['x-real-ip']
		// @ts-ignore: Unreachable code error
		req.userIp = userIp
		next()
	} catch (err) {
		if (err instanceof Error) {
			return res.status(500).json({
				message: 'Internal Server Error',
				error: err.message,
				requestTime: new Date().toISOString(),
			})
		}
	}
}
