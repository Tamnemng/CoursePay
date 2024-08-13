var TuitionData = {
    "48.01.104.128": {
        name: "Nguyễn Phúc Thịnh",  
        id: "48.01.104.128",
        major: "cntt",              
        semester: 1, 
        spe: '0',              
        fees: [
            { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
            { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2024-07-15" },
            { id: 3, name: "Phí ký túc xá", amount: 2000000, paid: false, paymentDate: null },
            { id: 4, name: "Phí ăn uống", amount: 300000, paid: true, paymentDate: '2024-07-16' },
        ],
        registeredCourses: [
            { id: 1, name: "Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 2, name: "Course 2", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        ]
    },
    "48.01.104.029": {
        name: "Trần Văn A", 
        id: "48.01.104.029", 
        major: "spt",              
        semester: 2,   
        spe: '0',            
        fees: [
            { id: 1, name: "Học phí học kỳ", amount: 12000000, paid: true, paymentDate: "2024-07-20" },
            { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: false, paymentDate: null },
            { id: 3, name: "Phí ký túc xá", amount: 2500000, paid: true, paymentDate: "2024-07-22" },
        ],
        registeredCourses: [
            { id: 1, name: "Course 4", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 2, name: "Course 5", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        ]
    },
    "48.01.104.132": {
        name: "Nguyễn Phúc B", 
        id: "48.01.104.132",  
        major: "cntt",              
        semester: 1,
        spe: '1',               
        fees: [
            { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
            { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2024-07-15" },
            { id: 3, name: "Phí ký túc xá", amount: 2000000, paid: false, paymentDate: null },
            { id: 4, name: "Phí ăn uống", amount: 300000, paid: true, paymentDate: '2024-07-16' },
            { id: 5, name: "Trung tâm tin học", amount: 500000, paid: true, paymentDate: "2024-07-15" },
        ],
        registeredCourses: [
            { id: 1, name: "Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 2, name: "Course 2", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        ]
    },
    "48.01.104.004": {
        name: "Lê Nguyễn A",  
        id: "48.01.104.004", 
        major: "cntt",              
        semester: 1,            
        spe: '0',   
        fees: [
            { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
            { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2024-07-15" },
            { id: 3, name: "Trung tâm ngoại ngữ", amount: 300000, paid: true, paymentDate: '2024-07-16' },
        ],
        registeredCourses: [
            { id: 1, name: "Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 2, name: "Course 2", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
            { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        ]
    },
}
export default TuitionData;

export function addFee(studentId, newFee) {
    if (TuitionData[studentId]) {
        TuitionData[studentId].fees.push(newFee);
    } else {
        console.error("Student not found");
    }
}