import {Request, Response} from 'express'
import {Funnels} from '../../models'

export default async (req: Request, res: Response) => {
	try {
		const {host} = req.query
		if (!host || host === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'Wrong/missing host',
						field: 'host',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		const rawFunnelDomain = host
			.toString()
			.replace('localhost:3000', 'funnelshero-website.com')
		const funnelDomain = rawFunnelDomain.split('/')[0]
		const funnel = await Funnels.findOne({
			$or: [
				{
					baseDomain: `${funnelDomain}`,
				},
				{
					proDomain: `${funnelDomain}`,
				},
			],
		}).populate('pages')


		if (!funnel) {
			return res.status(404).json({
				status: 'Failure',
				message: 'Funnel was not found',
				requestTime: new Date().toISOString(),
			})
		}

		const desiredPageLink = rawFunnelDomain.split(funnel.baseDomain)[1]
		const activePage = funnel.publish.pages.find(item => item.link === desiredPageLink)
		const payload = {
			...funnel.toObject(),
			activePage: activePage ? activePage : null,
			exists: Boolean(activePage),
		}
		return res.status(200).json({
			status: 'Success',
			message: 'Funnel was retrieved successfully',
			funnel: payload,
		})
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
