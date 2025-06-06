
import * as XLSX from 'xlsx';
import { GeneratedTimetable } from './timetableGenerator';

export const exportTimetableToExcel = (timetable: GeneratedTimetable, filename: string = 'timetable.xlsx') => {
  const workbook = XLSX.utils.book_new();

  // Create a sheet for each department
  Object.entries(timetable).forEach(([department, departmentData]) => {
    const sheetData: any[] = [];
    
    // Create header row
    const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    const headerRow = ['Time', ...days];
    sheetData.push(headerRow);

    // Create data rows
    timeSlots.forEach(time => {
      const row = [time];
      days.forEach(day => {
        const slot = departmentData[day]?.[time];
        if (slot) {
          row.push(`${slot.subject} - ${slot.teacher} (${slot.room}) [${slot.batch}]${slot.isFixed ? ' [FIXED]' : ''}`);
        } else {
          row.push('');
        }
      });
      sheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, department);
  });

  // Create summary sheet
  const summaryData: any[] = [
    ['Department', 'Total Classes', 'Fixed Classes', 'Generated Classes'],
  ];

  Object.entries(timetable).forEach(([department, departmentData]) => {
    let total = 0;
    let fixed = 0;
    let generated = 0;

    Object.values(departmentData).forEach(day => {
      Object.values(day).forEach(slot => {
        total++;
        if (slot.isFixed) {
          fixed++;
        } else {
          generated++;
        }
      });
    });

    summaryData.push([department, total, fixed, generated]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  XLSX.writeFile(workbook, filename);
};

export const exportTimetableToPDF = async (timetable: GeneratedTimetable, filename: string = 'timetable.pdf') => {
  // For PDF export, we'll create an HTML table and use browser's print functionality
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = generatePrintableHTML(timetable);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

const generatePrintableHTML = (timetable: GeneratedTimetable): string => {
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>College Timetable</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .fixed { background-color: #e3f2fd; }
        .generated { background-color: #f3e5f5; }
        .department-title { margin-top: 30px; font-size: 18px; font-weight: bold; }
        @media print {
          .department { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>College Timetable</h1>
  `;

  Object.entries(timetable).forEach(([department, departmentData]) => {
    html += `
      <div class="department">
        <h2 class="department-title">${department} Department</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              ${days.map(day => `<th>${day}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    timeSlots.forEach(time => {
      html += '<tr>';
      html += `<td><strong>${time}</strong></td>`;
      
      days.forEach(day => {
        const slot = departmentData[day]?.[time];
        if (slot) {
          const className = slot.isFixed ? 'fixed' : 'generated';
          html += `
            <td class="${className}">
              <div><strong>${slot.subject}</strong></div>
              <div>${slot.teacher}</div>
              <div>${slot.room} - ${slot.batch}</div>
              ${slot.isFixed ? '<div><em>[FIXED]</em></div>' : ''}
            </td>
          `;
        } else {
          html += '<td></td>';
        }
      });
      
      html += '</tr>';
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  });

  html += `
    </body>
    </html>
  `;

  return html;
};

export const exportTeachersToExcel = (teachers: any[], filename: string = 'teachers.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(teachers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');
  XLSX.writeFile(workbook, filename);
};
