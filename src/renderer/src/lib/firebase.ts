import { type FirebaseApp, initializeApp } from 'firebase/app'
import { type Auth, type User, getAuth, signInAnonymously } from 'firebase/auth'
import { type Firestore, getFirestore } from 'firebase/firestore'
import { logger } from './logger'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export function initFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (app && auth && db) return { app, auth, db }
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  return { app, auth, db }
}

export async function ensureAuth(): Promise<User> {
  const { auth: firebaseAuth } = initFirebase()
  if (firebaseAuth.currentUser) return firebaseAuth.currentUser
  try {
    const credential = await signInAnonymously(firebaseAuth)
    return credential.user
  } catch (error) {
    logger.error('Firebase auth failed:', error)
    throw error
  }
}

export function getFirebaseAuth(): Auth {
  if (!auth) initFirebase()
  return auth!
}

export function getFirebaseDb(): Firestore {
  if (!db) initFirebase()
  return db!
}
