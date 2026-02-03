-- Replace 'YOUR_EMAIL_HERE' with the email of the user you want to make an admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'YOUR_EMAIL_HERE';
