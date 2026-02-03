🎵 Music Distribution Platform - Complete PRD (Product Requirements Document)

📋 Table of Contents

Executive Summary
Product Overview
User Personas
Functional Requirements
Technical Architecture
Database Schema
Security & Compliance
Scalability Strategy
File Storage & CDN
API Documentation
Third-Party Integrations
Performance Requirements
Monitoring & Analytics
Deployment Strategy
Testing Strategy
Timeline & Milestones
Budget Estimation
Risk Management
Future Roadmap

1. EXECUTIVE SUMMARY
   1.1 Product Name
   MusicFlow (working title - can be changed)
   1.2 Product Vision
   A scalable, secure music distribution platform that enables independent artists to upload their music with metadata and cover art, which is then aggregated into CSV format for distribution to major streaming platforms.
   1.3 Target Market

Independent musicians
Small record labels
Music producers
Content creators
Emerging artists in India and globally

1.4 Core Value Proposition

Simple, intuitive upload process
Automated metadata management
CSV-based aggregation for bulk distribution
Cloud-based storage with CDN delivery
Admin oversight and quality control
Scalable infrastructure for growth

1.5 Success Metrics (KPIs)

User registrations: Target 1000+ artists in first 6 months
Upload volume: 500+ tracks/month
System uptime: 99.9%
CSV generation accuracy: 100%
User satisfaction: 4.5+/5 stars
Distribution success rate: 95%+

2. PRODUCT OVERVIEW
   2.1 Problem Statement
   Independent artists struggle with:

Complex distribution processes
Technical barriers to entry
Lack of aggregation tools
Quality control concerns
Manual data management

2.2 Solution
A platform that:

Simplifies music upload process
Validates quality automatically
Aggregates data into industry-standard CSV
Provides admin oversight
Ensures secure cloud storage
Scales with growing user base

2.3 Product Type
B2B2C SaaS Platform (Business-to-Business-to-Consumer)
2.4 Revenue Model Options

Subscription-based: Monthly/Annual artist plans
Per-upload fee: One-time charge per track/album
Revenue share: Percentage of streaming royalties
Freemium: Free uploads + premium features
White-label: License to distributors/labels

3. USER PERSONAS
   3.1 Primary Persona: Independent Artist (Aman)
   Demographics:

Age: 22-35
Location: Tier 1 & 2 cities in India
Occupation: Full-time/Part-time musician
Tech proficiency: Medium

Goals:

Get music on Spotify, Apple Music, etc.
Maintain quality presentation
Track upload status
Easy metadata management

Pain Points:

Complex distribution processes
High costs of traditional distributors
Lack of technical knowledge
Difficulty tracking submissions

Behaviors:

Uploads 2-5 tracks per month
Active on social media
Seeks professional presentation
Values simplicity and speed

3.2 Secondary Persona: Small Label Owner (Priya)
Demographics:

Age: 30-45
Location: Urban areas
Occupation: Music label owner
Tech proficiency: Medium-High

Goals:

Manage multiple artists
Bulk upload capabilities
Quality control
Streamlined distribution

Pain Points:

Managing many artists manually
Ensuring metadata consistency
Tracking multiple submissions
Cost per release

Behaviors:

Uploads 20-50 tracks per month
Needs bulk operations
Requires detailed reporting
Values automation

3.3 Admin Persona: Platform Administrator (Rahul)
Demographics:

Age: 25-40
Location: Office-based
Occupation: Platform admin/moderator
Tech proficiency: High

Goals:

Monitor all uploads
Ensure quality standards
Generate accurate CSVs
Manage users effectively
Maintain platform health

Pain Points:

Manual review time
Data accuracy concerns
Scaling moderation efforts
Identifying fraudulent content

Behaviors:

Reviews 50-100 uploads daily
Exports CSVs weekly
Monitors system health
Communicates with artists

4. FUNCTIONAL REQUIREMENTS
   4.1 USER FEATURES (Detailed)
   4.1.1 Authentication & Authorization
   Registration:

Email + Password (min 8 chars, 1 uppercase, 1 number, 1 special char)
Google OAuth integration
Facebook OAuth integration
Apple Sign In
Email verification (6-digit OTP, expires in 10 mins)
Terms of Service acceptance (checkbox required)
Privacy Policy acceptance
Age verification (18+ required)
CAPTCHA (reCAPTCHA v3) on signup

Login:

Email/Password
OAuth options
"Remember Me" option (30-day session)
Failed login attempts tracking (lock after 5 attempts, 30 min cooldown)
IP-based suspicious activity detection
Device fingerprinting

Password Management:

Forgot Password flow:

