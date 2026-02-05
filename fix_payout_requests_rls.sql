-- 1. DROP ALL POTENTIALLY RECURSIVE POLICIES
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all notes" ON admin_notes;
DROP POLICY IF EXISTS "Admins can insert notes" ON admin_notes;
DROP POLICY IF EXISTS "Admins can view logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "Admins can insert logs" ON admin_activity_logs;

-- 2. CREATE SAFETY FUNCTION (RECURSION-BREAKER)
-- SECURITY DEFINER makes the function run with the privileges of the creator (postgres),
-- bypassing RLS on the tables it queries.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role = 'admin')
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. APPLY CLEAN POLICIES TO PROFILES
-- Policy to allow users to see their own profile (Mandatory for Login)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy to allow admins to see everything
DROP POLICY IF EXISTS "Admins can view everything" ON profiles;
CREATE POLICY "Admins can view everything"
ON profiles FOR SELECT
USING (is_admin());

-- Policy to allow admins to update everything
DROP POLICY IF EXISTS "Admins can update everything" ON profiles;
CREATE POLICY "Admins can update everything"
ON profiles FOR UPDATE
USING (is_admin());

-- 4. APPLY TO PAYOUT_REQUESTS
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all payout requests" ON payout_requests;
CREATE POLICY "Admins can view all payout requests"
ON payout_requests FOR SELECT
USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all payout requests" ON payout_requests;
CREATE POLICY "Admins can update all payout requests"
ON payout_requests FOR UPDATE
USING (is_admin());

-- 5. APPLY TO TRANSACTIONS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions"
ON transactions FOR SELECT
USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert transactions" ON transactions;
CREATE POLICY "Admins can insert transactions"
ON transactions FOR INSERT
WITH CHECK (is_admin());
