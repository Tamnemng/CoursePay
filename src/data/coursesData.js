import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
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
let dataListeners = [];

function notifyListeners() {
  dataListeners.forEach(listener => listener(firebaseData));
}

function setupFirebaseListener() {
  const dataRef = ref(database, '/');
  onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      firebaseData = snapshot.val();
    } else {
      firebaseData = {};
    }
    notifyListeners();
  }, (error) => {
    console.error("Lỗi khi lắng nghe dữ liệu:", error);
  });
}

export async function initializeData() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        setupFirebaseListener();
        faculty = await getStudentFaculty();
        major = await getStudentMajor();
        semester = await getStudentSemester();
        dataInitialized = true;
        return { faculty, major, semester };
      } catch (error) {
        console.error("Lỗi trong quá trình khởi tạo dữ liệu:", error);
        return { faculty: "", major: "", semester: "" };
      }
    })();
  }
  return initializationPromise;
}

export function addDataListener(listener) {
  dataListeners.push(listener);
  if (firebaseData) {
    listener(firebaseData);
  }
}

export function removeDataListener(listener) {
  const index = dataListeners.indexOf(listener);
  if (index > -1) {
    dataListeners.splice(index, 1);
  }
}

async function ensureDataInitialized() {
  if (!dataInitialized) {
    await initializeData();
  }
}

export async function getMajorSubjects(semesterParam) {
  await ensureDataInitialized();
  const sem = semesterParam || semester;
  const majorSubjects = firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]?.[sem] || {};
  return {
    mandatory: majorSubjects.mandatory || {},
    elective: majorSubjects.elective || {}
  };
}

export async function getFacultySubjects(semesterParam) {
  await ensureDataInitialized();
  const sem = semesterParam || semester;
  const facultySubjects = firebaseData?.subjects?.facultySubjects?.[faculty]?.[sem] || {};
  return {
    mandatory: facultySubjects.mandatory || {},
    elective: facultySubjects.elective || {}
  };
}

export async function getGeneralSubjects() {
  await ensureDataInitialized();
  const generalSubjects = firebaseData?.subjects?.universityWideSubjects?.[semester] || {};
  return {
    mandatory: generalSubjects.mandatory || {},
    elective: generalSubjects.elective || {}
  };
}

export async function getAllGeneralSubjects() {
  await ensureDataInitialized();
  const allGeneralSubjects = {};
  const universityWideSubjects = firebaseData?.subjects?.universityWideSubjects || {};
  
  for (const sem in universityWideSubjects) {
    const { mandatory = {}, elective = {} } = universityWideSubjects[sem];
    const mergedSubjects = { ...mandatory, ...elective };
    allGeneralSubjects[sem] = Object.entries(mergedSubjects).reduce((acc, [subjectCode, subjectData]) => {
      acc[subjectCode] = {
        name: subjectData.name || '',
        classSections: subjectData.classSections || [],
        credits: subjectData.credits || 0
      };
      return acc;
    }, {});
  }
  return allGeneralSubjects;
}

export async function getAllStudentSubjects() {
  await ensureDataInitialized();
  const allSubjects = {
    major: {
      mandatory: {},
      elective: {}
    }
  };
  const majorData = firebaseData?.subjects?.majorSubjects?.[faculty]?.[major] || {};
  
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