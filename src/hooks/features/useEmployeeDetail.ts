import { useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { colors } from '../../themes/color';
import { EmployeeDetailModel } from '../../types/employee/employeeDetailModel';
import { EMPLOYEES } from '../../data/employees/employeeDetailModel.mock';

type RouteParams = {
  employeeId?: string;
  employee?: EmployeeDetailModel; // nếu bạn truyền thẳng object
};

export function useEmployeeDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = (route.params ?? {}) as RouteParams;

  const employee = useMemo(() => {
    if (params.employee) return params.employee;
    if (params.employeeId)
      return EMPLOYEES.find(e => e.id === params.employeeId);
    return EMPLOYEES[0];
  }, [params.employee, params.employeeId]);

  const statusColor =
    employee?.status === 'Đang làm việc'
      ? colors.success ?? '#34C759'
      : colors.error ?? colors.danger ?? '#FF3B30';

  const contracts = employee?.contracts ?? [];
  return {
    employee,
    statusColor,
    contracts,
    goBack: () => navigation.goBack(),
  };
}
