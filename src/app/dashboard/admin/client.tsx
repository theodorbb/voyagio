"use client";

import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Activity,
  CalendarDays,
  DollarSign,
  MessageSquare,
  Star,
  MapPin,
  Shield,
  TrendingUp,
  Heart,
  BarChart3,
  Percent,
  UserCheck,
  UserPlus,
  ShoppingBag,
  Layers,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  MiniBarChart,
  DonutChart,
  RankingList,
  AnalyticsPanel,
  StatusBar,
  KpiMini,
  FeedItem,
} from "@/components/admin/analytics-components";

// ─── Types ──────────────────────────────────
interface KPIs {
  totalUsers: number;
  totalTourists: number;
  totalOperators: number;
  totalAdmins: number;
  totalDestinations: number;
  totalActivities: number;
  activeActivities: number;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalReviews: number;
  avgRating: number;
  completedRevenue: number;
  confirmedRevenue: number;
  totalTrips: number;
  totalFavorites: number;
  utilization: number;
  totalSlots: number;
}

interface DestinationStat {
  id: string;
  name: string;
  activityCount: number;
  totalBookings: number;
  revenue: number;
  participants: number;
  avgRating: number;
}

interface CategoryStat {
  category: string;
  activityCount: number;
  avgRating: number;
  bookings: number;
  revenue: number;
}

interface TopActivity {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  destination: string;
  operator: string;
  bookingCount: number;
  revenue: number;
}

interface OperatorStat {
  id: string;
  name: string;
  email: string;
  totalActivities: number;
  activeActivities: number;
  totalBookings: number;
  revenue: number;
  guests: number;
  avgRating: number;
  totalReviews: number;
}

interface RecentBooking {
  id: string;
  status: string;
  totalPrice: number;
  participants: number;
  createdAt: string;
  activity: { title: string };
  user: { name: string };
}

interface RecentReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
  activity: { title: string };
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminData {
  kpis: KPIs;
  destinationStats: DestinationStat[];
  categoryStats: CategoryStat[];
  topActivities: TopActivity[];
  operatorStats: OperatorStat[];
  recentBookings: RecentBooking[];
  recentReviews: RecentReview[];
  recentUsers: RecentUser[];
}

interface AdminDashboardClientProps {
  user: { name: string };
  data: AdminData;
}

