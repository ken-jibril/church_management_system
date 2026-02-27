/**
 * Dashboard Service
 * Aggregates data from multiple services to build dashboard stats.
 * Members and Events come from the real backend API.
 * Donations, Prayer Requests, Sermons, Groups come from service layer
 * (currently backed by mock data until those backend endpoints exist).
 */
import { getMembers } from "./membersService";
import { getEvents } from "./eventsService";
import { getDonations } from "./donationsService";
import { getPrayerRequests } from "./prayerRequestsService";
import { getSermons } from "./sermonsService";
import { getGroups } from "./groupsService";

export const getDashboardStats = async () => {
  const [members, events, donations, prayerRequests, sermons, groups] =
    await Promise.all([
      getMembers(),
      getEvents(),
      getDonations(),
      getPrayerRequests(),
      getSermons(),
      getGroups(),
    ]);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "active").length,
    totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    monthlyDonations: donations
      .filter((d) => d.date && d.date.startsWith(currentMonth))
      .reduce((sum, d) => sum + (d.amount || 0), 0),
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    activePrayerRequests: prayerRequests.filter((p) => p.status === "active")
      .length,
    totalSermons: sermons.length,
    totalGroups: groups.length,
    recentMembers: members.slice(0, 5),
    recentDonations: donations.slice(0, 5),
    upcomingEventsList: events
      .filter((e) => e.status === "upcoming")
      .slice(0, 3),
  };
};
