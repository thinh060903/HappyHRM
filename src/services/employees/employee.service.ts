import { supabase } from '../supabase/client';
import type { Employee } from '../../types/employee/employee';
import type { EmployeeRow } from '../../types/employee/employeeRow';

const mapEmployee = (r: EmployeeRow): Employee => ({
  id: r.id,
  name: r.name,
  email: r.email,
  title: r.title,
  department: r.department,
  avatar: r.avatar ?? undefined,
  createdAt: new Date(r.created_at).getTime(),
});

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as EmployeeRow[]).map(mapEmployee);
  },
};
