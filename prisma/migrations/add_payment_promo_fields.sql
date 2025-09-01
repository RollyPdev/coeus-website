-- Add promo avails and payment status fields to Payment table
ALTER TABLE "Payment" 
ADD COLUMN "promoAvails" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN "paymentStatus" TEXT DEFAULT 'downpayment';

-- Update existing payments to have default values
UPDATE "Payment" 
SET "promoAvails" = 0, "paymentStatus" = 'downpayment' 
WHERE "promoAvails" IS NULL OR "paymentStatus" IS NULL;