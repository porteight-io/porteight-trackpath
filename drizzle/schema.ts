import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, primaryKey, int, varchar, timestamp, double, mysqlEnum, unique, float } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const porteight_addresses = mysqlTable("porteight_addresses", {
	id: int().autoincrement().notNull(),
	address: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 255 }).notNull(),
	pincode: varchar({ length: 6 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("city_state_idx").on(table.city, table.state),
	index("full_address_idx").on(table.address, table.city, table.state),
	primaryKey({ columns: [table.id], name: "porteight_addresses_id"}),
]);

export const porteight_attachments = mysqlTable("porteight_attachments", {
	id: int().autoincrement().notNull(),
	s3_key: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }),
	type: varchar({ length: 255 }),
	completed: int().default(0),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_attachments_id"}),
]);

export const porteight_bid_boq = mysqlTable("porteight_bid_boq", {
	id: int().autoincrement().notNull(),
	material_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_bid_boq_id"}),
]);

export const porteight_bid_boq_activities = mysqlTable("porteight_bid_boq_activities", {
	id: int().autoincrement().notNull(),
	boq_id: int(),
	boq_truck_type_id: int(),
	name: varchar({ length: 255 }).notNull(),
	has_slab: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }),
	gst: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("boq_id_idx").on(table.boq_id),
	index("boq_truck_type_id_idx").on(table.boq_truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_bid_boq_activities_id"}),
]);

export const porteight_bid_boq_activities_slabs = mysqlTable("porteight_bid_boq_activities_slabs", {
	id: int().autoincrement().notNull(),
	activity_id: int().notNull(),
	slab_min_value: int().notNull(),
	slab_max_value: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("activity_id_idx").on(table.activity_id),
	primaryKey({ columns: [table.id], name: "porteight_bid_boq_activities_slabs_id"}),
]);

export const porteight_bid_boq_truck_types = mysqlTable("porteight_bid_boq_truck_types", {
	id: int().autoincrement().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_bid_boq_truck_types_id"}),
]);

export const porteight_bids = mysqlTable("porteight_bids", {
	id: int().autoincrement().notNull(),
	bids_specification_id: int().notNull(),
	bidder_id: int().notNull(),
	status: mysqlEnum(['received','sent','negotiate','po-created','loa-created']).default('sent'),
	negotiate_count: int().default(0),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bidder_id_idx").on(table.bidder_id),
	index("bids_specification_id_idx").on(table.bids_specification_id),
	index("created_at_idx").on(table.created_at),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_bids_id"}),
]);

