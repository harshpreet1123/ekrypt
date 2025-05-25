// types.ts
export interface Link {
  id: string;
  user_id: string;
  title: string | null;
  original_url: string;
  short_code: string;
  is_active: boolean;
  click_count: number;
  max_clicks: number | null;
  expires_at: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface Analytics {
  id: string;
  link_id: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  referrer: string | null;
  timestamp: string;
}

export interface Stats {
  totalClicks: number;
  activeLinks: number;
  expiredLinks: number;
}

export interface ChartData {
  name: string;
  value?: number;
  clicks?: number;
  color?: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  url: string;
  ip: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
}

export interface ClicksOverTime {
  date: string;
  clicks: number;
}

export type StatusType = "Active" | "Expired" | "Paused";