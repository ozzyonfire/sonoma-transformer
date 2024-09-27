import { DataItem, parse, stringify } from "@std/csv";
import { TransformedData } from "./shopify-order.ts";

export function transformCSVString(
  inputString: string,
  customerLookup: string
): string {
  // const csv = await Deno.readTextFile(filePath);

  // the CSV order template contains a header row, and each order is on a new row - the line items are split into columns
  // We need to transform this data into a more structured format for Order's Up! to use.
  const data = parse(inputString, {
    skipFirstRow: true,
    trimLeadingSpace: true,
  });

  // this is the newly transformed data from the CSV order template
  const transformedOrderSheet: TransformedData[] = [];

  for (const row of data) {
    const id = row["Customer Order ID"];
    const orderDate = row["Customer Order Date"];

    // shipping address fields
    const shipToFirstName = row["Ship To First Name"];
    const shipToLastName = row["Ship To Last Name"];
    const shipToCompany = row["Ship To Company"];
    const shipToAddress1 = row["Ship To Address Line 1"];
    const shipToAddress2 = row["Ship To Address Line 2"];
    const shipToCity = row["Ship To City"];
    const shipToState = row["Ship To State"];
    const shipToZip = row["Ship To Zip"];
    const shipToCountry = row["Ship To Country"];
    const shipToPhone = row["Ship To Phone"];
    const shipToEmail = row["Ship To Email"];

    // shipping method fields
    const shippingMethod = row["Shipping Priority"];
    const shippingInstructions = row["Shipping Instructions"];

    // extra properties
    const giftMessage = row["Gift Message"];

    // add the initial row to the order
    transformedOrderSheet.push({
      id,
      customer_query: customerLookup,
      processed_at: orderDate,
      shipping_first_name: shipToFirstName,
      shipping_last_name: shipToLastName,
      shipping_company: shipToCompany,
      shipping_address_1: shipToAddress1,
      shipping_address_2: shipToAddress2,
      shipping_city: shipToCity,
      shipping_state_province: shipToState,
      shipping_zip_postal_code: shipToZip,
      shipping_country: shipToCountry || "US",
      shipping_phone: shipToPhone,
      shipping_line_title: shippingMethod,
      note_attributes: `Shipping Instructions:${shippingInstructions}\nGift Message:${giftMessage}\nShipping Email:${shipToEmail}`,
    });

    let totalQuantity = 0;

    // line item fields
    for (let i = 1; i <= 24; i++) {
      const sku = row[`SKU ${i}`];
      if (!sku) {
        continue;
      }

      const quantity = row[`Quantity ${i}`];
      const description = row[`Description ${i}`];
      const label = row[`Label Name ${i}`];
      const vintage = row[`Vintage ${i}`];
      const bottleSize = row[`Bottle Size ${i}`];

      const propertiesArray = [];
      if (label) {
        propertiesArray.push(`Label Name:${label}`);
      }
      if (vintage) {
        propertiesArray.push(`Vintage:${vintage}`);
      }
      if (bottleSize) {
        propertiesArray.push(`Bottle Size:${bottleSize}`);
      }

      const propertyString = propertiesArray.join("\n");
      transformedOrderSheet.push({
        id,
        sku,
        quantity,
        item_title: description,
        properties: propertyString,
      });

      totalQuantity += parseInt(quantity);
    }

    // the quantity is the total number of bottles in the order
    // we need to map this to the correct SKU
    // the max number of bottles in a case is 12, so we need to break the total quantity into cases

    const cases = Math.floor(totalQuantity / 12);
    const looseBottles = totalQuantity % 12;

    if (cases > 0) {
      transformedOrderSheet.push({
        id,
        sku: `WF${12}P`,
        quantity: cases.toString(),
        item_title: `Case of ${12} bottles`,
        properties: "",
      });
    }

    if (looseBottles > 0) {
      transformedOrderSheet.push({
        id,
        sku: `WF${looseBottles}P`,
        quantity: looseBottles.toString(),
        item_title: `Shipping for ${looseBottles} bottle${
          looseBottles > 1 ? "s" : ""
        }`,
        properties: "",
      });
    }
  }

  const columns: (keyof TransformedData)[] = [
    "id",
    "customer_query",
    "processed_at",
    "shipping_first_name",
    "shipping_last_name",
    "shipping_address_1",
    "shipping_address_2",
    "shipping_city",
    "shipping_state_province",
    "shipping_zip_postal_code",
    "shipping_country",
    "shipping_phone",
    "shipping_line_title",
    "note_attributes",
    "sku",
    "quantity",
    "item_title",
    "properties",
  ];

  return stringify(transformedOrderSheet as DataItem[], {
    headers: true,
    columns,
  });
}
