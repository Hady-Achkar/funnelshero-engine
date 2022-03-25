import {DocumentData, DocumentSnapshot, getDoc} from 'firebase/firestore'
import {docRef} from './StoreRefs'

/**
 * Returns a promise with <DocumentSnapshot<DocumentData>.
 *
 * @remarks
 * This method is part of the {@link Store | Store namespace}.
 * This method browses funnels from firestore
 * @param id - string
 * @returns Promise<DocumentSnapshot<DocumentData>>
 */
export const BrowseFunnelStore = async (
	id: string
): Promise<DocumentSnapshot<DocumentData>> => {
	return await getDoc(docRef('funnels', id))
}