Email OTP (6-digit, 10 min expiry)
Password reset link (valid 1 hour)
Password strength meter
Password history (can't reuse last 5 passwords)

Change Password (requires current password)
Force password change every 180 days (optional security setting)

Two-Factor Authentication (2FA):

SMS-based OTP
Email-based OTP
Authenticator app (TOTP - Google Authenticator, Authy)
Backup codes (10 one-time use codes)
2FA enforcement for admin accounts

Session Management:

JWT tokens (15 min access token, 7-day refresh token)
Session timeout after 30 mins inactivity
Logout from all devices option
Active sessions list with device info
Geographic location tracking

4.1.2 User Profile Management
Profile Fields:

Basic Information:

Artist/Stage Name* (required, 2-50 chars, unique)
Legal Name* (required, for contracts)
Email* (verified)
Phone Number (optional, with country code)
Date of Birth* (age verification)
Gender (optional, dropdown)
Country/Region\*
City
Postal Code

Artist Information:

Bio (rich text editor, max 2000 chars)
Profile Picture (JPG/PNG, max 5MB, min 400x400px)
Banner Image (optional, 1920x1080px recommended)
Artist Type (Solo/Band/Producer/Label)
Genres (multi-select, max 5)
Languages (multi-select)
Career Start Year

Social Media Links:

Spotify Artist Profile
Apple Music Profile
Instagram
Facebook
Twitter/X
YouTube Channel
SoundCloud
TikTok
Website

Payment Information:

Payee Name
Bank Name
Account Number
IFSC Code (for India)
Swift Code (for international)
PayPal Email
UPI ID (for India)
Tax ID/PAN Number
GST Number (if applicable)

Notification Preferences:

Email notifications (on/off)
SMS notifications (on/off)
Push notifications (on/off)
Notification types:

Upload status updates
Distribution updates
Platform announcements
Marketing emails
Weekly digest

Privacy Settings:

Profile visibility (Public/Private)
Show email to other users (on/off)
Show phone number (on/off)
Allow marketing communications (on/off)

Profile Actions:

Edit profile
Upload/change profile picture (with crop tool)
Upload/change banner
Verify email (resend verification)
Verify phone number
Download profile data (GDPR compliance)
Delete account (with confirmation + 30-day grace period)

4.1.3 Dashboard (Artist Dashboard)
Overview Section:

Welcome message with artist name
Quick stats cards:

Total Uploads (all time)
Pending Uploads (awaiting approval)
Approved Uploads
Rejected Uploads
Live Tracks (on platforms)
Total Storage Used (GB/MB)
Account Status (Active/Suspended)

Recent Activity Feed:

Last 10 activities with timestamps:

"Track uploaded successfully"
"Track approved by admin"
"Track rejected - reason: poor audio quality"
"Profile updated"
"New notification"

Real-time updates (WebSocket)

Quick Actions:

Upload New Track (prominent button)
View All Uploads
Edit Profile
Contact Support

Charts & Analytics:

Upload history (last 6 months) - line chart
Status breakdown - pie chart (Pending/Approved/Rejected/Live)
Genre distribution - bar chart
Monthly upload trends

Notifications Center:

Unread notification count badge
Notification dropdown:

Upload status changes
Admin messages
Platform announcements
Payment updates

Mark as read/unread
Delete notifications
Notification settings link

Storage Usage:

Visual progress bar
Used vs Available storage
Upgrade plan option (if applicable)

4.1.4 Music Upload Section
Upload Interface:
Step 1: File Upload

Audio File:

Drag & drop zone (primary)
Browse button (secondary)
Supported formats: MP3 (320kbps recommended), WAV (16/24-bit), FLAC
File size limit: 500MB per file
Multiple file upload (up to 10 tracks at once for album)
Upload progress bar (percentage + MB uploaded/total)
Cancel upload option
Resume upload on connection failure
Upload speed indicator
Estimated time remaining
Auto-pause on network disconnection, auto-resume on reconnection

Audio Validation (Real-time):

✅ Format check (MP3/WAV/FLAC only)
✅ Bitrate check (minimum 128kbps for MP3)
✅ Sample rate check (44.1kHz or 48kHz recommended)
✅ Channel check (Stereo/Mono)
✅ Duration check (minimum 30 seconds, maximum 15 minutes)
✅ Silence detection (no complete silence tracks)
✅ Audio clipping detection (peak level warning)
✅ Metadata reading (embedded ID3 tags)
⚠️ Warnings display (non-blocking)
❌ Error display (blocking, prevents submission)

Cover Art Upload:

Drag & drop zone
Browse button
Supported formats: JPG, PNG, WebP
File size limit: 10MB
Minimum dimensions: 3000x3000px (Spotify/Apple requirement)
Recommended: Square aspect ratio (1:1)
Image preview (thumbnail + full size)
Built-in crop tool:

Aspect ratio lock (1:1)
Zoom in/out
Rotate
Brightness/Contrast adjustment

Auto-resize option (downscale to exact 3000x3000)
Dimension validation (real-time)
DPI check (minimum 72 DPI)
Color space warning (RGB recommended)

Step 2: Metadata Form
Track Information:

Track Title\* (required)

Input field
Max 100 characters
Character counter
No special characters validation
Duplicate track name warning (within same artist)

Artist Name\* (required)

Auto-populated from profile
Edit option (for featuring artists)
Multi-artist support (comma-separated)
Primary artist dropdown (for collaborations)

Album/Single\* (required)

Radio buttons: Single / Album / EP
If Album/EP:

Album Name* (required)
Track Number* (required, 1-99)
Total Tracks in Album*
Disc Number (for multi-disc albums)
Album Release Date*

Genre\* (required)

Dropdown with search
Primary Genre\* (required)
Secondary Genre (optional)
Available genres:

Pop, Rock, Hip Hop, R&B, Electronic, Dance
Classical, Jazz, Blues, Country, Folk
Indie, Alternative, Metal, Punk
Reggae, Latin, World, Bollywood
Devotional, Ghazal, Sufi, Qawwali
Carnatic, Hindustani, Remix, Instrumental
(50+ genres total)

Language\* (required)

Dropdown: Hindi, English, Punjabi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Urdu, Others
Multi-language option (for multilingual tracks)

Release Date\* (required)

Date picker
Cannot be more than 2 years in past
Cannot be more than 1 year in future
Time zone selection
Pre-save campaign option (if future date)

Explicit Content\* (required)

Checkbox: "This track contains explicit content"
Warning about platform restrictions
Parental Advisory tag option

Additional Metadata:

ISRC Code (International Standard Recording Code)

Input field (format: XX-XXX-YY-NNNNN)
Format validation
Auto-generate option (platform generates unique ISRC)
Check for duplicates
ISRC lookup/validation via external API

UPC/EAN Code (for albums)

Input field (12-13 digits)
Format validation
Auto-generate option
Required for albums, optional for singles

Track Duration

Auto-detected from audio file
Display format: MM:SS
Manual override option (for edge cases)

Lyrics (optional)

Rich text editor
Max 10,000 characters
Time-synced lyrics option (LRC format upload)
Language selection
Romanized lyrics option (for non-Latin scripts)

Credits & Contributors:

Primary Artist\* (auto-filled)
Featured Artists (add multiple)

Name
Role (Featured/With/vs)

Songwriter/Composer (add multiple)

Name
Role (Composer/Lyricist/Both)
Split percentage (for royalty distribution)

Producer (add multiple)
Mixing Engineer
Mastering Engineer
Record Label
Publisher
Copyright Holder
P Line (℗ 2024 Artist Name)
C Line (© 2024 Label Name)

Advanced Settings:

Territories/Countries:

Worldwide (default)
Exclude specific countries (multi-select)
Include only specific countries

Distribution Platforms:

Select all (default)
Custom selection:

Spotify
Apple Music
YouTube Music
Amazon Music
Deezer
Tidal
JioSaavn
Gaana
Wynk
Resso
(20+ platforms)

Pre-order/Pre-save:

Enable pre-order (for future releases)
Pre-save link generation

Monetization:

Enable monetization (default: yes)
Content ID (for YouTube)
Ad-supported vs Subscription-only

Privacy:

Public (visible on platforms)
Private (uploaded but not distributed)

Step 3: Review & Submit

Preview Section:

Audio player (with waveform visualization)
Cover art display (full size)
All metadata in readable format
Edit buttons for each section

Pre-submission Checklist:

✅ Audio quality meets standards
✅ Cover art meets requirements
✅ All required metadata filled
✅ No copyright violations declared
✅ Terms of distribution accepted

Terms & Conditions:

Checkbox: "I confirm I own the rights to this music"
Checkbox: "I agree to the distribution terms"
Link to full T&C document

Actions:

Save as Draft (saves all data, doesn't submit)
Submit for Review (primary action)
Discard (with confirmation)

Post-Upload:

Success message with upload ID
Estimated review time (24-48 hours)
Email confirmation sent
Redirect to "My Uploads" page
Track status: "Pending Review"

Draft Management:

Auto-save every 30 seconds
Manual save button
Draft list on dashboard
Resume editing anytime
Draft expiry: 90 days (auto-delete warning at 80 days)

Bulk Upload (for Albums):

Upload multiple audio files at once
CSV import for metadata (template provided)
Batch cover art upload (1 per track or shared album art)
Bulk edit common fields (album name, artist, release date)
Track order drag-and-drop

4.1.5 My Uploads (Track Management)
List View:
View Options:

Table view (default)
Card/Grid view
Compact list view

Table Columns:

Cover Art (thumbnail, 60x60px)
Track Title
Album Name
Genre
Upload Date (DD-MM-YYYY)
Status (color-coded badge)
Distribution Status
Actions (dropdown menu)

Filters:

Status Filter:

All (default)
Pending Review
Approved
Rejected
Live on Platforms
Draft
Archived

Date Range:

Today
Last 7 days
Last 30 days
Last 3 months
Last 6 months
Last year
All time
Custom range (date picker)

Genre Filter:

Multi-select dropdown
All genres listed

Album Filter:

All singles
All albums
Specific album (dropdown)

Distribution Status:

Not Distributed
In Queue
Distributed
Live
Failed

Search:

Search bar (searches: track title, album, ISRC, UPC)
Real-time search (debounced, 300ms)
Search suggestions/autocomplete

Sorting:

Sort by:

Upload Date (newest/oldest)
Track Title (A-Z, Z-A)
Status
Album Name
Genre

Default: Upload Date (newest first)

Bulk Actions:

Select all checkbox (header)
Individual checkboxes per row
Bulk actions dropdown:

Delete selected (with confirmation)
Archive selected
Export selected to CSV
Download selected audio files (ZIP)
Change distribution status

Pagination:

Items per page: 10, 25, 50, 100
Page numbers with first/last/prev/next
Total count display ("Showing 1-25 of 234 uploads")
Infinite scroll option (toggle in settings)

Track Actions (Per Row):

👁️ View Details (opens detail modal/page)
✏️ Edit (only if status = Draft or Pending)
🗑️ Delete (with confirmation, cannot delete if Live)
📥 Download Audio
📥 Download Cover Art
📋 Copy Share Link
📊 View Analytics (if live)
⏸️ Pause Distribution (if live)
🔄 Resubmit (if rejected)

Status Badges (Color-coded):

🟡 Draft (yellow) - Not submitted
🟠 Pending Review (orange) - Awaiting admin approval
🟢 Approved (green) - Approved, ready for distribution
🔴 Rejected (red) - Rejected by admin (with reason)
🔵 In Queue (blue) - Queued for distribution
🟣 Distributed (purple) - Sent to platforms
✅ Live (green checkmark) - Live on streaming platforms
⚠️ Failed (red warning) - Distribution failed (with error)
🗄️ Archived (gray) - Archived by user

4.1.6 Track Detail Page
Header Section:

Track title (H1)
Artist name (H2)
Status badge (large)
Upload date & time
Last updated timestamp

Audio Player:

Full-width audio player with controls:

Play/Pause
Current time / Total duration
Seek bar (waveform visualization)
Volume control
Download button
Share button

Keyboard shortcuts (Space = play/pause, Arrow keys = seek)

Cover Art:

Large display (500x500px)
Zoom on click (lightbox)
Download button
Edit button (if editable)

Metadata Display:
Basic Information:

Track Title
Artist Name(s)
Album Name
Track Number (if album)
Genre (Primary & Secondary)
Language
Release Date
Duration
Explicit Content (Yes/No)

Technical Details:

Audio Format (MP3/WAV/FLAC)
Bitrate (e.g., 320 kbps)
Sample Rate (e.g., 44.1 kHz)
File Size (MB)
Audio URL (copyable, admin only)
Cover Art URL (copyable, admin only)

Identifiers:

ISRC Code
UPC/EAN Code
Upload ID (unique)

Credits:

Featured Artists
Songwriter/Composer
Producer
Mixing Engineer
Mastering Engineer
Record Label
Publisher
Copyright (P Line, C Line)

Lyrics:

Full lyrics display (if provided)
Romanized version (if applicable)
Language

Distribution Information:

Distribution Status (badge)
Target Platforms (list with icons)
Territories (Worldwide / Specific countries)
Distribution Date (if distributed)
Platform-specific status:

Spotify: ✅ Live (link to Spotify)
Apple Music: 🟡 Pending
YouTube Music: ❌ Failed (error message)
(etc.)

Review Information (if Pending/Approved/Rejected):

Submitted on: [timestamp]
Reviewed on: [timestamp] (if reviewed)
Reviewed by: [Admin name]
Admin Notes/Feedback:

"Approved - High quality submission"
"Rejected - Cover art resolution too low. Please upload minimum 3000x3000px image and resubmit."

Rejection Reason (dropdown selection by admin):

Poor audio quality
Cover art doesn't meet requirements
Incomplete metadata
Copyright concerns
Inappropriate content
Other (with notes)

Activity Timeline:

Visual timeline of all actions:

📤 Uploaded - [date time]
🔍 Under Review - [date time]
✅ Approved - [date time]
📦 Queued for Distribution - [date time]
🚀 Distributed - [date time]
🎵 Live on Spotify - [date time]
🎵 Live on Apple Music - [date time]
(etc.)

Analytics (if Live):

Total Plays (across platforms)
Total Downloads
Platform breakdown (pie chart)
Geographic distribution (map)
Listener demographics
Revenue earned (if applicable)
Playlist additions
Save/Like count
Share count

Action Buttons:
Primary Actions:

✏️ Edit Metadata (if status allows)

Opens edit form
Cannot edit if Live (show warning + contact support option)
Can edit draft anytime

🔄 Resubmit (if Rejected)

Fix issues and resubmit for review
Previous rejection reason displayed

🗑️ Delete Track (if not Live)

Confirmation modal
"Are you sure? This action cannot be undone."
Password confirmation for security
Cannot delete if Live (must contact support)

🗄️ Archive (if Live)

Keeps record but hides from main list
Can unarchive later

Secondary Actions:

📥 Download Audio File
📥 Download Cover Art
📋 Copy Track URL
📧 Share via Email
💬 Contact Support (about this track)
📊 View Full Analytics (if live)
⏸️ Request Takedown (if live)

Opens support ticket
Removes from platforms (7-14 days process)

Distribution Management (if applicable):

Pause Distribution

Temporarily stops promotion
Does not remove from platforms

Resume Distribution

Resumes promotion

Request Takedown

Complete removal request
Support ticket created

Comments/Notes Section:

User can add private notes about this track
Not visible to admin
Rich text editor
Auto-save

Related Uploads:

Other tracks from same album (if album)
Other tracks by same artist
Similar genre tracks (suggestions)

4.1.7 Notifications System
Notification Types:

Upload Notifications:

"Your track '[Track Name]' has been uploaded successfully"
"Upload failed for '[Track Name]' - [error reason]"
"Your track '[Track Name]' is now under review"

Review Notifications:

"Your track '[Track Name]' has been approved! ✅"
"Your track '[Track Name]' was rejected. Reason: [reason]. Please make changes and resubmit."
"Your track '[Track Name]' requires additional information"

Distribution Notifications:

"Your track '[Track Name]' has been queued for distribution"
"Your track '[Track Name]' has been distributed to platforms"
"Your track '[Track Name]' is now live on Spotify! 🎉"
"Your track '[Track Name]' is now live on Apple Music! 🎉"
"Distribution failed for '[Track Name]' - [error]"

System Notifications:

"Welcome to [Platform Name]! Complete your profile to get started"
"Your profile is 60% complete. Add payment details to receive royalties"
"New feature available: [Feature Name]"
"Scheduled maintenance on [date] from [time] to [time]"
"Platform update: [Update details]"

Account Notifications:

"New login from [Device] at [Location]"
"Password changed successfully"
"2FA enabled on your account"
"Email address updated"
"Payment details updated"

Payment Notifications (if applicable):

"Payment of $[amount] has been processed"
"Payment failed - please update payment method"
"Royalty statement available for [month]"

Support Notifications:

"Your support ticket #[ID] has been created"
"Update on your support ticket #[ID]"
"Your support ticket #[ID] has been resolved"

Notification Channels:

In-App Notifications:

Notification bell icon (header)
Unread count badge
Dropdown panel:

Last 20 notifications
Mark as read/unread
Delete notification
"View All" link

Real-time updates (WebSocket)
Browser notifications (with permission)

Email Notifications:

Immediate emails (for critical actions)
Daily digest (optional, configurable)
Weekly summary (optional)
HTML formatted emails
Plain text fallback
Unsubscribe link in footer
Preference center link

SMS Notifications (optional):

Critical only (e.g., approval, live)
OTP for verification
Rate limited to prevent spam
Opt-in required

Push Notifications (mobile app):

Mobile app notifications
Configurable per notification type
Do Not Disturb hours

Notification Preferences:
User can control:

Enable/Disable per notification type
Channel preference per type (email/SMS/push/in-app)
Frequency (immediate/daily digest/weekly)
Quiet hours (no notifications during specific times)
Critical notifications only mode

Notification Management:

All Notifications Page:

List of all notifications (paginated)
Filter by type
Filter by read/unread
Search notifications
Bulk actions (mark all as read, delete all)
Export notification history

Mark as Read/Unread:

Individual notifications
Bulk selection
Auto-mark as read on view (configurable)

Delete Notifications:

Individual delete
Bulk delete
Auto-delete after 90 days (configurable)

Notification Templates:

Admin can customize email templates
Variable placeholders (name, track, date, etc.)
Preview before sending

4.1.8 Help & Support
Help Center:

FAQ Section:

Getting Started:

How to create an account?
How to upload my first track?
What file formats are supported?
What are the cover art requirements?
How long does approval take?

Upload Requirements:

Audio quality requirements
Cover art specifications
Metadata best practices
ISRC and UPC codes explained
Lyrics formatting

Distribution:

Which platforms are supported?
How long until my music goes live?
Can I choose specific platforms?
How to remove my music from platforms?
What if distribution fails?

Account Management:

How to update my profile?
How to change password?
How to enable 2FA?
How to delete my account?
How to download my data?

Payments & Royalties:

How do I get paid?
When will I receive royalties?
How to add payment details?
What is the payment schedule?
How to view earnings?

Troubleshooting:

Upload failed - what to do?
Why was my track rejected?
Audio quality issues
Cover art upload problems
Login issues

Video Tutorials:

Platform walkthrough (5 min)
How to upload your first track (3 min)
Metadata best practices (4 min)
Understanding rejection reasons (2 min)
Profile setup guide (2 min)

Documentation:

User guide (PDF download)
Technical specifications
Distribution timeline
Platform policies
Terms of Service
Privacy Policy

Contact Support:

Support Ticket System:

Create Ticket Form:

Category (dropdown):

Upload Issue
Account Problem
Payment/Royalty Question
Distribution Issue
Technical Problem
Feature Request
Other

Subject (text)
Description (rich text, max 2000 chars)
Priority (Low/Medium/High)
Attach files (screenshots, error logs, max 5 files, 10MB each)
Track ID (optional, if related to specific upload)

Ticket Management:

View all tickets (list)
Ticket status: Open, In Progress, Waiting for Response, Resolved, Closed
Add replies
File attachments
Email notifications on updates
Ticket history/timeline
Close ticket
Reopen ticket

SLA (Service Level Agreement):

Response time:

High priority: 4 hours
Medium: 24 hours
Low: 48 hours

Resolution time targets

Live Chat (optional):

Chat widget (bottom right)
Available hours: 9 AM - 9 PM IST (configurable)
Offline form (when unavailable)
Chat transcript email
File sharing in chat
Quick replies/canned responses

Email Support:

support@musicflow.com
Auto-reply with ticket number
Email to ticket conversion

Community Forum (optional):

User-to-user discussions
Admin moderation
Vote on feature requests
Share tips and tricks

Guidelines & Policies:

Upload Guidelines:

Audio quality standards
Cover art requirements (with visual examples)
Metadata requirements
Content policies (no hate speech, violence, etc.)
Copyright guidelines

Distribution Guidelines:

Timeline expectations
Platform-specific requirements
Territory restrictions
Takedown process

Terms of Service:

User rights and responsibilities
Platform rights
Content ownership
Liability limitations
Dispute resolution

Privacy Policy:

Data collection practices
Data usage
Third-party sharing
Cookie policy
GDPR compliance
User rights (access, deletion, portability)

Feedback System:

Feature Requests:

Submit new feature ideas
Vote on existing requests
Admin response/status updates

Bug Reports:

Report bugs with details
Attach screenshots/logs
Track bug fix status

General Feedback:

Rate the platform (1-5 stars)
Written feedback
NPS (Net Promoter Score) survey

4.1.9 Settings
Account Settings:

Profile Information:

Edit all profile fields
Upload profile picture
Upload banner image
Update bio
Social media links

Email & Phone:

Change email (requires verification)
Add/change phone number (requires OTP)
Verify email
Verify phone

Password & Security:

Change password (requires current password)
Password strength indicator
Enable/Disable 2FA
Setup 2FA (QR code for authenticator apps)
Backup codes (generate and download)
Trusted devices list
Active sessions (with logout option)
Login history (last 20 logins with IP and device)

Payment Details:

Bank account information
PayPal email
UPI ID
Tax information (PAN, GST)
Currency preference

Notification Settings:

Per notification type:

Upload status updates
Distribution updates
Payment notifications
Security alerts
Platform announcements
Marketing emails

Per channel:

Email (on/off)
SMS (on/off)
Push notifications (on/off)
In-app (on/off)

Frequency:

Immediate
Daily digest
Weekly summary

Quiet hours:

From: [time]
To: [time]

Privacy Settings:

Profile visibility (Public/Private)
Show email to others (on/off)
Show phone to others (on/off)
Allow search engines to index profile (on/off)
Data sharing with partners (on/off)

Preferences:

Language: English, Hindi, etc.
Timezone: Auto-detect / Manual select
Date Format: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
Time Format: 12-hour, 24-hour
Theme: Light, Dark, Auto (system)
Dashboard Layout: Compact, Comfortable, Spacious
Items per page: 10, 25, 50, 100

Plan & Billing (if applicable):

Current plan details
Usage statistics
Upgrade/Downgrade plan
Billing history
Invoices (download)
Payment methods
Auto-renewal settings

Data & Privacy:

Download my data (GDPR)

Generates ZIP file with all user data
Includes: profile, uploads, metadata, activity logs
Email when ready (processing time: up to 48 hours)

Delete my account

Warning: "This action is permanent and cannot be undone"
Options:

Delete account only (uploads remain)
Delete account and all uploads

Grace period: 30 days (can recover within 30 days)
Requires password confirmation
Reason for deletion (optional feedback)

Integrations (future):

Connect Spotify for Artists
Connect Apple Music for Artists
Connect YouTube Studio
Connect social media accounts
API access tokens (for developers)

4.2 ADMIN FEATURES (Detailed)
4.2.1 Admin Authentication
Admin Login:

Separate admin login page (/admin/login)
Email + Password (stronger requirements than users)
Mandatory 2FA for all admin accounts
IP whitelist (optional, for high security)
Geofencing (only allow login from specific countries/regions)
Failed login attempt limit: 3 (account locked, requires super admin unlock)
Session timeout: 15 minutes inactivity
No "Remember Me" option
Audit log of all admin logins

Admin Roles & Permissions:

Super Admin:

Full access to everything
User management (create, edit, delete users)
Admin management (create, edit, delete other admins)
System settings
Billing & payments
Can override all actions
Cannot be locked out

Admin/Moderator:

Upload review and approval
User support
Content moderation
CSV export
View analytics
Cannot manage other admins
Cannot change system settings

Support Agent:

View uploads (read-only)
View users (read-only)
Manage support tickets
Send notifications to users
Cannot approve/reject uploads
Cannot export CSVs

Analyst:

View-only access to all data
Analytics and reporting
Export reports
No editing capabilities

Custom Roles (future):

Granular permission system
Create custom roles with specific permissions

Admin Account Security:

Password requirements:

Minimum 12 characters
At least 1 uppercase, 1 lowercase, 1 number, 1 special char
Cannot contain common words
Cannot contain username or email
Password expiry: 90 days (forced change)
Cannot reuse last 10 passwords

2FA methods:

Authenticator app (required)
SMS backup (optional)
Email backup (optional)
Hardware security key (optional, future)

Session management:

Single active session (logout from all on new login)
IP tracking
Device fingerprinting
Suspicious activity alerts

Admin Activity Logs:

Every admin action logged:

User: [admin email]
Action: [approved upload, rejected upload, deleted user, etc.]
Target: [user ID, upload ID, etc.]
Timestamp: [date time]
IP Address: [IP]
Device: [browser, OS]

Logs retained for 2 years
Immutable (cannot be edited/deleted)
Searchable and filterable
Export logs to CSV

4.2.2 Admin Dashboard
Overview Section:
Key Metrics (Real-time):

📊 Total Users: 1,234 (+15 today)
📊 Total Uploads: 5,678 (+42 today)
⚠️ Pending Approvals: 87 (requires action)
📊 Uploads Today: 42
📊 Uploads This Week: 231
📊 Uploads This Month: 987
👤 Active Users (30 days): 456
💾 Total Storage Used: 1.2 TB / 5 TB
📈 Storage Growth: +45 GB this week
🌍 Geographic Distribution: Top 5 countries
💰 Total Revenue (if applicable): $12,345

Alerts & Warnings:

🔴 87 uploads pending review (>48 hours old)
🟠 Storage 80% full - consider upgrading
🟡 23 support tickets unresolved
🔴 Server CPU usage at 85%
🟢 All systems operational

Quick Actions:

👁️ View Pending Uploads (87)
📥 Export Today's CSV
👥 View New Users (15)
🎫 View Support Tickets (23)
📊 Generate Report

Charts & Graphs:

Upload Trends (Last 30 Days):

Line chart
Daily upload count
Color-coded by status (approved/rejected/pending)
Interactive (click on date to see uploads)

User Growth (Last 6 Months):

Line chart
New registrations per month
Active users per month
Churn rate

Status Breakdown:

Pie chart
Pending, Approved, Rejected, Live percentages
Click to filter main list

Genre Distribution:

Bar chart
Top 10 genres by upload count
Horizontal bars for easy reading

Platform Performance:

Distribution success rate per platform
Average time to go live
Error rates

Storage Usage:

Donut chart
Used vs Available
Projected full date

Recent Activity Feed:

Last 50 activities across platform:

"New user registered: [name]"
"Upload submitted: [track] by [artist]"
"Upload approved by [admin]: [track]"
"Upload rejected by [admin]: [track]"
"CSV exported by [admin]"
"Support ticket created: #[ID]"
Real-time updates (WebSocket)
Filter by activity type
Filter by admin

System Health:

API response time (avg last hour)
Database query performance
CDN performance
Error rates
Uptime percentage
Background job queue length

Pending Actions:

Uploads awaiting approval (sorted by oldest first)
Unresolved support tickets
Flagged content for review
Failed distributions needing attention
User account reviews (suspicious activity)

4.2.3 User Management
All Users Page:
User List Table:
ProfileUser IDArtist NameEmailPhoneRegistration DateTotal UploadsStatusActions📷1001Aman Kumaraman@email.com+91-98765-4321015-Jan-202412Active👁️ ✏️ 🚫 🗑️
Columns:

Profile picture (thumbnail)
User ID (unique)
Artist Name
Email (verified badge if verified)
Phone Number (verified badge if verified)
Registration Date
Total Uploads
Active Uploads (not archived/deleted)
Account Status (Active/Suspended/Banned/Deleted)
Last Active (timestamp)
Storage Used (MB/GB)
Actions (dropdown)

Filters:

Status:

All
Active
Suspended
Banned
Pending Email Verification
Deleted (soft delete, in grace period)

Registration Date:

Today
Last 7 days
Last 30 days
Last 3 months
Custom range

Activity:

Active (logged in last 30 days)
Inactive (not logged in 30+ days)
Dormant (not logged in 90+ days)

Upload Count:

No uploads
1-5 uploads
6-20 uploads
20+ uploads

Verification Status:

Email verified
Email not verified
Phone verified
Phone not verified

Search:

Search by: Artist Name, Email, Phone, User ID
Real-time search
Advanced search options:

Genre (uploaded)
Country
Language

Sorting:

Registration date (newest/oldest)
Artist name (A-Z, Z-A)
Upload count (high/low)
Last active (recent/oldest)
Storage used (high/low)

Bulk Actions:

Select multiple users (checkboxes)
Bulk actions dropdown:

Send notification/email
Suspend selected
Activate selected
Export to CSV
Delete selected (with confirmation)

Pagination:

25, 50, 100 users per page
Total count display

User Actions (per row):

👁️ View Details (opens user detail page)
✏️ Edit User (edit profile on behalf of user)
📧 Send Email (compose email to user)
🔒 Suspend Account (temporary suspension with reason)
🚫 Ban Account (permanent ban with reason)
✅ Activate Account (unsuspend/unban)
🗑️ Delete Account (soft delete with 30-day grace period)
📊 View Analytics (user-specific analytics)
🎫 View Tickets (support tickets by this user)

User Detail Page:
Header:

Profile picture (large)
Artist name
Status badge (Active/Suspended/Banned)
User ID
"Impersonate User" button (super admin only, for debugging)

Tabs:

Profile Tab:

All profile information (read-only)
Edit button (opens edit form)
Verification status:

Email verified ✅ (with verify date)
Phone verified ✅ (with verify date)

Account created: [date]
Last login: [date time]
Login count: [number]
Profile completion: 85% (progress bar)

Uploads Tab:

List of all uploads by this user
Same table as "All Uploads" but filtered to this user
Quick stats:

Total: 12
Pending: 2
Approved: 8
Rejected: 1
Live: 7

Activity Tab:

Timeline of user actions:

Registered
Email verified
Uploaded track: [track name]
Track approved
Track went live
Profile updated
Login from [location]

Filter by activity type
Date range filter

Support Tickets Tab:

All support tickets by this user
Ticket status, date, subject
Quick reply option
Create new ticket on behalf of user

Payment Tab (if applicable):

Payment details
Royalty earnings
Payout history
Transaction logs

Notes Tab:

Admin-only private notes about this user
Add note (with timestamp and admin name)
Note history
Flag user (for suspicious activity)

User Statistics:

Total uploads: 12
Total storage used: 245 MB
Average upload per month: 2.4
Top genre: Pop (60%)
Active since: 3 months
Last upload: 2 days ago
Approval rate: 85% (10/12 approved)
Rejection rate: 8% (1/12 rejected)

Admin Actions (on user):

Edit Profile:

Edit any profile field
Override user input
Admin note required for edits

Verify Email/Phone:

Manually verify if needed
Override verification requirement

Suspend Account:

Reason (dropdown + text):

Suspicious activity
Copyright violation
Terms of Service violation
Payment issue
User request
Other (specify)

Duration:

7 days
30 days
90 days
Indefinite (until manual unsuspension)

Notify user (email)
Suspension note (visible to user)

Ban Account:

Permanent ban
Reason (required)
Notify user (email)
Ban note

Delete Account:

Soft delete (30-day grace period)
Hard delete (immediate, irreversible - super admin only)
Delete uploads too? (checkbox)
Reason (required)
Notify user (email)

Reset Password:

Send password reset email to user
Admin cannot see user's password

Send Notification:

Quick message to user
Email/in-app/SMS options
Pre-defined templates

Adjust Storage Limit:

Increase/decrease storage quota
Custom limit per user

Account Flags:

🚩 Flagged for review (admin sets flag)
⚠️ Multiple rejections (>50% rejection rate)
🔴 Copyright strike
🟠 Suspicious activity detected
🟡 Payment issue
⚠️ Spam uploads detected

4.2.4 Upload Management (Core Admin Feature)
All Uploads Page:
Upload List Table:
StatusCoverTrackArtistAlbumGenreUploadedDurationSizeActions🟠🖼️Song TitleArtist NameAlbumPop2h ago3:458.2 MB👁️ ✅ ❌
Columns (Customizable):

Status badge (color-coded)
Cover art thumbnail (60x60px, hover for full size)
Track Title (clickable - opens detail)
Artist Name (clickable - opens user profile)
Album Name
Genre
Language
Upload Date & Time
Duration (MM:SS)
File Size (MB)
Audio Format (MP3/WAV/FLAC)
Bitrate (kbps)
ISRC Code
Distribution Status
Reviewed By (admin name, if reviewed)
Review Date (if reviewed)
Actions (dropdown)

Column Visibility Toggle:

Admin can show/hide columns
Save column preferences per admin

Filters (Advanced):

Status Filter:

All (default)
Pending Review (requires action)
Approved
Rejected
Live
Draft
In Distribution Queue
Distribution Failed
Archived

Upload Date Range:

Today
Yesterday
Last 7 days
Last 30 days
Custom range (date picker)

Review Date Range:

Not reviewed yet
Reviewed today
Reviewed last 7 days
Custom range

Artist Filter:

Search/select specific artist
Multi-select (compare multiple artists)

Genre Filter:

Multi-select dropdown
All genres available

Language Filter:

Multi-select

Audio Format:

MP3
WAV
FLAC

Quality Issues:

Low bitrate (<128 kbps)
Clipping detected
Silence detected
Cover art too small

Distribution Status:

Not distributed
In queue
Distributed
Live on platforms
Failed

Reviewed By:

Select admin name
Not reviewed yet
Reviewed by me

Time in Queue:

<24 hours
24-48 hours

48 hours (urgent)

7 days (critical)

Search:

Search by: Track Title, Artist, Album, ISRC, UPC, Upload ID
Real-time search (debounced)
Regex search (advanced)

Sorting:

Upload date (oldest first - for review queue)
Upload date (newest first)
Track title (A-Z, Z-A)
Artist name (A-Z, Z-A)
Duration (short/long)
File size (small/large)
Review date (recent/oldest)
Status

Quick Filters (Buttons):

🔴 Pending Review (87) - shows oldest pending first
⚠️ Urgent (>48 hrs) - pending for more than 48 hours
🎯 Today's Uploads
✅ Approved Today
❌ Rejected Today
🚀 Ready for Distribution
⚠️ Quality Issues Detected

Bulk Actions:

Select all checkbox
Individual checkboxes per row
Select by criteria (e.g., all pending from last 7 days)
Bulk actions dropdown:

✅ Approve selected (batch approval)
❌ Reject selected (with common reason)
📥 Export to CSV
🗑️ Delete selected
🔄 Change status
📧 Notify artists
🚀 Queue for distribution

Pagination:

Items per page: 25, 50, 100, 200
Infinite scroll option
Total count: "Showing 1-50 of 1,234"
Jump to page number

Upload Actions (per row):
Quick Actions (icon buttons):

👁️ View Details (opens detail modal or page)
▶️ Play Audio (quick audio player)
🖼️ View Cover (lightbox)
✅ Approve (one-click approve, if no issues)
❌ Reject (opens rejection form)
✏️ Edit Metadata (admin can edit on behalf)
📥 Download Files (audio + cover as ZIP)

More Actions (dropdown):

📋 Copy audio URL
📋 Copy cover URL
📋 Copy track details (formatted)
🔄 Reprocess audio (re-validate)
🚀 Queue for distribution (if approved)
⏸️ Pause distribution
📧 Notify artist (custom message)
🗑️ Delete upload
📊 View analytics (if live)

Upload Detail/Review Page:
Layout: Split Screen
Left Panel (60% width):

Audio Player:

Full-featured player:

Play/Pause
Seek bar with waveform visualization
Current time / Total duration
Volume control
Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
Loop option
A/B repeat selection

Keyboard shortcuts
Download audio button

Cover Art:

Large display (600x600px)
Zoom/pan controls
Lightbox on click
Dimensions display
DPI display
File size
Download cover button

Audio Technical Analysis:

Waveform Visualization:

Full track waveform
Zoom in/out
Click to seek

Spectrum Analyzer:

Frequency distribution
Peak levels

Technical Metrics:

Format: MP3
Bitrate: 320 kbps
Sample Rate: 44.1 kHz
Channels: Stereo
Duration: 3:45
File Size: 8.2 MB
Codec: LAME MP3
Bit depth: 16-bit (for WAV)

Quality Checks:

✅ Bitrate adequate (>128 kbps)
✅ No clipping detected
✅ No silence detected
⚠️ Peak level: -0.1 dB (warning if >-1 dB)
✅ Dynamic range: Good
✅ No audio artifacts detected

Right Panel (40% width):
Track Information:

Basic Metadata:

Track Title: [editable inline]
Artist Name: [editable]
Album Name: [editable]
Track Number: [editable]
Genre: [dropdown, editable]
Language: [dropdown, editable]
Release Date: [date picker, editable]
Explicit Content: [checkbox, editable]

Identifiers:

ISRC: [editable, validation]
UPC: [editable, validation]
Upload ID: [read-only, copy button]

Credits:

Featured Artists: [editable list]
Songwriter/Composer: [editable list]
Producer: [editable list]
Other contributors: [editable list]
Copyright (P Line): [editable]
Copyright (C Line): [editable]

Distribution Settings:

Target Platforms: [multi-select]
Territories: [Worldwide / Custom]
Monetization: [on/off]

Lyrics:

Display full lyrics
Edit option

Upload Information:

Uploaded by: [Artist Name] (link to profile)
User ID: [ID]
Upload Date: [DD-MM-YYYY HH:MM:SS]
Upload IP: [IP address]
Upload Device: [Browser, OS]
Audio File URL: [copyable URL]
Cover Art URL: [copyable URL]

Review Information:

Status: [dropdown to change]
Review Status:

⏳ Not reviewed yet
🔍 Under review by [Admin Name]
✅ Approved by [Admin Name] on [Date]
❌ Rejected by [Admin Name] on [Date]

Time in Queue: 2 hours 34 minutes
Priority: Normal (auto-calculated based on time in queue)

Automated Quality Checks:
Display results of automated validations:
✅ Passed Checks:

Audio format valid (MP3)
Bitrate adequate (320 kbps)
Cover art dimensions OK (3000x3000px)
Metadata complete (all required fields)
No clipping detected
No silence detected
ISRC format valid
No duplicate track found

⚠️ Warnings (Non-blocking):

Peak level close to 0 dB (-0.1 dB)
Lyrics not provided
No secondary genre specified

❌ Errors (Blocking, if any):

Cover art dimensions too small (1500x1500, minimum 3000x3000)
ISRC code already in use
Audio file corrupted

Admin Notes Section:

Private Admin Notes:

Text area for internal admin notes
Not visible to user
Visible to all admins
Timestamped with admin name
Note history

Feedback to Artist:

Text area for feedback visible to artist
Sent via email and in-app notification
Previous feedback history

Review Actions:
Primary Actions (Large Buttons):

✅ Approve:

One-click approve if all checks pass
Optional: Add approval note
Action:

Status changes to "Approved"
Artist notified via email/in-app
Queued for distribution (if auto-distribution enabled)
Timestamp recorded
Admin name logged

❌ Reject:

Opens rejection form:

Rejection Reason (dropdown, required):

Poor audio quality (low bitrate, clipping, artifacts)
Cover art doesn't meet requirements (dimensions, quality, inappropriate)
Incomplete metadata (missing required fields)
ISRC/UPC code issue (invalid, duplicate, missing)
Copyright concerns (suspected infringement)
Inappropriate content (hate speech, violence, explicit without tag)
Duplicate upload (already exists on platform)
Other (specify in notes)

Detailed Feedback (text area, required):

Explain specific issues
Provide guidance for fixing
Be constructive and helpful

Attachments (optional):

Screenshots showing issues
Annotated images

Allow Resubmission (checkbox, default: yes)
Notify Artist (checkbox, default: yes)

Action:

Status changes to "Rejected"
Rejection reason and feedback sent to artist
Artist can view feedback and resubmit
Timestamp and admin name logged

🔄 Request Changes:

Similar to reject but less severe
Status: "Changes Requested"
Specify required changes
Artist must update and resubmit
Stays in artist's "My Uploads" as editable

Secondary Actions:

Edit Metadata:

Admin can edit any field on behalf of artist
Changes logged with admin name
Notification sent to artist
Use case: Minor corrections, standardization

Download Files:

Download audio file
Download cover art
Download both as ZIP

Copy URLs:

Copy audio URL
Copy cover art URL

Delete Upload:

Requires confirmation
Reason required
Notify artist (optional)
Hard delete (cannot be recovered)

Flag for Review:

Flag suspicious content
Escalate to super admin
Add flag reason

Assign to Admin:

Assign review to specific admin
Use case: Specialist required (e.g., classical music expert)

Change Priority:

Set priority: Low, Normal, High, Urgent
High priority items bubble to top of queue

Distribution Management:

Queue for Distribution:

Manually add to distribution queue
Select distribution date
Select platforms

Distribution Status:

Not Distributed
In Queue (position in queue)
Processing
Distributed
Live on Platforms:

Spotify: ✅ Live (link to track)
Apple Music: 🟡 Pending
YouTube Music: ❌ Failed (error message)
(etc. for all platforms)

Failed (error details)

Distribution Actions:

Retry distribution (if failed)
Force distribute (override checks)
Pause distribution
Cancel distribution
Request takedown (if live)

Activity Timeline:

Visual timeline of all actions on this upload:

📤 Uploaded by [Artist] - [timestamp]
🔍 Assigned to [Admin] for review - [timestamp]
👁️ Viewed by [Admin] - [timestamp]
✏️ Metadata edited by [Admin] - [timestamp]
✅ Approved by [Admin] - [timestamp]
📦 Added to distribution queue - [timestamp]
🚀 Distributed - [timestamp]
🎵 Live on Spotify - [timestamp]
(etc.)

Related Uploads:

Other uploads by this artist
Other tracks from same album (if album)
Duplicate detection (similar track titles, ISRC)

Review Performance Metrics (for admin):

Average review time for this admin
Approval rate
Rejection rate
Reviews completed today/this week/this month

4.2.5 CSV Export System (Critical Feature)
CSV Export Page:
Export Configuration:

Data Range:

Date Range Selector:

From: [date picker]
To: [date picker]
Quick options:

Today
Yesterday
Last 7 days
Last 30 days
This week
This month
Last month
Custom range

Filters:

Status:

All
Pending
Approved only
Rejected only
Live only
Custom (multi-select)

Artist:

All artists
Specific artist (search/select)
Multiple artists (multi-select)

Genre:

All genres
Specific genre (dropdown)
Multiple genres (multi-select)

Distribution Status:

All
Not distributed
Distributed
Live
Failed

Review Status:

All
Reviewed
Not reviewed
Reviewed by specific admin

Columns to Include:

Checkbox list (select/deselect columns):
☑️ User Information:

User ID
Artist Name
Email
Phone Number
Country

☑️ Track Information:

Upload ID
Track Title
Album Name
Track Number (if album)
Genre (Primary)
Genre (Secondary)
Language
Duration (seconds)
Duration (MM:SS format)
Explicit Content (Yes/No)
Release Date

☑️ File Information:

Audio File URL (cloud storage link)
Cover Art URL (cloud storage link)
Audio Format (MP3/WAV/FLAC)
Audio Bitrate (kbps)
Audio Sample Rate (Hz)
File Size (MB)
File Size (Bytes)
Cover Art Dimensions (WxH)
Cover Art File Size (MB)

☑️ Identifiers:

ISRC Code
UPC Code

☑️ Credits:

Featured Artists (comma-separated)
Songwriter/Composer (comma-separated)
Producer (comma-separated)
Record Label
Publisher
Copyright P Line
Copyright C Line

☑️ Lyrics:

Lyrics (full text)
Lyrics Language

☑️ Distribution:

Distribution Status
Target Platforms (comma-separated)
Territories (Worldwide/Custom list)
Distribution Date
Live on Spotify (Yes/No + link)
Live on Apple Music (Yes/No + link)
Live on YouTube Music (Yes/No + link)
(etc. for each platform)

☑️ Timestamps:

Upload Date (DD-MM-YYYY)
Upload Time (HH:MM:SS)
Upload DateTime (ISO format)
Approved Date
Approved Time
Review Date
Distribution Date
Go-Live Date

☑️ Review Information:

Status (Pending/Approved/Rejected/Live)
Reviewed By (admin name)
Review Notes
Rejection Reason (if rejected)
Admin Feedback

☑️ Technical Metadata:

Audio Channels (Stereo/Mono)
Bit Depth (for WAV)
Codec
Peak Level (dB)
Quality Checks Passed (Yes/No)

Preset Column Sets:

Minimal: Essential info only (artist, track, audio URL, cover URL)
Standard: Common fields (artist, track, metadata, URLs, identifiers)
Distribution: All distribution-related fields
Complete: All available fields
Custom: Save custom column selections

Export Format:

CSV (UTF-8 encoding)
CSV (UTF-16 for Excel compatibility)
Excel XLSX
JSON
XML

Additional Options:

Include header row: Yes/No
Delimiter: Comma, Semicolon, Tab, Pipe
Quote character: Double quote, Single quote
Escape character: Backslash, Double quote
Date format: DD-MM-YYYY, MM-DD-YYYY, YYYY-MM-DD, ISO 8601
Time format: 24-hour, 12-hour AM/PM
Include row numbers: Yes/No
Compress output: ZIP file (for large CSVs)

Preview:

Preview First 10 Rows:

Shows how CSV will look
Validates format
Allows adjustments before full export

Export Actions:
Primary Action:

📥 Generate & Download CSV

Click to generate
Processing indicator (for large datasets)
Progress bar: "Processing 450/1234 records..."
Estimated time remaining
Download automatically when ready
Or download link if processing in background

Secondary Actions:

💾 Save Export Configuration

Save current filter/column settings
Name the configuration (e.g., "Weekly Approved Tracks")
Reuse later with one click

📧 Email CSV

Enter email address(es)
CSV will be emailed when ready
Useful for large files or scheduled exports

📅 Schedule Export

Schedule recurring exports:

Daily (at specific time)
Weekly (specific day and time)
Monthly (specific date and time)

Email recipients
Auto-upload to cloud storage (optional)

CSV History:
Previously Generated CSV Files:
Table showing:

Export Date & Time
Generated By (admin name)
Filters Used (summary)
Columns Included (count)
Row Count
File Size
File Name
Status (Ready/Processing/Failed)
Actions:

📥 Re-download
👁️ View configuration
🔄 Re-run with same config
🗑️ Delete

Retention:

CSV files retained for 30 days
Auto-delete after 30 days
Download before expiry
Admin can manually delete

Scheduled Exports:
List of Scheduled Exports:

Export Name
Schedule (Daily/Weekly/Monthly)
Next Run Date & Time
Recipients (email addresses)
Configuration (filters, columns)
Status (Active/Paused)
Actions:

▶️ Run Now
⏸️ Pause
✏️ Edit
🗑️ Delete

Sample CSV Structure:
csvuser_id,artist_name,email,phone,track_title,album_name,genre_primary,genre_secondary,language,release_date,explicit,duration_seconds,duration_formatted,audio_url,cover_art_url,audio_format,bitrate_kbps,sample_rate_hz,file_size_mb,cover_dimensions,isrc,upc,featured_artists,songwriter,producer,label,publisher,copyright_p,copyright_c,lyrics,upload_date,upload_time,upload_datetime,status,reviewed_by,review_date,approved_date,distribution_status,distributed_date,live_spotify,live_apple_music,live_youtube_music,spotify_url,apple_music_url,youtube_music_url
1001,"Aman Kumar",aman@email.com,+919876543210,"Dil Ki Baat","Singles","Pop","R&B","Hindi","2024-03-15","No",210,"3:30","https://s3.amazonaws.com/bucket/audio/track001.mp3","https://s3.amazonaws.com/bucket/covers/cover001.jpg","MP3",320,44100,8.5,"3000x3000","INXXX2400001","123456789012","Priya Sharma","Aman Kumar, Rohit Verma","Vikram Singh","Indie Records","Music Publishing Co.","℗ 2024 Aman Kumar","© 2024 Indie Records","[Full lyrics here...]","01-02-2024","14:30:25","2024-02-01T14:30:25Z","Live","admin@musicflow.com","02-02-2024","02-02-2024","Live","05-02-2024","Yes","Yes","No","https://open.spotify.com/track/abc123","https://music.apple.com/track/xyz789",""
CSV Validation:

Pre-export validation:

Check for special characters that might break CSV
Escape quotes and commas in text fields
Handle multi-line text (lyrics)
Ensure UTF-8 encoding
Validate URLs

Error Handling:

If export fails:

Error message displayed
Error log available
Retry option
Contact support option

Performance Optimization:

Chunked processing for large datasets (>10,000 records)
Background job queue
Progress tracking
Resume on failure

Security:

Only admins can export CSVs
Export actions logged (who, when, what)
Sensitive data (phone, email) masked option
PII compliance (GDPR)

Advanced Features:

Custom SQL Query Export:

For super admins
Write custom queries
Export query results
Saved queries

Data Transformation:

Calculate fields (e.g., days since upload)
Aggregate data (e.g., uploads per artist)
Custom formulas

Multi-Sheet Excel:

Summary sheet
Uploads sheet
Artists sheet
Charts/graphs

API Endpoint:

Programmatic CSV generation
API token required
Same filters via JSON payload
Webhook on completion

4.2.6 Analytics & Reports
Analytics Dashboard:
Overview Metrics:

Upload Analytics:

Total uploads (all time)
Uploads this month
Uploads growth (% change vs last month)
Average uploads per day
Peak upload day (day of week)
Peak upload hour (time of day)
Uploads by status (pie chart)

User Analytics:

Total users
New users this month
User growth rate
Active users (30 days)
User retention rate
Churn rate
Users by country (map)

Content Analytics:

Total genres uploaded
Top 10 genres (bar chart)
Top 10 artists by upload count
Average track duration
Total hours of content
Languages distribution

Review Analytics:

Average review time (hours)
Approval rate (%)
Rejection rate (%)
Top rejection reasons
Admin performance (reviews per admin)
Pending backlog trend

Distribution Analytics:

Total tracks distributed
Distribution success rate (%)
Platform breakdown (which platforms)
Average time to go live
Distribution failures (count + reasons)
Territories coverage

Storage Analytics:

Total storage used (TB/GB)
Storage growth trend
Average file size
Storage by format (MP3/WAV/FLAC)
Projected storage needs

Quality Analytics:

Average audio bitrate
Format distribution (MP3 vs WAV vs FLAC)
Cover art compliance rate
Metadata completeness (%)
Quality issues detected (count)

Charts & Graphs:

Upload Trends:

Line chart: Last 6 months
Daily, weekly, monthly views
Compare periods (this month vs last month)
Trend projection (next 3 months)

User Growth:

Line chart: User registrations over time
Cohort analysis (retention by signup month)
Active users trend

Status Funnel:

Funnel chart:

Uploaded → Pending → Approved → Distributed → Live

Conversion rates at each stage
Drop-off analysis

Genre Distribution:

Pie chart: Top genres
Bar chart: Genre trends over time
Genre popularity by region

Platform Performance:

Stacked bar chart: Distribution by platform
Success rate per platform
Average time to live per platform

Geographic Distribution:

World map: Users by country
Heatmap: Upload density
Top 10 countries table

Admin Performance:

Reviews per admin (bar chart)
Average review time per admin
Approval/rejection rate per admin

Custom Reports:
Report Builder:

Select metrics to include
Choose date range
Apply filters
Select visualization type (chart/table)
Export report (PDF/Excel)
Schedule report (daily/weekly/monthly email)

Pre-built Reports:

Weekly Summary:

Uploads this week
New users
Reviews completed
Distribution stats
Email to admins every Monday

Monthly Report:

Comprehensive monthly stats
Month-over-month comparison
Trends and insights
Recommendations

Rejection Analysis:

Top rejection reasons
Artists with high rejection rates
Improvement areas

Quality Report:

Audio quality metrics
Cover art compliance
Metadata completeness
Best practices adherence

Distribution Report:

Tracks distributed this month
Platform breakdown
Failure analysis
Average time to live

Real-time Monitoring:
Live Dashboard:

Uploads happening now (real-time)
Current pending queue size
Active users (online now)
System health indicators
Recent errors/warnings

Alerts & Notifications:

Alert when pending queue >100
Alert when storage >90%
Alert when server errors spike
Alert when distribution failures >10/hour
Daily summary email to admins

Data Export:

Export any chart data to CSV
Export reports to PDF
Schedule automated exports

4.2.7 Distribution Management
Distribution Queue:
Queue Management:

List of approved uploads awaiting distribution
Queue position
Estimated distribution time
Priority (normal/high/urgent)
Distribution date (scheduled)

Actions:

Reorder queue (drag and drop)
Set priority
Schedule for specific date/time
Remove from queue
Force distribute now

Distribution Batches:

Group uploads into batches
Batch distribution to platforms
Track batch status
Batch success/failure report

Platform Configuration:
Supported Platforms:

Spotify
Apple Music
YouTube Music
Amazon Music
Deezer
Tidal
JioSaavn
Gaana
Wynk
Resso
Pandora
iHeartRadio
(20+ platforms)

Per Platform Settings:

Enable/Disable platform
API credentials (if direct integration)
Default settings (territories, monetization)
Custom metadata fields
Priority order

Distribution API Integration:
API Configuration:

Distribution service (Ditto/iMusician/FUGA)
API endpoint
Authentication (API key/OAuth)
Rate limits
Retry logic

API Actions:

Test connection
Validate credentials
Check quota/limits
View API logs

Distribution Status Tracking:
Per Upload Status:

Not Distributed
Queued for Distribution
API Call Sent
Processing by Platform
Live on Platform
Failed (with error message)
Taken Down

Platform-specific Status:
Each platform shows:

Status (Pending/Live/Failed)
Link to track (if live)
Go-live date
Error message (if failed)
Retry count

Failure Handling:

Automatic retry (up to 3 attempts)
Exponential backoff
Manual retry option
Error notification to admin
Error log with details

Takedown Management:
Takedown Requests:

User requests takedown
Admin reviews request
Approve/Deny takedown
If approved:

Remove from distribution queue
Send takedown to platforms
Track takedown status
Notify user when complete

Takedown Timeline:

Different platforms have different takedown times
Spotify: 7-14 days
Apple Music: 5-10 days
YouTube: 1-3 days
Track status per platform

4.2.8 Content Moderation
Moderation Queue:
Flagged Content:

Uploads flagged by automated system
Uploads flagged by users (copyright reports)
Uploads flagged by admins

Flagging Reasons:

Copyright violation suspected
Inappropriate content (hate speech, violence)
Spam/fake uploads
Quality issues
Metadata manipulation
Duplicate content

Review Process:

Admin reviews flagged content
Listen to audio
Check metadata
Research (check if track exists elsewhere)
Decision:

Approve (unflag)
Reject upload
Ban user
Request more information

Copyright Detection:
Automated Checks:

Audio fingerprinting (match against known databases)
Metadata matching (check for existing ISRC)
Artist name verification
Integration with Content ID systems

Manual Verification:

Admin listens to track
Search for track on Spotify/YouTube
Check artist's claimed identity
Request proof of ownership

DMCA Takedown:

DMCA complaint form for copyright holders
Admin reviews complaint
Notify uploader
Counter-notice process (if user disputes)
Remove content if valid complaint

Inappropriate Content:
Automated Filters:

Explicit language detection (lyrics)
Hate speech detection
Violence/graphic content (metadata/lyrics)

Manual Review:

Admin reviews flagged content
Cultural sensitivity check
Age-appropriate content

Actions:

Require explicit tag
Reject upload
Suspend user
Ban user

Duplicate Detection:
Find Duplicates:

Audio fingerprint matching
Metadata similarity (title, artist, ISRC)
Same user uploading multiple times
Different users uploading same track

Duplicate Actions:

Flag as duplicate
Keep one, reject others
Merge metadata
Notify users

4.2.9 Support Ticket Management
All Tickets View:
Ticket List:
Ticket IDUserSubjectCategoryPriorityStatusCreatedLast UpdatedAssigned ToActions#1234Aman KumarUpload FailedTechnicalHighOpen1 hour ago1 hour agoUnassigned👁️ ✏️
Columns:

Ticket ID (unique)
User Name (link to profile)
Subject
Category
Priority (Low/Medium/High/Urgent)
Status (Open/In Progress/Waiting/Resolved/Closed)
Created Date
Last Updated
Assigned To (admin name)
Response Time (how long since last message)
Actions

Filters:

Status (Open/In Progress/Resolved/Closed)
Priority (High/Medium/Low)
Category (Technical/Account/Payment/Distribution/Other)
Assigned To (specific admin / Unassigned)
Date range
User (specific user)

Sorting:

Created date (oldest first - urgent)
Priority (high to low)
Last updated (recent first)
Response time (longest waiting)

Bulk Actions:

Assign selected to admin
Close selected
Change priority
Export to CSV

Ticket Detail/Response:
Ticket Information:

Ticket ID: #1234
User: Aman Kumar (link to profile)
Email: aman@email.com
Created: 01-Feb-2024 14:30
Last Updated: 01-Feb-2024 15:45
Status: Open
Priority: High
Category: Technical Issue
Assigned To: admin@musicflow.com

Related Upload:

If ticket is about specific upload, show upload details
Quick link to upload

Conversation Thread:

Chronological message thread
User messages (styled differently)
Admin responses
System messages (status changes, assignments)
Timestamps on each message
Admin name on admin messages

Reply Section:

Rich text editor
Attach files (screenshots, documents)
Canned responses (dropdown):

Common solutions
Policy explanations
Troubleshooting steps

Internal note option (not visible to user)
CC other admins

Actions:

Reply to user (send email + in-app)
Add internal note
Change status (dropdown)
Change priority
Assign to another admin
Escalate to super admin
Merge with another ticket
Close ticket
Reopen ticket

Ticket Actions:

Resolve: Mark as resolved (user can reopen if needed)
Close: Permanently close (requires resolution note)
Assign: Assign to specific admin
Escalate: Flag for super admin attention
Flag: Mark important/urgent

SLA Tracking:

First response time: 2 hours / Target: 4 hours ✅
Resolution time: - / Target: 24 hours
Color-coded indicators (green/yellow/red)

Canned Responses Library:

Pre-written response templates
Variables: {user_name}, {track_title}, etc.
Categories (Technical/Account/Distribution)
Admin can create custom templates

Ticket Analytics:

Total open tickets
Average response time
Average resolution time
Tickets by category (chart)
Tickets by admin (performance)
User satisfaction (if post-ticket survey)

4.2.10 System Settings & Configuration
General Settings:

Platform Information:

Platform Name
Logo (upload)
Favicon
Support Email
Support Phone
Address

Upload Limits:

Max file size (audio): 500 MB (configurable)
Max file size (cover): 10 MB (configurable)
Supported audio formats: MP3, WAV, FLAC (toggles)
Supported image formats: JPG, PNG, WebP (toggles)
Max uploads per user per day: 10 (configurable)
Max uploads per user per month: 50 (configurable)

Quality Standards:

Minimum audio bitrate: 128 kbps (configurable)
Minimum cover art dimensions: 3000x3000px (configurable)
Mandatory ISRC: Yes/No (toggle)
Mandatory UPC for albums: Yes/No (toggle)

Review Settings:

Auto-approve if all checks pass: Yes/No (toggle)
Review SLA (hours): 48 (configurable)
Allow user resubmission after rejection: Yes/No (toggle)
Max resubmissions allowed: 3 (configurable)

Distribution Settings:

Auto-distribution on approval: Yes/No (toggle)
Distribution delay (days): 0 (immediate) or custom
Default platforms (select all / custom)
Default territories: Worldwide / Custom

Email Settings:

SMTP server
SMTP port
SMTP username
SMTP password
From email address
From name
Email footer (HTML)

Storage Settings:

Storage provider: AWS S3 / Google Cloud / Azure
Bucket name
Region
Access key
Secret key
CDN enabled: Yes/No
CDN URL

Security Settings:

Session timeout (minutes): 30
Password expiry (days): 180
2FA enforcement: All users / Admins only / Optional
Login attempt limit: 5
IP whitelist (for admin)
Allowed countries (user registration)

Backup Settings:

Auto-backup frequency: Daily/Weekly
Backup retention (days): 90
Backup location (cloud)

Maintenance Mode:

Enable maintenance mode: Yes/No
Maintenance message (displayed to users)
Allow admin access during maintenance: Yes/No

Admin Management:
Admin List:

Email
Name
Role (Super Admin/Admin/Support/Analyst)
Status (Active/Suspended)
Last Login
Actions (Edit/Suspend/Delete)

Add New Admin:

Email
Name
Role (dropdown)
Permissions (checkboxes for granular control)
Send invitation email

Edit Admin:

Change role
Change permissions
Reset password (send reset email)
Suspend/Activate

Admin Permissions (Granular):

View users
Edit users
Delete users
View uploads
Approve/Reject uploads
Edit uploads
Delete uploads
Export CSV
View analytics
Manage support tickets
Manage other admins (super admin only)
Change system settings (super admin only)

Notification Templates:
Email Templates:

Upload confirmation
Upload approved
Upload rejected
Account created
Password reset
Support ticket response
(etc.)

Edit Template:

Subject line (with variables)
Email body (HTML editor)
Variables: {user_name}, {track_title}, {platform_name}, etc.
Preview with sample data
Send test email

Platform Customization:

Branding:

Primary color
Secondary color
Font family
Custom CSS (advanced)

Homepage Content:

Hero section text
Features section
Testimonials
FAQ

Terms & Policies:

Terms of Service (rich text editor)
Privacy Policy (rich text editor)
Copyright Policy (rich text editor)
Refund Policy (rich text editor)

API Configuration (future):

Enable public API: Yes/No
API rate limits
API documentation link
Generate API keys

Integrations:
Distribution API:

Provider (Ditto/iMusician/FUGA)
API key
API secret
Test connection

Payment Gateway (future):

Provider (Stripe/PayPal/Razorpay)
API credentials
Webhook URL

Analytics:

Google Analytics ID
Facebook Pixel ID
Other tracking codes

Feature Flags:

Enable/disable features platform-wide:

User registration (open/closed/invite-only)
File uploads (enabled/disabled)
CSV export (enabled/disabled)
Distribution (enabled/disabled)
Support tickets (enabled/disabled)

Audit Logs:

All system setting changes logged
Who changed what and when
Previous value → New value
Immutable log

4.2.11 Monitoring & Logs
System Health Dashboard:
Server Metrics:

CPU usage (%)
Memory usage (%)
Disk usage (%)
Network I/O
Active connections
Request rate (requests/second)

Application Metrics:

API response time (average, p95, p99)
Database query time
Cache hit rate
Background job queue length
Error rate (errors/minute)

User Metrics:

Active users (now)
Uploads in progress
Downloads in progress
API calls (last hour)

Alerts:

Critical: CPU >90%, Memory >90%, Disk >90%
Warning: CPU >75%, Memory >75%, Disk >75%
Error rate spike (>100 errors/min)
API response time >2 seconds

Error Logs:
Error List:

Timestamp
Error type (500, 404, Database, API, etc.)
Error message
Stack trace
User (if applicable)
URL/Endpoint
IP address
Browser/Device

Filters:

Error type
Date range
User
Endpoint
Severity (Critical/Error/Warning)

Error Detail:

Full stack trace
Request details (headers, payload)
User session info
Reproduction steps (if available)
Mark as resolved
Add notes

Activity Logs:
All Activity:

User registrations
Logins/Logouts
Uploads
Approvals/Rejections
CSV exports
Admin actions
System events

Filters:

Activity type
User/Admin
Date range
IP address

Security Logs:
Security Events:

Failed login attempts
Suspicious activity detected
Account suspensions/bans
Password changes
2FA enabled/disabled
Admin access from new IP
API key usage

Filters:

Event type
User
IP address
Date range

Background Jobs:
Job Queue:

Job type (email sending, CSV generation, file processing)
Status (Pending/Running/Completed/Failed)
Created at
Started at
Completed at
Duration
Retry count
Error message (if failed)

Actions:

Retry failed job
Cancel pending job
View job details

Database Logs:
Slow Queries:

Query text
Execution time
Tables accessed
Timestamp

Optimization suggestions
API Logs:
API Requests:

Endpoint
Method (GET/POST/PUT/DELETE)
Status code
Response time
Timestamp
User/API key
IP address

Filters:

Endpoint
Status code
Date range
User

5. TECHNICAL ARCHITECTURE
   5.1 High-Level Architecture
   ┌─────────────────────────────────────────────────────────────────┐
   │ CLIENT LAYER │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ Web App │ │ Mobile App │ │ Admin Panel │ │
   │ │ (React/Next)│ │ (React Native│ │ (React) │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │2 / 2ContinueFeb 1HTTPS/WSS
   ┌────────────────────────────┴────────────────────────────────────┐
   │ APPLICATION LAYER │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Load Balancer (AWS ALB / Nginx) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ API Server │ │ API Server │ │ API Server │ │
   │ │ (Node.js/ │ │ (Node.js/ │ │ (Node.js/ │ │
   │ │ Express) │ │ Express) │ │ Express) │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   │ │ │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ WebSocket Server (Real-time notifications) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │
   ┌────────────────────────────┴────────────────────────────────────┐
   │ SERVICE LAYER │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ Auth Service │ │ Upload Service│ │ CSV Service │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ Email Service│ │ Distribution │ │ Analytics │ │
   │ │ │ │ Service │ │ Service │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │
   ┌────────────────────────────┴────────────────────────────────────┐
   │ DATA LAYER │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Primary Database (PostgreSQL Master) │ │
   │ └──────────────────┬───────────────────────────────────────┘ │
   │ │ Replication │
   │ ┌──────────────────┴───────────────────────────────────────┐ │
   │ │ Read Replicas (PostgreSQL Slaves) x2 │ │
   │ └──────────────────────────────────────────────────────────┘ │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Cache Layer (Redis Cluster) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Search Engine (Elasticsearch) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │
   ┌────────────────────────────┴────────────────────────────────────┐
   │ STORAGE LAYER │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Object Storage (AWS S3 / Google Cloud Storage) │ │
   │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐ │ │
   │ │ │ Audio │ │ Cover Art │ │ CSV │ │ │
   │ │ │ Files │ │ Files │ │ Files │ │ │
   │ │ └────────────┘ └────────────┘ └────────────┘ │ │
   │ └──────────────────────────────────────────────────────────┘ │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ CDN (CloudFront / Cloud CDN / Cloudflare) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │
   ┌────────────────────────────┴────────────────────────────────────┐
   │ BACKGROUND JOBS LAYER │
   │ ┌──────────────────────────────────────────────────────────┐ │
   │ │ Message Queue (RabbitMQ / AWS SQS / Redis) │ │
   │ └──────────────────────────────────────────────────────────┘ │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ Worker 1 │ │ Worker 2 │ │ Worker 3 │ │
   │ │ (File Process│ │ (Email Send) │ │ (CSV Gen) │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
   │
   ┌────────────────────────────┴────────────────────────────────────┐
   │ EXTERNAL INTEGRATIONS │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ Distribution │ │ Payment │ │ Email │ │
   │ │ API │ │ Gateway │ │ Service │ │
   │ │(Ditto/iMusic)│ │(Stripe/Razpr)│ │(SendGrid/SES)│ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
   │ │ SMS │ │ Analytics │ │ Monitoring │ │
   │ │ Service │ │ (GA/Mixpanel│ │(Datadog/NewR)│ │
   │ │ (Twilio) │ │ │ │ │ │
   │ └──────────────┘ └──────────────┘ └──────────────┘ │
   └─────────────────────────────────────────────────────────────────┘

### 5.2 Technology Stack Recommendations

#### 5.2.1 Frontend

**Web Application (User & Admin):**

- **Framework:** Next.js 14+ (React 18+)
- **UI Library:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand / Redux Toolkit
- **Form Handling:** React Hook Form + Zod validation
- **API Client:** Axios / TanStack Query
- **Audio Player:** Howler.js / WaveSurfer.js
- **File Upload:** react-dropzone + tus (resumable uploads)
- **Charts:** Recharts / Chart.js
- **Date Picker:** react-datepicker
- **Rich Text Editor:** Tiptap / Quill
- **Notifications:** react-hot-toast
- **Authentication:** NextAuth.js

**Mobile Application (Future):**

- **Framework:** React Native / Expo
- **UI:** React Native Paper / NativeWind
- **State:** Zustand / Redux Toolkit
- **API:** Axios / React Query

#### 5.2.2 Backend

**API Server:**

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js / Fastify (for performance)
- **Language:** TypeScript (strongly recommended)
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Joi / Zod
- **Authentication:** JWT (jsonwebtoken)
- **2FA:** speakeasy (TOTP)
- **Rate Limiting:** express-rate-limit
- **Security:** helmet, cors, express-validator

**Alternative (if Python preferred):**

- **Framework:** FastAPI
- **Validation:** Pydantic
- **Authentication:** python-jose (JWT)

#### 5.2.3 Database

**Primary Database:**

- **RDBMS:** PostgreSQL 15+
  - Reasons: ACID compliance, JSON support, strong ecosystem, scalability
  - Extensions: uuid-ossp, pg_trgm (full-text search)
  - ORM: Prisma (Node.js) / TypeORM / Sequelize
  - Migrations: Prisma Migrate / TypeORM migrations

**Alternative:** MySQL 8.0+ (if team is more familiar)

**Cache Layer:**

- **Redis 7+**
  - Use cases:
    - Session storage
    - API response caching
    - Rate limiting counters
    - Real-time data (active users)
    - Queue management

**Search Engine:**

- **Elasticsearch 8+** (for advanced search, analytics)
  - Index uploads for full-text search
  - Artist search
  - Analytics aggregations
  - Alternative: OpenSearch (AWS)

**Alternative for smaller scale:**

- PostgreSQL full-text search (built-in)

#### 5.2.4 File Storage

**Object Storage:**

- **AWS S3** (recommended)
  - Buckets:
    - `musicflow-audio-prod`
    - `musicflow-covers-prod`
    - `musicflow-csv-prod`
    - `musicflow-backups-prod`
  - Lifecycle policies (auto-delete old files)
  - Versioning enabled
  - Server-side encryption (AES-256)
  - CORS configuration

**Alternatives:**

- Google Cloud Storage
- Azure Blob Storage
- Cloudinary (for images, has built-in optimization)
- Backblaze B2 (cost-effective)

**CDN:**

- **AWS CloudFront** (if using S3)
- **Cloudflare** (global, DDoS protection)
- **Fastly** (advanced features)
- Benefits:
  - Faster file delivery globally
  - Reduced bandwidth costs
  - Caching at edge locations

#### 5.2.5 Background Jobs

**Message Queue:**

- **BullMQ** (Redis-based, Node.js)
  - Job types:
    - Email sending
    - File processing (audio analysis)
    - CSV generation
    - Distribution API calls
    - Image resizing
  - Features: Job retry, priority, delayed jobs, cron jobs

**Alternatives:**

- RabbitMQ (more robust, language-agnostic)
- AWS SQS (managed service)
- Google Cloud Tasks

**Job Scheduler:**

- **node-cron** (for scheduled tasks)
  - Daily CSV generation
  - Weekly reports
  - Cleanup jobs
  - Backup jobs

#### 5.2.6 Real-time Communication

**WebSocket:**

- **Socket.IO** (Node.js)
  - Use cases:
    - Real-time notifications
    - Upload progress
    - Admin dashboard live updates
    - Chat support

**Alternative:**

- **Server-Sent Events (SSE)** (simpler, one-way)

#### 5.2.7 Email Service

**Email Provider:**

- **SendGrid** (reliable, good deliverability)
- **AWS SES** (cost-effective, requires warm-up)
- **Mailgun** (developer-friendly)
- **Postmark** (transactional emails)

**Email Templates:**

- MJML (responsive email markup)
- Handlebars (template engine)

#### 5.2.8 SMS Service

**SMS Provider:**

- **Twilio** (global, reliable)
- **AWS SNS** (cost-effective)
- **MSG91** (India-focused)

#### 5.2.9 Payment Gateway (Future)

**Payment Processors:**

- **Stripe** (global, developer-friendly)
- **Razorpay** (India-focused, supports UPI)
- **PayPal** (widely accepted)

#### 5.2.10 Monitoring & Logging

**Application Monitoring:**

- **Datadog** (comprehensive, expensive)
- **New Relic** (APM, good for Node.js)
- **Sentry** (error tracking)
- **AWS CloudWatch** (if on AWS)

**Logging:**

- **Winston** (Node.js logging library)
- **Morgan** (HTTP request logger)
- **Logtail** (centralized logging)
- **ELK Stack** (Elasticsearch, Logstash, Kibana) - self-hosted

**Uptime Monitoring:**

- **Pingdom** (uptime monitoring)
- **UptimeRobot** (free tier available)
- **StatusCake**

#### 5.2.11 Analytics

**User Analytics:**

- **Google Analytics 4**
- **Mixpanel** (event tracking)
- **Amplitude** (product analytics)
- **Plausible** (privacy-friendly alternative)

**Custom Analytics:**

- Build custom dashboard using Elasticsearch + Kibana
- Or PostgreSQL + Metabase

#### 5.2.12 DevOps & Infrastructure

**Hosting:**

- **AWS** (EC2, RDS, S3, CloudFront, SQS, etc.)
  - Recommended regions: ap-south-1 (Mumbai), us-east-1 (N. Virginia)
- **Google Cloud Platform** (GCP)
- **Microsoft Azure**
- **DigitalOcean** (simpler, cost-effective for startups)
- **Vercel** (for Next.js frontend)

**Containerization:**

- **Docker** (containerize application)
- **Docker Compose** (local development)

**Orchestration (for scale):**

- **Kubernetes** (K8s) via EKS/GKE/AKS
- **Docker Swarm** (simpler alternative)
- **AWS ECS/Fargate** (managed containers)

**CI/CD:**

- **GitHub Actions** (if using GitHub)
- **GitLab CI** (if using GitLab)
- **CircleCI** (popular choice)
- **Jenkins** (self-hosted, highly customizable)

**Infrastructure as Code:**

- **Terraform** (cloud-agnostic)
- **AWS CloudFormation** (AWS-specific)
- **Pulumi** (code-based IaC)

**Reverse Proxy / Load Balancer:**

- **Nginx** (reverse proxy, load balancer)
- **AWS ALB** (Application Load Balancer)
- **HAProxy**

**SSL/TLS:**

- **Let's Encrypt** (free SSL certificates)
- **AWS Certificate Manager** (free on AWS)

#### 5.2.13 Security Tools

**Web Application Firewall (WAF):**

- **AWS WAF**
- **Cloudflare WAF**
- **Imperva**

**DDoS Protection:**

- **Cloudflare** (free tier includes basic protection)
- **AWS Shield**

**Secrets Management:**

- **AWS Secrets Manager**
- **HashiCorp Vault**
- **Environment variables** (for local dev)

**Dependency Scanning:**

- **Snyk** (vulnerability scanning)
- **npm audit** / **yarn audit** (built-in)
- **Dependabot** (GitHub, auto-updates)

### 5.3 Recommended Tech Stack Summary

**For a scalable, production-ready system:**
Frontend: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Backend: Node.js 20 + Express + TypeScript
Database: PostgreSQL 15 + Redis 7 + Elasticsearch 8
ORM: Prisma
Storage: AWS S3 + CloudFront CDN
Queue: BullMQ (Redis-based)
Email: SendGrid / AWS SES
SMS: Twilio / MSG91
Real-time: Socket.IO
Auth: JWT + 2FA (speakeasy)
Payments: Stripe / Razorpay
Hosting: AWS (EC2, RDS, S3, ALB, CloudFront)
CI/CD: GitHub Actions
Monitoring: Datadog / New Relic + Sentry
Analytics: Google Analytics 4 + Custom (Elasticsearch)

**Alternative stack (simpler, cost-effective for MVP):**
Frontend: Next.js + TypeScript + Tailwind
Backend: Node.js + Express + TypeScript
Database: PostgreSQL (managed by hosting provider)
Storage: Cloudinary (images) + Backblaze B2 (audio)
Queue: BullMQ
Email: SendGrid
Hosting: DigitalOcean (App Platform + Managed PostgreSQL + Spaces)
CI/CD: GitHub Actions
Monitoring: Sentry (errors) + UptimeRobot (uptime)

---

## 6. DATABASE SCHEMA

### 6.1 Entity Relationship Diagram (ERD)

┌─────────────────────────────────────────────────────────────────┐
│ DATABASE SCHEMA │
└─────────────────────────────────────────────────────────────────┘
┌──────────────────┐ ┌──────────────────┐
│ Users │ │ Uploads │
├──────────────────┤ ├──────────────────┤
│ id (PK) │─────────│ id (PK) │
│ email (unique) │ 1:N │ user_id (FK) │
│ password_hash │ │ track_title │
│ artist_name │ │ album_name │
│ phone │ │ genre │
│ profile_picture │ │ audio_url │
│ bio │ │ cover_art_url │
│ country │ │ status │
│ status │ │ isrc │
│ email_verified │ │ upc │
│ created_at │ │ created_at │
│ updated_at │ │ updated_at │
└──────────────────┘ └──────────────────┘
│ │
│ │
│ │
│ ┌────────┴────────┐
│ │ │
│ ┌────────▼──────┐ ┌───────▼────────┐
│ │ Metadata │ │ DistributionLog│
│ ├───────────────┤ ├────────────────┤
│ │ id (PK) │ │ id (PK) │
│ │ upload_id (FK)│ │ upload_id (FK) │
│ │ lyrics │ │ platform │
│ │ featured_art..│ │ status │
│ │ songwriter │ │ live_url │
│ │ producer │ │ distributed_at │
│ │ ... │ │ error_message │
│ └───────────────┘ └────────────────┘
│
│
┌────▼────────┐ ┌──────────────┐
│ Sessions │ │Notifications │
├─────────────┤ ├──────────────┤
│ id (PK) │ │ id (PK) │
│ user_id (FK)│ │ user_id (FK) │
│ token │ │ type │
│ ip_address │ │ message │
│ device │ │ read │
│ expires_at │ │ created_at │
└─────────────┘ └──────────────┘
┌──────────────────┐ ┌──────────────┐
│ SupportTickets │ │ Admins │
├──────────────────┤ ├──────────────┤
│ id (PK) │ │ id (PK) │
│ user_id (FK) │ │ email │
│ upload_id (FK) │ │ password_hash│
│ category │ │ name │
│ subject │ │ role │
│ status │ │ permissions │
│ priority │ │ last_login │
│ created_at │ │ created_at │
└──────────────────┘ └──────────────┘
│
│
┌────▼──────────┐ ┌──────────────┐
│TicketMessages │ │ AuditLogs │
├───────────────┤ ├──────────────┤
│ id (PK) │ │ id (PK) │
│ ticket_id (FK)│ │ admin_id (FK)│
│ sender_id (FK)│ │ action │
│ sender_type │ │ target_type │
│ message │ │ target_id │
│ created_at │ │ ip_address │
└───────────────┘ │ created_at │
└──────────────┘
┌──────────────────┐ ┌──────────────┐
│ CSVExports │ │ EmailQueue │
├──────────────────┤ ├──────────────┤
│ id (PK) │ │ id (PK) │
│ admin_id (FK) │ │ to_email │
│ filters │ │ subject │
│ columns │ │ body │
│ file_url │ │ status │
│ row_count │ │ attempts │
│ created_at │ │ sent_at │
│ expires_at │ │ created_at │
└──────────────────┘ └──────────────┘

### 6.2 Detailed Table Schemas

#### 6.2.1 Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    artist_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(100),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    profile_picture VARCHAR(500),
    banner_image VARCHAR(500),
    bio TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    country VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),

    -- Social Media
    spotify_profile VARCHAR(500),
    apple_music_profile VARCHAR(500),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    twitter VARCHAR(100),
    youtube VARCHAR(100),
    soundcloud VARCHAR(100),
    tiktok VARCHAR(100),
    website VARCHAR(500),

    -- Payment Information
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    swift_code VARCHAR(20),
    paypal_email VARCHAR(255),
    upi_id VARCHAR(100),
    tax_id VARCHAR(50),
    gst_number VARCHAR(50),

    -- Account Status
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, banned, deleted
    suspension_reason TEXT,
    banned_reason TEXT,

    -- Settings
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    profile_visibility VARCHAR(20) DEFAULT 'public', -- public, private

    -- Storage
    storage_used_mb DECIMAL(10,2) DEFAULT 0,
    storage_limit_mb DECIMAL(10,2) DEFAULT 5120, -- 5 GB default

    -- Security
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[], -- Array of backup codes
    password_changed_at TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP, -- Soft delete

    -- Indexes
    CONSTRAINT chk_status CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_artist_name ON users(artist_name);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 6.2.2 Uploads Table

```sql
CREATE TABLE uploads (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Track Information
    track_title VARCHAR(200) NOT NULL,
    album_name VARCHAR(200),
    track_number SMALLINT,
    total_tracks SMALLINT,
    disc_number SMALLINT,
    release_type VARCHAR(20), -- single, album, ep

    -- Genre & Language
    genre_primary VARCHAR(50) NOT NULL,
    genre_secondary VARCHAR(50),
    language VARCHAR(50) NOT NULL,
    multi_language BOOLEAN DEFAULT FALSE,

    -- Dates
    release_date DATE NOT NULL,

    -- Content Flags
    explicit_content BOOLEAN DEFAULT FALSE,

    -- File URLs
    audio_url VARCHAR(1000) NOT NULL,
    cover_art_url VARCHAR(1000) NOT NULL,

    -- Audio Technical Details
    audio_format VARCHAR(10) NOT NULL, -- mp3, wav, flac
    audio_bitrate_kbps INTEGER,
    audio_sample_rate_hz INTEGER,
    audio_channels VARCHAR(10), -- stereo, mono
    audio_bit_depth INTEGER, -- for WAV
    audio_codec VARCHAR(50),
    file_size_bytes BIGINT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    peak_level_db DECIMAL(5,2),

    -- Cover Art Details
    cover_width INTEGER,
    cover_height INTEGER,
    cover_format VARCHAR(10), -- jpg, png, webp
    cover_size_bytes INTEGER,

    -- Identifiers
    isrc VARCHAR(20),
    upc VARCHAR(20),

    -- Status & Review
    status VARCHAR(20) DEFAULT 'pending', -- draft, pending, approved, rejected, live, archived
    review_status VARCHAR(20) DEFAULT 'not_reviewed', -- not_reviewed, under_review, reviewed
    reviewed_by BIGINT REFERENCES admins(id),
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    rejection_reason VARCHAR(50),
    rejection_feedback TEXT,
    admin_notes TEXT,

    -- Quality Checks
    quality_checks_passed BOOLEAN DEFAULT FALSE,
    quality_issues JSONB, -- JSON array of issues
    automated_checks_passed BOOLEAN DEFAULT FALSE,

    -- Distribution
    distribution_status VARCHAR(20) DEFAULT 'not_distributed',
    distributed_at TIMESTAMP,
    distribution_error TEXT,

    -- Territories & Platforms
    territories VARCHAR(20) DEFAULT 'worldwide', -- worldwide, custom
    custom_territories TEXT[], -- Array of country codes
    target_platforms TEXT[], -- Array of platform names
    monetization_enabled BOOLEAN DEFAULT TRUE,

    -- Upload Metadata
    upload_ip VARCHAR(45),
    upload_device VARCHAR(200),
    upload_location VARCHAR(200),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_status CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'live', 'archived', 'deleted')),
    CONSTRAINT chk_release_type CHECK (release_type IN ('single', 'album', 'ep')),
    CONSTRAINT chk_audio_format CHECK (audio_format IN ('mp3', 'wav', 'flac')),
    CONSTRAINT chk_duration CHECK (duration_seconds >= 30 AND duration_seconds <= 900),
    CONSTRAINT chk_cover_dimensions CHECK (cover_width >= 3000 AND cover_height >= 3000),
    CONSTRAINT chk_isrc_format CHECK (isrc IS NULL OR isrc ~ '^[A-Z]{2}-[A-Z0-9]{3}-[0-9]{2}-[0-9]{5}$')
);

CREATE INDEX idx_uploads_user_id ON uploads(user_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);
CREATE INDEX idx_uploads_release_date ON uploads(release_date);
CREATE INDEX idx_uploads_genre ON uploads(genre_primary);
CREATE INDEX idx_uploads_isrc ON uploads(isrc);
CREATE INDEX idx_uploads_distribution_status ON uploads(distribution_status);

-- Full-text search index
CREATE INDEX idx_uploads_search ON uploads USING GIN (to_tsvector('english', track_title || ' ' || COALESCE(album_name, '')));
```

#### 6.2.3 Metadata Table (Extended track information)

```sql
CREATE TABLE metadata (
    id BIGSERIAL PRIMARY KEY,
    upload_id BIGINT UNIQUE NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,

    -- Lyrics
    lyrics TEXT,
    lyrics_language VARCHAR(50),
    romanized_lyrics TEXT,
    time_synced_lyrics TEXT, -- LRC format

    -- Credits
    featured_artists TEXT[], -- Array of artist names
    primary_artist VARCHAR(200),
    songwriters TEXT[],
    composers TEXT[],
    producers TEXT[],
    mixing_engineers TEXT[],
    mastering_engineers TEXT[],

    -- Label & Publisher
    record_label VARCHAR(200),
    publisher VARCHAR(200),

    -- Copyright
    copyright_p_line VARCHAR(500), -- ℗ Line
    copyright_c_line VARCHAR(500), -- © Line

    -- Advanced
    mood VARCHAR(50),
    tempo_bpm INTEGER,
    key_signature VARCHAR(10),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metadata_upload_id ON metadata(upload_id);
```

#### 6.2.4 Distribution_Logs Table

```sql
CREATE TABLE distribution_logs (
    id BIGSERIAL PRIMARY KEY,
    upload_id BIGINT NOT NULL REFERENCES uploads(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- spotify, apple_music, youtube_music, etc.

    status VARCHAR(20) NOT NULL, -- queued, processing, live, failed, removed

    live_url VARCHAR(1000), -- Link to track on platform
    platform_track_id VARCHAR(200), -- Platform's internal track ID

    -- Timestamps
    queued_at TIMESTAMP,
    submitted_at TIMESTAMP,
    live_at TIMESTAMP,
    failed_at TIMESTAMP,
    removed_at TIMESTAMP,

    -- Error Handling
    error_message TEXT,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,

    -- API Response (for debugging)
    api_request JSONB,
    api_response JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_status CHECK (status IN ('queued', 'processing', 'live', 'failed', 'removed'))
);

CREATE INDEX idx_distribution_upload_id ON distribution_logs(upload_id);
CREATE INDEX idx_distribution_platform ON distribution_logs(platform);
CREATE INDEX idx_distribution_status ON distribution_logs(status);
```

#### 6.2.5 Sessions Table

```sql
CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,

    ip_address VARCHAR(45),
    device VARCHAR(200),
    browser VARCHAR(100),
    os VARCHAR(100),
    location VARCHAR(200),

    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### 6.2.6 Notifications Table

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type VARCHAR(50) NOT NULL, -- upload_success, upload_failed, approved, rejected, live, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    related_type VARCHAR(50), -- upload, ticket, payment, etc.
    related_id BIGINT,

    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    action_url VARCHAR(500), -- Link to related resource

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

#### 6.2.7 Support_Tickets Table

```sql
CREATE TABLE support_tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    upload_id BIGINT REFERENCES uploads(id) ON DELETE SET NULL,

    category VARCHAR(50) NOT NULL, -- upload_issue, account, payment, distribution, technical, other
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, waiting, resolved, closed

    assigned_to BIGINT REFERENCES admins(id),

    first_response_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_category CHECK (category IN ('upload_issue', 'account', 'payment', 'distribution', 'technical', 'other')),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT chk_status CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed'))
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON support_tickets(created_at DESC);
```

#### 6.2.8 Ticket_Messages Table

```sql
CREATE TABLE ticket_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,

    sender_id BIGINT NOT NULL,
    sender_type VARCHAR(20) NOT NULL, -- user, admin, system

    message TEXT NOT NULL,
    attachments TEXT[], -- Array of file URLs

    is_internal BOOLEAN DEFAULT FALSE, -- Internal admin notes

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_sender_type CHECK (sender_type IN ('user', 'admin', 'system'))
);

CREATE INDEX idx_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_messages_created_at ON ticket_messages(created_at);
```

#### 6.2.9 Admins Table

```sql
CREATE TABLE admins (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,

    role VARCHAR(20) NOT NULL, -- super_admin, admin, support, analyst
    permissions JSONB, -- JSON object of permissions

    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted

    two_factor_enabled BOOLEAN DEFAULT TRUE,
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[],

    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    password_changed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_role CHECK (role IN ('super_admin', 'admin', 'support', 'analyst')),
    CONSTRAINT chk_status CHECK (status IN ('active', 'suspended', 'deleted'))
);

CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_role ON admins(role);
```

#### 6.2.10 Audit_Logs Table

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT REFERENCES admins(id),

    action VARCHAR(100) NOT NULL, -- approve_upload, reject_upload, delete_user, export_csv, etc.
    target_type VARCHAR(50) NOT NULL, -- upload, user, ticket, settings, etc.
    target_id BIGINT,

    description TEXT,
    changes JSONB, -- Before/after values

    ip_address VARCHAR(45),
    user_agent VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
```

#### 6.2.11 CSV_Exports Table

```sql
CREATE TABLE csv_exports (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL REFERENCES admins(id),

    export_name VARCHAR(200),
    filters JSONB NOT NULL, -- JSON of applied filters
    columns TEXT[] NOT NULL, -- Array of column names

    status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
    file_url VARCHAR(1000),
    file_size_bytes BIGINT,
    row_count INTEGER,

    error_message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Auto-delete after 30 days

    CONSTRAINT chk_status CHECK (status IN ('processing', 'completed', 'failed'))
);

CREATE INDEX idx_csv_admin_id ON csv_exports(admin_id);
CREATE INDEX idx_csv_created_at ON csv_exports(created_at DESC);
CREATE INDEX idx_csv_expires_at ON csv_exports(expires_at);
```

#### 6.2.12 Email_Queue Table

```sql
CREATE TABLE email_queue (
    id BIGSERIAL PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    cc_email VARCHAR(255),
    bcc_email VARCHAR(255),

    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    html_body TEXT,

    template_name VARCHAR(100),
    template_data JSONB,

    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,

    error_message TEXT,

    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP,

    CONSTRAINT chk_status CHECK (status IN ('pending', 'sent', 'failed'))
);

CREATE INDEX idx_email_status ON email_queue(status);
CREATE INDEX idx_email_scheduled ON email_queue(scheduled_for);
```

#### 6.2.13 Settings Table (System configuration)

```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_type VARCHAR(20) NOT NULL, -- string, number, boolean, json
    description TEXT,
    category VARCHAR(50), -- general, upload, distribution, email, security, etc.

    updated_by BIGINT REFERENCES admins(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_value_type CHECK (value_type IN ('string', 'number', 'boolean', 'json'))
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- Example settings
INSERT INTO settings (key, value, value_type, category, description) VALUES
('max_file_size_audio_mb', '500', 'number', 'upload', 'Maximum audio file size in MB'),
('max_file_size_cover_mb', '10', 'number', 'upload', 'Maximum cover art file size in MB'),
('min_cover_dimensions', '3000', 'number', 'upload', 'Minimum cover art dimensions (square)'),
('auto_approve_enabled', 'false', 'boolean', 'upload', 'Automatically approve uploads if all checks pass'),
('review_sla_hours', '48', 'number', 'upload', 'Review SLA in hours'),
('platform_name', 'MusicFlow', 'string', 'general', 'Platform name'),
('support_email', 'support@musicflow.com', 'string', 'general', 'Support email address');
```

#### 6.2.14 Activity_Logs Table (User activity tracking)

```sql
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,

    activity_type VARCHAR(50) NOT NULL, -- login, logout, upload, profile_update, etc.
    description TEXT,

    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    location VARCHAR(200),

    metadata JSONB, -- Additional context

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_created_at ON activity_logs(created_at DESC);
```

#### 6.2.15 Scheduled_Jobs Table (Cron jobs tracking)

```sql
CREATE TABLE scheduled_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_name VARCHAR(100) UNIQUE NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- csv_export, email_digest, cleanup, backup, etc.

    schedule VARCHAR(100) NOT NULL, -- Cron expression
    enabled BOOLEAN DEFAULT TRUE,

    last_run_at TIMESTAMP,
    last_run_status VARCHAR(20), -- success, failed
    last_run_error TEXT,

    next_run_at TIMESTAMP,

    config JSONB, -- Job-specific configuration

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scheduled_jobs_enabled ON scheduled_jobs(enabled);
CREATE INDEX idx_scheduled_jobs_next_run ON scheduled_jobs(next_run_at);
```

### 6.3 Database Optimization

**Indexing Strategy:**

- Primary keys: Auto-indexed
- Foreign keys: Indexed for JOIN performance
- Frequently filtered columns: status, created_at, email
- Search columns: Full-text search indexes on track_title, artist_name
- Composite indexes: (user_id, status), (upload_id, platform)

**Partitioning (for scale):**

- Partition `uploads` table by `created_at` (monthly partitions)
- Partition `audit_logs` by `created_at` (monthly partitions)
- Benefits: Faster queries on recent data, easier archiving

**Query Optimization:**

- Use EXPLAIN ANALYZE to identify slow queries
- Avoid SELECT \*, specify only needed columns
- Use prepared statements to prevent SQL injection
- Limit result sets with OFFSET/LIMIT

**Connection Pooling:**

- Use pg-pool (Node.js) or similar
- Max connections: 20-50 (based on server capacity)
- Idle timeout: 30 seconds

**Caching Strategy:**

- Cache frequently accessed data in Redis:
  - User sessions
  - Upload lists (recent uploads)
  - Admin dashboard stats
  - Genre/language dropdowns
- TTL: 5-60 minutes depending on data volatility

**Backup Strategy:**

- Automated daily backups (AWS RDS automated backups)
- Point-in-time recovery enabled
- Weekly full backups to S3
- Retention: 30 days for daily, 1 year for weekly
- Test restore process monthly

**Replication:**

- Master-slave replication for read scalability
- Master: All writes
- Slaves (2): Read queries (uploads list, analytics)
- Replication lag monitoring

---

## 7. SECURITY & COMPLIANCE

### 7.1 Authentication & Authorization

**Password Security:**

- **Hashing Algorithm:** bcrypt (cost factor: 12)
- **Salt:** Unique per password (automatic with bcrypt)
- **Password Requirements:**
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (!@#$%^&\*)
  - Cannot be common password (check against top 10,000)
  - Cannot be same as email or username
  - Cannot reuse last 5 passwords
- **Password Expiry:** Every 180 days (configurable, optional)
- **Forgot Password:**
  - Email OTP (6-digit, expires in 10 minutes)
  - Or password reset link (expires in 1 hour)
  - Rate limit: 3 requests per hour per email
  - Invalidate all existing sessions on password reset

**Two-Factor Authentication (2FA):**

- **Methods:**
  - TOTP (Time-based One-Time Password) via authenticator apps
  - SMS OTP (fallback)
  - Email OTP (fallback)
  - Backup codes (10 one-time use codes)
- **Enforcement:**
  - Mandatory for all admin accounts
  - Optional but strongly recommended for users
  - Can be required for high-value accounts (future)
- **Implementation:**
  - Library: speakeasy (Node.js)
  - QR code generation for TOTP setup
  - 30-second time window
  - Allow 1 time window drift for clock skew

**Session Management:**

- **JWT Tokens:**
  - Access token: 15 minutes expiry (short-lived)
  - Refresh token: 7 days expiry (long-lived)
  - Algorithm: HS256 (HMAC-SHA256) or RS256 (RSA with SHA-256)
  - Payload: user_id, email, role, iat, exp
  - Signed with secret key (stored in environment variable)
- **Token Storage:**
  - Access token: Memory (not localStorage for security)
  - Refresh token: httpOnly cookie (secure, sameSite: strict)
- **Token Refresh Flow:**
  - Client requests new access token with refresh token
  - Server validates refresh token
  - Issues new access + refresh token pair
  - Invalidates old refresh token (rotation)
- **Session Invalidation:**
  - Logout: Blacklist refresh token (store in Redis with TTL)
  - Logout all devices: Invalidate all refresh tokens for user
  - Password change: Invalidate all sessions
- **Session Tracking:**
  - Store active sessions in database
  - IP address, device, browser, location
  - Last activity timestamp
  - User can view and revoke individual sessions

**Authorization (RBAC - Role-Based Access Control):**

**User Roles:**

- `user`: Regular artist account
- `premium_user`: Paid plan (future)
- `label`: Record label account (future)

**Admin Roles:**

- `super_admin`: Full access to everything
- `admin`: Upload review, user management
- `support`: Support tickets only
- `analyst`: Read-only analytics

**Permissions (Granular):**

- `users:read`, `users:write`, `users:delete`
- `uploads:read`, `uploads:approve`, `uploads:reject`, `uploads:delete`
- `csv:export`
- `tickets:read`, `tickets:write`
- `settings:read`, `settings:write`
- `admins:manage`

**Permission Checks:**

```javascript
// Middleware example
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

// Usage
app.delete("/admin/users/:id", requirePermission("users:delete"), deleteUser);
```

### 7.2 Data Security

**Encryption:**

**At Rest:**

- **Database:** Enable encryption at rest (AWS RDS encryption, transparent)
- **File Storage:** Enable S3 server-side encryption (SSE-S3 or SSE-KMS)
- **Backups:** Encrypted backups
- **Secrets:** Environment variables encrypted (AWS Secrets Manager, HashiCorp Vault)

**In Transit:**

- **HTTPS:** Enforce HTTPS for all connections (SSL/TLS 1.2+)
- **Certificate:** Let's Encrypt or AWS Certificate Manager
- **HSTS:** HTTP Strict Transport Security header
- **Database:** SSL/TLS connection to database
- **API Calls:** HTTPS for all external API calls (distribution, email, etc.)

**Sensitive Data Handling:**

- **PII (Personally Identifiable Information):**
  - Email, phone, payment details
  - Encrypt in database (column-level encryption) or tokenize
  - Mask when displayed (e.g., show last 4 digits of phone)
  - Audit access (who viewed what PII, when)
- **Passwords:**
  - Never store plaintext
  - Hash with bcrypt
  - Never log passwords (even hashed)
  - Never transmit in URL parameters
- **API Keys:**
  - Store hashed in database
  - Display only once on generation
  - Allow regeneration
  - Rotate regularly

**File Security:**

- **Upload Validation:**
  - File type validation (MIME type + file extension + magic bytes)
  - File size limits (500 MB audio, 10 MB cover)
  - Virus/malware scanning (ClamAV or cloud service)
  - Audio file validation (not executable disguised as MP3)
- **Storage Access:**
  - Private buckets (not publicly listable)
  - Signed URLs for file access (temporary, expiring links)
  - CORS configuration (allow only our domain)
- **CDN Security:**
  - Signed URLs for sensitive files
  - Rate limiting on CDN
  - DDoS protection (Cloudflare, AWS Shield)

### 7.3 API Security

**Rate Limiting:**

- **User Endpoints:**
  - Login: 5 attempts per 15 minutes per IP
  - Signup: 3 attempts per hour per IP
  - Upload: 10 uploads per day per user
  - API calls: 100 requests per minute per user
- **Admin Endpoints:**
  - 1000 requests per minute per admin
- **Public Endpoints:**
  - 60 requests per minute per IP
- **Implementation:** express-rate-limit + Redis for distributed rate limiting
- **Response:** HTTP 429 Too Many Requests, with Retry-After header

**Input Validation:**

- **Sanitization:**
  - Strip HTML tags from text inputs (prevent XSS)
  - Validate email format
  - Validate phone number format
  - Validate URLs
  - Validate file extensions
- **Libraries:** validator.js, express-validator, Joi, Zod
- **Validation Rules:**
  - Whitelist allowed characters (alphanumeric + specific special chars)
  - Max length enforcement
  - Type checking (string, number, boolean)
  - Enum validation (status values, etc.)
- **Example:**

```javascript
const { body, validationResult } = require('express-validator');

app.post('/upload', [
  body('track_title').isString().trim().isLength({ min: 1, max: 200 }),
  body('genre').isIn(['Pop', 'Rock', 'Hip Hop', ...]),
  body('release_date').isDate(),
  body('explicit_content').isBoolean(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Proceed with upload
});
```

**SQL Injection Prevention:**

- **Use Parameterized Queries:** Always use ORM (Prisma, TypeORM) or prepared statements
- **Never concatenate user input into SQL queries**
- **Example (Prisma):**

```javascript
// Safe
const user = await prisma.user.findUnique({
  where: { email: userProvidedEmail },
});

// Unsafe (vulnerable)
const user =
  await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userProvidedEmail}`;
```

**XSS (Cross-Site Scripting) Prevention:**

- **Sanitize output:** Escape HTML in user-generated content
- **Content Security Policy (CSP):** HTTP header to restrict script sources
- **Libraries:** DOMPurify (frontend), sanitize-html (backend)
- **React:** Automatically escapes JSX (safe by default)

**CSRF (Cross-Site Request Forgery) Prevention:**

- **CSRF Tokens:** Include in forms and validate on server
- **SameSite Cookies:** Set cookies with SameSite=Strict or Lax
- **Double Submit Cookie Pattern:** Verify CSRF token matches cookie
- **Library:** csurf (Node.js)

**CORS (Cross-Origin Resource Sharing):**

- **Whitelist allowed origins:** Only our frontend domains
- **Credentials:** Allow credentials (cookies) only from trusted origins
- **Methods:** Only allow necessary methods (GET, POST, PUT, DELETE)
- **Example:**

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: ["https://musicflow.com", "https://admin.musicflow.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

**API Authentication:**

- **JWT Tokens:** Verify on every API request
- **API Keys (future):** For programmatic access, developer APIs
- **OAuth 2.0 (future):** For third-party integrations

**Logging & Monitoring:**

- **Log all API requests:**
  - Timestamp, endpoint, method, status code, response time
  - User ID (if authenticated)
  - IP address
  - User agent
- **Log security events:**
  - Failed login attempts
  - Suspicious activity (rapid requests, unusual patterns)
  - Admin actions (approvals, deletions, etc.)
- **Do not log sensitive data:**
  - Passwords (even hashed)
  - Full credit card numbers
  - API keys/tokens
- **Monitoring Tools:** Datadog, New Relic, Sentry

### 7.4 Compliance

**GDPR (General Data Protection Regulation):**

**User Rights:**

1. **Right to Access:**
   - User can request all data we have about them
   - Provide download link (JSON or CSV)
   - Response time: Within 30 days

2. **Right to Rectification:**
   - User can edit their profile anytime
   - Request admin to fix data if needed

3. **Right to Erasure ("Right to be Forgotten"):**
   - User can delete their account
   - Delete or anonymize personal data
   - Keep minimal data for legal/audit purposes
   - Grace period: 30 days (can recover)

4. **Right to Data Portability:**
   - User can download their data
   - Machine-readable format (JSON, CSV)
   - Include: profile, uploads, metadata, activity logs

5. **Right to Object:**
   - User can opt-out of marketing emails
   - Opt-out of data sharing with third parties

**Implementation:**

- **Data Download:**
  - Button in user settings: "Download My Data"
  - Generate ZIP file with all user data
  - Email link when ready (processing time: up to 48 hours)
- **Account Deletion:**
  - Button in settings: "Delete My Account"
  - Confirmation modal (password required)
  - Reason for deletion (optional feedback)
  - 30-day grace period (soft delete)
  - After 30 days: Hard delete
  - Anonymize data that must be retained (replace name/email with "Deleted User #12345")

- **Data Minimization:**
  - Only collect data necessary for service
  - Don't ask for unnecessary information
  - Regularly review and delete old data

- **Consent:**
  - Clear consent checkboxes on signup
  - Separate consent for marketing emails
  - Granular consent (newsletter vs product updates)
  - Easy to withdraw consent

- **Privacy Policy:**
  - Clear, readable privacy policy
  - Explain what data we collect, why, and how we use it
  - Explain third-party data sharing (distribution platforms)
  - Link in footer, signup page, and settings

**CCPA (California Consumer Privacy Act):**

- Similar to GDPR
- Applies to California residents
- Right to know, delete, opt-out of sale of personal information
- "Do Not Sell My Personal Information" link

**PCI DSS (if handling payments):**

- **Never store credit card numbers**
- Use payment processor (Stripe, Razorpay) that handles PCI compliance
- Tokenize payment methods
- Pass PCI compliance audits if needed

**DMCA (Digital Millennium Copyright Act):**

- **Copyright Infringement Handling:**
  - DMCA takedown notice submission form
  - Designated DMCA agent (register with US Copyright Office)
  - Respond to takedown notices within 48 hours
  - Remove infringing content
  - Notify uploader
  - Counter-notice process (if uploader disputes)
  - Repeat infringer policy (3 strikes = account termination)

- **Safe Harbor Provision:**
  - We are a platform, not liable for user-uploaded content
  - As long as we respond to takedown notices promptly

**Data Breach Notification:**

- **Incident Response Plan:**
  - Detect breach (monitoring, alerts)
  - Contain breach (isolate affected systems)
  - Assess impact (what data was accessed/stolen)
  - Notify affected users (within 72 hours - GDPR requirement)
  - Notify authorities (if required by law)
  - Public disclosure (if significant breach)
  - Remediation (fix vulnerability, reset passwords, etc.)
  - Post-mortem (learn from incident)

- **What to do in case of breach:**
  1. Immediately isolate affected systems
  2. Engage security team / external experts
  3. Assess scope of breach (which data, how many users)
  4. Notify legal/compliance team
  5. Draft user notification (clear, honest, actionable)
  6. Reset passwords for affected users
  7. Provide credit monitoring (if financial data exposed)
  8. Investigate root cause
  9. Implement fixes
  10. Document everything

**Terms of Service (ToS):**

- Clear, readable terms
- User rights and responsibilities
- Platform rights (e.g., right to remove content that violates ToS)
- Copyright policy
- Termination policy
- Limitation of liability
- Dispute resolution (arbitration, jurisdiction)
- Updates to ToS (notify users of changes)
- Acceptance: User must agree on signup

**Content Moderation:**

- **Prohibited Content:**
  - Hate speech, violence, terrorism
  - Child sexual abuse material (CSAM)
  - Copyright infringement
  - Spam, malware
  - Misleading content (fake tracks, impersonation)
  - Graphic violence, gore
- **Automated Filters:**
  - Keyword detection in metadata/lyrics
  - Audio fingerprinting (match against known copyrighted content)
  - Image recognition (cover art)
- **Manual Review:**
  - Admin reviews flagged content
  - User reports
  - Random sampling
- **Actions:**
  - Remove content
  - Warn user
  - Suspend account
  - Ban account
  - Report to authorities (if illegal content like CSAM)

### 7.5 Infrastructure Security

**Server Security:**

- **Operating System:** Ubuntu 24.04 LTS (keep updated)
- **Firewall:** UFW (Uncomplicated Firewall) or AWS Security Groups
  - Allow only necessary ports (80/443 for HTTP/HTTPS, 22 for SSH)
  - Restrict SSH access (IP whitelist)
- **SSH:**
  - Disable password authentication (use SSH keys only)
  - Disable root login
  - Use non-standard SSH port (optional, security through obscurity)
  - Fail2ban (block IPs after failed login attempts)
- **Updates:**
  - Automatic security updates (unattended-upgrades)
  - Regular manual updates for major versions
  - Test updates in staging before production

**Database Security:**

- **Access Control:**
  - Strong password for database user
  - Restrict database access to application server IPs only
  - No public access to database port (3306, 5432)
- **Principle of Least Privilege:**
  - Application uses a database user with limited permissions
  - No DROP, ALTER privileges for app user
  - Read-only user for analytics/reporting
- **Auditing:**
  - Enable database audit logs
  - Log all queries (for forensics, can impact performance)

**Network Security:**

- **VPC (Virtual Private Cloud):**
  - Isolate resources in private network
  - Public subnets: Load balancers, bastion hosts
  - Private subnets: App servers, databases
- **Security Groups:**
  - Whitelist traffic between services
  - Deny all by default, allow specific
- **DDoS Protection:**
  - Cloudflare (free basic protection)
  - AWS Shield (if on AWS)
  - Rate limiting at load balancer

**Secrets Management:**

- **Never commit secrets to Git:**
  - Use `.env` files (add to `.gitignore`)
  - Use environment variables
- **Secrets Manager:**
  - AWS Secrets Manager
  - HashiCorp Vault
  - Doppler
- **Rotation:**
  - Rotate API keys regularly (every 90 days)
  - Rotate database passwords (every 180 days)
  - Rotate JWT secret keys (if compromised)

**Code Security:**

- **Dependency Scanning:**
  - npm audit / yarn audit (before every deploy)
  - Snyk (automated scanning)
  - Dependabot (automated dependency updates)
- **Code Review:**
  - Peer review all code (pull requests)
  - Security-focused reviews for sensitive areas (auth, payments)
- **Static Analysis:**
  - ESLint (linting)
  - SonarQube (code quality + security)
  - Semgrep (security-focused static analysis)
- **Secrets Scanning:**
  - git-secrets (prevent committing secrets)
  - TruffleHog (scan git history for secrets)

**Deployment Security:**

- **CI/CD Security:**
  - Secrets stored in CI/CD environment variables (encrypted)
  - No secrets in build logs
  - Automated security tests in pipeline
- **Image Scanning (if using Docker):**
  - Scan Docker images for vulnerabilities
  - Trivy, Clair, Snyk Container
- **Immutable Infrastructure:**
  - Deploy new servers for updates (blue-green deployment)
  - No manual changes to production servers

**Backup & Disaster Recovery:**

- **Backup Strategy:**
  - Automated daily database backups
  - File storage backups (S3 versioning)
  - Weekly full backups to separate region/service
  - Retention: 30 days daily, 1 year weekly
- **Disaster Recovery Plan:**
  - RTO (Recovery Time Objective): 4 hours
  - RPO (Recovery Point Objective): 24 hours (max data loss)
  - Documented recovery procedures
  - Regular DR drills (quarterly)
  - Off-site backups (different cloud provider or region)

---

## 8. SCALABILITY STRATEGY

### 8.1 Horizontal Scaling

**Application Servers:**

- **Load Balancer:**
  - Distribute traffic across multiple API servers
  - AWS ALB (Application Load Balancer) or Nginx
  - Health checks (remove unhealthy instances)
  - Sticky sessions (if needed, e.g., for WebSocket)
  - SSL termination at load balancer

- **Auto-Scaling:**
  - Scale based on CPU/memory usage (target: 70%)
  - Scale based on request count
  - Minimum instances: 2 (for high availability)
  - Maximum instances: 10+ (based on budget/needs)
  - Scale-up: When avg CPU >70% for 2 minutes
  - Scale-down: When avg CPU <30% for 5 minutes
  - Scheduled scaling (e.g., scale up before peak hours)

- **Stateless Design:**
  - No session state stored on app servers
  - Session data in Redis (shared across all servers)
  - File uploads go directly to S3 (not stored on server)

**Database Scaling:**

- **Read Replicas:**
  - 1 master (writes), 2-3 read replicas (reads)
  - Read traffic: 80% (queries), Write traffic: 20% (inserts/updates)
  - Application routes queries:
    - Writes → Master
    - Reads → Read replicas (round-robin or least connections)
  - Replication lag monitoring (<1 second acceptable)

- **Connection Pooling:**
  - Limit database connections per app server
  - Reuse connections
  - Max connections: Based on database capacity
    - PostgreSQL: 100-200 connections (depends on RAM)
    - Connection pool size per app server: 10-20

- **Query Optimization:**
  - Index frequently queried columns
  - Avoid N+1 queries (use JOINs or batch queries)
  - Paginate results (LIMIT/OFFSET or cursor-based)
  - Cache query results (Redis)

- **Vertical Scaling (database):**
  - Start with smaller instance (e.g., db.t3.medium)
  - Scale up as needed (db.m5.large, db.m5.xlarge, etc.)
  - Monitor CPU, memory, IOPS

- **Sharding (extreme scale, future):**
  - Partition database by user_id or upload_id
  - Each shard handles a subset of data
  - Application routes queries to appropriate shard
  - Complex to implement, only if absolutely necessary

**Cache Scaling:**

- **Redis Cluster:**
  - Multiple Redis nodes for high availability
  - Master-slave replication
  - Automatic failover
  - Clustering for horizontal scaling (multiple masters)

- **Cache Strategy:**
  - Cache hot data (frequently accessed):
    - User sessions
    - Recent uploads
    - Dashboard stats
    - Dropdown data (genres, languages)
  - TTL (Time To Live):
    - Sessions: 15 minutes (auto-refresh on activity)
    - Dashboard stats: 5 minutes
    - Dropdown data: 1 hour
    - Upload lists: 1 minute
  - Cache invalidation:
    - On data update (e.g., upload approved → clear cache)
    - On delete
    - On user logout (clear session)

**File Storage Scaling:**

- **CDN (Content Delivery Network):**
  - Distribute files globally (edge caching)
  - Faster delivery (lower latency)
  - Reduce origin server load
  - Cache audio/cover art files
  - TTL: 1 day for audio, 7 days for covers (rarely change)

- **S3 Performance:**
  - Use S3 Transfer Acceleration (for faster uploads from far regions)
  - Multipart upload (for large files >100 MB)
  - Parallel uploads (upload chunks concurrently)
  - Request rate: S3 supports 5,500 PUT requests per second per prefix
    - Use prefixes to distribute load (e.g., /audio/2024/02/01/)

### 8.2 Performance Optimization

**Backend Optimization:**

1. **API Response Time:**
   - Target: <200ms for most endpoints
   - <500ms for complex queries
   - <2 seconds for file uploads (metadata only, file goes to S3)

2. **Caching:**
   - API response caching (Redis)
   - Example: Dashboard stats cached for 5 minutes
   - Cache key: `dashboard_stats:admin_${admin_id}`

3. **Database Query Optimization:**
   - Use EXPLAIN ANALYZE to identify slow queries
   - Add indexes for frequently queried columns
   - Avoid SELECT \* (fetch only needed columns)
   - Use database views for complex queries
   - Materialize expensive queries (pre-compute and store results)

4. **Async Processing:**
   - Offload heavy tasks to background jobs:
     - File processing (audio analysis, format conversion)
     - CSV generation
     - Email sending
     - Distribution API calls
     - Image resizing
   - Message queue (BullMQ, RabbitMQ)
   - Workers process jobs in background
   - User gets immediate response ("Processing...")

5. **Compression:**
   - Gzip compression for API responses (saves bandwidth)
   - Brotli for static assets (better compression than gzip)
   - Image optimization (cover art):
     - Resize to exact dimensions (3000x3000)
     - Convert to WebP (smaller than JPG/PNG)
     - Progressive JPG (loads faster)

6. **Code Optimization:**
   - Avoid blocking operations (use async/await)
   - Use streams for large files (don't load entire file in memory)
   - Batch operations (e.g., bulk insert 100 records at once)
   - Debounce/throttle API calls (prevent rapid repeated calls)

**Frontend Optimization:**

1. **Code Splitting:**
   - Load only necessary JavaScript (lazy loading)
   - Next.js automatic code splitting
   - Dynamic imports for heavy components

2. **Image Optimization:**
   - Next.js Image component (automatic optimization)
   - Lazy loading images (load as user scrolls)
   - Responsive images (serve appropriate size for device)
   - WebP format (modern browsers)

3. **Caching:**
   - Service Workers (PWA) - cache static assets
   - Browser cache headers (cache JS/CSS for 1 year, versioned)
   - CDN caching for static assets

4. **Bundle Size:**
   - Tree shaking (remove unused code)
   - Minification (compress JS/CSS)
   - Target: <200 KB initial bundle
   - Use bundle analyzer to identify large dependencies

5. **API Calls:**
   - Debounce search inputs (wait 300ms before searching)
   - Infinite scroll instead of pagination (for better UX)
   - Prefetch data (e.g., next page while user reads current page)
   - Optimistic updates (update UI immediately, rollback if API fails)

6. **Rendering:**
   - SSR (Server-Side Rendering) for SEO-critical pages
   - CSR (Client-Side Rendering) for authenticated pages
   - SSG (Static Site Generation) for marketing pages

**Monitoring & Alerts:**

1. **Performance Metrics:**
   - API response time (p50, p95, p99)
   - Database query time
   - Error rate (errors per minute)
   - Request rate (requests per second)
   - Active users (real-time)
   - CPU/memory usage (servers, database)

2. **Alerts:**
   - API response time >2 seconds (p95)
   - Error rate >1% (1 error per 100 requests)
   - CPU >80% for 5 minutes
   - Memory >90%
   - Database connections >90% of max
   - Disk space >90%
   - High replication lag (>5 seconds)

3. **Tools:**
   - Application: Datadog, New Relic, Dynatrace
   - Errors: Sentry
   - Logs: ELK stack, Logtail
   - Uptime: Pingdom, UptimeRobot
   - Real User Monitoring (RUM): Google Analytics, Sentry Performance

### 8.3 Capacity Planning

**Current Capacity (Assumptions for Year 1):**

- Users: 1,000
- Uploads per month: 500
- Total uploads: 6,000 (after 1 year)
- Storage: 50 GB (avg 8 MB per track)
- Database size: 5 GB
- API requests: 100,000 per day

**Year 1 Infrastructure:**

- **App Servers:** 2x t3.medium (AWS) or equivalent
  - 2 vCPU, 4 GB RAM each
  - Auto-scaling to 4 instances if needed
- **Database:** db.t3.medium (AWS RDS PostgreSQL)
  - 2 vCPU, 4 GB RAM
  - 100 GB storage
  - 1 read replica
- **Redis:** cache.t3.micro (AWS ElastiCache)
  - 1 GB memory
- **Storage:** AWS S3
  - 100 GB (with 20% buffer)
  - CloudFront CDN
- **Estimated Monthly Cost:** $300-500 USD

**Growth Projections:**

**Year 2:**

- Users: 10,000 (10x growth)
- Uploads per month: 5,000
- Total uploads: 60,000
- Storage: 500 GB
- Database: 50 GB
- API requests: 1,000,000 per day

**Year 2 Infrastructure:**

- **App Servers:** 4x t3.large
  - Auto-scaling to 8 instances
- **Database:** db.m5.large
  - 2 vCPU, 8 GB RAM
  - 500 GB storage
  - 2 read replicas
- **Redis:** cache.m5.large (4 GB)
- **Storage:** 1 TB S3
- **Estimated Monthly Cost:** $1,500-2,500 USD

**Year 3:**

- Users: 50,000
- Uploads per month: 20,000
- Total uploads: 240,000
- Storage: 2 TB
- Database: 200 GB
- API requests: 5,000,000 per day

**Year 3 Infrastructure:**

- **App Servers:** 8x t3.xlarge (or m5.large)
  - Auto-scaling to 16 instances
- **Database:** db.m5.2xlarge
  - 8 vCPU, 32 GB RAM
  - 1 TB storage
  - 3 read replicas
- **Redis:** cache.m5.xlarge (16 GB) or cluster
- **Storage:** 5 TB S3
- **Estimated Monthly Cost:** $5,000-8,000 USD

**Scaling Triggers:**

- Monitor growth rate monthly
- Scale infrastructure 2 months before projected capacity
- Load testing before major campaigns/launches
- Plan for 2x current capacity to handle spikes

**Cost Optimization:**

- Reserved instances (1-3 year commitment for 40-60% savings)
- Spot instances for non-critical workloads (workers)
- S3 lifecycle policies (archive old files to Glacier)
- Delete unused data (old CSVs, temporary files)
- Right-sizing (don't over-provision)
- Monitor and optimize (turn off unused resources)

---

## 9. FILE STORAGE & CDN

### 9.1 Cloud Storage Architecture

**Storage Structure:**
S3 Bucket: musicflow-prod (or similar)
│
├── audio/
│ ├── 2024/
│ │ ├── 01/
│ │ │ ├── user_1001_1704153600_track.mp3
│ │ │ ├── user_1002_1704154800_track.wav
│ │ │ └── ...
│ │ ├── 02/
│ │ └── ...
│ └── 2025/
│
├── covers/
│ ├── 2024/
│ │ ├── 01/
│ │ │ ├── user_1001_1704153600_cover.jpg
│ │ │ └── ...
│ │ └── ...
│ └── 2025/
│
├── csv/
│ ├── exports/
│ │ ├── 2024/
│ │ │ ├── 01/
│ │ │ │ ├── export_20240115_admin_5.csv
│ │ │ │ └── ...
│ │ │ └── ...
│ │ └── 2025/
│ │
│ └── scheduled/
│ ├── daily_approved_tracks.csv
│ └── ...
│
├── temp/
│ └── uploads/
│ ├── chunk_abc123_part1
│ ├── chunk_abc123_part2
│ └── ...
│
└── backups/
├── database/
│ ├── 2024-02-01-backup.sql.gz
│ └── ...
└── user_data/
└── ...

**File Naming Convention:**

- **Audio:** `user_{user_id}_{timestamp}_{random}.{ext}`
  - Example: `user_1001_1704153600_a4f2d9.mp3`
- **Cover:** `user_{user_id}_{timestamp}_{random}.{ext}`
  - Example: `user_1001_1704153600_b8e3c1.jpg`
- **CSV:** `export_{date}_{admin_id}_{random}.csv`
  - Example: `export_20240115_admin_5_f7a2b4.csv`

**Benefits:**

- Organized by year/month (easy to navigate, archive)
- User ID in filename (quick identification)
- Timestamp (chronological order, prevents collisions)
- Random suffix (additional uniqueness)
- No PII in filename (privacy)

### 9.2 Upload Flow

**Client-Side Upload (Direct to S3):**

**Step 1: Client requests signed URL**
Client → API: POST /api/upload/get-signed-url
Payload: { file_name, file_type, file_size, content_type }

**Step 2: API generates signed URL**

```javascript
// Backend (Node.js + AWS SDK)
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const generateSignedUrl = async (fileName, fileType, contentType) => {
  const key = `audio/2024/02/${userId}_${Date.now()}_${randomString()}.${fileExt}`;

  const params = {
    Bucket: "musicflow-prod",
    Key: key,
    Expires: 300, // 5 minutes
    ContentType: contentType,
    ACL: "private",
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);

  return { signedUrl, key };
};
```

**Step 3: Client uploads directly to S3**

```javascript
// Frontend
const uploadToS3 = async (file, signedUrl) => {
  await axios.put(signedUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      setUploadProgress(percentCompleted);
    },
  });
};
```

**Step 4: Client confirms upload to API**
Client → API: POST /api/upload/confirm
Payload: { key, file_info, metadata }

**Step 5: API creates database record**

```javascript
const upload = await prisma.upload.create({
  data: {
    user_id,
    track_title,
    audio_url: `https://s3.amazonaws.com/musicflow-prod/${key}`,
    status: "pending",
    // ... other fields
  },
});
```

**Resumable Uploads (for large files):**

- Use tus protocol (resumable upload standard)
- Break file into chunks (5-10 MB each)
- Upload chunks independently
- Resume from last successful chunk if connection drops
- Combine chunks on S3 after all uploaded

**Multipart Upload (S3 native):**

- For files >100 MB
- Split into parts (5 MB - 5 GB each)
- Upload parts in parallel (faster)
- S3 combines parts into single file
- Can resume failed uploads

### 9.3 CDN Configuration

**CloudFront (AWS CDN) Setup:**

**Distribution Settings:**

- **Origin:** S3 bucket (musicflow-prod)
- **Allowed HTTP Methods:** GET, HEAD, OPTIONS
- **Cache Behaviors:**
  - Audio files: Cache for 1 day (86400 seconds)
  - Cover art: Cache for 7 days (604800 seconds)
  - CSV files: No cache (always fetch fresh)
- **Viewer Protocol Policy:** Redirect HTTP to HTTPS
- **Compress Objects:** Yes (gzip compression)
- **Price Class:** Use All Edge Locations (or select based on target audience)

**Custom Domain:**

- CNAME: `cdn.musicflow.com` → CloudFront distribution
- SSL Certificate: AWS Certificate Manager (free)

**Signed URLs (for private files):**

```javascript
const cloudfront = new AWS.CloudFront.Signer(keyPairId, privateKey);

const signedUrl = cloudfront.getSignedUrl({
  url: "https://cdn.musicflow.com/audio/2024/02/file.mp3",
  expires: Math.floor(Date.now() / 1000) + 3600, // 1 hour
});
```

**Benefits:**

- **Performance:** Files cached at edge locations globally (low latency)
- **Cost:** Reduces S3 data transfer costs
- **Security:** Signed URLs prevent unauthorized access
- **Scalability:** Handles high traffic without origin server load

**Cache Invalidation:**

- When file is updated/deleted, invalidate CDN cache
- API call to CloudFront:

```javascript
const params = {
  DistributionId: "E1234567890ABC",
  InvalidationBatch: {
    CallerReference: `${Date.now()}`,
    Paths: {
      Quantity: 1,
      Items: ["/audio/2024/02/file.mp3"],
    },
  },
};

await cloudfront.createInvalidation(params).promise();
```

**Alternative CDNs:**

- **Cloudflare:** Easy setup, free tier, DDoS protection
- **Fastly:** Advanced features, real-time analytics
- **Bunny CDN:** Cost-effective

### 9.4 Storage Optimization

**Image Optimization:**

- **Cover Art Processing:**
  1. Upload original image (user's upload)
  2. Background job processes image:
     - Validate dimensions (min 3000x3000)
     - Resize to exact 3000x3000 (if larger)
     - Convert to WebP (smaller size, supported by most platforms)
     - Generate thumbnails:
       - 60x60 (list view)
       - 300x300 (detail view)
       - 600x600 (admin review)
     - Optimize (compress without quality loss)
  3. Store all versions:
     - Original: `cover_original.jpg`
     - Optimized: `cover_3000x3000.webp`
     - Thumbnails: `cover_60x60.webp`, `cover_300x300.webp`, etc.
  4. Serve appropriate version based on context

**Audio Optimization:**

- **Format Conversion (optional):**
  - User uploads WAV/FLAC (lossless, large)
  - Background job converts to MP3 320kbps (for streaming)
  - Store both original + converted
  - Serve MP3 for playback, keep original for distribution
- **Benefits:**
  - Faster streaming (smaller files)
  - Bandwidth savings
  - Original quality preserved for distribution

**S3 Lifecycle Policies:**

- **Transition to cheaper storage classes:**
  - After 30 days: Standard → Intelligent-Tiering
  - After 90 days: Intelligent-Tiering → Glacier (rarely accessed)
  - After 365 days: Glacier → Deep Archive (archival)
- **Auto-delete temporary files:**
  - `/temp/uploads/*` → Delete after 24 hours
  - CSV exports → Delete after 30 days
- **Benefits:** Significant cost savings (Glacier is 90% cheaper than Standard)

**Deduplication:**

- Check if identical file already exists (hash comparison)
- If duplicate, reference existing file instead of storing again
- Save storage space
- Use case: Same cover art for multiple tracks in album

### 9.5 Backup & Disaster Recovery

**Backup Strategy:**

1. **Database Backups:**
   - **Automated:** AWS RDS automated backups (daily)
   - **Retention:** 30 days
   - **Point-in-time recovery:** Up to 35 days
   - **Manual snapshots:** Before major changes/deployments
   - **Cross-region backup:** Weekly snapshot to different AWS region

2. **File Storage Backups:**
   - **S3 Versioning:** Enabled (keep previous versions of files)
   - **Cross-region replication:** Replicate to different region (optional, expensive)
   - **Alternative:** Weekly full backup to Backblaze B2 (cheaper cold storage)

3. **Backup Testing:**
   - Monthly restore test (ensure backups work)
   - Documented restore procedure
   - Measure restore time (RTO - Recovery Time Objective)

**Disaster Recovery:**

**Scenarios:**

1. **Database Failure:**
   - Automatic failover to read replica (promoted to master)
   - Downtime: <5 minutes
   - Or restore from automated backup (RPO: 24 hours max data loss)

2. **S3 Bucket Deleted (accidental):**
   - Restore from versioning (if enabled)
   - Or restore from cross-region replica
   - Or restore from Backblaze backup
   - Downtime: Hours to days (depending on data size)

3. **Entire AWS Region Down:**
   - Failover to backup region (if multi-region setup)
   - Restore database from cross-region snapshot
   - Update DNS to point to new region
   - Downtime: Hours

4. **Ransomware / Data Corruption:**
   - Restore from clean backup (before corruption)
   - Versioning helps identify clean version
   - Isolated backups (not accessible from production)

**DR Checklist:**

- [ ] Documented recovery procedures
- [ ] Tested recovery process
- [ ] Off-site backups (different provider/region)
- [ ] Immutable backups (cannot be deleted/modified)
- [ ] Regular DR drills (quarterly)
- [ ] Contact list (who to call in emergency)
- [ ] RTO target: 4 hours
- [ ] RPO target: 24 hours

---

(Continuing with remaining sections due to length...)

Would you like me to continue with the remaining sections (10-19)? Or would you like me to focus on specific sections first? Let me know how you'd like to proceed!ye kuch ss hai, reference ke liye use kr, iske iske nav bar ko anaze kr, aur ss ko anaylze krFeb 2Perfect! Maine aapke reference screenshots ko analyze kiya hai. Ye Fronic Media ka existing music distribution platform hai. Ab main complete PRD continue karunga with insights from these screenshots.

10. API DOCUMENTATION
    10.1 API Architecture
    RESTful API Design:

Base URL: https://api.musicflow.com/v1
Authentication: JWT Bearer token
Content-Type: application/json
API Versioning: /v1, /v2 (future)

HTTP Methods:

GET: Retrieve data
POST: Create new resource
PUT: Update entire resource
PATCH: Partial update
DELETE: Delete resource

Response Format:
json{
"success": true,
"data": { ... },
"message": "Operation successful",
"timestamp": "2024-02-01T14:30:25Z"
}
Error Response Format:
json{
"success": false,
"error": {
"code": "VALIDATION_ERROR",
"message": "Invalid input data",
"details": [
{
"field": "track_title",
"message": "Track title is required"
}
]
},
"timestamp": "2024-02-01T14:30:25Z"
}

```

### 10.2 Authentication Endpoints

**POST /auth/register**
```

Request:
{
"email": "artist@email.com",
"password": "SecurePass123!",
"artist_name": "Artist Name",
"country": "India"
}

Response:
{
"success": true,
"data": {
"user": {
"id": 1001,
"email": "artist@email.com",
"artist_name": "Artist Name"
},
"access_token": "eyJhbGci...",
"refresh_token": "eyJhbGci..."
}
}

```

**POST /auth/login**
```

Request:
{
"email": "artist@email.com",
"password": "SecurePass123!"
}

Response:
{
"success": true,
"data": {
"user": { ... },
"access_token": "eyJhbGci...",
"refresh_token": "eyJhbGci..."
}
}

```

**POST /auth/refresh**
**POST /auth/logout**
**POST /auth/forgot-password**
**POST /auth/reset-password**
**POST /auth/verify-email**
**POST /auth/enable-2fa**
**POST /auth/verify-2fa**

### 10.3 User Endpoints

**GET /users/me** - Get current user profile
**PUT /users/me** - Update profile
**GET /users/me/stats** - Get user statistics
**DELETE /users/me** - Delete account
**GET /users/me/sessions** - Active sessions
**DELETE /users/me/sessions/:id** - Logout specific session

### 10.4 Upload Endpoints

**POST /uploads/get-signed-url** - Get S3 signed URL
```

Request:
{
"file_name": "track.mp3",
"file_type": "audio",
"file_size": 8500000,
"content_type": "audio/mpeg"
}

Response:
{
"success": true,
"data": {
"signed_url": "https://s3.amazonaws.com/...",
"key": "audio/2024/02/user_1001_1704153600_a4f2d9.mp3",
"expires_in": 300
}
}

```

**POST /uploads** - Create upload record
```

Request:
{
"audio_key": "audio/2024/02/...",
"cover_key": "covers/2024/02/...",
"track_title": "My Song",
"album_name": "My Album",
"genre_primary": "Pop",
"language": "Hindi",
"release_date": "2024-03-15",
"explicit_content": false,
"isrc": "INXXX2400001",
"metadata": {
"lyrics": "...",
"featured_artists": ["Artist 2"],
"songwriter": ["Me"],
"producer": ["Producer Name"]
}
}

Response:
{
"success": true,
"data": {
"upload_id": 5001,
"status": "pending",
"message": "Upload submitted for review"
}
}

```

**GET /uploads** - List user uploads (with filters)
**GET /uploads/:id** - Get upload details
**PUT /uploads/:id** - Update upload (if draft/pending)
**DELETE /uploads/:id** - Delete upload
**POST /uploads/:id/resubmit** - Resubmit rejected upload

### 10.5 Admin Endpoints

**GET /admin/uploads** - List all uploads (admin)
```

Query Parameters:
?status=pending&page=1&limit=50&sort=created_at:desc

Response:
{
"success": true,
"data": {
"uploads": [ ... ],
"pagination": {
"page": 1,
"limit": 50,
"total": 234,
"total_pages": 5
}
}
}
POST /admin/uploads/:id/approve - Approve upload
POST /admin/uploads/:id/reject - Reject upload
GET /admin/users - List all users
GET /admin/dashboard/stats - Dashboard statistics
POST /admin/csv/export - Generate CSV export
GET /admin/csv/exports - List CSV exportsClaude's response was interruptedRetrysun dhyan se, mera idea simple sa main bol rha hu tu bas sun, kuch gen mat krna, jab tak bolu nhiFeb 2Haan bhai, main sun raha hoon. Tum batao, main sirf sununga. Kuch generate nahi karunga jab tak tum bologe nahi. 👂artist login , sigup karega, then dashboard pe apni deatils dekh skata hai, create relase pe click krne ke baad usko ke baad waha usko wo us realse ka deatils fill karega, then like cover , aur audio upload karega toh wo supabase pe upload hona chaiye, then last mein submit jab karega toh wo request create ho jayega, then ab backend mein admin ko request jayega us specidc relase ka, waha wo realse ko dekh skta hai, usko user ki sari deatils, cvs formate mein jaye song name and etc deatils, aur cover art, aur audio jo supabase pe upload hai, waha se uska link csv file ke ander add hona chaiye, thoda sa apna dimag laga mujhe kuch bataFeb 2Accha, samajh gaya! Main tumhara flow summarize karta hoon to confirm karu ki sahi samjha:
User Side Flow:

Artist login/signup → Dashboard (apni details dekhe)
"Create Release" click → Form bhare (track details, metadata)
Cover art + Audio upload → Supabase storage mein store ho
Submit → Request create (status: pending)

Admin Side Flow:

Admin ko pending requests dikhein
Admin specific release open kare
Waha pe:

User ki saari details visible
Cover art link (Supabase se)
Audio link (Supabase se)
CSV format mein download option jisme:

Song name
Artist details
Cover art URL (Supabase link)
Audio URL (Supabase link)
Sabhi metadata

Key Points jo samjha:

Storage = Supabase (not S3)
CSV mein actual files nahi, links honge
Admin CSV download kar sake for distribution

Mere questions/suggestions:

CSV auto-generate hoga har request pe ya admin manually trigger karega?
Ek hi CSV mein ek release ya bulk releases?
Distribution partner (DistroKid, etc.) ko ye CSV upload kaise hoga - manual ya API?
Approval/rejection workflow chahiye ya sirf CSV export?

Batao kya sahi samjha? Aur kya miss ho raha hai?main page ke side bar mein ye sab hone chaye isko bhi add kr main idae ke ander , sare funtion bhi define krnaFeb 2Samajh gaya! Ab main complete idea define karta hoon with sidebar navigation aur all functions:

🎵 COMPLETE PLATFORM IDEA - Music Distribution System
SIDEBAR NAVIGATION + FEATURES

1. 🏠 Dashboard
   Function:

Welcome screen with artist name
Quick Stats Cards:

Total Releases (38 - jaise image mein hai)
Pending Releases (awaiting approval)
Approved Releases
Live Releases (on platforms)
Total Earnings (if applicable)

Recent Activity Feed (last 5 releases with status)
Quick Actions: "Create New Release" button
Notifications (unread count badge)

2. ➕ Create Release
   Function:

Multi-step form:

Step 1: Release Type

Single / Album / EP (radio buttons)

Step 2: Track Details

Track Title\*
Album Name (if album/EP)
Track Number (if album)
Genre (dropdown)
Language (dropdown)
Release Date (date picker)
Explicit Content (checkbox)

Step 3: Upload Files

Cover Art Upload:

Drag & drop zone
Requirements: Min 3000x3000px
Upload to Supabase Storage → /covers/user_id/timestamp_filename.jpg
Show preview after upload

Audio File Upload:

Drag & drop zone
Formats: MP3, WAV, FLAC
Upload to Supabase Storage → /audio/user_id/timestamp_filename.mp3
Show progress bar
Auto-detect duration

Step 4: Metadata (Optional)

ISRC Code (auto-generate option)
UPC Code (for albums)
Lyrics
Featured Artists
Songwriter/Composer
Producer
Record Label

Step 5: Review & Submit

Preview all details
Cover art thumbnail
Audio player (preview)
Submit Button → Creates request in database:

Status: "pending"
Stores: Supabase URLs for cover + audio

3. 📂 Catalog (My Audio Catalog - jaise image mein)
   Function:

Grid/List view of all user's releases
Each card shows:

Cover art thumbnail
Track title
Artist name
Label name
Number of tracks
Release date
Status badge:

🟡 Pending (awaiting admin approval)
🟢 Approved (admin approved)
🔵 Live (on streaming platforms)
🔴 Rejected (with reason)

Actions per release:

View Details (full page)
Edit (if pending/draft)
Delete (if not live)
View Stores button (if live - shows which platforms it's on)

Filters:

All / Pending / Approved / Live / Rejected
Date range
Genre
Search by title

Stats at top:

Total Releases count (38 jaise image mein)
"Go To Video Catalog" button (future feature)

4. 📊 Reports (Streaming Reports - jaise image 2 mein)
   Function:

Request New Report Section:

Select Store (Spotify, Apple Music, All Stores)
Start Month/Year (dropdown)
End Month/Year (dropdown)
"Request Report" button
Important Notice: "Reports take 3-4 months delay from streaming services"

Previously Requested Reports Table:

Columns: No. | Report For | Start Date | End Date | Status
Status badges:

🔴 Rejected
🟢 Received (download link)

Download button (if received)

Reports include:

Streams count per track
Revenue per track
Geographic data
Platform-wise breakdown

5. 🎫 Tickets (Support System)
   Function:

Create New Ticket:

Category (dropdown): Upload Issue, Account, Payment, Distribution, Technical, Other
Subject
Description
Attach files (screenshots)
Priority (Low/Medium/High)
Submit → Creates ticket

My Tickets List:

Ticket ID
Subject
Category
Status (Open, In Progress, Resolved, Closed)
Created Date
Last Updated
Actions: View conversation, Add reply

Ticket Detail Page:

Full conversation thread
Reply box
File attachments
Close ticket option

6. 💰 Withdraw (Earnings Withdrawal - jaise image 3 mein)
   Function:

Balance Display:

Available Balance in USD (card 1)
Available Balance in INR (card 2)
Note: "Both amounts represent same fund in different currencies"

Withdraw Your Earnings Section:

"Withdraw Funds" button
Minimum withdrawal: $100
Opens modal:

Enter amount
Select payment method (Bank/PayPal/UPI)
Confirm withdrawal

Previously Requested Withdrawals Table:

Columns: No. | Amount (USD) | Gross Amount (INR) | TDS Amount (INR) | Net Payable (INR) | Requested On | UTR | Reference | Transferred On | Status
Status: Pending, Processing, Completed, Rejected
Shows history from Sept 2025 onwards (jaise image mein)

7. 🎵 Rights Manager (Expandable)
   Function:

Copyright Management:

View copyrights owned
Transfer rights
Split royalties (collaborations)

Content ID:

Enable/disable Content ID for YouTube
Claim management

Takedown Requests:

Request to remove track from platforms
Track takedown status

Sub-menu options:

My Copyrights
Royalty Splits
Content ID
Takedowns

8. 🛠️ Tools (Expandable)
   Function:

ISRC Generator:

Auto-generate ISRC codes
Batch generation

UPC Generator:

Generate UPC for albums

Lyrics Formatter:

Format lyrics properly
Time-sync tool (future)

Metadata Validator:

Check metadata completeness
Spotify/Apple Music compliance check

Sub-menu options:

ISRC Generator
UPC Generator
Lyrics Tools
Metadata Checker

9. 📢 Marketing (Expandable)
   Function:

Pre-save Campaigns:

Create pre-save links for upcoming releases
Track pre-save count

Smart Links:

Generate universal link (one link → all platforms)
Example: musicflow.to/artist/track-name
Analytics on clicks

Social Media Assets:

Auto-generate social media posts
Download promotional graphics

Spotify Canvas:

Upload canvas videos (future)

Sub-menu options:

Pre-save Campaigns
Smart Links
Promo Tools
Canvas Manager

10. 👥 Invite (Artist Referral)
    Function:

Invite Artists:

Generate unique referral link
Share via email/social media

Referral Stats:

Total invites sent
Signups from your link
Earnings (if referral program - future)

Referral Rewards (future):

Earn credits/commission for referred artists

11. 📡 Distribute Web Series (Future Feature)
    Function:

Similar to music, but for web series/podcasts
Upload video content
Distribute to YouTube, streaming platforms
Currently placeholder/coming soon

12. ❓ FAQ (Help Center)
    Function:

Searchable FAQ:

Categories: Getting Started, Uploads, Distribution, Payments, Technical
Expandable questions

Common Topics:

How to upload music?
What are ISRC/UPC codes?
How long for music to go live?
Payment schedule
How to withdraw earnings?

Video Tutorials (embedded)
Contact Support link (opens ticket)

13. 🚪 Logout
    Function:

Logout button
Confirmation modal: "Are you sure?"
Clears session
Redirects to login page

ADMIN PANEL - COMPLETE FEATURES
Admin Sidebar:

📊 Dashboard (admin stats)
👥 Users (manage all artists)
📂 Releases (approve/reject)
🎫 Tickets (support management)
📥 CSV Exports
📈 Analytics
⚙️ Settings
🚪 Logout

Admin: Releases Management (CORE)
Pending Releases List:

Table view:

Columns: Cover | Track Title | Artist | Album | Genre | Uploaded On | Status | Actions
Filter: All / Pending / Approved / Rejected
Search: By track title, artist name

Release Detail Page (Admin View):
Left Side (60%):

Audio Player (plays from Supabase URL)
Cover Art (from Supabase URL)
Technical Info:

Format: MP3/WAV
Bitrate: 320kbps
Duration: 3:45
File Size: 8.5 MB

Right Side (40%):

Track Metadata:

Track Title
Artist Name
Album
Genre, Language
Release Date
ISRC, UPC
Lyrics
Credits (featured artists, producer, etc.)

Artist Info:

Artist Name (link to user profile)
Email
Phone
Country

File URLs (Supabase):

Audio URL: https://supabase.co/storage/v1/object/public/audio/...
Cover URL: https://supabase.co/storage/v1/object/public/covers/...
Copy buttons for each

Admin Actions:

✅ Approve:

Status → "approved"
Notification sent to artist
Queued for CSV generation

❌ Reject:

Rejection reason (dropdown + notes)
Status → "rejected"
Artist notified with feedback

📥 Download CSV:

Generates CSV for THIS release:

csv artist_name,email,phone,track_title,album_name,genre,language,release_date,audio_url,cover_art_url,isrc,upc,lyrics,featured_artists,songwriter,producer,label,duration,file_size,status
"Aman Kumar","aman@email.com","+91-9876543210","My Song","My Album","Pop","Hindi","2024-03-15","https://supabase.co/.../audio.mp3","https://supabase.co/.../cover.jpg","INXXX2400001","123456789012","Full lyrics...","Artist 2","Me","Producer","Label",225,8500000,"approved"

```
   - Auto-download CSV file

4. **📥 Bulk CSV Export:**
   - Admin can select multiple releases (checkboxes)
   - "Export Selected to CSV" button
   - Generates single CSV with all selected releases

---

### **CSV Generation Logic:**

**Option 1: Auto CSV per Release (Simple)**
- When admin approves release → Auto-generate CSV
- CSV stored in Supabase: `/csv/release_{release_id}_{timestamp}.csv`
- Download link provided to admin
- Contains single release data

**Option 2: Bulk CSV Export (Better)**
- Admin goes to "CSV Exports" page
- Filters:
  - Date range
  - Status (Approved only, All, etc.)
  - Genre
  - Artist
- Click "Generate CSV"
- Background job creates CSV with all filtered releases
- CSV includes Supabase URLs (not actual files)
- Download link when ready

**CSV Columns (Final):**
```

artist_name, email, phone, country,
track_title, album_name, track_number,
genre_primary, genre_secondary, language,
release_date, explicit_content, duration_seconds,
audio_url, cover_art_url,
audio_format, bitrate, file_size_mb,
isrc, upc,
lyrics, featured_artists, songwriter, composer, producer,
record_label, publisher, copyright_p, copyright_c,
status, approved_date, uploaded_date

```

---

### **Distribution Workflow:**

**Current (Manual CSV Upload):**
1. Admin filters approved releases
2. Exports CSV
3. Manually uploads CSV to DistroKid/Ditto
4. Distribution service reads CSV
5. Fetches audio/cover from Supabase URLs
6. Distributes to Spotify, Apple Music, etc.

**Future (Automated API):**
1. Admin clicks "Queue for Distribution"
2. Backend calls DistroKid API with CSV data
3. Automated distribution
4. Track status updates

---

## **TECHNICAL STACK SUMMARY:**
```

Frontend: Next.js + TypeScript + Tailwind CSS
Backend: Node.js + Express + TypeScript
Database: PostgreSQL (Supabase DB)
Storage: Supabase Storage (for audio + covers + CSV)
Auth: Supabase Auth (or custom JWT)
Realtime: Supabase Realtime (for notifications)
Why Supabase?

All-in-one: Database + Storage + Auth + Realtime
PostgreSQL-based (scalable)
Built-in file storage with CDN
Generous free tier
Easy to use
