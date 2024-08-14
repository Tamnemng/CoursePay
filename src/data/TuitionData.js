import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//hàm lấy ds SV
export const getStudents = (callback) => {
    const studentsRef = ref(database, 'student');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      const studentsList = Object.entries(data).map(([id, student]) => ({
        stuID: id,
        stuName: student.name,
        spe: student.spe ? 'Có' : 'Không'
      }));
      callback(studentsList);
    });
  };


// Hàm lấy dữ liệu hóa đơn
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