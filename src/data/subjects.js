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

export const getMajorClassSectionLength = async (subjectId) => {
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

export const getGeneralSubjects = () => {
  return get(child(dbRef, "/subjects/universityWideSubjects"))
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

export const getGeneralSubjectDetail = (subjectId) => {
  return get(child(dbRef, "/subjects/universityWideSubjects"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let subjectDetail = null;
        for (const semester in data) {
          for (const type in data[semester]) {
            const subjects = data[semester][type];
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
                faculty: subjects[subjectId].faculty,
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

export const getGeneralClassSectionLength = async (subjectId) => {
  try {
    const majorSubjectDetail = await getGeneralSubjectDetail(subjectId);
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

export const addGeneralClassSection = async (subjectId, newClassSection) => {
  try {
    const generalSubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (generalSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        generalSubjectDetail.message
      );
      return generalSubjectDetail;
    }

    const { semester, type } = generalSubjectDetail.data;
    const classSectionsRef = ref(
      database,
      `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}/classSections/${newClassSection.classId}`
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

export const updateGeneralClassSection = async (
  subjectId,
  updatedClassSection
) => {
  try {
    const generalSubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (generalSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        generalSubjectDetail.message
      );
      return generalSubjectDetail;
    }

    const { semester, type } = generalSubjectDetail.data;
    const classSectionsRef = ref(
      database,
      `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}/classSections`
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

export const deleteGeneralClassSection = async (subjectId, classSectionId) => {
  try {
    const generalSubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (generalSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        generalSubjectDetail.message
      );
      return generalSubjectDetail;
    }

    const { semester, type, classSections } = generalSubjectDetail.data;

    const classSectionsKeys = Object.keys(classSections || {});
    const hasMoreThanOneSection = classSectionsKeys.length > 1;

    const classSectionRef = ref(
      database,
      `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}/classSections/${classSectionId}`
    );

    await remove(classSectionRef);

    if (!hasMoreThanOneSection) {
      const subjectRef = ref(
        database,
        `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}`
      );
      await set(subjectRef, {
        name: generalSubjectDetail.data.name,
        credits: generalSubjectDetail.data.credits,
        faculty: generalSubjectDetail.data.faculty,
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

export const addGeneralSubject = async (subjectData) => {
  try {
    const subjectsSnapshot = await get(
      child(dbRef, "/subjects/universityWideSubjects")
    );

    if (subjectsSnapshot.exists()) {
      const allSubjects = subjectsSnapshot.val();
      for (const semester in allSubjects) {
        for (const type in allSubjects[semester]) {
          const subjectsInType = allSubjects[semester][type];
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

    const subjectRef = ref(
      database,
      `/subjects/universityWideSubjects/${subjectData.semester}/${subjectData.type}/${subjectData.id}`
    );

    const subjectDataToSet = {
      name: subjectData.name,
      credits: subjectData.credits,
      faculty: subjectData.faculty,
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

export const updateGeneralSubject = async (subjectId, updatedSubjectData) => {
  try {
    const generalSubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (generalSubjectDetail.status !== "success") {
      console.error(
        "Failed to get subject details:",
        generalSubjectDetail.message
      );
      return generalSubjectDetail;
    }

    const { semester, type } = generalSubjectDetail.data;
    const oldPath = `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}`;
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
      updatedSubjectData.semester !== semester ||
      updatedSubjectData.type !== type
    ) {
      // Remove from old location
      await remove(oldSubjectRef);

      // Add to new location
      const newPath = `/subjects/universityWideSubjects/${updatedSubjectData.semester}/${updatedSubjectData.type}/${subjectId}`;
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

export const deleteGeneralSubject = async (subjectId) => {
  try {
    const generalSubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (generalSubjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        generalSubjectDetail.message
      );
      return generalSubjectDetail;
    }

    const { semester, type } = generalSubjectDetail.data;

    const subjectRef = ref(
      database,
      `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}`
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

export const increaseMajorEnrolled = async (subjectId, classSectionsId) => {
  try {
    const subjectDetail = await getMajorSubjectDetail(subjectId);
    if (subjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        subjectDetail.message
      );
      return subjectDetail;
    }

    const { faculty, major, semester, type } = subjectDetail.data;
    const enrolledPath = `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${classSectionsId}/enrolled`;

    const enrolledRef = ref(database, enrolledPath);
    const snapshot = await get(enrolledRef);

    if (snapshot.exists()) {
      const currentEnrolled = snapshot.val() || 0;
      await set(enrolledRef, currentEnrolled + 1);
      return { status: "success", message: "Enrolled increased by 1" };
    } else {
      return { status: "error", message: "Enrolled value does not exist" };
    }
  } catch (error) {
    console.error("Failed to increase enrolled:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const decreaseMajorEnrolled = async (subjectId, classSectionsId) => {
  try {
    const subjectDetail = await getMajorSubjectDetail(subjectId);
    if (subjectDetail.status !== "success") {
      console.error(
        "Failed to get major subject details:",
        subjectDetail.message
      );
      return subjectDetail;
    }

    const { faculty, major, semester, type } = subjectDetail.data;
    const enrolledPath = `/subjects/majorSubjects/${faculty}/${major}/${semester}/${type}/${subjectId}/classSections/${classSectionsId}/enrolled`;

    const enrolledRef = ref(database, enrolledPath);
    const snapshot = await get(enrolledRef);

    if (snapshot.exists()) {
      const currentEnrolled = snapshot.val() || 0;
      await set(enrolledRef, currentEnrolled - 1);
      return { status: "success", message: "Enrolled increased by 1" };
    } else {
      return { status: "error", message: "Enrolled value does not exist" };
    }
  } catch (error) {
    console.error("Failed to increase enrolled:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const increaseGeneralEnrolled = async (subjectId, classSectionsId) => {
  try {
    const SubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (SubjectDetail.status !== "success") {
      console.error(
        "Failed to get general subject details:",
        SubjectDetail.message
      );
      return SubjectDetail;
    }

    const { semester, type } = SubjectDetail.data;
    const enrolledPath = `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}/classSections/${classSectionsId}/enrolled`;

    const enrolledRef = ref(database, enrolledPath);
    const snapshot = await get(enrolledRef);

    if (snapshot.exists()) {
      const currentEnrolled = snapshot.val() || 0;
      await set(enrolledRef, currentEnrolled + 1);
      return { status: "success", message: "Enrolled increased by 1" };
    } else {
      return { status: "error", message: "Enrolled value does not exist" };
    }
  } catch (error) {
    console.error("Failed to increase enrolled:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};

export const decreaseGeneralEnrolled = async (subjectId, classSectionsId) => {
  try {
    const SubjectDetail = await getGeneralSubjectDetail(subjectId);
    if (SubjectDetail.status !== "success") {
      console.error(
        "Failed to get general subject details:",
        SubjectDetail.message
      );
      return SubjectDetail;
    }

    const { semester, type } = SubjectDetail.data;
    const enrolledPath = `/subjects/universityWideSubjects/${semester}/${type}/${subjectId}/classSections/${classSectionsId}/enrolled`;

    const enrolledRef = ref(database, enrolledPath);
    const snapshot = await get(enrolledRef);

    if (snapshot.exists()) {
      const currentEnrolled = snapshot.val() || 0;
      await set(enrolledRef, currentEnrolled - 1);
      return { status: "success", message: "Enrolled increased by 1" };
    } else {
      return { status: "error", message: "Enrolled value does not exist" };
    }
  } catch (error) {
    console.error("Failed to increase enrolled:", error);
    return {
      status: "error",
      code: error.code,
      message: error.message,
    };
  }
};
