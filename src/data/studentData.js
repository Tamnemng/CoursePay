export const studentInfo =
{
    id: "48.01.104.128",
    name: "Nguyễn Phúc Thịnh",  
    major: "spa",                   //nganh hoc trong day co 5 nganh chinh trong datatester spa, cntt, spt, ,spnv ,sph
    semester: 's1n1',               //nam sinh vien s la hoc ki, n la nam. s1n1 la hk1 nam 1
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
        { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
        { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10' },
    ]
}
