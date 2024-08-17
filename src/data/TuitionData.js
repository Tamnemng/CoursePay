import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue } from 'firebase/database';
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
              paidFees.push({...feeInfo, paymentDate: fee.paymentDate});
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

export function getFees(studentID, callback) {
  const studentRef = ref(database, `student/${studentID}/fees`);

  onValue(studentRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      const cleanedData = data.filter(item => item !== null);

      const fees = cleanedData.map((fee, index) => ({
        key: index,
        paymID: index + 1,
        paymName: fee.name || '',
        /*amount: fee.amount || 0,
        paid: fee.paid ? 'Đã thanh toán' : 'Chưa thanh toán',
        paymentDate: fee.paymentDate || ''*/
      }));
      callback(fees);
    } else {
      callback([]);
    }
  });
}