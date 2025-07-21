--Using INSERT, UPDATE and DELETE
INSERT INTO account(account_firstname,account_lastname,account_email,account_password
)
VALUES(
'Tony', 
'Stark', 
'tony@starkent.com', 
'Iam1ronM@n'
);

UPDATE "account" SET account_type= 'Admin' WHERE account_id = 1;

DELETE FROM account WHERE account_id = 1

-- Using UPDATE and REPLACE String function
UPDATE inventory
SET inv_description = REPLACE(inv_description,'small interiors', 'a huge interior') 
WHERE inv_make= 'GM'


-- Using INNER JOIN
SELECT inventory.inv_make,inventory.inv_model,classification.classification_name
FROM inventory
INNER JOIN classification
ON (inventory.classification_id = 2 AND classification.classification_name = 'Sport') 

--Using UPDATE and OVERLAY String Function
UPDATE  inventory 
SET inv_thumbnail = overlay(inv_thumbnail placing '/vehicles' from 8 for 0), inv_image = overlay(inv_image placing '/vehicles' from 8 for 0)

