import db from "../db.server";

// Handle CORS preflight
export const loader = async () => {
  return new Response(null, { headers: corsHeaders() });
};

// Handle POST - return all stringsGroups in Gadget-compatible format
export const action = async ({ request }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }

  const stringsGroups = await db.stringsGroup.findMany({
    orderBy: { createdAt: "asc" },
  });

  const payload = {
    data: {
      stringsGroups: {
        edges: stringsGroups.map((group) => ({
          node: {
            id: String(group.id),
            groupName: group.groupName,
            tennisMains: group.tennisMains,
            tennisCrosses: group.tennisCrosses,
            productId: group.productId,
            stencilText: group.stencilText,
          },
        })),
      },
    },
  };

  return new Response(JSON.stringify(payload), {
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
