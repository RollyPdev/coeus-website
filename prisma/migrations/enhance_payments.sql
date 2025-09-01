-- Migration to add enhanced payment fields
-- Run this after updating the schema

-- Add new columns to Payment table
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"paymentGateway\" TEXT;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"gatewayTransactionId\" TEXT;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"gatewayResponse\" TEXT;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"dueDate\" TIMESTAMP(3);
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"refundAmount\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"refundReason\" TEXT;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"lateFee\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"discount\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"Payment\" ADD COLUMN IF NOT EXISTS \"tax\" DOUBLE PRECISION DEFAULT 0;

-- Add new columns to Enrollment table
ALTER TABLE \"Enrollment\" ADD COLUMN IF NOT EXISTS \"totalPaid\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"Enrollment\" ADD COLUMN IF NOT EXISTS \"remainingBalance\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"Enrollment\" ADD COLUMN IF NOT EXISTS \"installmentPlan\" TEXT;
ALTER TABLE \"Enrollment\" ADD COLUMN IF NOT EXISTS \"nextPaymentDue\" TIMESTAMP(3);

-- Add new columns to SiteSettings table
ALTER TABLE \"SiteSettings\" ADD COLUMN IF NOT EXISTS \"paymentGateways\" TEXT;
ALTER TABLE \"SiteSettings\" ADD COLUMN IF NOT EXISTS \"taxRate\" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE \"SiteSettings\" ADD COLUMN IF NOT EXISTS \"lateFeeRate\" DOUBLE PRECISION DEFAULT 0;

-- Create PaymentAuditLog table
CREATE TABLE IF NOT EXISTS \"PaymentAuditLog\" (
    \"id\" TEXT NOT NULL,
    \"paymentId\" TEXT NOT NULL,
    \"action\" TEXT NOT NULL,
    \"oldValues\" TEXT,
    \"newValues\" TEXT,
    \"performedBy\" TEXT NOT NULL,
    \"ipAddress\" TEXT,
    \"userAgent\" TEXT,
    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT \"PaymentAuditLog_pkey\" PRIMARY KEY (\"id\")
);

-- Create PaymentReminder table
CREATE TABLE IF NOT EXISTS \"PaymentReminder\" (
    \"id\" TEXT NOT NULL,
    \"enrollmentId\" TEXT NOT NULL,
    \"reminderType\" TEXT NOT NULL,
    \"message\" TEXT NOT NULL,
    \"scheduledDate\" TIMESTAMP(3) NOT NULL,
    \"sentDate\" TIMESTAMP(3),
    \"status\" TEXT NOT NULL DEFAULT 'pending',
    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \"updatedAt\" TIMESTAMP(3) NOT NULL,

    CONSTRAINT \"PaymentReminder_pkey\" PRIMARY KEY (\"id\")
);

-- Add foreign key constraints
ALTER TABLE \"PaymentAuditLog\" ADD CONSTRAINT \"PaymentAuditLog_paymentId_fkey\" FOREIGN KEY (\"paymentId\") REFERENCES \"Payment\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE \"PaymentReminder\" ADD CONSTRAINT \"PaymentReminder_enrollmentId_fkey\" FOREIGN KEY (\"enrollmentId\") REFERENCES \"Enrollment\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Update existing enrollments with calculated values
UPDATE \"Enrollment\" SET 
    \"totalPaid\" = COALESCE((
        SELECT SUM(amount) 
        FROM \"Payment\" 
        WHERE \"enrollmentId\" = \"Enrollment\".\"id\" 
        AND status = 'completed'
    ), 0),
    \"remainingBalance\" = GREATEST(0, \"amount\" - COALESCE((
        SELECT SUM(amount) 
        FROM \"Payment\" 
        WHERE \"enrollmentId\" = \"Enrollment\".\"id\" 
        AND status = 'completed'
    ), 0))
WHERE \"totalPaid\" = 0;