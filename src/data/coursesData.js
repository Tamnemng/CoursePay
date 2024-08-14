import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { getStudentFaculty, getStudentMajor, getStudentSemester } from './studentData';

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
let faculty = "";
let major = "";
let semester = "";

export async function initializeData() {
  firebaseData = await fetchFirebaseData();
  faculty = await getStudentFaculty();
  major = await getStudentMajor();
  semester = await getStudentSemester();
  if (!firebaseData) {
    console.error("Không thể khởi tạo dữ liệu từ Firebase");
  }
  return { firebaseData, faculty, major, semester };
}


export function getMajorSubjects(semester) {

  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]?.[semester]) {
    return null;
  }

  const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

  return { mandatory, elective };
}

export function getFacultySubjects(semester) {
  if (!firebaseData?.subjects?.facultySubjects?.[faculty]?.[semester]) {
    return null;
  }

  const { mandatory = {}, elective = {} } = firebaseData.subjects.facultySubjects[faculty][semester];

  return { mandatory, elective };
}

export function getGeneralSubjects() {
  if (!firebaseData || !firebaseData.subjects || !firebaseData.subjects.universityWideSubjects || !firebaseData.subjects.universityWideSubjects[semester]) {
    return null;
  }
  const { mandatory, elective } = firebaseData.subjects.universityWideSubjects[semester];

  return { mandatory, elective };
}

export function getAllGeneralSubjects() {
  if (!firebaseData?.subjects?.universityWideSubjects) {
    return null;
  }

  const allGeneralSubjects = {};

  for (const semester in firebaseData.subjects.universityWideSubjects) {
    const { mandatory = {}, elective = {} } = firebaseData.subjects.universityWideSubjects[semester];

    const mergedSubjects = { ...mandatory, ...elective };

    allGeneralSubjects[semester] = Object.entries(mergedSubjects).reduce((acc, [subjectCode, subjectData]) => {
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

export function getAllStudentSubjects() {

  if (!firebaseData?.subjects?.facultySubjects?.[faculty] ||
    !firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]) {
    return null;
  }

  const allSubjects = {
    faculty: {
      mandatory: {},
      elective: {}
    },
    major: {
      mandatory: {},
      elective: {}
    }
  };

  const facultyData = firebaseData.subjects.facultySubjects[faculty];
  for (const semester in facultyData) {
    const { mandatory = {}, elective = {} } = facultyData[semester];

    Object.entries(mandatory).forEach(([subjectCode, subjectData]) => {
      allSubjects.faculty.mandatory[subjectCode] = {
        ...subjectData,
        semester
      };
    });

    Object.entries(elective).forEach(([subjectCode, subjectData]) => {
      allSubjects.faculty.elective[subjectCode] = {
        ...subjectData,
        semester
      };
    });
  }

  const majorData = firebaseData.subjects.majorSubjects[faculty][major];
  for (const semester in majorData) {
    const { mandatory = {}, elective = {} } = majorData[semester];

    Object.entries(mandatory).forEach(([subjectCode, subjectData]) => {
      allSubjects.major.mandatory[subjectCode] = {
        ...subjectData,
        semester
      };
    });

    Object.entries(elective).forEach(([subjectCode, subjectData]) => {
      allSubjects.major.elective[subjectCode] = {
        ...subjectData,
        semester
      };
    });
  }

  return allSubjects;
}



initializeData();