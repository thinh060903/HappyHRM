export type EmployeeDetailModel = {
    id: string;
    name: string;
    avatar: string;
    role: string;
    location: string;
    status: 'Đang làm việc' | 'Nghỉ việc' | 'Tạm nghỉ';
    code: string;
    email: string;
    department: string;
    birthday: string;
    phone: string;
    citizenId: string;
    issuedPlace: string;
    issuedDate: string;
    contracts: {
        id: string;
        title: string;
        range?: string; // "27/9/2022 - 27/11/2022"
        inactive?: boolean;
    }[];
};