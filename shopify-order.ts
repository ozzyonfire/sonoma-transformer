export interface TransformedData {
  // base fields
  id?: string;
  buyer_accepts_marketing?: string;
  cancel_reason?: string;
  email?: string;
  financial_status?: string;
  fulfillment_status?: string;
  location_id?: string;
  merchant_of_record_app_id?: string;
  currency?: string;
  order_name?: string;
  note?: string;
  phone?: string;
  processed_at?: string;
  referring_site?: string;
  source_name?: string;
  source_identifier?: string;
  source_url?: string;
  tags?: string;
  taxes_included?: string;
  total_discount?: number;
  total_weight?: number;
  note_attributes?: string;
  subtotal_price?: string;
  total_price?: string;
  total_tax?: string;
  // processing_method?: string; // deprecated

  // customer fields
  customer_id?: string;
  customer_email?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_phone?: string;
  customer_sms_opt_in?: boolean;
  customer_tags?: string;
  customer_note?: string;
  customer_tax_exempt?: boolean;
  customer_query?: string;

  // line item fields
  sku?: string;
  barcode?: string;
  product_id?: string;
  product_handle?: string;
  variant_id?: string;
  quantity?: string;
  requires_shipping?: boolean;
  taxable?: string;
  price?: string;
  item_title?: string;
  gift_card?: boolean;
  properties?: string;

  // line item tax fields
  line_item_tax_line_title?: string;
  line_item_tax_line_price?: string;
  line_item_tax_line_rate?: string;

  // line item discount fields - this doesn't work!!!
  // line_item_discount_code_1?: string;
  // line_item_discount_amount_1?: number;
  // line_item_discount_type_1?: string;
  // line_item_discount_amount?: string;
  // discount_code_index?: string;

  // order discount fields
  discount_code?: string;
  discount_amount?: string;
  discount_type?: string;

  // shipping address fields
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_company?: string;
  shipping_country?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_latitude?: number;
  shipping_longitude?: number;
  shipping_phone?: string;
  shipping_state_province?: string;
  shipping_state_province_code?: string;
  shipping_zip_postal_code?: string;
  shipping_name?: string;
  shipping_country_code?: string;

  // billing address fields
  billing_address_1?: string;
  billing_address_2?: string;
  billing_city?: string;
  billing_company?: string;
  billing_country?: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_latitude?: string;
  billing_longitude?: string;
  billing_phone?: string;
  billing_state_province?: string;
  billing_state_province_code?: string;
  billing_zip_postal_code?: string;
  billing_name?: string;
  billing_country_code?: string;

  // shipping line fields
  shipping_line_code?: string;
  shipping_line_price?: number;
  shipping_line_title?: string;
  shipping_line_carrier_identifier?: string;
  shipping_line_source?: string;

  // order tax fields
  tax_line_title?: string;
  tax_line_price?: string;
  tax_line_rate?: string;

  // fulfillment fields
  fulfillment_location_id?: string;
  fulfillment_created_at?: string;
  fulfillment_service?: string;
  fulfillment_status_type?: string;
  fulfillment_tracking_number?: string;
  fulfillment_tracking_company?: string;
  fulfillment_tracking_url?: string;
  fulfillment_notify_customer?: boolean;

  // transaction fields
  transaction_amount?: number;
  transaction_authorization?: string;
  transaction_currency?: string;
  transaction_gateway?: string;
  transaction_kind?: "authorization" | "capture" | "sale" | "refund" | "void";
  transaction_source?: string;
  transaction_status?: "pending" | "success" | "failure" | "error";
  transaction_test?: boolean;
}

export interface RestAddressInput {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  country_code?: string;
  first_name?: string;
  last_name?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  province?: string;
  province_code?: string;
  zip?: string;
}

interface RestCustomerInput {
  id?: string | number;
  email?: string;
  email_marketing_consent?: boolean;
  first_name?: string;
  last_name?: string;
  note?: string;
  phone?: string;
  sms_marketing_consent?: boolean;
  tags?: string;
  tax_exempt?: boolean;
  default_address?: RestAddressInput;
}

