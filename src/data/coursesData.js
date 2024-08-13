import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { studentInfo } from './studentData';
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
  const semester = studentInfo.semester;
  const faculty = studentInfo.faculty;
  const major = studentInfo.major;
  
  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]?.[semester]) {
    return null;
  }
  
  const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

  return { mandatory, elective };
}

export function getFacultySubjects() {
  const semester = studentInfo.semester;
  const faculty = studentInfo.faculty;
  
  if (!firebaseData?.subjects?.facultySubjects?.[faculty]?.[semester]) {
    return null;
  }
  
  const { mandatory = {}, elective = {} } = firebaseData.subjects.facultySubjects[faculty][semester];

  return { mandatory, elective };
}

export function getGeneralSubjects() {
  const  semester = studentInfo.semester;
  if (!firebaseData || !firebaseData.subjects || !firebaseData.subjects.universityWideSubjects || !firebaseData.subjects.universityWideSubjects[semester]) {
    return null;
  }
  const { mandatory, elective } = firebaseData.subjects.universityWideSubjects[semester];

  return {
    mandatory: mandatory || {},
    elective: elective || {}
  };
}

export function getAllMajorSubjects() {
  const faculty = studentInfo.faculty;
  const major = studentInfo.major;
  
  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]) {
    return null;
  }
  
  //const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

  //return { mandatory, elective };
}

export function getAllFacultySubjects() {
  const semester = studentInfo.semester;
  const faculty = studentInfo.faculty;
  
  if (!firebaseData?.subjects?.facultySubjects?.[faculty]?.[semester]) {
    return null;
  }
  
  const { mandatory = {}, elective = {} } = firebaseData.subjects.facultySubjects[faculty][semester];

  return { mandatory, elective };
}

export function getAllGeneralSubjects() {
  const  semester = studentInfo.semester;
  if (!firebaseData || !firebaseData.subjects || !firebaseData.subjects.universityWideSubjects || !firebaseData.subjects.universityWideSubjects[semester]) {
    return null;
  }
  const { mandatory, elective } = firebaseData.subjects.universityWideSubjects[semester];

  return {
    mandatory: mandatory || {},
    elective: elective || {}
  };
}

initializeData();