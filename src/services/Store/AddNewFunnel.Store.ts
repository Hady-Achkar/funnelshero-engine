import {doc, setDoc} from 'firebase/firestore'
import {IAddFunnelStorePayload, Store} from '../../types'
import initialPage from '../../assets/initialPage.json'
import {Funnels as StoreFunnels, RealTimeFunnels} from './StoreRefs'

/**
 * Returns a promise void.
 *
 * @remarks
 * This method is part of the {@link Store | Store namespace}.
 * This method adds real-time document to into firestore
* @example const data = {
  title:string,
  subDomain: string
	category: string
}
*
 * @param data - Object with type IAddFunnelStorePayload
 * @returns promise void
 */
export const AddNewFunnelStore = async (
	data: IAddFunnelStorePayload
): Promise<void> => {
	const payload: Store.Funnel = {
		pages: [
			{
				data: JSON.stringify(initialPage),
				title: 'Home',
			},
		],
		maintenance: false,
		title: data?.title,
		proDomain: data?.proDomain,
		baseDomain: data?.baseDomain,
		category: data?.category,
		domain: '',
	}
	await setDoc(doc(RealTimeFunnels, data.baseDomain), {
		realtime: data?.realtime,
	})
	return setDoc(doc(StoreFunnels, data.baseDomain), payload)
}
