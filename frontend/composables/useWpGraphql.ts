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
    variables: Record<string, any> = {},
  ): Promise<T> {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      let json: GraphQLResponse<T>;
      try {
        json = (await res.json()) as GraphQLResponse<T>;
      } catch (parseError) {
        throw new Error(
          `Failed to parse GraphQL response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
        );
      }

      if (json.errors) {
        const errorMessages = json.errors.map((e) => e.message).join("\n");
        throw new Error(`GraphQL error: ${errorMessages}`);
      }

      if (!json.data) {
        throw new Error("No data returned from GraphQL query");
      }

      return json.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`GraphQL query failed: ${message}`);
      throw error;
    }
  }

  return { query };
}