interface RestDiscountCodeInput {
  code?: string;
  amount?: number;
  type?: "fixed_amount" | "percentage" | "shipping";
}

interface RestFulfillmentInput {
  created_at?: string;
  location_id?: number;
  // name?: string;
  notify_customer?: boolean;
  service?: string;
  // shipment_status?: 'label_printed' | 'label_purchased' | 'attempted_delivery' | 'ready_for_pickup' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failure';
  status?: "pending" | "open" | "success" | "failure" | "cancelled" | "error";
  // tracking_info?: { // not sure if this is correct
  // 	number?: string;
  // 	url?: string;
  // 	company?: string;
  // }
  tracking_company?: string;
  tracking_number?: string;
  tracking_url?: string;
}

export interface RestLineItemInput {
  fulfillment_service?: string;
  fulfillment_status?: "fulfilled" | "partial" | "null" | "unfulfilled";
  grams?: number;
  price?: number;
  product_id?: number;
  product_handle?: string;
  skip?: boolean;
  quantity?: number;
  requires_shipping?: boolean;
  sku?: string;
  barcode?: string;
  title?: string;
  variant_id?: number;
  variant_title?: string;
  vendor?: string;
  gift_card?: boolean;
  properties?: { [key: string]: string };
  taxable?: boolean;
  tax_lines?: RestTaxLineInput[];
  discount_allocations?: {
    amount?: number;
    discount_application_index?: number;
  }[];
}

export interface RestShippingLineInput {
  code?: string;
  price?: number;
  source?: string;
  title?: string;
  carrier_identifier?: string;

  // todo: add tax_lines, discounted_price
}

interface RestTaxLineInput {
  price?: number;
  rate?: number;
  title?: string;
}

// all fields on the object that aren't read-only
export interface RestOrderInput {
  identifier?: string;
  billing_address?: RestAddressInput;
  buyer_accepts_marketing?: boolean;
  cancel_reason?: "customer" | "fraud" | "inventory" | "other" | "declined";
  customer?: RestCustomerInput;
  customer_query?: string;
  discount_codes?: RestDiscountCodeInput[];
  email?: string;
  financial_status?:
    | "pending"
    | "authorized"
    | "partially_paid"
    | "paid"
    | "partially_refunded"
    | "refunded"
    | "voided";
  fulfillment_status?: "fulfilled" | "partial" | "null" | "unfulfilled";
  fulfillments?: RestFulfillmentInput[];
  line_items?: RestLineItemInput[];
  location_id?: number;
  merchant_of_record_app_id?: number;
  currency?: string;
  name?: string;
  note?: string;
  note_attributes?: {
    name?: string;
    value?: string;
  }[];
  phone?: string;
  presentment_currency?: string;
  processed_at?: string;
  // processing_method?: string; // deprecated
  referring_site?: string;
  shipping_address?: RestAddressInput;
  shipping_lines?: {
    code?: string;
    discounted_price?: number;
    price?: number;
    source?: string;
    title?: string;
    carrier_identifier?: string;
    tax_lines?: RestTaxLineInput[];
  }[];
  source_name?: string;
  source_identifier?: string;
  source_url?: string;
  subtotal_price?: number;
  tags?: string;
  tax_lines?: RestTaxLineInput[];
  taxes_included?: boolean;
  total_discounts?: number;
  total_line_items_price?: number;
  total_outstanding?: number;
  total_price?: number;
  total_tax?: number;
  total_weight?: number;
  transactions?: RestTransactionInput[];
  // options
  send_receipt?: boolean;
  send_fulfillment_receipt?: boolean;
  inventory_behaviour?:
    | "decrement_ignoring_policy"
    | "decrement_obeying_policy"
    | "bypass";
}

export interface RestTransactionInput {
  amount?: number;
  authorization?: string;
  currency?: string;
  gateway?: string;
  kind?: "authorization" | "capture" | "sale" | "void" | "refund";
  source?: string;
  status?: "pending" | "success" | "failure" | "error";
  test?: boolean;
  processed_at?: string;
}
