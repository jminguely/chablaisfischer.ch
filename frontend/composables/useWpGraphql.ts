import fetch from "cross-fetch";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

export function useWpGraphql() {
  const config = useRuntimeConfig();
  const endpoint = config.public.wpGraphqlEndpoint;

  async function query<T>(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<T> {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors) {
      throw new Error(json.errors.map((e) => e.message).join("\n"));
    }
    if (!json.data) throw new Error("No data returned");
    return json.data;
  }

  return { query };
}
