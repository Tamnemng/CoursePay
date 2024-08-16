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
        let paidFees = 0;
        let unpaidFees = 0;
        let totalFees = 0;
        
        if (user.fees) {
          Object.entries(user.fees).forEach(([feeId, fee]) => {
            totalFees += fee.amount;
            if (fee.paid) {
              paidFees += fee.amount;
            } else {
              unpaidFees += fee.amount;
            }
          });
        }

        return {
          id,
          ...(user.info || {}),
          role: 1,
          paidFees,  // This is now a number representing the total paid amount
          unpaidFees,  // This is now a number representing the total unpaid amount
          totalFees  // Total fees (paid + unpaid)
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