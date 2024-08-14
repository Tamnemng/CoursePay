import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
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

export function getStudentInfo(){
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.info || null;
}

export function getStudentPaid(){
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid];
    if (!userInfo) {
        return null;
    }
    return userInfo.fees || null;
}

export function getStudentCourses(){
    if (!firebaseData || !uid) {
        return null;
    }
    const userInfo = firebaseData.users?.[uid]?.registeredCourses;
    if (!userInfo) {
        return null;
    }
    return userInfo;
}

initializeData();

export const studentInfo =
{
    id: "48.01.104.128",
    name: "Nguyễn Phúc Thịnh",
    major: "Công Nghệ Thông Tin",
    faculty: "Khoa Công Nghệ Thông Tin",
    semester: "HK1",
    fees: [
        { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
        { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2024-07-15" },
        { id: 3, name: "Phí ký túc xá", amount: 2000000, paid: false, paymentDate: null },
        { id: 4, name: "Phí ăn uống", amount: 300000, paid: true, paymentDate: '2024-07-16' },
    ],
    registeredCourses: [
        { id: 1, name: "Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        { id: 2, name: "Course 2", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
    ]
}
