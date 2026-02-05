-- Drop potentially conflicting policies first to ensure clean state
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins insert transactions" ON transactions;

-- 1. Allow Admins to UPDATE any profile (including role, status, balance)
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Allow Admins to INSERT transactions (for manual balance adjustments)
CREATE POLICY "Admins insert transactions"
ON transactions
FOR INSERT
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
