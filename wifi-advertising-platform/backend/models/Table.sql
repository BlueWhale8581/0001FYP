CREATE TABLE [dbo].[wifi_access_logs](
	[id] [int] IDENTITY(600000001,1) NOT NULL,
	[merchant_id] [int] NOT NULL,
	[user_id] [int] NULL,
	[device_mac] [varchar](17) NOT NULL,
	[connection_time] [datetime] NULL,
	[disconnection_time] [datetime] NULL,
	[ads_viewed] [int] NULL,
	[ip_address] [varchar](45) NULL,
	[user_agent] [text] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[wifi_access_logs] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[wifi_access_logs] ADD  DEFAULT (getdate()) FOR [connection_time]
GO
ALTER TABLE [dbo].[wifi_access_logs] ADD  DEFAULT ((0)) FOR [ads_viewed]
GO
ALTER TABLE [dbo].[wifi_access_logs]  WITH CHECK ADD FOREIGN KEY([merchant_id])
REFERENCES [dbo].[merchants] ([id])
GO
ALTER TABLE [dbo].[wifi_access_logs]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

CREATE TABLE [dbo].[wifi_settings](
	[id] [int] IDENTITY(500000001,1) NOT NULL,
	[merchant_id] [int] NOT NULL,
	[ssid] [varchar](100) NOT NULL,
	[password] [varchar](100) NULL,
	[connection_limit] [int] NULL,
	[session_duration] [int] NULL,
	[ads_before_access] [bit] NULL,
	[redirect_url] [varchar](255) NULL,
	[terms_and_conditions] [text] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[wifi_settings] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[wifi_settings] ADD  DEFAULT ((50)) FOR [connection_limit]
GO
ALTER TABLE [dbo].[wifi_settings] ADD  DEFAULT ((60)) FOR [session_duration]
GO
ALTER TABLE [dbo].[wifi_settings] ADD  DEFAULT ((1)) FOR [ads_before_access]
GO
ALTER TABLE [dbo].[wifi_settings] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[wifi_settings] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[wifi_settings]  WITH CHECK ADD FOREIGN KEY([merchant_id])
REFERENCES [dbo].[merchants] ([id])
ON DELETE CASCADE
GO

CREATE TABLE [dbo].[transactions](
	[id] [int] IDENTITY(800000001,1) NOT NULL,
	[type] [varchar](20) NOT NULL,
	[amount] [decimal](10, 2) NOT NULL,
	[status] [varchar](20) NULL,
	[reference_id] [varchar](100) NULL,
	[merchant_id] [int] NULL,
	[advertiser_id] [int] NULL,
	[agent_id] [int] NULL,
	[campaign_id] [int] NULL,
	[description] [text] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[transactions] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT ('PENDING') FOR [status]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD FOREIGN KEY([advertiser_id])
REFERENCES [dbo].[advertisers] ([id])
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD FOREIGN KEY([agent_id])
REFERENCES [dbo].[agents] ([id])
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD FOREIGN KEY([campaign_id])
REFERENCES [dbo].[campaigns] ([id])
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD FOREIGN KEY([merchant_id])
REFERENCES [dbo].[merchants] ([id])
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD CHECK  (([status]='refunded' OR [status]='failed' OR [status]='completed' OR [status]='PENDING'))
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD CHECK  (([type]='advertiser_payment' OR [type]='agent_commission' OR [type]='merchant_payment' OR [type]='ad_revenue'))
GO

CREATE TABLE [dbo].[qr_codes](
	[id] [int] IDENTITY(400000001,1) NOT NULL,
	[merchant_id] [int] NOT NULL,
	[code_image_url] [varchar](255) NOT NULL,
	[activation_status] [varchar](20) NULL,
	[created_by] [int] NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[qr_codes] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[qr_codes] ADD  DEFAULT ('ACTIVE') FOR [activation_status]
GO
ALTER TABLE [dbo].[qr_codes] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[qr_codes] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[qr_codes]  WITH CHECK ADD FOREIGN KEY([created_by])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[qr_codes]  WITH CHECK ADD FOREIGN KEY([merchant_id])
REFERENCES [dbo].[merchants] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[qr_codes]  WITH CHECK ADD CHECK  (([activation_status]='inactive' OR [activation_status]='ACTIVE'))
GO

CREATE TABLE [dbo].[system_settings](
	[id] [int] IDENTITY(980000001,1) NOT NULL,
	[setting_key] [varchar](50) NOT NULL,
	[setting_value] [text] NOT NULL,
	[description] [text] NULL,
	[updated_by] [int] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[system_settings] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[system_settings] ADD UNIQUE NONCLUSTERED 
(
	[setting_key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[system_settings] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[system_settings]  WITH CHECK ADD FOREIGN KEY([updated_by])
REFERENCES [dbo].[users] ([id])
GO

CREATE TABLE [dbo].[notifications](
	[id] [int] IDENTITY(900000001,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[title] [varchar](100) NOT NULL,
	[message] [text] NOT NULL,
	[type] [varchar](20) NULL,
	[is_read] [bit] NULL,
	[created_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[notifications] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT ('info') FOR [type]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT ((0)) FOR [is_read]
GO
ALTER TABLE [dbo].[notifications] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[notifications]  WITH CHECK ADD CHECK  (([type]='error' OR [type]='warning' OR [type]='success' OR [type]='info'))
GO

CREATE TABLE [dbo].[campaigns](
	[id] [int] IDENTITY(200000001,1) NOT NULL,
	[advertiser_id] [int] NOT NULL,
	[name] [varchar](100) NOT NULL,
	[description] [text] NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
	[budget] [decimal](10, 2) NOT NULL,
	[spent] [decimal](10, 2) NULL,
	[status] [varchar](10) NULL,
	[target_audience] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[campaigns] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[campaigns] ADD  DEFAULT ((0.00)) FOR [spent]
GO
ALTER TABLE [dbo].[campaigns] ADD  DEFAULT ('draft') FOR [status]
GO
ALTER TABLE [dbo].[campaigns] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[campaigns] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[campaigns]  WITH CHECK ADD FOREIGN KEY([advertiser_id])
REFERENCES [dbo].[advertisers] ([id])
GO
ALTER TABLE [dbo].[campaigns]  WITH CHECK ADD CHECK  (([status]='CANCELLED' OR [status]='completed' OR [status]='paused' OR [status]='ACTIVE' OR [status]='draft'))
GO

CREATE TABLE [dbo].[merchants](
	[id] [int] NOT NULL,
	[business_name] [varchar](100) NOT NULL,
	[business_address] [text] NOT NULL,
	[business_phone] [varchar](20) NULL,
	[business_email] [varchar](100) NULL,
	[business_category] [varchar](50) NULL,
	[tax_id] [varchar](50) NULL,
	[logo_url] [varchar](255) NULL,
	[agent_id] [int] NULL,
	[approval_status] [varchar](20) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[merchants] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[merchants] ADD  DEFAULT ('PENDING') FOR [approval_status]
GO
ALTER TABLE [dbo].[merchants] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[merchants] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[merchants]  WITH CHECK ADD FOREIGN KEY([agent_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[merchants]  WITH CHECK ADD FOREIGN KEY([id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[merchants]  WITH CHECK ADD CHECK  (([approval_status]='rejected' OR [approval_status]='approved' OR [approval_status]='PENDING'))
GO

CREATE TABLE [dbo].[audit_logs](
	[id] [int] IDENTITY(960000001,1) NOT NULL,
	[user_id] [int] NULL,
	[action] [varchar](100) NOT NULL,
	[entity_type] [varchar](50) NOT NULL,
	[entity_id] [int] NULL,
	[old_values] [nvarchar](max) NULL,
	[new_values] [nvarchar](max) NULL,
	[ip_address] [varchar](45) NULL,
	[created_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[audit_logs] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[audit_logs] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[audit_logs]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

CREATE TABLE [dbo].[ads](
	[id] [int] IDENTITY(300000001,1) NOT NULL,
	[campaign_id] [int] NOT NULL,
	[title] [varchar](100) NOT NULL,
	[content] [text] NOT NULL,
	[media_url] [varchar](255) NULL,
	[type] [varchar](10) NOT NULL,
	[redirect_url] [varchar](255) NULL,
	[duration] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[ads] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ads] ADD  DEFAULT ((15)) FOR [duration]
GO
ALTER TABLE [dbo].[ads] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[ads] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[ads]  WITH CHECK ADD FOREIGN KEY([campaign_id])
REFERENCES [dbo].[campaigns] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ads]  WITH CHECK ADD CHECK  (([type]='text' OR [type]='video' OR [type]='image'))
GO

CREATE TABLE [dbo].[ad_impressions](
	[id] [int] IDENTITY(700000001,1) NOT NULL,
	[ad_id] [int] NOT NULL,
	[user_id] [int] NULL,
	[merchant_id] [int] NOT NULL,
	[view_time] [datetime] NULL,
	[view_duration] [int] NULL,
	[completed] [bit] NULL,
	[device_info] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[ad_impressions] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ad_impressions] ADD  DEFAULT (getdate()) FOR [view_time]
GO
ALTER TABLE [dbo].[ad_impressions] ADD  DEFAULT ((0)) FOR [completed]
GO
ALTER TABLE [dbo].[ad_impressions]  WITH CHECK ADD FOREIGN KEY([ad_id])
REFERENCES [dbo].[ads] ([id])
GO
ALTER TABLE [dbo].[ad_impressions]  WITH CHECK ADD FOREIGN KEY([merchant_id])
REFERENCES [dbo].[merchants] ([id])
GO
ALTER TABLE [dbo].[ad_impressions]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

CREATE TABLE [dbo].[agents](
	[id] [int] NOT NULL,
	[commission_rate] [decimal](5, 2) NULL,
	[territory] [varchar](100) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[agents] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[agents] ADD  DEFAULT ((0.00)) FOR [commission_rate]
GO
ALTER TABLE [dbo].[agents] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[agents] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[agents]  WITH CHECK ADD FOREIGN KEY([id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO

CREATE TABLE [dbo].[advertisers](
	[id] [int] NOT NULL,
	[company_name] [varchar](100) NOT NULL,
	[company_address] [text] NULL,
	[company_phone] [varchar](20) NULL,
	[company_email] [varchar](100) NULL,
	[industry] [varchar](50) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[advertisers] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[advertisers] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[advertisers] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[advertisers]  WITH CHECK ADD FOREIGN KEY([id])
REFERENCES [dbo].[users] ([id])
GO

CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(100000001,1) NOT NULL,
	[username] [varchar](50) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[role] [varchar](20) NOT NULL,
	[first_name] [varchar](50) NULL,
	[last_name] [varchar](50) NULL,
	[phone] [varchar](20) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[last_login] [datetime] NULL,
	[status] [varchar](20) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[users] ADD UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ('PENDING') FOR [status]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD CHECK  (([role]='merchant' OR [role]='advertiser' OR [role]='agent' OR [role]='admin'))
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD CHECK  (([status]='suspended' OR [status]='PENDING' OR [status]='inactive' OR [status]='ACTIVE'))
GO
