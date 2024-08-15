import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { getStudentFaculty, getStudentMajor, getStudentSemester } from './studentData';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let firebaseData = null;
let faculty = "";
let major = "";
let semester = "";
let dataInitialized = false;
let initializationPromise = null;

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
    throw error;
  }
}

export async function initializeData() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        firebaseData = await fetchFirebaseData();
        faculty = await getStudentFaculty();
        major = await getStudentMajor();
        semester = await getStudentSemester();
        if (!firebaseData) {
          throw new Error("Không thể khởi tạo dữ liệu từ Firebase");
        }
        dataInitialized = true;
        return { firebaseData, faculty, major, semester };
      } catch (error) {
        console.error("Lỗi trong quá trình khởi tạo dữ liệu:", error);
        throw error;
      }
    })();
  }
  return initializationPromise;
}

async function ensureDataInitialized() {
  if (!dataInitialized) {
    await initializeData();
  }
}

export async function getMajorSubjects(semesterParam) {
  await ensureDataInitialized();
  const sem = semesterParam || semester;
  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]?.[sem]) {
    return null;
  }
  const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][sem];
  return { mandatory, elective };
}

export async function getFacultySubjects(semesterParam) {
  await ensureDataInitialized();
  const sem = semesterParam || semester;
  if (!firebaseData?.subjects?.facultySubjects?.[faculty]?.[sem]) {
    return null;
  }
  const { mandatory = {}, elective = {} } = firebaseData.subjects.facultySubjects[faculty][sem];
  return { mandatory, elective };
}

export async function getGeneralSubjects() {
  await ensureDataInitialized();
  if (!firebaseData?.subjects?.universityWideSubjects?.[semester]) {
    return null;
  }
  const { mandatory = {}, elective = {} } = firebaseData.subjects.universityWideSubjects[semester];
  return { mandatory, elective };
}

export async function getAllGeneralSubjects() {
  await ensureDataInitialized();
  if (!firebaseData?.subjects?.universityWideSubjects) {
    return null;
  }
  const allGeneralSubjects = {};
  for (const sem in firebaseData.subjects.universityWideSubjects) {
    const { mandatory = {}, elective = {} } = firebaseData.subjects.universityWideSubjects[sem];
    const mergedSubjects = { ...mandatory, ...elective };
    allGeneralSubjects[sem] = Object.entries(mergedSubjects).reduce((acc, [subjectCode, subjectData]) => {
      acc[subjectCode] = {
        name: subjectData.name,
        classSections: subjectData.classSections,
        credits: subjectData.credits
      };
      return acc;
    }, {});
  }
  return allGeneralSubjects;
}

export async function getAllStudentSubjects() {
  await ensureDataInitialized();
  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]) {
    return null;
  }
  const allSubjects = {
    major: {
      mandatory: {},
      elective: {}
    }
  };
  const majorData = firebaseData.subjects.majorSubjects[faculty][major];
  for (const sem in majorData) {
    const { mandatory = {}, elective = {} } = majorData[sem];
    Object.entries(mandatory).forEach(([subjectCode, subjectData]) => {
      allSubjects.major.mandatory[subjectCode] = {
        ...subjectData,
        semester: sem
      };
    });
    Object.entries(elective).forEach(([subjectCode, subjectData]) => {
      allSubjects.major.elective[subjectCode] = {
        ...subjectData,
        semester: sem
      };
    });
  }
  return allSubjects;
}

initializeData().catch(error => console.error("Lỗi trong quá trình khởi tạo ban đầu:", error));