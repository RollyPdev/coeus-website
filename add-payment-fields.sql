-- Add missing fields to Payment table if they don't exist
DO $$ 
BEGIN
    -- Add promoAvails column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'promoAvails') THEN
        ALTER TABLE "Payment" ADD COLUMN "promoAvails" DOUBLE PRECISION DEFAULT 0;
    END IF;
    
    -- Add paymentStatus column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Payment' AND column_name = 'paymentStatus') THEN
        ALTER TABLE "Payment" ADD COLUMN "paymentStatus" TEXT DEFAULT 'downpayment';
    END IF;
END $$;