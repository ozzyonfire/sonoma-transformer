import { transformCSVString, transformRawData } from "./transformer.ts";

const port = 8080;

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);

  if (pathname === "/") {
    const index = await Deno.readTextFile("./views/index.html");
    return new Response(index, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (pathname === "/transform") {
    const formData = await req.formData();
    const file = formData.get("file");
    const customerLookup = formData.get("customerLookup") as string;

    console.log("customerLookup", customerLookup);

    if (!file) {
      return new Response("Please provide a file", { status: 400 });
    }

    if (file instanceof File) {
      const fileContents = await file.text();
      try {
        const result = transformCSVString(fileContents, customerLookup || "");
        return new Response(result, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=transformed.csv",
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          return new Response(error.message, { status: 500 });
        }
        return new Response("Internal server error", { status: 500 });
      }
    }
  }

  if (pathname === "/preprocessor") {
    // Add CORS headers for preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // body contains a json object with the following properties:
    // data: Record<string, string>[]

    const body = await req.json();
    const data = body.data;

    const result = transformRawData(data);

    const responseBody = {
      data: result,
      autoMap: true,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  return new Response("Not found", { status: 404 });
};

if (import.meta.main) {
  console.log("pid", Deno.pid);
  Deno.serve({ port }, handler);
}
