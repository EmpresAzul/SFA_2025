import React from "react";
import { menuItems } from "./menuItems";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarNavigationProps {
  collapsed: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  collapsed,
  expandedItems,
  onToggleExpanded,
}) => {
  return (
    <nav className="flex-1 p-3 overflow-y-auto">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            expandedItems={expandedItems}
            onToggleExpanded={onToggleExpanded}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
