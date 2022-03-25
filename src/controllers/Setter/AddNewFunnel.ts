import {Funnels, Pages, Users} from '../../models'
import {Response} from 'express'
import {AddFunnel, AuthUserBody, Store} from '../../types'
import InitialPage from '../../assets/initialPage.json'
import {AddNewFunnelStore} from '../../services'
import {GetFunnel} from '..'
export default async (req: AuthUserBody<AddFunnel>, res: Response) => {
	try {
		const {category, title} = req.body
		if (!category || category === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing category',
						field: 'category',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}

		if (!title || title === '') {
			return res.status(400).json({
				status: 'Failure',
				errors: [
					{
						name: 'missing title',
						field: 'title',
					},
				],
				requestTime: new Date().toISOString(),
			})
		}
		const {_id: UserId} = req.user
		const _page = await Pages.create({
			title: 'Home',
			data: JSON.stringify(InitialPage),
		})
		const _user = await Users.findById(UserId)
		if (!_user) {
			return res.status(404).json({
				status: 'Failure',
				message: 'User was not found',
				requestTime: new Date().toISOString(),
			})
		}
		const _verify = await Funnels.findOne({
			title,
		})
		if (_verify) {
			return res.status(400).json({
				status: 'Failure',
				message: 'Bad request, funnel title already in use',
				requestTime: new Date().toISOString(),
			})
		}
		const funnel = await Funnels.create({
			category,
			title,
			owner: UserId,
			pages: [_page?._id],
			contactEmail: _user.email,
		})

		if (!funnel) {
			throw new Error('Internal Server Error')
		}
		await AddNewFunnelStore({
			title: funnel?.title,
			category: funnel?.category,
			proDomain: funnel?.proDomain,
			baseDomain: funnel?.baseDomain,
			realtime: false,
		})
		const newFunnel = await Funnels.findById(funnel?._id)
			.populate('pages', '-__v')
			//@ts-ignore
			.cache({
				time: 3600,
			})
		return res.status(200).json({
			status: 'Success',
			message: 'Funnel was created successfully',
			funnel: {
				...newFunnel,
				pages: [
					{
						..._page.toObject(),
					},
				],
			},
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
