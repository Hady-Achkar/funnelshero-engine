import {FirebaseOptions, initializeApp} from 'firebase/app'
import * as dotenv from 'dotenv'
import {getFirestore, collection, doc} from 'firebase/firestore'
import {Store} from '../../types'
dotenv.config()

const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
export const firestore = getFirestore(firebaseApp)
