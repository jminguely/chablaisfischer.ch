import type { WpMenuItem } from "@/types/wp";
import { useWpGraphql } from "./useWpGraphql";

interface MenuDataQuery {
  menuItems: {
    nodes: { id: string; label: string; url: string }[];
  };
}

const NAV_QUERY = `
  query PrimaryMenu($first: Int = 20) {
    menuItems(where: {location: PRIMARYNAV, parentDatabaseId: 0}, first: $first) {
      nodes { id label url }
    }
  }
`;

export async function useNavigation(): Promise<WpMenuItem[]> {
  const { query } = useWpGraphql();
  const data = await query<MenuDataQuery>(NAV_QUERY, { first: 20 });
  return data.menuItems.nodes.map((i) => ({
    id: i.id,
    label: i.label,
    path: new URL(i.url).pathname || "/",
  }));
}
