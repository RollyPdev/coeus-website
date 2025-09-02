-- Add indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_student_firstname ON "Student" ("firstName");
CREATE INDEX IF NOT EXISTS idx_student_lastname ON "Student" ("lastName");
CREATE INDEX IF NOT EXISTS idx_student_status ON "Student" ("status");
CREATE INDEX IF NOT EXISTS idx_student_name_status ON "Student" ("firstName", "lastName", "status");

-- Composite index for common search patterns
CREATE INDEX IF NOT EXISTS idx_student_search ON "Student" ("status", "firstName", "lastName", "studentId");