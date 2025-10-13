import type { WpMenuItem } from "@/types/wp";
import { useWpGraphql } from "./useWpGraphql";

interface MenuDataQuery {
  menuItems: {
    nodes: { id: string; label: string; url: string }[];
  };
}

import NAV_QUERY from "@/graphql/nav.gql?raw";

export async function useNavigation(): Promise<WpMenuItem[]> {
  const { query } = useWpGraphql();
  const data = await query<MenuDataQuery>(NAV_QUERY, { first: 20 });
  return data.menuItems.nodes.map(
    (i: { id: string; label: string; url: string }) => ({
      id: i.id,
      label: i.label,
      path: new URL(i.url).pathname || "/",
    })
  );
}
