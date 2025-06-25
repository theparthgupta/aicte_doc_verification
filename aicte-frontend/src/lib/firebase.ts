import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  // Your Firebase configuration object
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)