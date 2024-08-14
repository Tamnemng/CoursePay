import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { getStudentUid } from '../pages/Logging/loggingData';

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
let uid = null;

export async function initializeData() {
    firebaseData = await fetchFirebaseData();
    if (!firebaseData) {
        console.error("Không thể khởi tạo dữ liệu từ Firebase");
    }

    try {
        uid = await getStudentUid();
        console.log("Student UID:", uid);
    } catch (error) {
        console.error("Lỗi khi lấy Student UID:", error);
    }
}

export function getStudentFaculty() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.info.faculty || null;
}

export function getStudentMajor() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.info.major || null;
}

export function getStudentSemester() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.info.semester || null;
}

export function getStudentInfo() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.info || null;
}

export function getStudentPaid() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.fees || null;
}

export function getStudentCourses() {
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid]?.registeredCourses;
    if (!userInfo) {
        return null;
    }
    return userInfo;
}



export async function updatePaymentStatus(feeId) {
    if (!firebaseData || !uid || !feeId) {
      return;
    }
  
    const feeRef = ref(database, `/users/${uid}/fees/${feeId}`);
    const newPaymentData = {
      paid: true,
      paymentDate: new Date().toISOString(),
    };
  
    try {
      await update(feeRef, newPaymentData);
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái thanh toán cho khoản phí ${feeId}:`, error);
    }
  }


initializeData();