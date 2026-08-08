-- Real exam scores, so XP can be awarded for a good result rather than
-- just for having registered an exam.
alter table exams add column score numeric(5,2) check (score is null or (score >= 0 and score <= 100));
