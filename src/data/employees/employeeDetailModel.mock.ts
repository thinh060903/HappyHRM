import { EmployeeDetailModel } from "../../types/employeeDetailModel";

// Fake data demo (sau này bạn thay bằng API/Firebase)
export const EMPLOYEES: EmployeeDetailModel[] = [
    {
        id: 'e01',
        name: 'Courtney Henry',
        avatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
        role: 'Python Developer',
        location: 'Trụ sở Hà Nội',
        status: 'Đang làm việc',
        code: 'APG221031001',
        email: 'henrycr@apec.com.vn',
        department: 'API - Phòng Quản lý Thiết kế',
        birthday: '24/05/1990',
        phone: '(+84) 123 456 789',
        citizenId: '0312001489',
        issuedPlace: 'Công An Hải Phòng',
        issuedDate: '15/10/2016',
        contracts: [
            {
                id: 'c1',
                title: 'Hợp đồng lao động 2',
                range: '27/9/2022 - 27/11/2022',
            },
            { id: 'c2', title: 'Hợp đồng bảo mật', range: '27/9/2022 - 27/11/2022' },
            { id: 'c3', title: 'Hợp đồng Thử việc', inactive: true },
        ],
    },
];