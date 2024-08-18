import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, set, remove } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { getStudentUid } from '../pages/Logging/loggingData';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let uid = null;
let initializationPromise = null;

export function initializeData() {
    if (!initializationPromise) {
        initializationPromise = getStudentUid().then(studentUid => {
            uid = studentUid;
            console.log("UID initialized:", uid);
        }).catch(error => {
            console.error("Error initializing UID:", error);
        });
    }
    return initializationPromise;
}

async function ensureInitialized() {
    if (!uid) {
        await initializeData();
    }
    if (!uid) {
        throw new Error("UID chưa được khởi tạo");
    }
}

async function getStudentData() {
    await ensureInitialized();
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("Không tìm thấy dữ liệu cho user");
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu user:", error);
        return null;
    }
}

export async function getStudentFaculty() {
    const userData = await getStudentData();
    return userData?.info?.faculty || null;
}

export async function getStudentMajor() {
    const userData = await getStudentData();
    return userData?.info?.major || null;
}

export async function getStudentSemester() {
    const userData = await getStudentData();
    return userData?.info?.semester || null;
}

export async function getStudentInfo() {
    const userData = await getStudentData();
    return userData?.info || null;
}

export async function getStudentPaid() {
    const userData = await getStudentData();
    return userData?.fees || null;
}

export async function getStudentCourses() {
    const userData = await getStudentData();
    return userData?.registeredCourses || null;
}

export async function updateCoursesList(course) {
    await ensureInitialized();
    if (!course) {
        throw new Error('Không đủ thông tin để cập nhật danh sách khóa học.');
    }
    const courseRef = ref(database, `users/${uid}/registeredCourses/${course.id}`);
    const newCourseData = {
        credits: course.credits,
        name: course.name,
        teacher: course.teacher,
        timeEnd: course.timeEnd,
        timeStart: course.timeStart,
        timetable: course.timetable
    };

    try {
        await set(courseRef, newCourseData);
        console.log('Cập nhật khóa học thành công:', course.id);
    } catch (error) {
        console.error('Lỗi khi cập nhật khóa học:', error);
        throw error;
    }
}

export async function updatePaymentStatus(feeId) {
    await ensureInitialized();
    if (!feeId) {
        throw new Error('Không đủ thông tin để cập nhật trạng thái thanh toán.');
    }

    const feeRef = ref(database, `/users/${uid}/fees/${feeId}`);
    const newPaymentData = {
        paid: true,
        paymentDate: new Date().toISOString(),
    };

    try {
        await update(feeRef, newPaymentData);
        console.log('Cập nhật trạng thái thanh toán thành công:', feeId);
    } catch (error) {
        console.error(`Lỗi khi cập nhật trạng thái thanh toán cho khoản phí ${feeId}:`, error);
        throw error;
    }
}

export async function checkStudentCourses(courseId) {
    if (!uid || !courseId) {
        throw new Error("Both studentUid and courseId are required");
    }
    try {
        const db = getDatabase();
        const studentRef = ref(db, `users/${uid}`);
        const snapshot = await get(studentRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const registeredCourses = userData.registeredCourses || {};
            
            return Object.hasOwnProperty.call(registeredCourses, courseId);
        } else {
            console.log("No data available for this student");
            return false;
        }
    } catch (error) {
        console.error("Error checking student courses:", error);
        throw error;
    }
}

export async function deleteRegisteredCourse(id) {
    await ensureInitialized();
    if (!id) {
        throw new Error('Không đủ thông tin để xóa khóa học.');
    }
    
    const courseRef = ref(database, `users/${uid}/registeredCourses/${id}`);
    
    try {
        await remove(courseRef);
        console.log('Xóa khóa học thành công:', id);
    } catch (error) {
        console.error('Lỗi khi xóa khóa học:', error);
        throw error;
    }
}

initializeData();