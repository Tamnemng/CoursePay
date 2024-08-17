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
              for (const type in data[faculty][major][semester]) {
                const subjects = data[faculty][major][semester][type];
                if (subjects[subjectId]) {
                  const classSectionWithId = Object.entries(
                    subjects[subjectId].classSections || {}
                  ).map(([classId, classData]) => ({
                    id: classId,
                    ...classData,
                  }));

                  subjectDetail = {
                    id: subjectId,
                    name: subjects[subjectId].name,
                    credits: subjects[subjectId].credits,
                    faculty,
                    major,
                    semester,
                    type,
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
          message: "Subject not found for this subjectId",
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
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${newClassSection.classId}`
    );

    const { classId, ...classSectionDataWithoutId } = newClassSection;

    const classIdSnapshot = await get(classSectionsRef);
    if (classIdSnapshot.exists()) {
      console.error("Class ID already exists:", classId);
      return {
        status: "error",
        code: "database/exists",
        message: "ClassId already exists. Please choose a different classId.",
      };
    }

    await set(classSectionsRef, classSectionDataWithoutId);
    console.log("Class section added successfully:", classSectionDataWithoutId);
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

export const updateMajorClassSection = async (
  subjectId,
  updatedClassSection
) => {
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

    const { originalId, id, ...classSectionDataWithoutId } =
      updatedClassSection;
    const classSectionRef = child(classSectionsRef, originalId);

    await set(classSectionRef, {
      ...classSectionDataWithoutId,
    });

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

    const { faculty, major, semester, type, classSections } =
      majorSubjectDetail.data;

    const classSectionsKeys = Object.keys(classSections || {});
    const hasMoreThanOneSection = classSectionsKeys.length > 1;

    const classSectionRef = ref(
      database,
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${classSectionId}`
    );

    await remove(classSectionRef);

    if (!hasMoreThanOneSection) {
      const subjectRef = ref(
        database,
        `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}`
      );
      await set(subjectRef, {
        name: majorSubjectDetail.data.name,
        credits: majorSubjectDetail.data.credits,
        classSections: "",
      });
      console.log(
        "Class section deleted and classSections set to an empty string."
      );
    } else {
      console.log("Class section deleted successfully:", classSectionId);
    }

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

export const getClassSectionLength = async (subjectId) => {
  try {
    const majorSubjectDetail = await getMajorSubjectDetail(subjectId);
    if (majorSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        majorSubjectDetail.message
      );
      return 0;
    }

    const classSections = majorSubjectDetail.data.classSections || [];
    return classSections.length;
  } catch (error) {
    console.error("Failed to get class section count:", error);
    return 0;
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
              const subjectsInType =
                allSubjects[faculty][major][semester][type];
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

    const subjectDataToSet = {
      name: subjectData.name,
      credits: subjectData.credits,
      classSections: subjectData.classSections || "",
    };

    await set(subjectRef, subjectDataToSet);

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

export const updatedMajorSubject = async (subjectId, updatedSubjectData) => {
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
    const oldPath = `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}`;
    const oldSubjectRef = ref(database, oldPath);

    // Get the current subject data, including class sections
    const currentSubjectSnapshot = await get(oldSubjectRef);
    if (!currentSubjectSnapshot.exists()) {
      return {
        status: "error",
        code: "database/not_found",
        message: "Subject not found",
      };
    }
    const currentSubjectData = currentSubjectSnapshot.val();

    // Prepare updated subject data
    const updatedData = {
      name: updatedSubjectData.name,
      credits: updatedSubjectData.credits,
      classSections: currentSubjectData.classSections || "", // Preserve existing class sections
    };

    // If the subject is being moved to a different location
    if (
      updatedSubjectData.faculty !== faculty ||
      updatedSubjectData.major !== major ||
      updatedSubjectData.semester !== semester ||
      updatedSubjectData.type !== type
    ) {
      // Remove from old location
      await remove(oldSubjectRef);

      // Add to new location
      const newPath = `/subjects/majorSubjects/${updatedSubjectData.faculty}/${updatedSubjectData.major}/${updatedSubjectData.semester}/${updatedSubjectData.type}/${subjectId}`;
      const newSubjectRef = ref(database, newPath);
      await set(newSubjectRef, updatedData);
    } else {
      // Update in the same location
      await update(oldSubjectRef, updatedData);
    }

    console.log("Môn học đã được cập nhật thành công:", updatedData);
    return {
      status: "success",
      message: "Môn học đã được cập nhật thành công.",
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật môn học:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const deletedMajorSubject = async (subjectId) => {
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

    const subjectRef = ref(
      database,
      `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}`
    );

    await remove(subjectRef);

    return {
      status: "success",
      message: "Subject deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete subject:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};