const roleColors: Record<string, string> = {
  TOURIST: "bg-primary-light/10 text-primary-light border-primary-light/20",
  OPERATOR: "bg-accent/10 text-accent border-accent/20",
  ADMIN: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AdminDashboardClient({ user, data }: AdminDashboardClientProps) {
  const { kpis } = data;
  const pendingBookings = kpis.totalBookings - kpis.confirmedBookings - kpis.completedBookings - kpis.cancelledBookings;

  return (
    <div className="min-h-screen pb-16 pt-24">
      <div className="section-container">
        {/* ─── Header ───────────────────────── */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-medium uppercase tracking-wider text-violet-400">
              Admin Analytics
            </p>
          </div>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
            Platform Overview
          </h1>
          <p className="mt-2 text-white/50">
            Welcome, {user.name}. Here&apos;s Voyagio at a glance.
          </p>
        </motion.div>

        {/* ─── Primary KPIs ─────────────────── */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={kpis.totalUsers}
            subtitle={`${kpis.totalTourists} tourists · ${kpis.totalOperators} operators`}
            icon={Users}
            color="primary"
          />
          <StatCard
            label="Activities"
            value={kpis.totalActivities}
            subtitle={`${kpis.activeActivities} active · ${kpis.totalDestinations} destinations`}
            icon={Activity}
            color="accent"
          />
          <StatCard
            label="Revenue"
            value={`€${(kpis.completedRevenue + kpis.confirmedRevenue).toLocaleString()}`}
            subtitle={`€${kpis.completedRevenue.toLocaleString()} completed`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Bookings"
            value={kpis.totalBookings}
            subtitle={`${kpis.completedBookings} completed · ${kpis.confirmedBookings} confirmed`}
            icon={CalendarDays}
            color="purple"
          />
        </motion.div>

        {/* ─── Secondary KPIs ───────────────── */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <KpiMini label="Avg Rating" value={kpis.avgRating || "—"} icon={Star} color="text-amber-400" bgColor="bg-amber-500/10" />
          <KpiMini label="Reviews" value={kpis.totalReviews} icon={MessageSquare} color="text-violet-400" bgColor="bg-violet-500/10" />
          <KpiMini label="Trips Built" value={kpis.totalTrips} icon={MapPin} color="text-emerald-400" bgColor="bg-emerald-500/10" />
          <KpiMini label="Favorites" value={kpis.totalFavorites} icon={Heart} color="text-rose-400" bgColor="bg-rose-500/10" />
          <KpiMini label="Utilization" value={`${kpis.utilization}%`} icon={Percent} color="text-sky-400" bgColor="bg-sky-500/10" />
          <KpiMini label="Time Slots" value={kpis.totalSlots} icon={Layers} color="text-orange-400" bgColor="bg-orange-500/10" />
        </motion.div>

        {/* ─── Booking Status Distribution ──── */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-8">
          <AnalyticsPanel title="Booking Status Distribution" subtitle="All-time booking breakdown" icon={BarChart3}>
            <StatusBar
              segments={[
                { label: "Completed", value: kpis.completedBookings, color: "#34d399" },
                { label: "Confirmed", value: kpis.confirmedBookings, color: "#38bdf8" },
                { label: "Pending", value: Math.max(0, pendingBookings), color: "#fbbf24" },
                { label: "Cancelled", value: kpis.cancelledBookings, color: "#f87171" },
              ]}
            />
          </AnalyticsPanel>
        </motion.div>

        {/* ─── Main Analytics Grid ──────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Destination Performance */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Destination Performance" subtitle="Ranked by revenue" icon={Globe}>
              <RankingList
                items={data.destinationStats.slice(0, 6).map((d) => {
                  const maxRev = data.destinationStats[0]?.revenue || 1;
                  return {
                    label: d.name,
                    sublabel: `${d.activityCount} activities · ${d.participants} guests`,
                    value: `€${d.revenue.toLocaleString()}`,
                    sublabelRight: d.avgRating > 0 ? `★ ${d.avgRating}` : undefined,
                    barPercent: (d.revenue / maxRev) * 100,
                    barColor: "bg-primary-light",
                  };
                })}
              />
            </AnalyticsPanel>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Category Breakdown" subtitle="Activity types & bookings" icon={Layers}>
              {data.categoryStats.length > 0 ? (
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <DonutChart
                    segments={data.categoryStats.map((c, i) => ({
                      label: c.category.replace(/_/g, " "),
                      value: c.activityCount,
                      color: ["#F4845F", "#5FA8D3", "#34d399", "#a78bfa", "#fbbf24", "#f472b6", "#38bdf8", "#fb923c"][i % 8],
                    }))}
                    centerValue={kpis.totalActivities}
                    centerLabel="activities"
                  />
                  <div className="flex-1 w-full">
                    <MiniBarChart
                      data={data.categoryStats.map((c, i) => ({
                        label: c.category.replace(/_/g, " "),
                        value: c.bookings,
                        color: ["bg-accent", "bg-primary-light", "bg-emerald-400", "bg-violet-400", "bg-amber-400", "bg-pink-400", "bg-sky-400", "bg-orange-400"][i % 8],
                      }))}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/20">No category data yet</p>
              )}
            </AnalyticsPanel>
          </motion.div>

          {/* Top Activities by Bookings */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Top Activities" subtitle="By booking volume" icon={TrendingUp}>
              <RankingList
                items={data.topActivities.slice(0, 6).map((a) => {
                  const maxBk = data.topActivities[0]?.bookingCount || 1;
                  return {
                    label: a.title,
                    sublabel: `${a.destination} · by ${a.operator}`,
                    value: `${a.bookingCount} bk`,
                    sublabelRight: `€${a.revenue.toLocaleString()}`,
                    barPercent: (a.bookingCount / maxBk) * 100,
                    barColor: "bg-accent",
                  };
                })}
              />
            </AnalyticsPanel>
          </motion.div>

          {/* Operator Performance */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Operator Performance" subtitle="Ranked by revenue" icon={UserCheck}>
              {data.operatorStats.length > 0 ? (
                <RankingList
                  items={data.operatorStats.slice(0, 6).map((op) => {
                    const maxRev = data.operatorStats[0]?.revenue || 1;
                    return {
                      label: op.name,
                      sublabel: `${op.totalActivities} activities · ${op.guests} guests · ★ ${op.avgRating}`,
                      value: `€${op.revenue.toLocaleString()}`,
                      sublabelRight: `${op.totalBookings} bookings`,
                      barPercent: (op.revenue / maxRev) * 100,
                      barColor: "bg-emerald-400",
                    };
                  })}
                />
              ) : (
                <p className="text-sm text-white/20">No operator data yet</p>
              )}
            </AnalyticsPanel>
          </motion.div>
        </div>

        {/* ─── Activity Feed Row ────────────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Recent Bookings */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Recent Bookings" subtitle="Latest platform bookings" icon={ShoppingBag}>
              <div className="space-y-1 max-h-[340px] overflow-y-auto scrollbar-thin">
                {data.recentBookings.map((b) => (
                  <FeedItem
                    key={b.id}
                    icon={CalendarDays}
                    iconColor={
                      b.status === "COMPLETED" ? "text-emerald-400" :
                      b.status === "CONFIRMED" ? "text-sky-400" :
                      b.status === "CANCELLED" ? "text-red-400" :
                      "text-amber-400"
                    }
                    title={`${b.user.name} → ${b.activity.title}`}
                    subtitle={`${b.participants} guest${b.participants === 1 ? "" : "s"} · €${b.totalPrice}`}
                    time={timeAgo(b.createdAt)}
                    badge={b.status.toLowerCase()}
                    badgeColor={statusColors[b.status] || "text-white/40"}
                  />
                ))}
                {data.recentBookings.length === 0 && <p className="text-xs text-white/20 py-4 text-center">No bookings yet</p>}
              </div>
            </AnalyticsPanel>
          </motion.div>

          {/* Recent Reviews */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="Recent Reviews" subtitle="Latest user feedback" icon={MessageSquare}>
              <div className="space-y-1 max-h-[340px] overflow-y-auto scrollbar-thin">
                {data.recentReviews.map((r) => (
                  <FeedItem
                    key={r.id}
                    icon={Star}
                    iconColor="text-amber-400"
                    title={`${r.user.name} rated ${r.activity.title}`}
                    subtitle={r.comment ? (r.comment.length > 60 ? r.comment.slice(0, 60) + "…" : r.comment) : `${r.rating}/5 stars`}
                    time={timeAgo(r.createdAt)}
                    badge={`${r.rating}★`}
                    badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/20"
                  />
                ))}
                {data.recentReviews.length === 0 && <p className="text-xs text-white/20 py-4 text-center">No reviews yet</p>}
              </div>
            </AnalyticsPanel>
          </motion.div>

          {/* Recent Users */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsPanel title="New Users" subtitle="Latest registrations" icon={UserPlus}>
              <div className="space-y-1 max-h-[340px] overflow-y-auto scrollbar-thin">
                {data.recentUsers.map((u) => (
                  <FeedItem
                    key={u.id}
                    icon={Users}
                    iconColor={
                      u.role === "OPERATOR" ? "text-accent" :
                      u.role === "ADMIN" ? "text-violet-400" :
                      "text-primary-light"
                    }
                    title={u.name}
                    subtitle={u.email}
                    time={timeAgo(u.createdAt)}
                    badge={u.role.toLowerCase()}
                    badgeColor={roleColors[u.role] || "text-white/40"}
                  />
                ))}
                {data.recentUsers.length === 0 && <p className="text-xs text-white/20 py-4 text-center">No users yet</p>}
              </div>
            </AnalyticsPanel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
