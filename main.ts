import { transformCSVString } from "./transformer.ts";

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

    if (!file) {
      return new Response("Please provide a file", { status: 400 });
    }

    if (file instanceof File) {
      const fileContents = await file.text();
      try {
        const result = transformCSVString(fileContents);
        return new Response(result, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=transformed.csv",
          },
        });
      } catch (error) {
        return new Response(error.message, { status: 500 });
      }
    }
  }

  return new Response("Not found", { status: 404 });
};

Deno.serve({ port }, handler);
