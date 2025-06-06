
import { ExcelTeacher, ExcelFixedSlot, ExcelSubjectMapping, ExcelClass } from './excelParser';

export interface TimeSlot {
  day: string;
  time: string;
  subject?: string;
  teacher?: string;
  room?: string;
  batch?: string;
  isFixed: boolean;
  conflicts?: string[];
}

export interface GeneratedTimetable {
  [department: string]: {
    [day: string]: {
      [time: string]: {
        subject: string;
        teacher: string;
        room: string;
        batch: string;
        isFixed: boolean;
      };
    };
  };
}

export interface TimetableGenerationResult {
  timetable: GeneratedTimetable;
  conflicts: string[];
  statistics: {
    totalSlots: number;
    fixedSlots: number;
    generatedSlots: number;
    teacherUtilization: { [teacherId: string]: number };
    roomUtilization: { [roomId: string]: number };
  };
}

export class TimetableGenerator {
  private teachers: ExcelTeacher[];
  private fixedSlots: ExcelFixedSlot[];
  private subjectMappings: ExcelSubjectMapping[];
  private classes: ExcelClass[];
  private rooms: string[];
  private timeSlots: string[];
  private days: string[];

  constructor(
    teachers: ExcelTeacher[],
    fixedSlots: ExcelFixedSlot[],
    subjectMappings: ExcelSubjectMapping[],
    classes: ExcelClass[] = []
  ) {
    this.teachers = teachers;
    this.fixedSlots = fixedSlots;
    this.subjectMappings = subjectMappings;
    this.classes = classes;
    this.rooms = this.extractRooms();
    this.timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  public generateTimetable(): TimetableGenerationResult {
    const timetable: GeneratedTimetable = {};
    const conflicts: string[] = [];
    const occupiedSlots = new Map<string, TimeSlot>();

    // Initialize timetable structure
    this.initializeTimetable(timetable);

    // Step 1: Place all fixed slots
    this.placeFixedSlots(timetable, occupiedSlots, conflicts);

    // Step 2: Generate remaining slots using constraint-based algorithm
    this.generateRemainingSlots(timetable, occupiedSlots, conflicts);

    // Step 3: Calculate statistics
    const statistics = this.calculateStatistics(timetable, occupiedSlots);

    return {
      timetable,
      conflicts,
      statistics
    };
  }

  private initializeTimetable(timetable: GeneratedTimetable): void {
    const departments = Array.from(new Set([
      ...this.fixedSlots.map(slot => slot.department),
      ...this.subjectMappings.map(mapping => mapping.department)
    ]));

    departments.forEach(department => {
      timetable[department] = {};
      this.days.forEach(day => {
        timetable[department][day] = {};
      });
    });
  }

  private placeFixedSlots(
    timetable: GeneratedTimetable,
    occupiedSlots: Map<string, TimeSlot>,
    conflicts: string[]
  ): void {
    this.fixedSlots.forEach(slot => {
      const key = `${slot.day}-${slot.time}-${slot.room}`;
      const teacherKey = `${slot.day}-${slot.time}-${slot.faculty}`;
      const batchKey = `${slot.day}-${slot.time}-${slot.batch}`;

      // Check for conflicts
      if (occupiedSlots.has(key)) {
        conflicts.push(`Room conflict: ${slot.room} at ${slot.day} ${slot.time}`);
      }
      if (occupiedSlots.has(teacherKey)) {
        conflicts.push(`Teacher conflict: ${slot.faculty} at ${slot.day} ${slot.time}`);
      }
      if (occupiedSlots.has(batchKey)) {
        conflicts.push(`Batch conflict: ${slot.batch} at ${slot.day} ${slot.time}`);
      }

      // Place the slot
      if (!timetable[slot.department]) {
        timetable[slot.department] = {};
      }
      if (!timetable[slot.department][slot.day]) {
        timetable[slot.department][slot.day] = {};
      }

      timetable[slot.department][slot.day][slot.time] = {
        subject: slot.subject,
        teacher: slot.faculty,
        room: slot.room,
        batch: slot.batch,
        isFixed: true
      };

      // Mark slots as occupied
      occupiedSlots.set(key, {
        day: slot.day,
        time: slot.time,
        subject: slot.subject,
        teacher: slot.faculty,
        room: slot.room,
        batch: slot.batch,
        isFixed: true
      });
      occupiedSlots.set(teacherKey, {
        day: slot.day,
        time: slot.time,
        teacher: slot.faculty,
        isFixed: true
      });
      occupiedSlots.set(batchKey, {
        day: slot.day,
        time: slot.time,
        batch: slot.batch,
        isFixed: true
      });
    });
  }

  private generateRemainingSlots(
    timetable: GeneratedTimetable,
    occupiedSlots: Map<string, TimeSlot>,
    conflicts: string[]
  ): void {
    // For each subject mapping, try to schedule the required hours
    this.subjectMappings.forEach(mapping => {
      mapping.batches.forEach(batch => {
        let hoursScheduled = 0;
        const targetHours = mapping.hoursPerWeek;

        // Try to schedule this subject for this batch
        for (let attempt = 0; attempt < targetHours && hoursScheduled < targetHours; attempt++) {
          const slot = this.findBestSlot(mapping, batch, occupiedSlots);
          if (slot) {
            this.placeGeneratedSlot(timetable, slot, occupiedSlots);
            hoursScheduled++;
          } else {
            conflicts.push(`Could not schedule ${mapping.subject} for ${batch} (${targetHours - hoursScheduled} hours remaining)`);
            break;
          }
        }
      });
    });
  }

  private findBestSlot(
    mapping: ExcelSubjectMapping,
    batch: string,
    occupiedSlots: Map<string, TimeSlot>
  ): TimeSlot | null {
    const availableTeachers = this.teachers.filter(teacher => 
      teacher.subjects.includes(mapping.subject)
    );

    if (availableTeachers.length === 0) {
      return null;
    }

    // Try each day and time slot
    for (const day of this.days) {
      for (const time of this.timeSlots) {
        for (const teacher of availableTeachers) {
          // Check if teacher is available
          if (!teacher.availability[day]?.includes(time)) {
            continue;
          }

          // Check for conflicts
          const teacherKey = `${day}-${time}-${teacher.name}`;
          const batchKey = `${day}-${time}-${batch}`;

          if (occupiedSlots.has(teacherKey) || occupiedSlots.has(batchKey)) {
            continue;
          }

          // Find an available room
          const room = this.findAvailableRoom(day, time, occupiedSlots);
          if (!room) {
            continue;
          }

          return {
            day,
            time,
            subject: mapping.subject,
            teacher: teacher.name,
            room,
            batch,
            isFixed: false
          };
        }
      }
    }

    return null;
  }

  private findAvailableRoom(day: string, time: string, occupiedSlots: Map<string, TimeSlot>): string | null {
    for (const room of this.rooms) {
      const roomKey = `${day}-${time}-${room}`;
      if (!occupiedSlots.has(roomKey)) {
        return room;
      }
    }
    return null;
  }

  private placeGeneratedSlot(
    timetable: GeneratedTimetable,
    slot: TimeSlot,
    occupiedSlots: Map<string, TimeSlot>
  ): void {
    const department = this.getDepartmentForSubject(slot.subject!);
    
    if (!timetable[department]) {
      timetable[department] = {};
    }
    if (!timetable[department][slot.day]) {
      timetable[department][slot.day] = {};
    }

    timetable[department][slot.day][slot.time] = {
      subject: slot.subject!,
      teacher: slot.teacher!,
      room: slot.room!,
      batch: slot.batch!,
      isFixed: false
    };

    // Mark slots as occupied
    const roomKey = `${slot.day}-${slot.time}-${slot.room}`;
    const teacherKey = `${slot.day}-${slot.time}-${slot.teacher}`;
    const batchKey = `${slot.day}-${slot.time}-${slot.batch}`;

    occupiedSlots.set(roomKey, slot);
    occupiedSlots.set(teacherKey, slot);
    occupiedSlots.set(batchKey, slot);
  }

  private getDepartmentForSubject(subject: string): string {
    const mapping = this.subjectMappings.find(m => m.subject === subject);
    return mapping?.department || 'General';
  }

  private extractRooms(): string[] {
    const roomsFromFixed = this.fixedSlots.map(slot => slot.room);
    const defaultRooms = ['CS-101', 'CS-102', 'CS-103', 'CS-104', 'CS-105', 'M-201', 'M-202', 'P-301', 'P-302'];
    return Array.from(new Set([...roomsFromFixed, ...defaultRooms]));
  }

  private calculateStatistics(
    timetable: GeneratedTimetable,
    occupiedSlots: Map<string, TimeSlot>
  ): any {
    let totalSlots = 0;
    let fixedSlots = 0;
    let generatedSlots = 0;

    Object.values(timetable).forEach(department => {
      Object.values(department).forEach(day => {
        Object.values(day).forEach(slot => {
          totalSlots++;
          if (slot.isFixed) {
            fixedSlots++;
          } else {
            generatedSlots++;
          }
        });
      });
    });

    const teacherUtilization: { [teacherId: string]: number } = {};
    this.teachers.forEach(teacher => {
      const assignedSlots = Array.from(occupiedSlots.values()).filter(
        slot => slot.teacher === teacher.name
      ).length;
      teacherUtilization[teacher.name] = assignedSlots;
    });

    const roomUtilization: { [roomId: string]: number } = {};
    this.rooms.forEach(room => {
      const assignedSlots = Array.from(occupiedSlots.values()).filter(
        slot => slot.room === room
      ).length;
      roomUtilization[room] = assignedSlots;
    });

    return {
      totalSlots,
      fixedSlots,
      generatedSlots,
      teacherUtilization,
      roomUtilization
    };
  }
}
