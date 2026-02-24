import { supabase } from '../supabase/client';
import type { Employee } from '../../types/employee/employee';
import type { EmployeeRow } from '../../types/employee/employeeRow';

function toCreatedAtMs(value: string) {
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? Date.now() : ms;
}

const mapEmployee = (r: EmployeeRow): Employee => ({
  id: r.id,
  name: r.name,
  email: r.email,
  title: r.title,
  department: r.department,
  avatar: r.avatar ?? undefined,
  createdAt: toCreatedAtMs(r.created_at),
});

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load employees: ${error.message}`);
    }

    const rows: EmployeeRow[] = Array.isArray(data)
      ? (data as EmployeeRow[])
      : [];
    return rows.map(mapEmployee);
  },
};
