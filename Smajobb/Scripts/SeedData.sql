-- Småjobb Database Seed Data
-- This script populates the database with initial data for categories, skills, and system configuration

-- Insert Job Categories
INSERT INTO "JobCategories" ("Id", "Name", "Description", "Icon", "Color", "IsActive", "SortOrder", "CreatedAt") VALUES
('11111111-1111-1111-1111-111111111111', 'Städning', 'Hushållsstädning och kontorsstädning', 'broom', '#4CAF50', true, 1, NOW()),
('22222222-2222-2222-2222-222222222222', 'Trädgård', 'Trädgårdsarbete och landskapsvård', 'tree', '#8BC34A', true, 2, NOW()),
('33333333-3333-3333-3333-333333333333', 'Handla', 'Inköp och ärenden', 'shopping-cart', '#FF9800', true, 3, NOW()),
('44444444-4444-4444-4444-444444444444', 'Barnpassning', 'Barnvakt och lekledning', 'child', '#E91E63', true, 4, NOW()),
('55555555-5555-5555-5555-555555555555', 'Hundvakt', 'Hundpassning och hundpromenader', 'paw', '#9C27B0', true, 5, NOW()),
('66666666-6666-6666-6666-666666666666', 'Flytt', 'Flytthjälp och packning', 'truck', '#607D8B', true, 6, NOW()),
('77777777-7777-7777-7777-777777777777', 'IT-hjälp', 'Datorteknisk support', 'computer', '#2196F3', true, 7, NOW()),
('88888888-8888-8888-8888-888888888888', 'Undervisning', 'Läxhjälp och privatundervisning', 'book', '#3F51B5', true, 8, NOW()),
('99999999-9999-9999-9999-999999999999', 'Övrigt', 'Andra typer av jobb', 'more', '#795548', true, 9, NOW());

-- Insert Skills
INSERT INTO "Skills" ("Id", "Name", "Description", "CategoryId", "IsActive", "SortOrder", "CreatedAt") VALUES
-- Städning skills
('a1111111-1111-1111-1111-111111111111', 'Hushållsstädning', 'Erfarenhet av hushållsstädning', '11111111-1111-1111-1111-111111111111', true, 1, NOW()),
('a2222222-2222-2222-2222-222222222222', 'Kontorsstädning', 'Erfarenhet av kontorsstädning', '11111111-1111-1111-1111-111111111111', true, 2, NOW()),
('a3333333-3333-3333-3333-333333333333', 'Fönsterputsning', 'Kan putsa fönster professionellt', '11111111-1111-1111-1111-111111111111', true, 3, NOW()),

-- Trädgård skills
('b1111111-1111-1111-1111-111111111111', 'Trädgårdsarbete', 'Erfarenhet av trädgårdsarbete', '22222222-2222-2222-2222-222222222222', true, 1, NOW()),
('b2222222-2222-2222-2222-222222222222', 'Gräsklippning', 'Kan klippa gräs med maskin', '22222222-2222-2222-2222-222222222222', true, 2, NOW()),
('b3333333-3333-3333-3333-333333333333', 'Växtvård', 'Kunskap om växtvård och odling', '22222222-2222-2222-2222-222222222222', true, 3, NOW()),

-- Handla skills
('c1111111-1111-1111-1111-111111111111', 'Inköp', 'Erfarenhet av att handla mat', '33333333-3333-3333-3333-333333333333', true, 1, NOW()),
('c2222222-2222-2222-2222-222222222222', 'Ärenden', 'Kan göra olika typer av ärenden', '33333333-3333-3333-3333-333333333333', true, 2, NOW()),

-- Barnpassning skills
('d1111111-1111-1111-1111-111111111111', 'Barnvakt', 'Erfarenhet av barnpassning', '44444444-4444-4444-4444-444444444444', true, 1, NOW()),
('d2222222-2222-2222-2222-222222222222', 'Lekledning', 'Kan leda aktiviteter för barn', '44444444-4444-4444-4444-444444444444', true, 2, NOW()),
('d3333333-3333-3333-3333-333333333333', 'Läxhjälp', 'Kan hjälpa barn med läxor', '44444444-4444-4444-4444-444444444444', true, 3, NOW()),

