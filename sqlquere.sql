-- Insert rows into table '[dbo].[users]
INSERT INTO [dbo].[users]
([username], [email], [password], [role], [first_name], [last_name], [phone])
VALUES
( -- first row: values for the columns in the list above
 'user001','user001@gmail.com', 'password001','merchant','John','Doe','1234567890'
),
( -- second row: values for the columns in the list above
'user002','user002@gmail.com', 'password002','advertiser','Jane','Smith','0987654321'
),
( -- third row: values for the columns in the list above
'user003','user003@gmail.com', 'password003','agent','Alice','Johnson','5551234567'
),
( -- fourth row: values for the columns in the list above
'user004','user004@gmail.com', 'password004','admin','Bob','Brown','5559876543'
)

-- Insert rows into table '[dbo].[merchants]'
INSERT INTO [dbo].[merchants]
( -- columns to insert data into
 [id],[business_name],[business_address],[business_phone],[business_email],[business_category],[tax_id]
)
VALUES
( -- first row: values for the columns in the list above
 100000001,'Food Truck', 'Bukit Jalil', '0124680000', 'user001@gmail.com', 'Food & Beverage', '123456789012'
)

-- Insert rows into table '[dbo].[advertisers]
INSERT INTO [dbo].[advertisers]
( -- columns to insert data into
 [id],[company_name],[company_address],[company_phone],[company_email],[industry]
)
VALUES
( -- first row: values for the columns in the list above
 100000002, 'APU', 'Bukit Jalil', '0112223344', 'user002@gmail.com', 'Education'
)

-- Insert rows into table 'agents'
INSERT INTO agents
( -- columns to insert data into
 [id]
)
VALUES
( -- first row: values for the columns in the list above
 100000003
)

SELECT * FROM [dbo].[agents]
