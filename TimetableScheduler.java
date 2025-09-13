import java.util.*;

class Classroom {
    String name;
    Classroom(String name) { this.name = name; }
}

class Teacher {
    String name, subject;
    Teacher(String name, String subject) {
        this.name = name;
        this.subject = subject;
    }
}

class Batch {
    String name;
    Batch(String name) { this.name = name; }
}

class TimeSlot {
    String range;
    TimeSlot(String range) { this.range = range; }
}

class ClassSession {
    String batch, subject, teacher;
    TimeSlot slot;
    Classroom room;
    ClassSession(String batch, String subject, String teacher, TimeSlot slot, Classroom room) {
        this.batch = batch;
        this.subject = subject;
        this.teacher = teacher;
        this.slot = slot;
        this.room = room;
    }
}

public class TimetableScheduler {
    static int classroomsCount = 2;
    static int totalSlots = 2;

    public static void main(String[] args) {
        Classroom[] classrooms = {new Classroom("C1"), new Classroom("C2")};
        Teacher[] teachers = {new Teacher("T1", "S1"), new Teacher("T2", "S2")};
        Batch[] batches = {new Batch("B1"), new Batch("B2")};
        TimeSlot[] slots = {
            new TimeSlot("5am-6am"),
            new TimeSlot("6am-7am"),
            new TimeSlot("7am-8am"),
            new TimeSlot("8am-9am"),
            new TimeSlot("9am-10am"),
            new TimeSlot("10am-11am"),
            new TimeSlot("11am-12pm"),
            new TimeSlot("12pm-1pm"),
            new TimeSlot("1pm-2pm"),
            new TimeSlot("2pm-3pm")
        };
        // Example: each batch needs 5 sessions for each subject
        int sessionsPerSubject = 5;

        // Array to hold the timetable. Each slot, each classroom.
        ClassSession[][] scheduledClasses = new ClassSession[totalSlots][classroomsCount];

        // Map to track how many sessions still remain per batch+subject
        Map<String, Integer> sessionsLeft = new HashMap<>();
        for (Batch batch : batches)
            for (Teacher teacher : teachers)
                sessionsLeft.put(batch.name + "-" + teacher.subject, sessionsPerSubject);

        // Greedy scheduling - loop until all sessions are placed or full
        boolean sessionsFoundInThisPass;
        do {
            sessionsFoundInThisPass = false;
            for (int slot = 0; slot < totalSlots; slot++) {
                for (int room = 0; room < classrooms.length; room++) {
                    if (scheduledClasses[slot][room] != null) continue;
                    // Try every (batch, teacher) combination
                    outer:
                    for (Batch batch : batches) {
                        for (Teacher teacher : teachers) {
                            String key = batch.name + "-" + teacher.subject;
                            if (sessionsLeft.get(key) == 0) continue; // Already placed

                            // Check if teacher & batch are both free at this slot in other rooms
                            if (!isTeacherFree(teacher.name, slot, scheduledClasses)) continue;
                            if (!isBatchFree(batch.name, slot, scheduledClasses)) continue;

                            // If so, place the session
                            scheduledClasses[slot][room] = new ClassSession(
                                batch.name, teacher.subject, teacher.name, slots[slot], classrooms[room]);
                            // Reduce sessions needed
                            sessionsLeft.put(key, sessionsLeft.get(key) - 1);
                            sessionsFoundInThisPass = true;
                            break outer; // Move to next slot/room to maximize utilization
                        }
                    }
                }
            }
        } while (sessionsFoundInThisPass);

        // Print result
        printSchedule(scheduledClasses, classrooms);
        // Print unfinished sessions if any
        for (Map.Entry<String, Integer> entry : sessionsLeft.entrySet()) {
            if (entry.getValue() > 0) {
                System.out.println("Unscheduled sessions for " + entry.getKey() + ": " + entry.getValue());
            }
        }
    }

    static boolean isTeacherFree(String teacherName, int slot, ClassSession[][] scheduledClasses) {
        for (int room = 0; room < scheduledClasses[slot].length; room++)
            if (scheduledClasses[slot][room] != null && scheduledClasses[slot][room].teacher.equals(teacherName))
                return false;
        return true;
    }

    static boolean isBatchFree(String batchName, int slot, ClassSession[][] scheduledClasses) {
        for (int room = 0; room < scheduledClasses[slot].length; room++)
            if (scheduledClasses[slot][room] != null && scheduledClasses[slot][room].batch.equals(batchName))
                return false;
        return true;
    }

    static void printSchedule(ClassSession[][] scheduledClasses, Classroom[] classrooms) {
        System.out.println("Time Slot         | Classroom | Batch | Subject | Teacher");
        System.out.println("----------------------------------------------------------");
        for (int slot = 0; slot < scheduledClasses.length; slot++) {
            for (int room = 0; room < classrooms.length; room++) {
                ClassSession cs = scheduledClasses[slot][room];
                if (cs != null) {
                    System.out.printf("%-16s |   %s      |  %s   |   %s    |  %s\n",
                            cs.slot.range, cs.room.name, cs.batch, cs.subject, cs.teacher);
                }
            }
        }
    }
}
