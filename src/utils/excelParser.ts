
import * as XLSX from 'xlsx';

export interface ExcelTeacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  availability: {
    [day: string]: string[];
  };
  maxHoursPerWeek: number;
}

export interface ExcelFixedSlot {
  department: string;
  subject: string;
  faculty: string;
  day: string;
  time: string;
  room: string;
  batch: string;
}

export interface ExcelSubjectMapping {
  subject: string;
  department: string;
  hoursPerWeek: number;
  batches: string[];
  requiredTeachers: number;
}

export interface ExcelClass {
  id: string;
  name: string;
  department: string;
  strength: number;
  subjects: string[];
}

export interface ExcelRoom {
  id: string;
  name: string;
  capacity: number;
  type: string;
  availability: {
    [day: string]: string[];
  };
}

export const parseTeachersFromExcel = async (file: File): Promise<ExcelTeacher[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const teachers: ExcelTeacher[] = jsonData.map((row: any, index: number) => ({
          id: row.ID || `teacher-${index + 1}`,
          name: row.Name || row.Teacher || '',
          email: row.Email || `${row.Name?.toLowerCase().replace(' ', '.')}@college.edu`,
          subjects: (row.Subjects || '').split(',').map((s: string) => s.trim()),
          availability: parseAvailability(row),
          maxHoursPerWeek: parseInt(row.MaxHours) || 20
        }));

        resolve(teachers);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const parseFixedSlotsFromExcel = async (file: File): Promise<ExcelFixedSlot[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const fixedSlots: ExcelFixedSlot[] = jsonData.map((row: any) => ({
          department: row.Department || '',
          subject: row.Subject || '',
          faculty: row.Faculty || row.Teacher || '',
          day: row.Day || '',
          time: row.Time || '',
          room: row.Room || '',
          batch: row.Batch || row.Class || ''
        }));

        resolve(fixedSlots);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const parseSubjectMappingsFromExcel = async (file: File): Promise<ExcelSubjectMapping[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const mappings: ExcelSubjectMapping[] = jsonData.map((row: any) => ({
          subject: row.Subject || '',
          department: row.Department || '',
          hoursPerWeek: parseInt(row.HoursPerWeek) || 3,
          batches: (row.Batches || '').split(',').map((b: string) => b.trim()),
          requiredTeachers: parseInt(row.RequiredTeachers) || 1
        }));

        resolve(mappings);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

const parseAvailability = (row: any): { [day: string]: string[] } => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const availability: { [day: string]: string[] } = {};
  
  days.forEach(day => {
    const dayAvailability = row[`${day}_Availability`] || row[day] || '';
    if (dayAvailability) {
      availability[day] = dayAvailability.split(',').map((time: string) => time.trim());
    } else {
      availability[day] = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '2:00-3:00', '3:00-4:00'];
    }
  });
  
  return availability;
};

export const generateSampleExcelFile = (type: 'teachers' | 'fixedSlots' | 'subjects') => {
  let sampleData: any[] = [];
  
  switch (type) {
    case 'teachers':
      sampleData = [
        {
          ID: 'T001',
          Name: 'Dr. John Smith',
          Email: 'john.smith@college.edu',
          Subjects: 'Data Structures, Algorithms',
          Monday_Availability: '9:00-10:00, 10:00-11:00, 2:00-3:00',
          Tuesday_Availability: '9:00-10:00, 11:00-12:00, 3:00-4:00',
          Wednesday_Availability: '10:00-11:00, 2:00-3:00, 3:00-4:00',
          Thursday_Availability: '9:00-10:00, 10:00-11:00, 2:00-3:00',
          Friday_Availability: '9:00-10:00, 11:00-12:00',
          MaxHours: 20
        },
        {
          ID: 'T002',
          Name: 'Prof. Sarah Johnson',
          Email: 'sarah.johnson@college.edu',
          Subjects: 'Database Systems, Web Development',
          Monday_Availability: '10:00-11:00, 11:00-12:00, 3:00-4:00',
          Tuesday_Availability: '9:00-10:00, 2:00-3:00, 3:00-4:00',
          Wednesday_Availability: '9:00-10:00, 11:00-12:00, 2:00-3:00',
          Thursday_Availability: '10:00-11:00, 11:00-12:00, 3:00-4:00',
          Friday_Availability: '9:00-10:00, 10:00-11:00, 2:00-3:00',
          MaxHours: 18
        }
      ];
      break;
    case 'fixedSlots':
      sampleData = [
        {
          Department: 'Computer Science',
          Subject: 'Data Structures',
          Faculty: 'Dr. John Smith',
          Day: 'Monday',
          Time: '9:00-10:00',
          Room: 'CS-101',
          Batch: 'CSE-A'
        },
        {
          Department: 'Computer Science',
          Subject: 'Database Systems',
          Faculty: 'Prof. Sarah Johnson',
          Day: 'Tuesday',
          Time: '10:00-11:00',
          Room: 'CS-102',
          Batch: 'CSE-B'
        }
      ];
      break;
    case 'subjects':
      sampleData = [
        {
          Subject: 'Data Structures',
          Department: 'Computer Science',
          HoursPerWeek: 4,
          Batches: 'CSE-A, CSE-B',
          RequiredTeachers: 1
        },
        {
          Subject: 'Database Systems',
          Department: 'Computer Science',
          HoursPerWeek: 3,
          Batches: 'CSE-A, CSE-B, CSE-C',
          RequiredTeachers: 2
        }
      ];
      break;
  }

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  const fileName = `sample_${type}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
