-- Pathfinder HS — career_track enum + certifications seed data
-- Source: "Comprehensive Architectural Framework and Strategic Implementation
-- Model for Early Secondary Career Specialization Platforms" research doc.
-- Locks career_track to the 6 fully-specified tracks and seeds the
-- certifications catalog with the researched age-eligibility matrix.

create type career_track as enum (
  'pre_med_clinical_healthcare',
  'nursing_advanced_practice',
  'software_engineering',
  'financial_engineering',
  'mechanical_engineering_cad',
  'law_public_policy'
);

alter table profiles
  alter column target_career type career_track using target_career::career_track;

alter table roadmaps
  alter column career_track type career_track using career_track::career_track;

-- ---------------------------------------------------------------------------
-- certifications seed data
-- ---------------------------------------------------------------------------
-- min_age is the practical floor for a student to *begin pursuing* the
-- credential (course enrollment, exam registration, etc). Where legal
-- eligibility differs by state or by exam-vs-practice, the detail lives in
-- state_rules_json rather than being flattened into a single number.

insert into certifications (title, category, min_age, prereqs, description, state_rules_json) values

('NHA Certified Clinical Medical Assistant (CCMA)', 'healthcare', 0,
 '["NHA-approved training program or CTE pathway", "Anatomy & physiology coursework"]',
 'No minimum age to sit provisionally, up to 12 months before high school graduation. 180 multiple-choice questions, 3 hours, scaled passing score 390+. Provisional status expires 12 months after the exam date unless proof of graduation is uploaded, converting it to a full 2-year certification.',
 '{"default": {"min_age": 0, "notes": "Provisional exam allowed up to 12 months pre-graduation; must upload diploma/transcript within 12 months of the exam or the credential is permanently invalidated. Active independent clinical practice may remain restricted under 18 in some states even after passing."}}'
),

('NHA Certified Phlebotomy Technician (CPT)', 'healthcare', 0,
 '["NHA-approved training program", "30 successful venipunctures", "10 capillary sticks"]',
 'Same provisional pathway as the CCMA: no minimum sit age, provisional status valid 12 months, converts to full certification on proof of high school graduation.',
 '{"default": {"min_age": 0, "notes": "Provisional mechanics identical to CCMA."}}'
),

('NREMT EMT-Basic', 'healthcare', 16,
 '["State-approved EMT training program", "Psychomotor exam"]',
 'The cognitive exam itself has no minimum age. In practice, most training programs enforce a 16+ enrollment floor due to clinical liability and ambulance ride-along insurance. National registry validity is 2 years.',
 '{"default": {"min_age": 16, "notes": "Cognitive exam has no legal age floor, but training-program enrollment is typically restricted to 16+. Most state EMS agencies require candidates to be 18 for an active operational license even if NREMT registry status was earned earlier."}}'
),

('Certified Nursing Assistant (CNA)', 'healthcare', 16,
 '["State-approved CNA training course", "State-mandated clinical facility hours"]',
 'Governed state-by-state under federal OBRA guidelines. Minimum testing/placement age varies significantly by jurisdiction.',
 '{"default": {"min_age": 16}, "FL": {"min_age": 16, "notes": "Permits testing at 16 upon completion of state-approved clinical hours."}, "TX": {"min_age": 16, "notes": "Permits testing at 16 upon completion of state-approved clinical hours."}, "CA": {"min_age": 18, "notes": "Enforces an 18-year-old floor for clinical facility placement."}}'
),

('FINRA Securities Industry Essentials (SIE) Exam', 'finance', 18,
 '[]',
 'Strict 18-year-old age floor, no exceptions. No firm sponsorship or college degree required. 80 multiple-choice questions (75 scored), 1 hour 45 minutes, 70% passing score. Valid 4 years from pass date.',
 '{"default": {"min_age": 18, "notes": "Under-18 students should not schedule this during 9th-11th grade. Platform schedules the exam window to open on the student''s 18th birthday (typically 12th grade) so the 4-year validity window covers undergraduate studies."}}'
),

