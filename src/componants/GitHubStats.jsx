import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ScrollFountain } from "@/components/ui/scroll-fountain-text";

const GitHubStats = () => {
  const [contributions, setContributions] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [yesterdayActivity, setYesterdayActivity] = useState({
    minutes: 0,
    seconds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  const colors = {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width < 380);
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (GITHUB_TOKEN) {
          try {
            const graphqlData = await fetchWithGraphQL();
            if (graphqlData) {
              setContributions(graphqlData.contributions);
              setTotalContributions(graphqlData.total);
              calculateYesterdayActivity(graphqlData.contributions);
              setLoading(false);
              return;
            }
          } catch (graphqlError) {
            console.log("GraphQL failed, trying next method...", graphqlError);
          }
        }

        try {
          const response = await fetch(
            "https://github-contributions-api.jogruber.de/v4/Dipankar-source?y=last"
          );
          const data = await response.json();
          if (data.contributions) {
            processContributionsData(data.contributions);
          } else {
            throw new Error("No contributions data");
          }
        } catch (contribError) {
          console.log("Contributions API failed, trying events API...");
          await fetchGitHubEvents();
        }
      } catch (err) {
        console.error("All methods failed:", err);
        setError("Failed to fetch GitHub data. Using demo data.");
        loadDemoData();
      }
    };

    fetchGitHubData();
  }, []);

  const getColor = (count) => {
    if (count === 0) return colors.level0;
    if (count < 10) return colors.level1;
    if (count < 20) return colors.level2;
    if (count < 30) return colors.level3;
    return colors.level4;
  };

  const fetchWithGraphQL = async () => {
    const query = `
      query {
        user(login: "Dipankar-source") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error(`GraphQL error: ${response.status}`);

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    const weeks =
      result.data.user.contributionsCollection.contributionCalendar.weeks;
    const total =
      result.data.user.contributionsCollection.contributionCalendar
        .totalContributions;
    const contributions = [];

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        contributions.push({
          date: new Date(day.date),
          count: day.contributionCount,
          color: getColor(day.contributionCount),
        });
      });
    });

    return { contributions, total };
  };

  const processContributionsData = (contributionsData) => {
    let total = 0;
    const contributions = [];

    contributionsData.forEach((day) => {
      total += day.count;
      contributions.push({
        date: new Date(day.date),
        count: day.count,
        color: getColor(day.count),
      });
    });

    setContributions(contributions);
    setTotalContributions(total);
    calculateYesterdayActivity(contributions);
    setLoading(false);
  };

  const fetchGitHubEvents = async () => {
    const headers = GITHUB_TOKEN
      ? { Authorization: `token ${GITHUB_TOKEN}` }
      : {};

    const response = await fetch(
      "https://api.github.com/users/Dipankar-source/events",
      { headers }
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const events = await response.json();
    if (events.message?.includes("API rate limit"))
      throw new Error("GitHub API rate limit exceeded");

    processEventsData(events);
  };

  const processEventsData = (events) => {
    const contributionsMap = {};
    let total = 0;

    events.forEach((event) => {
      const date = new Date(event.created_at).toDateString();
      contributionsMap[date] = (contributionsMap[date] || 0) + 1;
      total++;
    });

    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const contributions = [];
    for (
      let date = new Date(startDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const count = contributionsMap[date.toDateString()] || 0;
      contributions.push({ date: new Date(date), count, color: getColor(count) });
    }

    setContributions(contributions);
    setTotalContributions(total);
    calculateYesterdayActivity(contributions);
    setLoading(false);
  };

  const loadDemoData = () => {
    const demoData = generateDemoContributions();
    setContributions(demoData.contributions);
    setTotalContributions(demoData.total);
    calculateYesterdayActivity(demoData.contributions);
    setLoading(false);
  };

  const generateDemoContributions = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const contributions = [];
    let total = 2074;
    let remaining = total;

    for (
      let date = new Date(startDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseChance = isWeekend ? 0.2 : 0.4;
      let count = 0;
      if (Math.random() < baseChance && remaining > 0) {
        count = Math.floor(Math.random() * Math.min(8, remaining)) + 1;
        remaining -= count;
      }
      contributions.push({ date: new Date(date), count, color: getColor(count) });
    }

    if (remaining > 0) {
      for (let i = 0; i < remaining && i < contributions.length; i++) {
        const index = Math.floor(Math.random() * contributions.length);
        contributions[index].count += 1;
        contributions[index].color = getColor(contributions[index].count);
      }
    }

    return { contributions, total };
  };

  const calculateYesterdayActivity = (contribs) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const yesterdayContrib = contribs.find(
      (c) => c.date.toDateString() === yesterdayStr
    );

    if (yesterdayContrib && yesterdayContrib.count > 0) {
      const baseMinutes = 10 + yesterdayContrib.count * 3;
      setYesterdayActivity({
        minutes: Math.min(baseMinutes, 180),
        seconds: Math.floor(Math.random() * 60),
      });
    } else {
      setYesterdayActivity({ minutes: 0, seconds: 0 });
    }
  };

  const groupByWeek = () => {
    if (!contributions.length) return [];

    const weeks = [];
    let currentWeek = [];

    const firstDayOfWeek = contributions[0].date.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null);

    contributions.forEach((contribution) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(contribution);
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const getMonthLabels = () => {
    const weeksData = groupByWeek();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const months = [];
    let currentMonth = -1;

    weeksData.forEach((week, index) => {
      const firstValidDay = week.find((day) => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== currentMonth) {
          months.push({ month: monthNames[month], weekIndex: index });
          currentMonth = month;
        }
      }
    });

    return months.filter((m, i) => {
      if (i === 0) return true;
      return m.weekIndex - months[i - 1].weekIndex > 2;
    });
  };

  const weeks = groupByWeek();
  const monthLabels = getMonthLabels();

  const lastFiveMonthsContributions = contributions
    .filter((c) => {
      const fiveMonthsAgo = new Date();
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 4);
      fiveMonthsAgo.setDate(1);
      fiveMonthsAgo.setHours(0, 0, 0, 0);
      return c.date >= fiveMonthsAgo;
    })
    .reduce((sum, day) => sum + day.count, 0);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [contributions, isMobile, isSmallMobile, isTablet]);

  // Responsive cell size based on screen width
  const getCellSize = () => {
    if (isSmallMobile) return 6;
    if (isMobile) return 8;
    if (isTablet) return 10;
    return 12;
  };

  const cellSize = getCellSize();
  const cellGap = isSmallMobile ? 2 : 4;
  const cellStep = cellSize + cellGap;

  // ─── SKELETON ───────────────────────────────────────────────────────────────
  if (loading) {
    const skeletonWeeks = isMobile ? 22 : 53;
    const skeletonMonths = isMobile ? 5 : 12;

    return (
      <div className="w-full px-2 sm:px-4 mt-3 sm:mt-4">
        <div>
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">
            <ScrollFountain particleCount={25}>
              GitHub
            </ScrollFountain>
          </p>
          <p className='tracking-wider dark:text-white/30 text-sm italic'>How do I learn?</p>
        </div>

        <div className="w-full rounded-md  min-h-[100px] sm:min-h-[120px]">
          <div className="animate-pulse flex gap-1 sm:gap-2 mb-3 sm:mb-4 px-1 sm:px-2 overflow-hidden mt-5 sm:mt-7">

            {/* Day labels column — only on desktop */}
            {!isMobile && !isTablet && (
              <div className="flex flex-col gap-1 pt-[28px] shrink-0">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    style={{ width: 28, height: cellSize }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-[2px]"
                  />
                ))}
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              {/* Month labels row */}
              <div className="flex gap-1 h-5 sm:h-6 mb-1 items-end">
                {[...Array(skeletonMonths)].map((_, i) => (
                  <div
                    key={i}
                    style={{ width: 20, height: 8 }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-[2px] shrink-0"
                  />
                ))}
              </div>

              {/* Contribution grid */}
              <div className="flex gap-1">
                {[...Array(skeletonWeeks)].map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {[...Array(7)].map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        style={{ width: cellSize, height: cellSize }}
                        className="bg-gray-200 dark:bg-gray-700 rounded-[2px]"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row skeleton */}
        <div
          className={`flex ${isMobile ? "flex-col" : "items-center justify-between"
            } mt-3 sm:mt-4 w-full gap-2 sm:gap-3`}
        >
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="h-2.5 sm:h-3 w-36 sm:w-52 bg-gray-200 dark:bg-gray-700 rounded-[2px]" />
            <div className="h-2.5 sm:h-3 w-28 sm:w-40 bg-gray-200 dark:bg-gray-700 rounded-[2px]" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2.5 sm:h-3 w-5 sm:w-6 bg-gray-200 dark:bg-gray-700 rounded-[2px]" />
            <div className="flex gap-[1px]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{ width: cellSize, height: cellSize }}
                  className="bg-gray-200 dark:bg-gray-700 rounded-[2px]"
                />
              ))}
            </div>
            <div className="h-2.5 sm:h-3 w-6 sm:w-8 bg-gray-200 dark:bg-gray-700 rounded-[2px]" />
          </div>
        </div>
      </div>
    );
  }

  // ─── ERROR ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full px-2 sm:px-4 py-6 sm:py-10">
        <div>
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">
            <ScrollFountain particleCount={25}>
              GitHub
            </ScrollFountain>
          </p>
          <p className='tracking-wider dark:text-white/30 text-sm italic'>How do I learn?</p>
        </div>
        <div className="w-full px-2 sm:px-3 py-4 sm:py-6 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
          <div className="text-center text-black dark:text-white py-1 sm:py-2 text-xs sm:text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────────
  return (
    <div>
      <hr className="text-blue-100 mt-4" />

      <div className="w-full px-2 sm:px-4 mt-3 sm:mt-4">

        <div>
          <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">
            <ScrollFountain particleCount={25}>
              GitHub
            </ScrollFountain>
          </p>
          <p className='tracking-wider dark:text-white/30 text-sm italic'>How do I learn?</p>
        </div>

        <div className="w-full rounded-md  min-h-[100px] sm:min-h-[120px]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 px-1 sm:px-2 overflow-hidden"
          >
            {/* Day labels — desktop only */}
            {!isMobile && !isTablet && (
              <div className="flex flex-col gap-1 pt-[28px] shrink-0 mt-5">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <span
                    key={i}
                    style={{ height: cellSize }}
                    className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 flex items-center justify-end pr-1"
                  >
                    {day}
                  </span>
                ))}
              </div>
            )}

            {/* Grid + month labels */}
            <div className="flex-1 overflow-x-auto pb-2 sm:pb-4 mt-5 sm:mt-7" ref={scrollContainerRef}>
              <div className="min-w-max">
                {/* Month labels */}
                <div className="flex relative h-5 sm:h-6">
                  {monthLabels.map((month, i) => (
                    <span
                      key={i}
                      className="absolute text-[10px] sm:text-xs text-gray-600 dark:text-gray-400"
                      style={{ left: `${month.weekIndex * cellStep}px` }}
                    >
                      {month.month}
                    </span>
                  ))}
                </div>

                {/* Contribution squares */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) =>
                        day ? (
                          <motion.div
                            key={`${weekIndex}-${dayIndex}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              delay: (weekIndex * 7 + dayIndex) * 0.002,
                              duration: 0.3,
                            }}
                            style={{
                              width: cellSize,
                              height: cellSize,
                              backgroundColor: day.color,
                              borderRadius: 2,
                            }}
                            className="cursor-pointer hover:scale-110 transition-transform"
                            title={`${day.count} contributions on ${day.date.toLocaleDateString()}`}
                          />
                        ) : (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            style={{ width: cellSize, height: cellSize }}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Legend and Stats */}
        <div
          className={`flex ${isMobile ? "flex-col" : "items-center justify-between"
            } mt-3 sm:mt-4 w-full gap-2 sm:gap-3`}
        >
          <div className="flex flex-col">
            <h2 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              Total: {totalContributions.toLocaleString()} contributions
              {isMobile && (
                <span className="block text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
                  Last 5 months: {lastFiveMonthsContributions.toLocaleString()} contributions
                </span>
              )}
            </h2>
            <span className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              {yesterdayActivity.minutes > 0 ? (
                <span className="inline-flex items-center">
                  Yesterday worked {yesterdayActivity.minutes}m {yesterdayActivity.seconds}s
                </span>
              ) : (
                <span className="inline-flex items-center">No activity yesterday</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Less</span>
            <div className="flex gap-[1px]">
              {[
                colors.level0,
                colors.level1,
                colors.level2,
                colors.level3,
                colors.level4,
              ].map((color, i) => (
                <div
                  key={i}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color,
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;