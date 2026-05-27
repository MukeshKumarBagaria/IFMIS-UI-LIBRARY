import type { MenuNode } from "./SidebarMenu";

/**
 * A single flattened search hit.
 *
 *   - `node`   — the matching **leaf** menu item (no children).
 *   - `path`   — labels of the ancestors that lead to this leaf, in
 *                top-down order. Use this to render a breadcrumb like
 *                `HRMS / Pay Related`.
 *   - `idPath` — ancestor ids, in the same order. Useful when you
 *                need to expand a tree programmatically.
 */
export interface MenuSearchResult {
  node: MenuNode;
  path: string[];
  idPath: string[];
}

/**
 * Walk a menu tree and return every leaf whose label matches `query`,
 * or whose ancestor matches (so typing the section name surfaces every
 * leaf inside it). Case-insensitive substring match — sufficient for
 * IFMIS menus where labels are short and well-known.
 *
 * The result is a flat list, not a filtered tree, because the Sidebar
 * renders matches inline as a search-results view rather than trying
 * to fold matches back into the cascading popover structure. Flat
 * results with breadcrumbs is the canonical UX for app-shell search
 * (VS Code Command Palette, Linear, Notion).
 *
 * @example
 *   const hits = searchMenuTree(MENU, "salary");
 *   //  [{ node: { id: "hrms.pay.salary", label: "Salary" },
 *   //     path: ["HRMS", "Pay Related"],
 *   //     idPath: ["hrms", "hrms.pay"] }]
 *
 * @example Match a parent
 *   const hits = searchMenuTree(MENU, "pay");
 *   //  Returns Salary, Bonus, Arrears — every leaf under "Pay Related"
 *   //  because the parent label matched.
 */
export function searchMenuTree(
  items: MenuNode[],
  query: string,
): MenuSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: MenuSearchResult[] = [];

  const walk = (
    nodes: MenuNode[],
    pathLabels: string[],
    pathIds: string[],
    ancestorMatched: boolean,
  ): void => {
    for (const node of nodes) {
      const selfMatches = node.label.toLowerCase().includes(q);
      const hasChildren = !!node.children?.length;

      if (hasChildren) {
        walk(
          node.children!,
          [...pathLabels, node.label],
          [...pathIds, node.id],
          ancestorMatched || selfMatches,
        );
      } else if (ancestorMatched || selfMatches) {
        results.push({ node, path: pathLabels, idPath: pathIds });
      }
    }
  };

  walk(items, [], [], false);
  return results;
}