-- Hundvakt skills
('e1111111-1111-1111-1111-111111111111', 'Hundpassning', 'Erfarenhet av hundpassning', '55555555-5555-5555-5555-555555555555', true, 1, NOW()),
('e2222222-2222-2222-2222-222222222222', 'Hundpromenader', 'Kan gå promenader med hundar', '55555555-5555-5555-5555-555555555555', true, 2, NOW()),

-- Flytt skills
('f1111111-1111-1111-1111-111111111111', 'Flytthjälp', 'Erfarenhet av flytthjälp', '66666666-6666-6666-6666-666666666666', true, 1, NOW()),
('f2222222-2222-2222-2222-222222222222', 'Packning', 'Kan packa saker säkert', '66666666-6666-6666-6666-666666666666', true, 2, NOW()),

-- IT-hjälp skills
('g1111111-1111-1111-1111-111111111111', 'Datorteknisk support', 'Kan hjälpa med datorproblem', '77777777-7777-7777-7777-777777777777', true, 1, NOW()),
('g2222222-2222-2222-2222-222222222222', 'Programinstallation', 'Kan installera program', '77777777-7777-7777-7777-777777777777', true, 2, NOW()),
('g3333333-3333-3333-3333-333333333333', 'Internetproblem', 'Kan lösa internetproblem', '77777777-7777-7777-7777-777777777777', true, 3, NOW()),

-- Undervisning skills
('h1111111-1111-1111-1111-111111111111', 'Läxhjälp', 'Kan hjälpa med läxor', '88888888-8888-8888-8888-888888888888', true, 1, NOW()),
('h2222222-2222-2222-2222-222222222222', 'Matematik', 'Kunskap i matematik', '88888888-8888-8888-8888-888888888888', true, 2, NOW()),
('h3333333-3333-3333-3333-333333333333', 'Svenska', 'Kunskap i svenska språket', '88888888-8888-8888-8888-888888888888', true, 3, NOW()),
('h4444444-4444-4444-4444-444444444444', 'Engelska', 'Kunskap i engelska språket', '88888888-8888-8888-8888-888888888888', true, 4, NOW()),

-- Generella skills
('i1111111-1111-1111-1111-111111111111', 'Pålitlighet', 'Pålitlig och ansvarsfull', NULL, true, 1, NOW()),
('i2222222-2222-2222-2222-222222222222', 'Kommunikation', 'Bra kommunikationsförmåga', NULL, true, 2, NOW()),
('i3333333-3333-3333-3333-333333333333', 'Flexibilitet', 'Flexibel och anpassningsbar', NULL, true, 3, NOW()),
('i4444444-4444-4444-4444-444444444444', 'Erfarenhet', 'Har relevant erfarenhet', NULL, true, 4, NOW());

-- Create default admin user (password should be changed in production)
INSERT INTO "Users" ("Id", "Email", "DisplayName", "Role", "IsActive", "IsVerified", "EmailVerified", "CreatedAt") VALUES
('00000000-0000-0000-0000-000000000000', 'admin@smajobb.se', 'System Administrator', 'admin', true, true, true, NOW());

-- Create sample users for testing
INSERT INTO "Users" ("Id", "Email", "DisplayName", "Role", "IsActive", "IsVerified", "EmailVerified", "CreatedAt") VALUES
('10000000-0000-0000-0000-000000000000', 'kund@example.com', 'Test Kund', 'customer', true, true, true, NOW()),
('20000000-0000-0000-0000-000000000000', 'ungdom@example.com', 'Test Ungdom', 'youth', true, true, true, NOW());

-- Create youth profile for test youth user
INSERT INTO "YouthProfiles" ("UserId", "DateOfBirth", "City", "Bio", "HourlyRate", "AllowedCategories", "CreatedAt") VALUES
('20000000-0000-0000-0000-000000000000', '2005-06-15', 'Stockholm', 'Jag gillar att hjälpa till med olika saker och är pålitlig.', 120, ARRAY['Städning', 'Trädgård', 'Handla'], NOW());

