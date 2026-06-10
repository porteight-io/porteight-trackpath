-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `porteight_addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`pincode` varchar(6) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`s3_key` varchar(255) NOT NULL,
	`name` varchar(255),
	`type` varchar(255),
	`completed` tinyint(1) DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bid_boq` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bid_boq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bid_boq_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`boq_id` int,
	`boq_truck_type_id` int,
	`name` varchar(255) NOT NULL,
	`has_slab` tinyint(1) NOT NULL,
	`boq_rate` double(10,2),
	`gst` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bid_boq_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bid_boq_activities_slabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activity_id` int NOT NULL,
	`slab_min_value` int NOT NULL,
	`slab_max_value` int NOT NULL,
	`boq_rate` double(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bid_boq_activities_slabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bid_boq_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bid_boq_truck_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_specification_id` int NOT NULL,
	`bidder_id` int NOT NULL,
	`status` enum('received','sent','negotiate','po-created','loa-created') DEFAULT 'sent',
	`negotiate_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_specification_id` int NOT NULL,
	`address_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_id` int NOT NULL,
	`attachment_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_id` int NOT NULL,
	`material_id` int NOT NULL,
	`quantity` float,
	`uom` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_bids_materials_bids_id_material_id_unique` UNIQUE(`bids_id`,`material_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_materials_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bid_material_id` int NOT NULL,
	`description` varchar(255),
	`amount` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_materials_prices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_specifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`pickup_address_id` int,
	`title` varchar(255) NOT NULL,
	`procurement_mode` varchar(255) NOT NULL,
	`payment_term_in_days` int NOT NULL,
	`submission_deadline` timestamp,
	`based_on` enum('trips','quantity') NOT NULL DEFAULT 'quantity',
	`description` varchar(1024),
	`amount` float,
	`status` enum('draft','bid-created','under-negotiation','po-created','loa-created') DEFAULT 'draft',
	`is_deleted` tinyint(1) DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_specifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_specifications_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attachment_id` int NOT NULL,
	`bids_specification_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_specifications_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_specifications_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_specification_id` int NOT NULL,
	`material_id` int NOT NULL,
	`quantity` float,
	`uom` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_specifications_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `bids_materials_specification_unique` UNIQUE(`bids_specification_id`,`material_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_specifications_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_specification_id` int NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_specifications_truck_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `bids_truck_types_specification_unique` UNIQUE(`bids_specification_id`,`truck_type_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_id` int NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_truck_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_bids_truck_types_bids_id_truck_type_id_unique` UNIQUE(`bids_id`,`truck_type_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_bids_truck_types_rate` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bid_truck_type_id` int NOT NULL,
	`description` varchar(255),
	`amount` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_bids_truck_types_rate_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_billing_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationsId` int NOT NULL,
	`status` enum('not_started','executing','success','failed') NOT NULL,
	`no_of_trucks` int NOT NULL,
	`planId` int NOT NULL,
	`cgst` varchar(10),
	`sgst` varchar(10),
	`igst` varchar(10),
	`amount` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_billing_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_boq` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_boq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_boq_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`boq_id` int,
	`boq_truck_type_id` int,
	`name` varchar(255) NOT NULL,
	`has_slab` tinyint(1) NOT NULL,
	`boq_rate` double(10,2),
	`gst` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_boq_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_boq_activities_slabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activity_id` int NOT NULL,
	`slab_min_value` int NOT NULL,
	`slab_max_value` int NOT NULL,
	`boq_rate` double(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_boq_activities_slabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_boq_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_boq_truck_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`mobile` varchar(10),
	`email` varchar(255),
	`org_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_drivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`mobile` varchar(10) NOT NULL,
	`address_id` int,
	`dl_no` varchar(15),
	`dob` timestamp,
	`status` enum('busy','free') DEFAULT 'free',
	`isDeleted` tinyint(1) DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_drivers_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_drivers_mobile_unique` UNIQUE(`mobile`)
);
--> statement-breakpoint
CREATE TABLE `porteight_fastag_bank` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bank_name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_fastag_bank_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_fastag_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('credit','debit') NOT NULL,
	`organization_id` int NOT NULL,
	`transaction_id` varchar(100) NOT NULL,
	`customer_name` varchar(100) NOT NULL,
	`mobile_no` varchar(10) NOT NULL,
	`owner_name` varchar(100) NOT NULL,
	`amount` float NOT NULL,
	`truck_id` int NOT NULL,
	`closing_balance` float NOT NULL,
	`transaction_date_time` timestamp NOT NULL,
	`description` varchar(1000) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`location` varchar(255),
	CONSTRAINT `porteight_fastag_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_fastag_transactions_transaction_id_unique` UNIQUE(`transaction_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_invoice_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoice_id` int NOT NULL,
	`truck_type_id` int,
	`no_of_trips` int,
	`material_id` int,
	`quantity` float,
	`hsn_code` varchar(255),
	`discount` double(10,2),
	`gst` int NOT NULL,
	`cgst` int,
	`sgst` int,
	`igst` int,
	CONSTRAINT `porteight_invoice_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_invoice_materials_invoice_id_material_id_unique` UNIQUE(`invoice_id`,`material_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_invoice_trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoice_id` int NOT NULL,
	`trip_id` int NOT NULL,
	`po_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_invoice_trips_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_invoice_trips_invoice_id_trip_id_unique` UNIQUE(`invoice_id`,`trip_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_invoice_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoice_id` int NOT NULL,
	`truck_type_id` int NOT NULL,
	`discount` double(10,2),
	`gst` int NOT NULL,
	`cgst` int,
	`sgst` int,
	`igst` int,
	CONSTRAINT `porteight_invoice_truck_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_invoice_truck_types_invoice_id_truck_type_id_unique` UNIQUE(`invoice_id`,`truck_type_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoice_no` varchar(255) NOT NULL,
	`invoice_date` timestamp NOT NULL,
	`status` enum('unpaid','paid') DEFAULT 'unpaid',
	`approved` tinyint(1),
	`amount` float NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_loa` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bid_id` int,
	`bid_specification_id` int,
	`status` enum('awarded','accepted') DEFAULT 'awarded',
	`loa_given_to_id` int NOT NULL,
	`loa_given_by_id` int NOT NULL,
	`description` varchar(2048) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_loa_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_material_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`attachment_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_material_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`hsn_code` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`description` varchar(255) NOT NULL,
	CONSTRAINT `porteight_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_msme_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`classification_year` varchar(255) NOT NULL,
	`enterprise_type` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_msme_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_org_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`material_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_org_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `org_material_unique` UNIQUE(`organization_id`,`material_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_org_service_locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`state` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_org_service_locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_location_unique` UNIQUE(`state`,`organization_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_org_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`type` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`mobile` varchar(10),
	`tb_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`password` varchar(255),
	CONSTRAINT `porteight_org_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_org_users_mobile_unique` UNIQUE(`mobile`)
);
--> statement-breakpoint
CREATE TABLE `porteight_org_users_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_user_id` int NOT NULL,
	`can_add_trip` tinyint(1) NOT NULL DEFAULT 0,
	`can_edit_trip` tinyint(1) NOT NULL DEFAULT 0,
	`can_delete_trip` tinyint(1) NOT NULL DEFAULT 0,
	`can_start_trip` tinyint(1) NOT NULL DEFAULT 0,
	`can_complete_trip` tinyint(1) NOT NULL DEFAULT 0,
	`show_fastag` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `porteight_org_users_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_org_users_site` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_user_id` int NOT NULL,
	`site_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_org_users_site_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_organization` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`gst` varchar(15),
	`pan` varchar(10),
	`bank_acc_no` varchar(18),
	`ifsc` varchar(11),
	`bank_name` varchar(255),
	`branch_name` varchar(255),
	`msme` varchar(19),
	`enterprise_name` varchar(255),
	`pan_india` tinyint(1) NOT NULL DEFAULT 0,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_organization_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_organization_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`attachment_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_organization_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payment_date` timestamp NOT NULL,
	`amount` float NOT NULL,
	`payment_mode` enum('cash','cheque','online','other') NOT NULL,
	`transaction_no` varchar(255),
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_payments_invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payment_id` int NOT NULL,
	`invoice_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_payments_invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_payments_invoices_invoice_id_payment_id_unique` UNIQUE(`invoice_id`,`payment_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_plan` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price_per_month` int NOT NULL,
	`price_per_year` int NOT NULL,
	`features` varchar(1000) NOT NULL,
	CONSTRAINT `porteight_plan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bids_id` int,
	`bid_specification_id` int,
	`loa_id` int,
	`parent_po_id` int,
	`po_given_to_id` int,
	`po_generated_by_id` int,
	`status` enum('awarded','accepted','completed','declined') DEFAULT 'awarded',
	`pickup_address_id` int,
	`po_no` varchar(255) NOT NULL,
	`po_date` timestamp NOT NULL,
	`po_validity_date` timestamp NOT NULL,
	`self_po_external_user_id` int,
	`po_amount` varchar(10) NOT NULL,
	`payment_term_in_days` int NOT NULL,
	`description` varchar(2048),
	`pickup_contact_id` int,
	`rating` int,
	`rating_description` varchar(1024),
	`is_sublet` tinyint(1) DEFAULT 0,
	`based_on` enum('trips','quantity') NOT NULL DEFAULT 'quantity',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`address_id` int NOT NULL,
	`po_id` int NOT NULL,
	`lead` float,
	`chainage` varchar(255),
	`contact_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`po_id` int NOT NULL,
	`attachment_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_boq` (
	`id` int AUTO_INCREMENT NOT NULL,
	`material_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_boq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_boq_activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`boq_id` int,
	`boq_truck_type_id` int,
	`name` varchar(255) NOT NULL,
	`has_slab` tinyint(1) NOT NULL,
	`boq_rate` double(10,2),
	`gst` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_boq_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_boq_activities_slabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activity_id` int NOT NULL,
	`slab_min_value` int NOT NULL,
	`slab_max_value` int NOT NULL,
	`boq_rate` double(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_boq_activities_slabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_boq_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_boq_truck_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`po_id` int NOT NULL,
	`material_id` int NOT NULL,
	`quantity` float,
	`uom` varchar(255),
	`rate` float,
	`gst_percentage` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_materials_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_po_materials_po_id_material_id_unique` UNIQUE(`po_id`,`material_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_truck_type_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`po_truck_type_id` int NOT NULL,
	`rate` float,
	`gst_percentage` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_truck_type_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_po_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`po_id` int NOT NULL,
	`truck_type_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_po_truck_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_po_truck_types_po_id_truck_type_id_unique` UNIQUE(`po_id`,`truck_type_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_self_po_external_user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`org_name` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`mobile` varchar(10),
	`email` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_self_po_external_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_session` (
	`session_token` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `porteight_session_session_token` PRIMARY KEY(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `porteight_sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organization_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`address_id` int NOT NULL,
	`gstin` varchar(15),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_sites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_sites_po` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_id` int NOT NULL,
	`po_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_sites_po_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_sites_truck` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_id` int NOT NULL,
	`truck_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_sites_truck_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_subscription` (
	`id` int AUTO_INCREMENT NOT NULL,
	`billingId` int NOT NULL,
	`organizationId` int NOT NULL,
	`status` enum('active','inactive') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_trip_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trip_id` int NOT NULL,
	`material_id` int NOT NULL,
	`quantity_scheduled` float,
	`quantity_delivered` float,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_trip_materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trip_no` varchar(255) NOT NULL,
	`po_id` int NOT NULL,
	`pickup_address_id` int,
	`drop_address_id` int NOT NULL,
	`lead` float,
	`chainage` varchar(255),
	`scheduled_date` timestamp NOT NULL,
	`end_trip_date` timestamp,
	`supervisor` varchar(255),
	`status` enum('scheduled','started','stopped','completed') DEFAULT 'scheduled',
	`truck_id` int,
	`driver_id` int,
	`pickup_contact_id` int,
	`drop_contact_id` int NOT NULL,
	`description` varchar(1024),
	`challan_no` varchar(255),
	`diesel_amount` double(10,2),
	`diesel_quantity` double(10,2),
	`weighbridge_slip_no` varchar(255),
	`unloading_client` varchar(255),
	`truck_type_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`diesel_date` timestamp,
	`pump_name` varchar(255),
	CONSTRAINT `porteight_trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_trips_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trip_id` int,
	`attachment_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_trips_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_truck_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_truck_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_trucks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`truck_no` varchar(15) NOT NULL,
	`organization_id` int NOT NULL,
	`type` varchar(255) NOT NULL,
	`gps_service` varchar(255) NOT NULL,
	`chassis_number` varchar(255),
	`fitness_upto` varchar(255),
	`insurance_validity` varchar(255),
	`manufacturer` varchar(255),
	`permit_type` varchar(255),
	`permit_issue_date` varchar(255),
	`permitValidity` varchar(255),
	`puc_validity` varchar(255),
	`status` enum('running','stopped','idle') DEFAULT 'idle',
	`isDeleted` tinyint(1) DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`fastag_bank_id` int,
	`truck_owner` varchar(255),
	`truck_owner_contact` varchar(255),
	`customer_name` varchar(255),
	CONSTRAINT `porteight_trucks_id` PRIMARY KEY(`id`),
	CONSTRAINT `truck_unique` UNIQUE(`truck_no`,`organization_id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_uom` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`material_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `porteight_uom_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `porteight_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`mobile_no` varchar(10) NOT NULL,
	`verified` tinyint(1) NOT NULL DEFAULT 0,
	`is_deleted` tinyint(1) NOT NULL DEFAULT 0,
	`password` varchar(255) NOT NULL,
	`role` enum('supplier','transporter') NOT NULL,
	`onboarding_completed` tinyint(1) NOT NULL DEFAULT 0,
	`background_verified` tinyint(1) NOT NULL DEFAULT 1,
	`account_type` enum('personal','business'),
	`image` varchar(255),
	`organization_id` int,
	`tb_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`show_fastag` tinyint(1) NOT NULL DEFAULT 0,
	CONSTRAINT `porteight_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `porteight_user_email_unique` UNIQUE(`email`),
	CONSTRAINT `porteight_user_mobile_no_unique` UNIQUE(`mobile_no`)
);
--> statement-breakpoint
CREATE TABLE `porteight_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `porteight_verificationToken_identifier_token` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE INDEX `city_state_idx` ON `porteight_addresses` (`city`,`state`);--> statement-breakpoint
CREATE INDEX `full_address_idx` ON `porteight_addresses` (`address`,`city`,`state`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_bid_boq` (`material_id`);--> statement-breakpoint
CREATE INDEX `boq_id_idx` ON `porteight_bid_boq_activities` (`boq_id`);--> statement-breakpoint
CREATE INDEX `boq_truck_type_id_idx` ON `porteight_bid_boq_activities` (`boq_truck_type_id`);--> statement-breakpoint
CREATE INDEX `activity_id_idx` ON `porteight_bid_boq_activities_slabs` (`activity_id`);--> statement-breakpoint
CREATE INDEX `bidder_id_idx` ON `porteight_bids` (`bidder_id`);--> statement-breakpoint
CREATE INDEX `bids_specification_id_idx` ON `porteight_bids` (`bids_specification_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `porteight_bids` (`created_at`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_bids` (`status`);--> statement-breakpoint
CREATE INDEX `address_id_idx` ON `porteight_bids_addresses` (`address_id`);--> statement-breakpoint
CREATE INDEX `bids_specification_id_idx` ON `porteight_bids_addresses` (`bids_specification_id`);--> statement-breakpoint
CREATE INDEX `attachment_id_idx` ON `porteight_bids_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `bids_id_idx` ON `porteight_bids_attachments` (`bids_id`);--> statement-breakpoint
CREATE INDEX `bids_id_idx` ON `porteight_bids_materials` (`bids_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_bids_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `uom_idx` ON `porteight_bids_materials` (`uom`);--> statement-breakpoint
CREATE INDEX `bid_material_id_idx` ON `porteight_bids_materials_prices` (`bid_material_id`);--> statement-breakpoint
CREATE INDEX `based_on_idx` ON `porteight_bids_specifications` (`based_on`);--> statement-breakpoint
CREATE INDEX `is_deleted_idx` ON `porteight_bids_specifications` (`is_deleted`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_bids_specifications` (`organization_id`);--> statement-breakpoint
CREATE INDEX `pickup_address_id_idx` ON `porteight_bids_specifications` (`pickup_address_id`);--> statement-breakpoint
CREATE INDEX `procurement_mode_idx` ON `porteight_bids_specifications` (`procurement_mode`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_bids_specifications` (`status`);--> statement-breakpoint
CREATE INDEX `submission_deadline_idx` ON `porteight_bids_specifications` (`submission_deadline`);--> statement-breakpoint
CREATE INDEX `attachment_id_idx` ON `porteight_bids_specifications_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `bids_specification_id_idx` ON `porteight_bids_specifications_attachments` (`bids_specification_id`);--> statement-breakpoint
CREATE INDEX `bids_specification_id_idx` ON `porteight_bids_specifications_materials` (`bids_specification_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_bids_specifications_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `uom_idx` ON `porteight_bids_specifications_materials` (`uom`);--> statement-breakpoint
CREATE INDEX `bids_specification_id_idx` ON `porteight_bids_specifications_truck_types` (`bids_specification_id`);--> statement-breakpoint
CREATE INDEX `truck_type_id_idx` ON `porteight_bids_specifications_truck_types` (`truck_type_id`);--> statement-breakpoint
CREATE INDEX `bids_id_idx` ON `porteight_bids_truck_types` (`bids_id`);--> statement-breakpoint
CREATE INDEX `truck_type_id_idx` ON `porteight_bids_truck_types` (`truck_type_id`);--> statement-breakpoint
CREATE INDEX `bid_truck_type_id_idx` ON `porteight_bids_truck_types_rate` (`bid_truck_type_id`);--> statement-breakpoint
CREATE INDEX `organizations_id_idx` ON `porteight_billing_history` (`organizationsId`);--> statement-breakpoint
CREATE INDEX `plan_id_idx` ON `porteight_billing_history` (`planId`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_boq` (`material_id`);--> statement-breakpoint
CREATE INDEX `boq_id_idx` ON `porteight_boq_activities` (`boq_id`);--> statement-breakpoint
CREATE INDEX `boq_truck_type_id_idx` ON `porteight_boq_activities` (`boq_truck_type_id`);--> statement-breakpoint
CREATE INDEX `activity_id_idx` ON `porteight_boq_activities_slabs` (`activity_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `porteight_contacts` (`email`);--> statement-breakpoint
CREATE INDEX `mobile_idx` ON `porteight_contacts` (`mobile`);--> statement-breakpoint
CREATE INDEX `org_id_idx` ON `porteight_contacts` (`org_id`);--> statement-breakpoint
CREATE INDEX `address_id_idx` ON `porteight_drivers` (`address_id`);--> statement-breakpoint
CREATE INDEX `dl_no_idx` ON `porteight_drivers` (`dl_no`);--> statement-breakpoint
CREATE INDEX `is_deleted_idx` ON `porteight_drivers` (`isDeleted`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `porteight_drivers` (`name`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_drivers` (`organization_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_drivers` (`status`);--> statement-breakpoint
CREATE INDEX `mobile_no_idx` ON `porteight_fastag_transactions` (`mobile_no`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_fastag_transactions` (`organization_id`);--> statement-breakpoint
CREATE INDEX `transaction_date_time_idx` ON `porteight_fastag_transactions` (`transaction_date_time`);--> statement-breakpoint
CREATE INDEX `transaction_id_idx` ON `porteight_fastag_transactions` (`transaction_id`);--> statement-breakpoint
CREATE INDEX `truck_id_idx` ON `porteight_fastag_transactions` (`truck_id`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `porteight_fastag_transactions` (`type`);--> statement-breakpoint
CREATE INDEX `hsn_code_idx` ON `porteight_invoice_materials` (`hsn_code`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `porteight_invoice_materials` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_invoice_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `truck_type_id_idx` ON `porteight_invoice_materials` (`truck_type_id`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `porteight_invoice_trips` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_invoice_trips` (`po_id`);--> statement-breakpoint
CREATE INDEX `trip_id_idx` ON `porteight_invoice_trips` (`trip_id`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `porteight_invoice_truck_types` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `truck_type_id_idx` ON `porteight_invoice_truck_types` (`truck_type_id`);--> statement-breakpoint
CREATE INDEX `approved_idx` ON `porteight_invoices` (`approved`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `porteight_invoices` (`created_at`);--> statement-breakpoint
CREATE INDEX `invoice_date_idx` ON `porteight_invoices` (`invoice_date`);--> statement-breakpoint
CREATE INDEX `invoice_no_idx` ON `porteight_invoices` (`invoice_no`);--> statement-breakpoint
CREATE INDEX `status_approved_idx` ON `porteight_invoices` (`status`,`approved`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_invoices` (`status`);--> statement-breakpoint
CREATE INDEX `bid_id_idx` ON `porteight_loa` (`bid_id`);--> statement-breakpoint
CREATE INDEX `bid_specification_id_idx` ON `porteight_loa` (`bid_specification_id`);--> statement-breakpoint
CREATE INDEX `loa_given_by_id_idx` ON `porteight_loa` (`loa_given_by_id`);--> statement-breakpoint
CREATE INDEX `loa_given_to_id_idx` ON `porteight_loa` (`loa_given_to_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_loa` (`status`);--> statement-breakpoint
CREATE INDEX `attachment_idx` ON `porteight_material_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `material_idx` ON `porteight_material_attachments` (`material_id`);--> statement-breakpoint
CREATE INDEX `hsn_code_idx` ON `porteight_materials` (`hsn_code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `porteight_materials` (`name`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_msme_details` (`organization_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_org_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_org_service_locations` (`organization_id`);--> statement-breakpoint
CREATE INDEX `mobile_idx` ON `porteight_org_users` (`mobile`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `porteight_org_users` (`name`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_org_users` (`organization_id`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `porteight_org_users` (`type`);--> statement-breakpoint
CREATE INDEX `org_user_id_idx` ON `porteight_org_users_permissions` (`org_user_id`);--> statement-breakpoint
CREATE INDEX `org_user_id_idx` ON `porteight_org_users_site` (`org_user_id`);--> statement-breakpoint
CREATE INDEX `site_id_idx` ON `porteight_org_users_site` (`site_id`);--> statement-breakpoint
CREATE INDEX `bank_acc_no_idx` ON `porteight_organization` (`bank_acc_no`);--> statement-breakpoint
CREATE INDEX `gst_idx` ON `porteight_organization` (`gst`);--> statement-breakpoint
CREATE INDEX `ifsc_idx` ON `porteight_organization` (`ifsc`);--> statement-breakpoint
CREATE INDEX `pan_idx` ON `porteight_organization` (`pan`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `porteight_organization` (`user_id`);--> statement-breakpoint
CREATE INDEX `attachment_id_idx` ON `porteight_organization_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_organization_attachments` (`organization_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `porteight_payments` (`created_at`);--> statement-breakpoint
CREATE INDEX `payment_date_idx` ON `porteight_payments` (`payment_date`);--> statement-breakpoint
CREATE INDEX `payment_mode_idx` ON `porteight_payments` (`payment_mode`);--> statement-breakpoint
CREATE INDEX `transaction_no_idx` ON `porteight_payments` (`transaction_no`);--> statement-breakpoint
CREATE INDEX `invoice_id_idx` ON `porteight_payments_invoices` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `payment_id_idx` ON `porteight_payments_invoices` (`payment_id`);--> statement-breakpoint
CREATE INDEX `bid_specification_id_idx` ON `porteight_po` (`bid_specification_id`);--> statement-breakpoint
CREATE INDEX `bids_id_idx` ON `porteight_po` (`bids_id`);--> statement-breakpoint
CREATE INDEX `loa_id_idx` ON `porteight_po` (`loa_id`);--> statement-breakpoint
CREATE INDEX `parent_po_id_idx` ON `porteight_po` (`parent_po_id`);--> statement-breakpoint
CREATE INDEX `pickup_address_id_idx` ON `porteight_po` (`pickup_address_id`);--> statement-breakpoint
CREATE INDEX `pickup_contact_id_idx` ON `porteight_po` (`pickup_contact_id`);--> statement-breakpoint
CREATE INDEX `po_date_idx` ON `porteight_po` (`po_date`);--> statement-breakpoint
CREATE INDEX `po_generated_by_id_idx` ON `porteight_po` (`po_generated_by_id`);--> statement-breakpoint
CREATE INDEX `po_given_to_id_idx` ON `porteight_po` (`po_given_to_id`);--> statement-breakpoint
CREATE INDEX `po_no_idx` ON `porteight_po` (`po_no`);--> statement-breakpoint
CREATE INDEX `self_po_external_user_id_idx` ON `porteight_po` (`self_po_external_user_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_po` (`status`);--> statement-breakpoint
CREATE INDEX `address_id_idx` ON `porteight_po_addresses` (`address_id`);--> statement-breakpoint
CREATE INDEX `contact_id_idx` ON `porteight_po_addresses` (`contact_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_po_addresses` (`po_id`);--> statement-breakpoint
CREATE INDEX `attachment_id_idx` ON `porteight_po_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_po_attachments` (`po_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_po_boq` (`material_id`);--> statement-breakpoint
CREATE INDEX `boq_id_idx` ON `porteight_po_boq_activities` (`boq_id`);--> statement-breakpoint
CREATE INDEX `boq_truck_type_id_idx` ON `porteight_po_boq_activities` (`boq_truck_type_id`);--> statement-breakpoint
CREATE INDEX `activity_id_idx` ON `porteight_po_boq_activities_slabs` (`activity_id`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_po_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_po_materials` (`po_id`);--> statement-breakpoint
CREATE INDEX `uom_idx` ON `porteight_po_materials` (`uom`);--> statement-breakpoint
CREATE INDEX `po_truck_type_id_idx` ON `porteight_po_truck_type_rates` (`po_truck_type_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_po_truck_types` (`po_id`);--> statement-breakpoint
CREATE INDEX `truck_type_id_idx` ON `porteight_po_truck_types` (`truck_type_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `porteight_session` (`user_id`);--> statement-breakpoint
CREATE INDEX `address_id_idx` ON `porteight_sites` (`address_id`);--> statement-breakpoint
CREATE INDEX `gstin_idx` ON `porteight_sites` (`gstin`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `porteight_sites` (`name`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_sites` (`organization_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_sites_po` (`po_id`);--> statement-breakpoint
CREATE INDEX `site_id_idx` ON `porteight_sites_po` (`site_id`);--> statement-breakpoint
CREATE INDEX `site_id_idx` ON `porteight_sites_truck` (`site_id`);--> statement-breakpoint
CREATE INDEX `truck_id_idx` ON `porteight_sites_truck` (`truck_id`);--> statement-breakpoint
CREATE INDEX `billing_id_idx` ON `porteight_subscription` (`billingId`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_subscription` (`organizationId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_subscription` (`status`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_trip_materials` (`material_id`);--> statement-breakpoint
CREATE INDEX `trip_id_idx` ON `porteight_trip_materials` (`trip_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `porteight_trips` (`created_at`);--> statement-breakpoint
CREATE INDEX `driver_id_idx` ON `porteight_trips` (`driver_id`);--> statement-breakpoint
CREATE INDEX `drop_address_id_idx` ON `porteight_trips` (`drop_address_id`);--> statement-breakpoint
CREATE INDEX `drop_contact_id_idx` ON `porteight_trips` (`drop_contact_id`);--> statement-breakpoint
CREATE INDEX `pickup_address_id_idx` ON `porteight_trips` (`pickup_address_id`);--> statement-breakpoint
CREATE INDEX `pickup_contact_id_idx` ON `porteight_trips` (`pickup_contact_id`);--> statement-breakpoint
CREATE INDEX `po_id_idx` ON `porteight_trips` (`po_id`);--> statement-breakpoint
CREATE INDEX `po_id_status_idx` ON `porteight_trips` (`po_id`,`status`);--> statement-breakpoint
CREATE INDEX `scheduled_date_idx` ON `porteight_trips` (`scheduled_date`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_trips` (`status`);--> statement-breakpoint
CREATE INDEX `trip_no_idx` ON `porteight_trips` (`trip_no`);--> statement-breakpoint
CREATE INDEX `truck_id_idx` ON `porteight_trips` (`truck_id`);--> statement-breakpoint
CREATE INDEX `attachment_id_idx` ON `porteight_trips_attachments` (`attachment_id`);--> statement-breakpoint
CREATE INDEX `trip_id_idx` ON `porteight_trips_attachments` (`trip_id`);--> statement-breakpoint
CREATE INDEX `fastag_bank_idx` ON `porteight_trucks` (`fastag_bank_id`);--> statement-breakpoint
CREATE INDEX `is_deleted_idx` ON `porteight_trucks` (`isDeleted`);--> statement-breakpoint
CREATE INDEX `organization_idx` ON `porteight_trucks` (`organization_id`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `porteight_trucks` (`status`);--> statement-breakpoint
CREATE INDEX `truck_no_idx` ON `porteight_trucks` (`truck_no`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `porteight_trucks` (`type`);--> statement-breakpoint
CREATE INDEX `material_id_idx` ON `porteight_uom` (`material_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `porteight_user` (`email`);--> statement-breakpoint
CREATE INDEX `is_deleted_idx` ON `porteight_user` (`is_deleted`);--> statement-breakpoint
CREATE INDEX `mobile_no_idx` ON `porteight_user` (`mobile_no`);--> statement-breakpoint
CREATE INDEX `onboarding_status_idx` ON `porteight_user` (`is_deleted`,`onboarding_completed`,`background_verified`);--> statement-breakpoint
CREATE INDEX `organization_id_idx` ON `porteight_user` (`organization_id`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `porteight_user` (`role`);--> statement-breakpoint
CREATE INDEX `show_fastag_idx` ON `porteight_user` (`show_fastag`);
*/