export const porteight_bids_addresses = mysqlTable("porteight_bids_addresses", {
	id: int().autoincrement().notNull(),
	bids_specification_id: int().notNull(),
	address_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("address_id_idx").on(table.address_id),
	index("bids_specification_id_idx").on(table.bids_specification_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_addresses_id"}),
]);

export const porteight_bids_attachments = mysqlTable("porteight_bids_attachments", {
	id: int().autoincrement().notNull(),
	bids_id: int().notNull(),
	attachment_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_id_idx").on(table.attachment_id),
	index("bids_id_idx").on(table.bids_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_attachments_id"}),
]);

export const porteight_bids_materials = mysqlTable("porteight_bids_materials", {
	id: int().autoincrement().notNull(),
	bids_id: int().notNull(),
	material_id: int().notNull(),
	quantity: float(),
	uom: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bids_id_idx").on(table.bids_id),
	index("material_id_idx").on(table.material_id),
	index("uom_idx").on(table.uom),
	primaryKey({ columns: [table.id], name: "porteight_bids_materials_id"}),
	unique("porteight_bids_materials_bids_id_material_id_unique").on(table.bids_id, table.material_id),
]);

export const porteight_bids_materials_prices = mysqlTable("porteight_bids_materials_prices", {
	id: int().autoincrement().notNull(),
	bid_material_id: int().notNull(),
	description: varchar({ length: 255 }),
	amount: varchar({ length: 10 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bid_material_id_idx").on(table.bid_material_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_materials_prices_id"}),
]);

export const porteight_bids_specifications = mysqlTable("porteight_bids_specifications", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	pickup_address_id: int(),
	title: varchar({ length: 255 }).notNull(),
	procurement_mode: varchar({ length: 255 }).notNull(),
	payment_term_in_days: int().notNull(),
	submission_deadline: timestamp({ mode: 'string' }),
	based_on: mysqlEnum(['trips','quantity']).default('quantity').notNull(),
	description: varchar({ length: 1024 }),
	amount: float(),
	status: mysqlEnum(['draft','bid-created','under-negotiation','po-created','loa-created']).default('draft'),
	is_deleted: int().default(0),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("based_on_idx").on(table.based_on),
	index("is_deleted_idx").on(table.is_deleted),
	index("organization_id_idx").on(table.organization_id),
	index("pickup_address_id_idx").on(table.pickup_address_id),
	index("procurement_mode_idx").on(table.procurement_mode),
	index("status_idx").on(table.status),
	index("submission_deadline_idx").on(table.submission_deadline),
	primaryKey({ columns: [table.id], name: "porteight_bids_specifications_id"}),
]);

export const porteight_bids_specifications_attachments = mysqlTable("porteight_bids_specifications_attachments", {
	id: int().autoincrement().notNull(),
	attachment_id: int().notNull(),
	bids_specification_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_id_idx").on(table.attachment_id),
	index("bids_specification_id_idx").on(table.bids_specification_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_specifications_attachments_id"}),
]);

export const porteight_bids_specifications_materials = mysqlTable("porteight_bids_specifications_materials", {
	id: int().autoincrement().notNull(),
	bids_specification_id: int().notNull(),
	material_id: int().notNull(),
	quantity: float(),
	uom: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bids_specification_id_idx").on(table.bids_specification_id),
	index("material_id_idx").on(table.material_id),
	index("uom_idx").on(table.uom),
	primaryKey({ columns: [table.id], name: "porteight_bids_specifications_materials_id"}),
	unique("bids_materials_specification_unique").on(table.bids_specification_id, table.material_id),
]);

export const porteight_bids_specifications_truck_types = mysqlTable("porteight_bids_specifications_truck_types", {
	id: int().autoincrement().notNull(),
	bids_specification_id: int().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bids_specification_id_idx").on(table.bids_specification_id),
	index("truck_type_id_idx").on(table.truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_specifications_truck_types_id"}),
	unique("bids_truck_types_specification_unique").on(table.bids_specification_id, table.truck_type_id),
]);

export const porteight_bids_truck_types = mysqlTable("porteight_bids_truck_types", {
	id: int().autoincrement().notNull(),
	bids_id: int().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bids_id_idx").on(table.bids_id),
	index("truck_type_id_idx").on(table.truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_truck_types_id"}),
	unique("porteight_bids_truck_types_bids_id_truck_type_id_unique").on(table.bids_id, table.truck_type_id),
]);

export const porteight_bids_truck_types_rate = mysqlTable("porteight_bids_truck_types_rate", {
	id: int().autoincrement().notNull(),
	bid_truck_type_id: int().notNull(),
	description: varchar({ length: 255 }),
	amount: varchar({ length: 10 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bid_truck_type_id_idx").on(table.bid_truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_bids_truck_types_rate_id"}),
]);

export const porteight_billing_history = mysqlTable("porteight_billing_history", {
	id: int().autoincrement().notNull(),
	organizationsId: int().notNull(),
	status: mysqlEnum(['not_started','executing','success','failed']).notNull(),
	no_of_trucks: int().notNull(),
	planId: int().notNull(),
	cgst: varchar({ length: 10 }),
	sgst: varchar({ length: 10 }),
	igst: varchar({ length: 10 }),
	amount: varchar({ length: 10 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("organizations_id_idx").on(table.organizationsId),
	index("plan_id_idx").on(table.planId),
	primaryKey({ columns: [table.id], name: "porteight_billing_history_id"}),
]);

export const porteight_boq = mysqlTable("porteight_boq", {
	id: int().autoincrement().notNull(),
	material_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_boq_id"}),
]);

export const porteight_boq_activities = mysqlTable("porteight_boq_activities", {
	id: int().autoincrement().notNull(),
	boq_id: int(),
	boq_truck_type_id: int(),
	name: varchar({ length: 255 }).notNull(),
	has_slab: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }),
	gst: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("boq_id_idx").on(table.boq_id),
	index("boq_truck_type_id_idx").on(table.boq_truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_boq_activities_id"}),
]);

export const porteight_boq_activities_slabs = mysqlTable("porteight_boq_activities_slabs", {
	id: int().autoincrement().notNull(),
	activity_id: int().notNull(),
	slab_min_value: int().notNull(),
	slab_max_value: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("activity_id_idx").on(table.activity_id),
	primaryKey({ columns: [table.id], name: "porteight_boq_activities_slabs_id"}),
]);

export const porteight_boq_truck_types = mysqlTable("porteight_boq_truck_types", {
	id: int().autoincrement().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_boq_truck_types_id"}),
]);

export const porteight_contacts = mysqlTable("porteight_contacts", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	mobile: varchar({ length: 10 }),
	email: varchar({ length: 255 }),
	org_id: int(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("email_idx").on(table.email),
	index("mobile_idx").on(table.mobile),
	index("org_id_idx").on(table.org_id),
	primaryKey({ columns: [table.id], name: "porteight_contacts_id"}),
]);

export const porteight_drivers = mysqlTable("porteight_drivers", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	mobile: varchar({ length: 10 }).notNull(),
	address_id: int(),
	dl_no: varchar({ length: 15 }),
	dob: timestamp({ mode: 'string' }),
	status: mysqlEnum(['busy','free']).default('free'),
	isDeleted: int().default(0),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("address_id_idx").on(table.address_id),
	index("dl_no_idx").on(table.dl_no),
	index("is_deleted_idx").on(table.isDeleted),
	index("name_idx").on(table.name),
	index("organization_id_idx").on(table.organization_id),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_drivers_id"}),
	unique("porteight_drivers_mobile_unique").on(table.mobile),
]);

export const porteight_fastag_bank = mysqlTable("porteight_fastag_bank", {
	id: int().autoincrement().notNull(),
	bank_name: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_fastag_bank_id"}),
]);

export const porteight_fastag_transactions = mysqlTable("porteight_fastag_transactions", {
	id: int().autoincrement().notNull(),
	type: mysqlEnum(['credit','debit']).notNull(),
	organization_id: int().notNull(),
	transaction_id: varchar({ length: 100 }).notNull(),
	customer_name: varchar({ length: 100 }).notNull(),
	mobile_no: varchar({ length: 10 }).notNull(),
	owner_name: varchar({ length: 100 }).notNull(),
	amount: float().notNull(),
	truck_id: int().notNull(),
	closing_balance: float().notNull(),
	transaction_date_time: timestamp({ mode: 'string' }).notNull(),
	description: varchar({ length: 1000 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	location: varchar({ length: 255 }),
},
(table) => [
	index("mobile_no_idx").on(table.mobile_no),
	index("organization_id_idx").on(table.organization_id),
	index("transaction_date_time_idx").on(table.transaction_date_time),
	index("transaction_id_idx").on(table.transaction_id),
	index("truck_id_idx").on(table.truck_id),
	index("type_idx").on(table.type),
	primaryKey({ columns: [table.id], name: "porteight_fastag_transactions_id"}),
	unique("porteight_fastag_transactions_transaction_id_unique").on(table.transaction_id),
]);

export const porteight_invoice_materials = mysqlTable("porteight_invoice_materials", {
	id: int().autoincrement().notNull(),
	invoice_id: int().notNull(),
	truck_type_id: int(),
	no_of_trips: int(),
	material_id: int(),
	quantity: float(),
	hsn_code: varchar({ length: 255 }),
	discount: double({ precision: 10, scale: 2 }),
	gst: int().notNull(),
	cgst: int(),
	sgst: int(),
	igst: int(),
},
(table) => [
	index("hsn_code_idx").on(table.hsn_code),
	index("invoice_id_idx").on(table.invoice_id),
	index("material_id_idx").on(table.material_id),
	index("truck_type_id_idx").on(table.truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_invoice_materials_id"}),
	unique("porteight_invoice_materials_invoice_id_material_id_unique").on(table.invoice_id, table.material_id),
]);

export const porteight_invoice_trips = mysqlTable("porteight_invoice_trips", {
	id: int().autoincrement().notNull(),
	invoice_id: int().notNull(),
	trip_id: int().notNull(),
	po_id: int(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("invoice_id_idx").on(table.invoice_id),
	index("po_id_idx").on(table.po_id),
	index("trip_id_idx").on(table.trip_id),
	primaryKey({ columns: [table.id], name: "porteight_invoice_trips_id"}),
	unique("porteight_invoice_trips_invoice_id_trip_id_unique").on(table.invoice_id, table.trip_id),
]);

export const porteight_invoice_truck_types = mysqlTable("porteight_invoice_truck_types", {
	id: int().autoincrement().notNull(),
	invoice_id: int().notNull(),
	truck_type_id: int().notNull(),
	discount: double({ precision: 10, scale: 2 }),
	gst: int().notNull(),
	cgst: int(),
	sgst: int(),
	igst: int(),
},
(table) => [
	index("invoice_id_idx").on(table.invoice_id),
	index("truck_type_id_idx").on(table.truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_invoice_truck_types_id"}),
	unique("porteight_invoice_truck_types_invoice_id_truck_type_id_unique").on(table.invoice_id, table.truck_type_id),
]);

export const porteight_invoices = mysqlTable("porteight_invoices", {
	id: int().autoincrement().notNull(),
	invoice_no: varchar({ length: 255 }).notNull(),
	invoice_date: timestamp({ mode: 'string' }).notNull(),
	status: mysqlEnum(['unpaid','paid']).default('unpaid'),
	approved: int(),
	amount: float().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("approved_idx").on(table.approved),
	index("created_at_idx").on(table.created_at),
	index("invoice_date_idx").on(table.invoice_date),
	index("invoice_no_idx").on(table.invoice_no),
	index("status_approved_idx").on(table.status, table.approved),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_invoices_id"}),
]);

export const porteight_loa = mysqlTable("porteight_loa", {
	id: int().autoincrement().notNull(),
	bid_id: int(),
	bid_specification_id: int(),
	status: mysqlEnum(['awarded','accepted']).default('awarded'),
	loa_given_to_id: int().notNull(),
	loa_given_by_id: int().notNull(),
	description: varchar({ length: 2048 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bid_id_idx").on(table.bid_id),
	index("bid_specification_id_idx").on(table.bid_specification_id),
	index("loa_given_by_id_idx").on(table.loa_given_by_id),
	index("loa_given_to_id_idx").on(table.loa_given_to_id),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_loa_id"}),
]);

export const porteight_material_attachments = mysqlTable("porteight_material_attachments", {
	id: int().autoincrement().notNull(),
	material_id: int().notNull(),
	attachment_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_idx").on(table.attachment_id),
	index("material_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_material_attachments_id"}),
]);

export const porteight_materials = mysqlTable("porteight_materials", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	hsn_code: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	description: varchar({ length: 255 }).notNull(),
},
(table) => [
	index("hsn_code_idx").on(table.hsn_code),
	index("name_idx").on(table.name),
	primaryKey({ columns: [table.id], name: "porteight_materials_id"}),
]);

export const porteight_msme_details = mysqlTable("porteight_msme_details", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	classification_year: varchar({ length: 255 }).notNull(),
	enterprise_type: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("organization_id_idx").on(table.organization_id),
	primaryKey({ columns: [table.id], name: "porteight_msme_details_id"}),
]);

export const porteight_org_materials = mysqlTable("porteight_org_materials", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	material_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_org_materials_id"}),
	unique("org_material_unique").on(table.organization_id, table.material_id),
]);

export const porteight_org_service_locations = mysqlTable("porteight_org_service_locations", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	state: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("organization_id_idx").on(table.organization_id),
	primaryKey({ columns: [table.id], name: "porteight_org_service_locations_id"}),
	unique("service_location_unique").on(table.state, table.organization_id),
]);

export const porteight_org_users = mysqlTable("porteight_org_users", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	type: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	mobile: varchar({ length: 10 }),
	tb_token: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	password: varchar({ length: 255 }),
},
(table) => [
	index("mobile_idx").on(table.mobile),
	index("name_idx").on(table.name),
	index("organization_id_idx").on(table.organization_id),
	index("type_idx").on(table.type),
	primaryKey({ columns: [table.id], name: "porteight_org_users_id"}),
	unique("porteight_org_users_mobile_unique").on(table.mobile),
]);

export const porteight_org_users_permissions = mysqlTable("porteight_org_users_permissions", {
	id: int().autoincrement().notNull(),
	org_user_id: int().notNull(),
	can_add_trip: int().default(0).notNull(),
	can_edit_trip: int().default(0).notNull(),
	can_delete_trip: int().default(0).notNull(),
	can_start_trip: int().default(0).notNull(),
	can_complete_trip: int().default(0).notNull(),
	show_fastag: int().default(0).notNull(),
},
(table) => [
	index("org_user_id_idx").on(table.org_user_id),
	primaryKey({ columns: [table.id], name: "porteight_org_users_permissions_id"}),
]);

export const porteight_org_users_site = mysqlTable("porteight_org_users_site", {
	id: int().autoincrement().notNull(),
	org_user_id: int().notNull(),
	site_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("org_user_id_idx").on(table.org_user_id),
	index("site_id_idx").on(table.site_id),
	primaryKey({ columns: [table.id], name: "porteight_org_users_site_id"}),
]);

export const porteight_organization = mysqlTable("porteight_organization", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	country: varchar({ length: 255 }).notNull(),
	state: varchar({ length: 255 }).notNull(),
	city: varchar({ length: 255 }).notNull(),
	gst: varchar({ length: 15 }),
	pan: varchar({ length: 10 }),
	bank_acc_no: varchar({ length: 18 }),
	ifsc: varchar({ length: 11 }),
	bank_name: varchar({ length: 255 }),
	branch_name: varchar({ length: 255 }),
	msme: varchar({ length: 19 }),
	enterprise_name: varchar({ length: 255 }),
	pan_india: int().default(0).notNull(),
	user_id: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bank_acc_no_idx").on(table.bank_acc_no),
	index("gst_idx").on(table.gst),
	index("ifsc_idx").on(table.ifsc),
	index("pan_idx").on(table.pan),
	index("user_id_idx").on(table.user_id),
	primaryKey({ columns: [table.id], name: "porteight_organization_id"}),
]);

export const porteight_organization_attachments = mysqlTable("porteight_organization_attachments", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	attachment_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_id_idx").on(table.attachment_id),
	index("organization_id_idx").on(table.organization_id),
	primaryKey({ columns: [table.id], name: "porteight_organization_attachments_id"}),
]);

export const porteight_payments = mysqlTable("porteight_payments", {
	id: int().autoincrement().notNull(),
	payment_date: timestamp({ mode: 'string' }).notNull(),
	amount: float().notNull(),
	payment_mode: mysqlEnum(['cash','cheque','online','other']).notNull(),
	transaction_no: varchar({ length: 255 }),
	description: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("created_at_idx").on(table.created_at),
	index("payment_date_idx").on(table.payment_date),
	index("payment_mode_idx").on(table.payment_mode),
	index("transaction_no_idx").on(table.transaction_no),
	primaryKey({ columns: [table.id], name: "porteight_payments_id"}),
]);

export const porteight_payments_invoices = mysqlTable("porteight_payments_invoices", {
	id: int().autoincrement().notNull(),
	payment_id: int().notNull(),
	invoice_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("invoice_id_idx").on(table.invoice_id),
	index("payment_id_idx").on(table.payment_id),
	primaryKey({ columns: [table.id], name: "porteight_payments_invoices_id"}),
	unique("porteight_payments_invoices_invoice_id_payment_id_unique").on(table.invoice_id, table.payment_id),
]);

export const porteight_plan = mysqlTable("porteight_plan", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	price_per_month: int().notNull(),
	price_per_year: int().notNull(),
	features: varchar({ length: 1000 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_plan_id"}),
]);

export const porteight_po = mysqlTable("porteight_po", {
	id: int().autoincrement().notNull(),
	bids_id: int(),
	bid_specification_id: int(),
	loa_id: int(),
	parent_po_id: int(),
	po_given_to_id: int(),
	po_generated_by_id: int(),
	status: mysqlEnum(['awarded','accepted','completed','declined']).default('awarded'),
	pickup_address_id: int(),
	po_no: varchar({ length: 255 }).notNull(),
	po_date: timestamp({ mode: 'string' }).notNull(),
	po_validity_date: timestamp({ mode: 'string' }).notNull(),
	self_po_external_user_id: int(),
	po_amount: varchar({ length: 10 }).notNull(),
	payment_term_in_days: int().notNull(),
	description: varchar({ length: 2048 }),
	pickup_contact_id: int(),
	rating: int(),
	rating_description: varchar({ length: 1024 }),
	is_sublet: int().default(0),
	based_on: mysqlEnum(['trips','quantity']).default('quantity').notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("bid_specification_id_idx").on(table.bid_specification_id),
	index("bids_id_idx").on(table.bids_id),
	index("loa_id_idx").on(table.loa_id),
	index("parent_po_id_idx").on(table.parent_po_id),
	index("pickup_address_id_idx").on(table.pickup_address_id),
	index("pickup_contact_id_idx").on(table.pickup_contact_id),
	index("po_date_idx").on(table.po_date),
	index("po_generated_by_id_idx").on(table.po_generated_by_id),
	index("po_given_to_id_idx").on(table.po_given_to_id),
	index("po_no_idx").on(table.po_no),
	index("self_po_external_user_id_idx").on(table.self_po_external_user_id),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_po_id"}),
]);

export const porteight_po_addresses = mysqlTable("porteight_po_addresses", {
	id: int().autoincrement().notNull(),
	address_id: int().notNull(),
	po_id: int().notNull(),
	lead: float(),
	chainage: varchar({ length: 255 }),
	contact_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("address_id_idx").on(table.address_id),
	index("contact_id_idx").on(table.contact_id),
	index("po_id_idx").on(table.po_id),
	primaryKey({ columns: [table.id], name: "porteight_po_addresses_id"}),
]);

export const porteight_po_attachments = mysqlTable("porteight_po_attachments", {
	id: int().autoincrement().notNull(),
	po_id: int().notNull(),
	attachment_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_id_idx").on(table.attachment_id),
	index("po_id_idx").on(table.po_id),
	primaryKey({ columns: [table.id], name: "porteight_po_attachments_id"}),
]);

export const porteight_po_boq = mysqlTable("porteight_po_boq", {
	id: int().autoincrement().notNull(),
	material_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_po_boq_id"}),
]);

export const porteight_po_boq_activities = mysqlTable("porteight_po_boq_activities", {
	id: int().autoincrement().notNull(),
	boq_id: int(),
	boq_truck_type_id: int(),
	name: varchar({ length: 255 }).notNull(),
	has_slab: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }),
	gst: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("boq_id_idx").on(table.boq_id),
	index("boq_truck_type_id_idx").on(table.boq_truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_po_boq_activities_id"}),
]);

export const porteight_po_boq_activities_slabs = mysqlTable("porteight_po_boq_activities_slabs", {
	id: int().autoincrement().notNull(),
	activity_id: int().notNull(),
	slab_min_value: int().notNull(),
	slab_max_value: int().notNull(),
	boq_rate: double({ precision: 10, scale: 2 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("activity_id_idx").on(table.activity_id),
	primaryKey({ columns: [table.id], name: "porteight_po_boq_activities_slabs_id"}),
]);

export const porteight_po_boq_truck_types = mysqlTable("porteight_po_boq_truck_types", {
	id: int().autoincrement().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_po_boq_truck_types_id"}),
]);

export const porteight_po_materials = mysqlTable("porteight_po_materials", {
	id: int().autoincrement().notNull(),
	po_id: int().notNull(),
	material_id: int().notNull(),
	quantity: float(),
	uom: varchar({ length: 255 }),
	rate: float(),
	gst_percentage: int(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	index("po_id_idx").on(table.po_id),
	index("uom_idx").on(table.uom),
	primaryKey({ columns: [table.id], name: "porteight_po_materials_id"}),
	unique("porteight_po_materials_po_id_material_id_unique").on(table.po_id, table.material_id),
]);

export const porteight_po_truck_type_rates = mysqlTable("porteight_po_truck_type_rates", {
	id: int().autoincrement().notNull(),
	po_truck_type_id: int().notNull(),
	rate: float(),
	gst_percentage: int(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("po_truck_type_id_idx").on(table.po_truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_po_truck_type_rates_id"}),
]);

export const porteight_po_truck_types = mysqlTable("porteight_po_truck_types", {
	id: int().autoincrement().notNull(),
	po_id: int().notNull(),
	truck_type_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("po_id_idx").on(table.po_id),
	index("truck_type_id_idx").on(table.truck_type_id),
	primaryKey({ columns: [table.id], name: "porteight_po_truck_types_id"}),
	unique("porteight_po_truck_types_po_id_truck_type_id_unique").on(table.po_id, table.truck_type_id),
]);

export const porteight_self_po_external_user = mysqlTable("porteight_self_po_external_user", {
	id: int().autoincrement().notNull(),
	org_name: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	mobile: varchar({ length: 10 }),
	email: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_self_po_external_user_id"}),
]);

export const porteight_session = mysqlTable("porteight_session", {
	session_token: varchar({ length: 255 }).notNull(),
	user_id: varchar({ length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => [
	index("user_id_idx").on(table.user_id),
	primaryKey({ columns: [table.session_token], name: "porteight_session_session_token"}),
]);

export const porteight_sites = mysqlTable("porteight_sites", {
	id: int().autoincrement().notNull(),
	organization_id: int().notNull(),
	name: varchar({ length: 255 }).notNull(),
	address_id: int().notNull(),
	gstin: varchar({ length: 15 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("address_id_idx").on(table.address_id),
	index("gstin_idx").on(table.gstin),
	index("name_idx").on(table.name),
	index("organization_id_idx").on(table.organization_id),
	primaryKey({ columns: [table.id], name: "porteight_sites_id"}),
]);

export const porteight_sites_po = mysqlTable("porteight_sites_po", {
	id: int().autoincrement().notNull(),
	site_id: int().notNull(),
	po_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("po_id_idx").on(table.po_id),
	index("site_id_idx").on(table.site_id),
	primaryKey({ columns: [table.id], name: "porteight_sites_po_id"}),
]);

export const porteight_sites_truck = mysqlTable("porteight_sites_truck", {
	id: int().autoincrement().notNull(),
	site_id: int().notNull(),
	truck_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("site_id_idx").on(table.site_id),
	index("truck_id_idx").on(table.truck_id),
	primaryKey({ columns: [table.id], name: "porteight_sites_truck_id"}),
]);

export const porteight_subscription = mysqlTable("porteight_subscription", {
	id: int().autoincrement().notNull(),
	billingId: int().notNull(),
	organizationId: int().notNull(),
	status: mysqlEnum(['active','inactive']).notNull(),
	startDate: timestamp({ mode: 'string' }).notNull(),
	endDate: timestamp({ mode: 'string' }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("billing_id_idx").on(table.billingId),
	index("organization_id_idx").on(table.organizationId),
	index("status_idx").on(table.status),
	primaryKey({ columns: [table.id], name: "porteight_subscription_id"}),
]);

export const porteight_trip_materials = mysqlTable("porteight_trip_materials", {
	id: int().autoincrement().notNull(),
	trip_id: int().notNull(),
	material_id: int().notNull(),
	quantity_scheduled: float(),
	quantity_delivered: float(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	index("trip_id_idx").on(table.trip_id),
	primaryKey({ columns: [table.id], name: "porteight_trip_materials_id"}),
]);

export const porteight_trips = mysqlTable("porteight_trips", {
	id: int().autoincrement().notNull(),
	trip_no: varchar({ length: 255 }).notNull(),
	po_id: int().notNull(),
	pickup_address_id: int(),
	drop_address_id: int().notNull(),
	lead: float(),
	chainage: varchar({ length: 255 }),
	scheduled_date: timestamp({ mode: 'string' }).notNull(),
	end_trip_date: timestamp({ mode: 'string' }),
	supervisor: varchar({ length: 255 }),
	status: mysqlEnum(['scheduled','started','stopped','completed']).default('scheduled'),
	truck_id: int(),
	driver_id: int(),
	pickup_contact_id: int(),
	drop_contact_id: int().notNull(),
	description: varchar({ length: 1024 }),
	challan_no: varchar({ length: 255 }),
	diesel_amount: double({ precision: 10, scale: 2 }),
	diesel_quantity: double({ precision: 10, scale: 2 }),
	weighbridge_slip_no: varchar({ length: 255 }),
	unloading_client: varchar({ length: 255 }),
	truck_type_id: int(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	diesel_date: timestamp({ mode: 'string' }),
	pump_name: varchar({ length: 255 }),
},
(table) => [
	index("created_at_idx").on(table.created_at),
	index("driver_id_idx").on(table.driver_id),
	index("drop_address_id_idx").on(table.drop_address_id),
	index("drop_contact_id_idx").on(table.drop_contact_id),
	index("pickup_address_id_idx").on(table.pickup_address_id),
	index("pickup_contact_id_idx").on(table.pickup_contact_id),
	index("po_id_idx").on(table.po_id),
	index("po_id_status_idx").on(table.po_id, table.status),
	index("scheduled_date_idx").on(table.scheduled_date),
	index("status_idx").on(table.status),
	index("trip_no_idx").on(table.trip_no),
	index("truck_id_idx").on(table.truck_id),
	primaryKey({ columns: [table.id], name: "porteight_trips_id"}),
]);

export const porteight_trips_attachments = mysqlTable("porteight_trips_attachments", {
	id: int().autoincrement().notNull(),
	trip_id: int(),
	attachment_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("attachment_id_idx").on(table.attachment_id),
	index("trip_id_idx").on(table.trip_id),
	primaryKey({ columns: [table.id], name: "porteight_trips_attachments_id"}),
]);

export const porteight_truck_types = mysqlTable("porteight_truck_types", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "porteight_truck_types_id"}),
]);

export const porteight_trucks = mysqlTable("porteight_trucks", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	truck_no: varchar({ length: 15 }).notNull(),
	organization_id: int().notNull(),
	type: varchar({ length: 255 }).notNull(),
	gps_service: varchar({ length: 255 }).notNull(),
	chassis_number: varchar({ length: 255 }),
	fitness_upto: varchar({ length: 255 }),
	insurance_validity: varchar({ length: 255 }),
	manufacturer: varchar({ length: 255 }),
	permit_type: varchar({ length: 255 }),
	permit_issue_date: varchar({ length: 255 }),
	permitValidity: varchar({ length: 255 }),
	puc_validity: varchar({ length: 255 }),
	status: mysqlEnum(['running','stopped','idle']).default('idle'),
	isDeleted: int().default(0),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	fastag_bank_id: int(),
	truck_owner: varchar({ length: 255 }),
	truck_owner_contact: varchar({ length: 255 }),
	customer_name: varchar({ length: 255 }),
},
(table) => [
	index("fastag_bank_idx").on(table.fastag_bank_id),
	index("is_deleted_idx").on(table.isDeleted),
	index("organization_idx").on(table.organization_id),
	index("status_idx").on(table.status),
	index("truck_no_idx").on(table.truck_no),
	index("type_idx").on(table.type),
	primaryKey({ columns: [table.id], name: "porteight_trucks_id"}),
	unique("truck_unique").on(table.truck_no, table.organization_id),
]);

export const porteight_uom = mysqlTable("porteight_uom", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
	material_id: int().notNull(),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
},
(table) => [
	index("material_id_idx").on(table.material_id),
	primaryKey({ columns: [table.id], name: "porteight_uom_id"}),
]);

export const porteight_user = mysqlTable("porteight_user", {
	id: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	mobile_no: varchar({ length: 10 }).notNull(),
	verified: int().default(0).notNull(),
	is_deleted: int().default(0).notNull(),
	password: varchar({ length: 255 }).notNull(),
	role: mysqlEnum(['supplier','transporter']).notNull(),
	onboarding_completed: int().default(0).notNull(),
	background_verified: int().default(1).notNull(),
	account_type: mysqlEnum(['personal','business']),
	image: varchar({ length: 255 }),
	organization_id: int(),
	tb_token: varchar({ length: 255 }),
	created_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	updated_at: timestamp({ mode: 'string' }).default(sql`(now())`).notNull(),
	show_fastag: int().default(0).notNull(),
},
(table) => [
	index("email_idx").on(table.email),
	index("is_deleted_idx").on(table.is_deleted),
	index("mobile_no_idx").on(table.mobile_no),
	index("onboarding_status_idx").on(table.is_deleted, table.onboarding_completed, table.background_verified),
	index("organization_id_idx").on(table.organization_id),
	index("role_idx").on(table.role),
	index("show_fastag_idx").on(table.show_fastag),
	primaryKey({ columns: [table.id], name: "porteight_user_id"}),
	unique("porteight_user_email_unique").on(table.email),
	unique("porteight_user_mobile_no_unique").on(table.mobile_no),
]);

export const porteight_verificationToken = mysqlTable("porteight_verificationToken", {
	identifier: varchar({ length: 255 }).notNull(),
	token: varchar({ length: 255 }).notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "porteight_verificationToken_identifier_token"}),
]);
