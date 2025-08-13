

-- ALTER TABLE inventory
-- DROP CONSTRAINT fk_classification;

-- ALTER TABLE inventory
-- ADD CONSTRAINT fk_classification
-- FOREIGN KEY (classification_id)
-- REFERENCES classification(classification_id)
-- ON DELETE CASCADE;

DELETE FROM classification WHERE classification_id IN (17, 18, 19,20,21,23,24);

SELECT classification_id,
       classification_name
FROM public.classification
LIMIT 1000;