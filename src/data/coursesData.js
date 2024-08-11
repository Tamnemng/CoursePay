import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

async function fetchFirebaseData() {
  try {
    const dataRef = ref(database, '/');
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Không có dữ liệu");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    return null;
  }
}

let firebaseData = null;

export async function initializeData() {
  firebaseData = await fetchFirebaseData();
  if (!firebaseData) {
    console.error("Không thể khởi tạo dữ liệu từ Firebase");
  }
}

export function getMajorSubjects() {
  return firebaseData ? firebaseData.majorSubjects : null;
}

export function getGeneralSubjects() {
  return firebaseData ? firebaseData.generalSubjects : null;
}

initializeData();