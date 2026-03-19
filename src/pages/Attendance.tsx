import { CalendarCheck, Users, UserX, Clock, LogIn, LogOut } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerInput } from '@/components/ui/date-picker';
import { mockEmployees } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday';

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  leave: 'إجازة',
  holiday: 'عطلة',
};

const statusVariants: Record<AttendanceStatus, 'active' | 'cancelled' | 'warning' | 'info' | 'inactive'> = {
  present: 'active',
  absent: 'cancelled',
  late: 'warning',
  leave: 'info',
  holiday: 'inactive',
};

const today = new Date().toISOString().split('T')[0];

type AttendanceRow = {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
};

export default function Attendance() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  // State for managing attendance
  const [attendanceData, setAttendanceData] = useState(
    mockEmployees.map((emp, i) => ({
      id: `att-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.nameAr,
      role: emp.role,
      department: emp.department,
      date: today,
      checkIn: emp.status === 'active' ? `0${7 + (i % 3)}:${i % 2 === 0 ? '00' : '30'}` : undefined,
      checkOut: emp.status === 'active' && i < 3 ? `1${6 + (i % 2)}:00` : undefined,
      status: (
        emp.status === 'on_leave' ? 'leave' :
        emp.status === 'terminated' ? 'absent' :
        i % 5 === 0 ? 'late' :
        'present'
      ) as AttendanceStatus,
    }))
  );

  const presentCount = attendanceData.filter((a) => a.status === 'present').length;
  const absentCount = attendanceData.filter((a) => a.status === 'absent').length;
  const lateCount = attendanceData.filter((a) => a.status === 'late').length;
  const leaveCount = attendanceData.filter((a) => a.status === 'leave').length;

  const handleCheckIn = (employeeId: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendanceData(prev => prev.map(record => 
      record.employeeId === employeeId 
        ? { ...record, checkIn: time, status: 'present' as AttendanceStatus }
        : record
    ));
  };

  const handleCheckOut = (employeeId: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendanceData(prev => prev.map(record => 
      record.employeeId === employeeId 
        ? { ...record, checkOut: time }
        : record
    ));
  };

  const handleStatusChange = (employeeId: string, newStatus: AttendanceStatus) => {
    setAttendanceData(prev => prev.map(record => 
      record.employeeId === employeeId 
        ? { ...record, status: newStatus, checkIn: newStatus === 'present' ? record.checkIn : undefined, checkOut: newStatus === 'present' ? record.checkOut : undefined }
        : record
    ));
  };

  const columns = [
  {
    key: 'employeeName',
    header: 'الموظف',
    cell: (row: AttendanceRow) => (
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 font-semibold text-xs text-accent">
          {row.employeeName.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm">{row.employeeName}</p>
          <p className="text-xs text-muted-foreground">{row.role}</p>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'department',
    header: 'القسم',
    cell: (row: AttendanceRow) => (
      <span className="text-xs text-muted-foreground">{row.department}</span>
    ),
  },
  {
    key: 'checkIn',
    header: 'وقت الحضور',
    cell: (row: AttendanceRow) => (
      <span className="text-sm tabular-nums font-medium" dir="ltr">
        {row.checkIn ?? <span className="text-muted-foreground">—</span>}
      </span>
    ),
  },
  {
    key: 'checkOut',
    header: 'وقت الانصراف',
    cell: (row: AttendanceRow) => (
      <span className="text-sm tabular-nums" dir="ltr">
        {row.checkOut ?? <span className="text-muted-foreground">—</span>}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'إجراءات',
    cell: (row: AttendanceRow) => (
      <div className="flex items-center gap-2">
        {!row.checkIn && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCheckIn(row.employeeId)}
            className="h-8 px-2"
          >
            <LogIn className="h-3 w-3 ml-1" />
            حضور
          </Button>
        )}
        {row.checkIn && !row.checkOut && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCheckOut(row.employeeId)}
            className="h-8 px-2"
          >
            <LogOut className="h-3 w-3 ml-1" />
            انصراف
          </Button>
        )}
        <Select
          value={row.status}
          onValueChange={(value) => handleStatusChange(row.employeeId, value as AttendanceStatus)}
        >
          <SelectTrigger className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">حاضر</SelectItem>
            <SelectItem value="absent">غائب</SelectItem>
            <SelectItem value="late">متأخر</SelectItem>
            <SelectItem value="leave">إجازة</SelectItem>
            <SelectItem value="holiday">عطلة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'الحالة',
    cell: (row: AttendanceRow) => (
      <StatusBadge variant={statusVariants[row.status]} label={statusLabels[row.status]} />
    ),
  },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="الحضور والانصراف"
        description={`سجل الحضور ليوم ${formatDate(selectedDate)}`}
        actions={
          <div className="flex items-center gap-2">
            <DatePickerInput 
              date={new Date(selectedDate)} 
              onDateChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
            />
            <Button
              variant="outline"
              onClick={() => {
                // Reset attendance for new day
                setAttendanceData(mockEmployees.map((emp, i) => ({
                  id: `att-${emp.id}-${selectedDate}`,
                  employeeId: emp.id,
                  employeeName: emp.nameAr,
                  role: emp.role,
                  department: emp.department,
                  date: selectedDate,
                  checkIn: undefined,
                  checkOut: undefined,
                  status: 'present' as AttendanceStatus,
                })));
              }}
            >
              بدء يوم جديد
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 grid-cols-4">
        <StatCard title="حاضرون" value={presentCount} icon={Users} tone="success" />
        <StatCard title="غائبون" value={absentCount} icon={UserX} tone="danger" />
        <StatCard title="متأخرون" value={lateCount} icon={Clock} tone="warning" />
        <StatCard title="إجازات" value={leaveCount} icon={CalendarCheck} tone="info" />
      </div>

      <DataTable
        data={attendanceData}
        columns={columns}
        keyExtractor={(row) => row.id}
        searchPlaceholder="بحث بالاسم أو القسم..."
        searchKeys={['employeeName', 'role', 'department']}
        emptyState={
          <EmptyState
            icon={CalendarCheck}
            title="لا توجد سجلات حضور"
            description="لا توجد بيانات حضور لهذا اليوم"
          />
        }
      />
    </div>
  );
}
