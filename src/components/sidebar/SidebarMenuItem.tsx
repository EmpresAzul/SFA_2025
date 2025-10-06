import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "./types";

interface SidebarMenuItemProps {
  item: MenuItem;
  level?: number;
  collapsed: boolean;
  expandedItems: string[];
  onToggleExpanded: (itemId: string) => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  level = 0,
  collapsed,
  expandedItems,
  onToggleExpanded,
  isMobile = false,
  onMobileClose,
}) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  const isParentActive = (menuItem: MenuItem): boolean => {
    if (menuItem.href && isActive(menuItem.href)) return true;
    return (
      menuItem.children?.some((child) => child.href && isActive(child.href)) ||
      false
    );
  };

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const parentActive = isParentActive(item);

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => onToggleExpanded(item.id)}
          className={cn(
            "w-full flex items-center px-3 py-2 text-left rounded-lg transition-all duration-300 group backdrop-blur-md border border-white/10",
            parentActive
              ? "bg-gradient-to-br from-white/20 via-white/15 to-white/10 text-white shadow-lg border-white/20"
              : "text-white/80 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-md",
            collapsed && !isMobile && "justify-center px-2",
          )}
        >
          <item.icon
            className={cn(
              "flex-shrink-0",
              collapsed ? "w-4 h-4" : "w-4 h-4 mr-2",
              item.iconColor || "text-current",
            )}
          />
          {(!collapsed || isMobile) && (
            <>
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </>
          )}
        </button>

        {(!collapsed || isMobile) && isExpanded && (
          <div className="ml-3 mt-1 space-y-0.5 animate-fade-in">
            {item.children?.map((child) => (
              <SidebarMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                collapsed={collapsed}
                expandedItems={expandedItems}
                onToggleExpanded={onToggleExpanded}
                isMobile={isMobile}
                onMobileClose={onMobileClose}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.href) {
    return (
      <NavLink
        to={item.href}
        onClick={() => {
          if (isMobile && onMobileClose) {
            onMobileClose();
          }
        }}
        className={cn(
          "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group mb-1 backdrop-blur-md border border-white/10",
          level > 0 && "ml-3",
          isActive(item.href)
            ? "bg-gradient-to-br from-white/20 via-white/15 to-white/10 text-white shadow-lg border-white/20"
            : "text-white/80 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-md",
          collapsed && !isMobile && "justify-center px-2",
        )}
      >
        <item.icon
          className={cn(
            "flex-shrink-0",
            collapsed && !isMobile ? "w-4 h-4" : "w-4 h-4 mr-2",
            "text-current",
          )}
        />
        {(!collapsed || isMobile) && (
          <span className="font-medium text-sm">{item.label}</span>
        )}
      </NavLink>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 rounded-lg transition-all duration-300 group mb-1 backdrop-blur-md border border-white/10",
        level > 0 && "ml-3",
        "text-white/80 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-md",
        collapsed && !isMobile && "justify-center px-2",
      )}
    >
      <item.icon
        className={cn(
          "flex-shrink-0",
          collapsed && !isMobile ? "w-4 h-4" : "w-4 h-4 mr-2",
          "text-current",
        )}
      />
      {(!collapsed || isMobile) && <span className="font-medium text-sm">{item.label}</span>}
    </div>
  );
};

export default SidebarMenuItem;
