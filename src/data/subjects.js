import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
  update,
  remove,
} from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

export const getMajorSubjects = () => {
  return get(child(dbRef, "/subjects/majorSubjects"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return {
          status: "success",
          data: snapshot.val(),
        };
      } else {
        return {
          status: "error",
          code: "database/empty",
          message: "No majorSubject",
        };
      }
    })
    .catch((error) => {
      return {
        status: "error",
        code: error.code,
        message: error.message,
      };
    });
};

export const getMajorSubjectDetail = (subjectId) => {
  return get(child(dbRef, "/subjects/majorSubjects"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let subjectDetail = null;
        for (const faculty in data) {
          for (const major in data[faculty]) {
            for (const semester in data[faculty][major]) {
              const types = data[faculty][major][semester];
              for (const type in types) {
                const subjectIdList = types[type];
                if (subjectIdList[subjectId]) {
                  const classSectionWithId = Object.keys(
                    subjectIdList[subjectId].classSections
                  ).map((classId) => ({
                    id: classId,
                    ...subjectIdList[subjectId].classSections[classId],
                  }));

                  subjectDetail = {
                    id: subjectId,
                    name: subjectIdList[subjectId].name,
                    credits: subjectIdList[subjectId].credits,
                    faculty,
                    major,
                    semester,
                    type: type,
                    classSections: classSectionWithId,
                  };
                  return {
                    status: "success",
                    data: subjectDetail,
                  };
                }
              }
            }
          }
        }
        return {
          status: "error",
          code: "database/not_found",
          message: "Class not found for this subjectId",
        };
      } else {
        return {
          status: "error",
          code: "database/empty",
          message: "No majorSubjects",
        };
      }
    })
    .catch((error) => {
      return {
        status: "error",
        code: error.code,
        message: error.message,
      };
    });
};

export const addMajorClassSection = async (subjectId, newClassSection) => {
  try {
    const majorSubjectDetail = await getMajorSubjectDetail(subjectId);
    if (majorSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        majorSubjectDetail.message
      );
      return majorSubjectDetail;
    }

    const { faculty, major, semester, type } = majorSubjectDetail.data;
    const classSectionsRef = ref(
      database,
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections`
    );

    const classIdRef = child(classSectionsRef, newClassSection.classId);
    const classIdSnapshot = await get(classIdRef);
    if (classIdSnapshot.exists()) {
      console.error("Class ID already exists:", newClassSection.classId);
      return {
        status: "error",
        code: "database/exists",
        message: "ClassId already exists. Please choose a different classId.",
      };
    }

    await set(classIdRef, newClassSection);
    console.log("Class section added successfully:", newClassSection);
    return {
      status: "success",
      message: "Class section added successfully.",
    };
  } catch (error) {
    console.error("Failed to add class section:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const updateMajorClassSection = async (subjectId, updatedClassSection) => {
  try {
    const majorSubjectDetail = await getMajorSubjectDetail(subjectId);
    if (majorSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        majorSubjectDetail.message
      );
      return majorSubjectDetail;
    }

    const { faculty, major, semester, type, classSections } =
      majorSubjectDetail.data;
    // Kiểm tra nếu classId mới có trùng với lớp học phần khác
    const isClassIdUnique = classSections.every(
      (section) =>
        section.id !== updatedClassSection.id ||
        section.id === updatedClassSection.originalId
    );

    if (!isClassIdUnique) {
      return {
        status: "error",
        code: "database/classId_duplicate",
        message: "ClassId đã tồn tại, vui lòng chọn ClassId khác.",
      };
    }

    const classSectionRef = ref(
      database,
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${updatedClassSection.id}`
    );

    await update(classSectionRef, updatedClassSection);
    console.log("Class section updated successfully:", updatedClassSection);
    return {
      status: "success",
      message: "Class section updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update class section:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const deleteMajorClassSection = async (subjectId, classSectionId) => {
  try {
    const majorSubjectDetail = await getMajorSubjectDetail(subjectId);
    if (majorSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        majorSubjectDetail.message
      );
      return majorSubjectDetail;
    }

    const { faculty, major, semester, type } = majorSubjectDetail.data;
    const classSectionRef = ref(
      database,
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${classSectionId}`
    );

    await remove(classSectionRef);
    console.log("Class section deleted successfully:", classSectionId);
    return {
      status: "success",
      message: "Class section deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete class section:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const addMajorSubject = async (subjectData) => {
  try {
    const subjectsSnapshot = await get(child(dbRef, "/subjects/majorSubjects"));

    if (subjectsSnapshot.exists()) {
      const allSubjects = subjectsSnapshot.val();
      for (const faculty in allSubjects) {
        for (const major in allSubjects[faculty]) {
          for (const semester in allSubjects[faculty][major]) {
            for (const type in allSubjects[faculty][major][semester]) {
              const subjectsInType = allSubjects[faculty][major][semester][type];
              if (subjectsInType[subjectData.id]) {
                return {
                  status: "error",
                  code: "database/exists",
                  message: "Mã học phần này đã tồn tại.",
                };
              }
            }
          }
        }
      }
    }

    const subjectRef = ref(
      database,
      `/subjects/majorSubjects/${subjectData.faculty}/${subjectData.major}/${subjectData.semester}/${subjectData.type}/${subjectData.id}`
    );

    await set(subjectRef, {
      name: subjectData.name,
      credits: subjectData.credits,
      classSections: "",
    });

    console.log("Môn học đã được thêm thành công:", subjectData);
    return {
      status: "success",
      message: "Môn học đã được thêm thành công.",
    };
  } catch (error) {
    console.error("Lỗi khi thêm môn học:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

