import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue, update } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const getStudents = (callback) => {
  const usersRef = ref(database, 'users');
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const studentsList = Object.entries(data)
      .filter(([, user]) => user.role === 1)
      .map(([id, user]) => {
        const paidFees = [];
        const unpaidFees = [];

        if (user.fees) {
          Object.entries(user.fees).forEach(([feeId, fee]) => {
            const feeInfo = {
              id: feeId,
              name: fee.name,
              amount: fee.amount
            };
            if (fee.paid) {
              paidFees.push({ ...feeInfo, paymentDate: fee.paymentDate });
            } else {
              unpaidFees.push(feeInfo);
            }
          });
        }

        return {
          id,
          ...(user.info || {}),
          role: 1,
          paidFees,
          unpaidFees,
          totalFees: (paidFees.length + unpaidFees.length)
        };
      });
    callback(studentsList);
  });
};


export const getFees = (callback) => {
  const usersRef = ref(database, 'users');
  get(usersRef).then((snapshot) => {
    const data = snapshot.val();
    const uniqueFees = new Map();

    Object.values(data).forEach((user) => {
      if (user.fees) {
        Object.entries(user.fees).forEach(([feeId, fee]) => {
          if (!uniqueFees.has(feeId)) {
            uniqueFees.set(feeId, {
              id: feeId,
              name: fee.name,
              amount: fee.amount,
              paidCount: 0,
              unpaidCount: 0
            });
          }

          const feeEntry = uniqueFees.get(feeId);
          if (fee.paid) {
            feeEntry.paidCount++;
          } else {
            feeEntry.unpaidCount++;
          }
        });
      }
    });

    const feesList = Array.from(uniqueFees.values());
    callback(feesList);
  }).catch((error) => {
    console.error("Error fetching fees:", error);
    callback([]);
  });
};


export const addFeeToStudents = async (newFee, semester = '', faculty = '') => {
  const db = getDatabase();
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);
    const updates = {};
    let addedCount = 0;
    const newFeeId = `fee_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    snapshot.forEach((childSnapshot) => {
      const uid = childSnapshot.key;
      const userData = childSnapshot.val();

      if (userData.role === 1) {
        const userSemester = userData.info?.semester;
        const userFaculty = userData.info?.faculty;

        if (semester === '' || userSemester === semester || userFaculty === faculty || faculty === '') {
          const feeExists = Object.values(userData.fees || {}).some(
            (fee) => fee.name === newFee.name
          );

          if (!feeExists) {
            updates[`users/${uid}/fees/${newFeeId}`] = {
              name: newFee.name,
              amount: newFee.amount,
              paid: false
            };
            addedCount++;
          }
        }
      }
    });

    if (addedCount > 0) {
      await update(ref(db), updates);
      console.log(`Đã thêm học phí cho ${addedCount} sinh viên thành công`);
    } else {
      console.log('Không có sinh viên nào được thêm học phí hoặc phí đã tồn tại');
    }

    return addedCount;
  } catch (error) {
    console.error('Lỗi khi thêm học phí:', error);
    throw error;
  }
};

export const removeFeeFromAllStudents = async (feeIdToRemove) => {
  const db = getDatabase();
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);
    const updates = {};

    snapshot.forEach((childSnapshot) => {
      const uid = childSnapshot.key;
      const userData = childSnapshot.val();

      if (userData.role === 1 && userData.fees && userData.fees[feeIdToRemove]) {
        updates[`users/${uid}/fees/${feeIdToRemove}`] = null;
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
      console.log(`Đã xóa học phí khỏi ${Object.keys(updates).length} sinh viên thành công`);
    } else {
      console.log('Không tìm thấy học phí cần xóa ở bất kỳ sinh viên nào');
    }
  } catch (error) {
    console.error('Lỗi khi xóa học phí:', error);
    throw error;
  }
};

export const editFeeForStudents = async (feeId, updatedFee) => {
  const db = getDatabase();
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);
    const updates = {};

    snapshot.forEach((childSnapshot) => {
      const uid = childSnapshot.key;
      const userData = childSnapshot.val();

      if (userData.role === 1 && userData.fees && userData.fees[feeId]) {
        updates[`users/${uid}/fees/${feeId}`] = {
          ...userData.fees[feeId],
          ...updatedFee
        };
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
      console.log(`Đã chỉnh sửa học phí cho ${Object.keys(updates).length} sinh viên thành công`);
    } else {
      console.log('Không tìm thấy học phí cần chỉnh sửa ở bất kỳ sinh viên nào');
    }

    return Object.keys(updates).length;
  } catch (error) {
    console.error('Lỗi khi chỉnh sửa học phí:', error);
    throw error;
  }
};
