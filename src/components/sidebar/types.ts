
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  iconColor?: string;
  href?: string;
  children?: MenuItem[];
}