('Certified SOLIDWORKS Associate (CSWA)', 'engineering', 0,
 '["~150 classroom hours: engineering fundamentals, part modeling, assembly building, drawing analysis"]',
 'Age-neutral credential — students as young as 14 can take and hold it. Does not expire.',
 '{"default": {"min_age": 0, "notes": "Direct commercial software purchase requires the buyer to certify they are 18+ to execute the EULA. Under-18 students access the software through a school''s SOLIDWORKS Academic Provider program (free exam vouchers) or guardian-executed purchase of the Student/Maker Edition."}}'
),

('Certified SOLIDWORKS Professional (CSWP)', 'engineering', 0,
 '["Certified SOLIDWORKS Associate (CSWA)", "1-2 years advanced modeling experience"]',
 'Age-neutral, advanced-tier credential following the CSWA. Same academic-provider/guardian-purchase workaround applies for software access under 18.',
 '{"default": {"min_age": 0}}'
),

('CompTIA Security+', 'technology', 0,
 '[]',
 'No firm minimum age; candidates under 13 require parental consent. Administered via Pearson VUE. Valid 3 years, renewable via Continuing Education.',
 '{"default": {"min_age": 0, "notes": "No age limit; parental consent required only under 13."}}'
),

('Autodesk Certified User: AutoCAD', 'engineering', 0,
 '["~150 hours hands-on Autodesk software experience"]',
 'Age-neutral credential, valid 3 years. Integrates naturally into 9th/10th grade drafting coursework.',
 '{"default": {"min_age": 0, "notes": "No age limit; parental consent required only under 13."}}'
),

('AHA CPR / AED / First Aid for Healthcare Providers', 'healthcare', 12,
 '[]',
 'No strict legal age floor, but most course providers set a practical minimum around 12-14 for course enrollment. Common Summer -0 starting credential across all healthcare-adjacent tracks.',
 '{"default": {"min_age": 12, "notes": "Age floor is a course-provider convention, not a legal requirement."}}'
),

('HIPAA Compliance & OSHA Bloodborne Pathogens Certification', 'healthcare', 0,
 '[]',
 'Online compliance training required before clinical shadowing or externship placements. No age restriction.',
 '{"default": {"min_age": 0}}'
),

('OpenEDG Python Institute PCEP', 'technology', 0,
 '[]',
 'Entry-level Python certification with no prerequisites, commonly used as a Summer -0 credential for software-engineering-track students.',
 '{"default": {"min_age": 0}}'
),

('OpenEDG Python Institute PCAP', 'technology', 0,
 '["PCEP or equivalent Python fluency"]',
 'Associate-level Python certification, typical 9th-grade follow-on to the PCEP.',
 '{"default": {"min_age": 0}}'
),

('AWS Certified Cloud Practitioner', 'technology', 0,
 '[]',
 'Foundational AWS credential with no prerequisites, valid 3 years.',
 '{"default": {"min_age": 0}}'
),

('AWS Certified Solutions Architect – Associate', 'technology', 0,
 '["Working knowledge of core AWS services (e.g. via Cloud Practitioner)"]',
 'Associate-level architecture credential, valid 3 years.',
 '{"default": {"min_age": 0}}'
),

('AWS Certified Developer – Associate', 'technology', 0,
 '["Working knowledge of core AWS services"]',
 'Associate-level developer credential, valid 3 years.',
 '{"default": {"min_age": 0}}'
),

('Microsoft Office Specialist (MOS): Excel Associate', 'finance', 0,
 '[]',
 'Entry-level Excel credential commonly paired with DECA/FBLA finance-track coursework.',
 '{"default": {"min_age": 0}}'
),

('Bloomberg Market Concepts (BMC)', 'finance', 0,
 '[]',
 'Self-paced financial markets primer (economics, currencies, fixed income) used to prepare finance-track students ahead of the FINRA SIE.',
 '{"default": {"min_age": 0}}'
),

('Wall Street Prep Corporate Finance / CFI FMVA (Student Track)', 'finance', 0,
 '[]',
 'Financial modeling and valuation certification track used as pre-18 preparation ahead of the FINRA SIE exam window.',
 '{"default": {"min_age": 0}}'
);
