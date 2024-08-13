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

export function getMajorSubjects(semester) {
  const faculty = studentInfo.faculty;
  const major = studentInfo.major;

  if (!firebaseData?.subjects?.majorSubjects?.[faculty]?.[major]?.[semester]) {
    return null;
  }

  const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

  return { mandatory, elective };
}

export function getFacultySubjects(semester) {
  const faculty = studentInfo.faculty;

  if (!firebaseData?.subjects?.facultySubjects?.[faculty]?.[semester]) {
    return null;
  }

  const { mandatory = {}, elective = {} } = firebaseData.subjects.facultySubjects[faculty][semester];

  return { mandatory, elective };
}

export function getGeneralSubjects() {
  const semester = studentInfo.semester;
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
  if (!firebaseData?.subjects?.majorSubjects) {
    return null;
  }
  
<<<<<<< HEAD
  const allMajorSubjects = {};

  for (const faculty in firebaseData.subjects.majorSubjects) {
    allMajorSubjects[faculty] = {};

    for (const major in firebaseData.subjects.majorSubjects[faculty]) {
      allMajorSubjects[faculty][major] = {};

      for (const semester in firebaseData.subjects.majorSubjects[faculty][major]) {
        const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

        allMajorSubjects[faculty][major][semester] = {
          mandatory,
          elective
        };
      }
    }
  }

  return allMajorSubjects;
=======
  //const { mandatory = {}, elective = {} } = firebaseData.subjects.majorSubjects[faculty][major][semester];

  //return { mandatory, elective };
>>>>>>> f51a6d1f27ed7d53277c9106ee5238247c639abf
}

export function getAllFacultySubjects() {
  const faculty = studentInfo.faculty;

  if (!firebaseData?.subjects?.facultySubjects?.[faculty]) {
    return null;
  }

  const semesters = ['HK1', 'HK2', 'HK3', 'HK4'];
  const allSubjects = {
    mandatory: {},
    elective: {}
  };

  semesters.forEach(semester => {
    const semesterData = firebaseData.subjects.facultySubjects[faculty][semester];
    if (semesterData) {

      Object.entries(semesterData.mandatory || {}).forEach(([subjectCode, subjectData]) => {
        allSubjects.mandatory[subjectCode] = {
          ...subjectData,
          semester: semester
        };
      });

      Object.entries(semesterData.elective || {}).forEach(([subjectCode, subjectData]) => {
        allSubjects.elective[subjectCode] = {
          ...subjectData,
          semester: semester
        };
      });
    }
  });

  return allSubjects;
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
  const { faculty, major } = studentInfo;

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