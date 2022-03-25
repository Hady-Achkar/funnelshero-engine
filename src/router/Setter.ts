import {Router} from 'express'
import {AddNewFunnel} from '../controllers'
const router = Router()
//@ts-ignore
router.route('/funnel').post(AddNewFunnel)
export default router
