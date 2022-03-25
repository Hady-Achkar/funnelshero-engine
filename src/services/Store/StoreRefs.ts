import {doc, collection} from '@firebase/firestore'
import {firestore} from '../../lib'
import {Store} from '../../types'

export const docRef = (collection: Store.FunnelCollections, docId: string) => {
	return doc(firestore, collection, docId)
}

export const Funnels = collection(firestore, 'funnels')
export const RealTimeFunnels = collection(firestore, 'real-time')