-- Create some sample jobs
INSERT INTO "Jobs" ("Id", "Title", "Description", "Category", "CreatorId", "PriceType", "Price", "Status", "Urgency", "EstimatedHours", "CreatedAt") VALUES
('30000000-0000-0000-0000-000000000000', 'Städning av lägenhet', 'Behöver hjälp med att städa min 3:a i Stockholm. Inkluderar kök, badrum och vardagsrum.', 'Städning', '10000000-0000-0000-0000-000000000000', 'fixed', 500, 'open', 'medium', 4, NOW()),
('40000000-0000-0000-0000-000000000000', 'Gräsklippning', 'Behöver klippa gräset i min trädgård. Ca 200 kvm.', 'Trädgård', '10000000-0000-0000-0000-000000000000', 'hourly', 150, 'open', 'low', 2, NOW()),
('50000000-0000-0000-0000-000000000000', 'Hjälp med flytt', 'Behöver hjälp med att packa och flytta till ny lägenhet.', 'Flytt', '10000000-0000-0000-0000-000000000000', 'hourly', 200, 'open', 'high', 6, NOW());

-- Create some sample job applications
INSERT INTO "JobApplications" ("Id", "JobId", "YouthId", "CoverLetter", "Status", "ProposedPrice", "CreatedAt") VALUES
('60000000-0000-0000-0000-000000000000', '30000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 'Hej! Jag har mycket erfarenhet av städning och skulle gärna hjälpa dig. Jag är pålitlig och noggrann.', 'pending', 450, NOW()),
('70000000-0000-0000-0000-000000000000', '40000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 'Jag har erfarenhet av gräsklippning och kan hjälpa dig med din trädgård.', 'pending', 120, NOW());

-- Create some sample notifications
INSERT INTO "Notifications" ("Id", "UserId", "Type", "Title", "Message", "IsRead", "Priority", "CreatedAt") VALUES
('80000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000000', 'job_application', 'Ny ansökan', 'Du har fått en ny ansökan på ditt jobb "Städning av lägenhet"', false, 'normal', NOW()),
('90000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 'job_created', 'Nytt jobb', 'Ett nytt jobb inom "Trädgård" har publicerats som matchar dina preferenser', false, 'normal', NOW());

-- Create some sample messages
INSERT INTO "Messages" ("Id", "SenderId", "ReceiverId", "Content", "Type", "IsRead", "CreatedAt") VALUES
('a0000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 'Hej! Tack för din ansökan. När skulle du kunna komma och städa?', 'text', false, NOW()),
('b0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000000', 'Hej! Jag kan komma imorgon eftermiddag, runt 14:00. Fungerar det?', 'text', false, NOW());

-- Create some sample user skills
INSERT INTO "UserSkills" ("UserId", "SkillId", "ProficiencyLevel", "IsVerified", "CreatedAt") VALUES
('20000000-0000-0000-0000-000000000000', 'a1111111-1111-1111-1111-111111111111', 4, true, NOW()),
('20000000-0000-0000-0000-000000000000', 'b1111111-1111-1111-1111-111111111111', 3, true, NOW()),
('20000000-0000-0000-0000-000000000000', 'c1111111-1111-1111-1111-111111111111', 5, true, NOW()),
('20000000-0000-0000-0000-000000000000', 'i1111111-1111-1111-1111-111111111111', 5, true, NOW()),
('20000000-0000-0000-0000-000000000000', 'i2222222-2222-2222-2222-222222222222', 4, true, NOW());

-- Create some sample user category preferences
INSERT INTO "UserCategoryPreferences" ("UserId", "CategoryId", "IsPreferred", "Priority", "CreatedAt") VALUES
('20000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', true, 3, NOW()),
('20000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', true, 2, NOW()),
('20000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', true, 1, NOW());

-- Create some sample availability
INSERT INTO "Availabilities" ("Id", "UserId", "DayOfWeek", "StartTime", "EndTime", "IsAvailable", "CreatedAt") VALUES
('c0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 1, '16:00', '20:00', true, NOW()), -- Monday
('d0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 2, '16:00', '20:00', true, NOW()), -- Tuesday
('e0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 3, '16:00', '20:00', true, NOW()), -- Wednesday
('f0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 4, '16:00', '20:00', true, NOW()), -- Thursday
('g0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 5, '16:00', '20:00', true, NOW()), -- Friday
('h0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 6, '10:00', '18:00', true, NOW()), -- Saturday
('i0000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000000', 0, '10:00', '18:00', true, NOW()); -- Sunday
