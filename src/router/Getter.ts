import {Router} from 'express'
import {BrowseFunnel, GetFunnel} from '../controllers'
const router = Router()
//@ts-ignore
router.route('/funnel').post(GetFunnel)
router.route('/').get(BrowseFunnel)
export default router
