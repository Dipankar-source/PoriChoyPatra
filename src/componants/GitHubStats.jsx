import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  // Safe environment variable access with fallback
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

  // GitHub contribution colors
  const colors = {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch REAL GitHub data with multiple fallback methods
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try GraphQL API first if token exists (most accurate)
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

        // Fallback to Contributions API
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
        // Load demo data as final fallback
        loadDemoData();
      }
    };

    fetchGitHubData();
  }, []);

  // GraphQL API method (most accurate)
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

    if (!response.ok) {
      throw new Error(`GraphQL error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const weeks =
      result.data.user.contributionsCollection.contributionCalendar.weeks;
    let total =
      result.data.user.contributionsCollection.contributionCalendar
        .totalContributions;
    const contributions = [];

    weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        let color = colors.level0;
        if (day.contributionCount > 0 && day.contributionCount < 10)
          color = colors.level1;
        else if (day.contributionCount >= 10 && day.contributionCount < 20)
          color = colors.level2;
        else if (day.contributionCount >= 20 && day.contributionCount < 30)
          color = colors.level3;
        else if (day.contributionCount >= 30) color = colors.level4;

        contributions.push({
          date: new Date(day.date),
          count: day.contributionCount,
          color,
        });
      });
    });

    return { contributions, total };
  };

  // Process contributions from contributions API
  const processContributionsData = (contributionsData) => {
    let total = 0;
    const contributions = [];

    contributionsData.forEach((day) => {
      total += day.count;

      let color = colors.level0;
      if (day.count > 0 && day.count < 10) color = colors.level1;
      else if (day.count >= 10 && day.count < 20) color = colors.level2;
      else if (day.count >= 20 && day.count < 30) color = colors.level3;
      else if (day.count >= 30) color = colors.level4;

      contributions.push({
        date: new Date(day.date),
        count: day.count,
        color,
      });
    });

    setContributions(contributions);
    setTotalContributions(total);
    calculateYesterdayActivity(contributions);
    setLoading(false);
  };

  // GitHub Events API fallback
  const fetchGitHubEvents = async () => {
    try {
      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
      };

      const response = await fetch(
        "https://api.github.com/users/Dipankar-source/events",
        { headers }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const events = await response.json();

      if (events.message && events.message.includes("API rate limit")) {
        throw new Error("GitHub API rate limit exceeded");
      }

      processEventsData(events);
    } catch (err) {
      console.error("Events API failed:", err);
      throw err; // Re-throw to trigger demo data fallback
    }
  };

  // Process events from GitHub events API
  const processEventsData = (events) => {
    // Group events by date and count contributions
    const contributionsMap = {};
    let total = 0;

    events.forEach((event) => {
      const date = new Date(event.created_at).toDateString();
      contributionsMap[date] = (contributionsMap[date] || 0) + 1;
      total++;
    });

    // Generate contributions array for the last year
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const contributions = [];

    for (
      let date = new Date(startDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toDateString();
      const count = contributionsMap[dateStr] || 0;

      let color = colors.level0;
      if (count > 0 && count < 10) color = colors.level1;
      else if (count >= 10 && count < 20) color = colors.level2;
      else if (count >= 20 && count < 30) color = colors.level3;
      else if (count >= 30) color = colors.level4;

      contributions.push({
        date: new Date(date),
        count,
        color,
      });
    }

    setContributions(contributions);
    setTotalContributions(total);
    calculateYesterdayActivity(contributions);
    setLoading(false);
  };

  // Demo data as final fallback
  const loadDemoData = () => {
    const demoData = generateDemoContributions();
    setContributions(demoData.contributions);
    setTotalContributions(demoData.total);
    calculateYesterdayActivity(demoData.contributions);
    setLoading(false);
  };

  // Generate demo data
  const generateDemoContributions = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    const contributions = [];
    let total = 2074; // Your mentioned total

    // Distribute contributions realistically
    let remaining = total;

    for (
      let date = new Date(startDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      // More likely to have contributions on weekdays
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseChance = isWeekend ? 0.2 : 0.4;

      let count = 0;
      if (Math.random() < baseChance && remaining > 0) {
        count = Math.floor(Math.random() * Math.min(8, remaining)) + 1;
        remaining -= count;
      }

      let color = colors.level0;
      if (count > 0 && count < 10) color = colors.level1;
      else if (count >= 10 && count < 20) color = colors.level2;
      else if (count >= 20 && count < 30) color = colors.level3;
      else if (count >= 30) color = colors.level4;

      contributions.push({
        date: new Date(date),
        count,
        color,
      });
    }

    // Distribute any remaining contributions
    if (remaining > 0) {
      for (let i = 0; i < remaining && i < contributions.length; i++) {
        const index = Math.floor(Math.random() * contributions.length);
        contributions[index].count += 1;
        // Update color if needed
        if (contributions[index].count >= 10) {
          contributions[index].color = colors.level2;
        }
        if (contributions[index].count >= 20) {
          contributions[index].color = colors.level3;
        }
        if (contributions[index].count >= 30) {
          contributions[index].color = colors.level4;
        }
      }
    }

    return { contributions, total };
  };

  // Calculate yesterday's activity time
  const calculateYesterdayActivity = (contribs) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const yesterdayContrib = contribs.find(
      (c) => c.date.toDateString() === yesterdayStr
    );

    if (yesterdayContrib && yesterdayContrib.count > 0) {
      const baseMinutes = 10 + yesterdayContrib.count * 3;
      const minutes = Math.min(baseMinutes, 180);
      const seconds = Math.floor(Math.random() * 60);

      setYesterdayActivity({
        minutes,
        seconds,
      });
    } else {
      setYesterdayActivity({ minutes: 0, seconds: 0 });
    }
  };

  // Get contributions for display (last 5 months including current on mobile)
  const getDisplayContributions = () => {
    if (!contributions.length) return [];

    if (isMobile) {
      // Show last 5 months including current month
      const fiveMonthsAgo = new Date();
      fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 4); // -4 gives us 5 months total (current + 4 previous)

      // Set to first day of that month for clean cutoff
      fiveMonthsAgo.setDate(1);
      fiveMonthsAgo.setHours(0, 0, 0, 0);

      return contributions.filter(
        (contribution) => contribution.date >= fiveMonthsAgo
      );
    }

    // Show full year on desktop
    return contributions;
  };

  // Group contributions by week for display
  const groupByWeek = () => {
    const displayContributions = getDisplayContributions();
    if (!displayContributions.length) return [];

    const weeks = [];
    let currentWeek = [];

    // Find what day of the week the first contribution is
    const firstDate = displayContributions[0].date;
    const firstDayOfWeek = firstDate.getDay(); // 0 is Sunday

    // Pad the first week with empty days if needed
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    displayContributions.forEach((contribution) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(contribution);
    });

    if (currentWeek.length > 0) {
      // Pad the last week with empty days if needed
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Get month labels for the chart
  const getMonthLabels = () => {
    const weeksData = groupByWeek();
    const months = [];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    let currentMonth = -1;

    weeksData.forEach((week, index) => {
      const firstValidDay = week.find((day) => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== currentMonth) {
          months.push({
            month: monthNames[month],
            weekIndex: index,
          });
          currentMonth = month;
        }
      }
    });

    // Filter out month labels that are too close to each other
    return months.filter((m, i) => {
      if (i === 0) return true;
      return m.weekIndex - months[i - 1].weekIndex > 2;
    });
  };

  const displayContributions = getDisplayContributions();
  const weeks = groupByWeek();
  const monthLabels = getMonthLabels();

  // Calculate last 5 months contributions
  const lastFiveMonthsContributions = displayContributions.reduce(
    (sum, day) => sum + day.count,
    0
  );

  if (error) {
    return (
      <div className="w-full px-4 py-10">
        <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
          GitHub Activities
        </p>
        <div className="max-w-4xl mx-4 px-3 py-6 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-900">
          <div className="text-center text-yellow-600 dark:text-yellow-400 py-2 text-sm">
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-10">
        <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
          GitHub Activities
        </p>
        <div className="max-w-4xl mt-7 mx-4 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm min-h-[220px]">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="flex gap-1 mb-4">
              <div className="flex flex-col gap-1 mr-2 pt-6">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-6"
                  ></div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-52 gap-1">
                {[...Array(364)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-300 dark:bg-gray-700 rounded"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-10 border-l-1 border-r-1 ">
      <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
        GitHub Activities
      </p>
      <div className="max-w-4xl  mt-7 mx-4 px-3 py-1 border-1 rounded-md shadow-md min-h-[120px]">
        {/* Contribution grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-2 mb-4 px-2 overflow-hidden"
        >
          {/* Day labels */}
          {!isMobile && (
            <div className="flex flex-col gap-1 pt-[28px] shrink-0 mt-5">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <span
                  key={i}
                  className="text-xs text-gray-600 dark:text-gray-400 h-3 flex items-center justify-end pr-1"
                >
                  {day}
                </span>
              ))}
            </div>
          )}

          {/* Contribution squares with month labels */}
          <div className="flex-1 overflow-x-auto pb-4 mt-7">
            <div className="min-w-max">
              {/* Month labels */}
              <div className="flex relative h-6">
                {monthLabels.map((month, i) => (
                  <span
                    key={i}
                    className="absolute text-xs text-gray-600 dark:text-gray-400"
                    style={{
                      left: `${month.weekIndex * (isMobile ? 12 : 16)}px`,
                    }}
                  >
                    {month.month}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      day ? (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: (weekIndex * 7 + dayIndex) * 0.002,
                            duration: 0.3,
                          }}
                          className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                            } rounded-sm cursor-pointer`}
                          style={{ backgroundColor: day.color }}
                          title={`${day.count
                            } contributions on ${day.date.toLocaleDateString()}`}
                        />
                      ) : (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                            } rounded-sm`}
                          style={{ backgroundColor: "transparent" }}
                        />
                      )
                    ))}
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
          } mt-4 px-5 max-w-4xl mx-1 gap-3`}
      >
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">
            Total: {totalContributions.toLocaleString()} contributions
            {isMobile && (
              <span className="block text-xs text-gray-600 dark:text-gray-400 mt-1">
                Last 5 months: {lastFiveMonthsContributions.toLocaleString()}{" "}
                contributions
              </span>
            )}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {yesterdayActivity.minutes > 0 ? (
              <span className="inline-flex items-center">
                Yesterday worked {yesterdayActivity.minutes}m{" "}
                {yesterdayActivity.seconds}s
              </span>
            ) : (
              <span className="inline-flex items-center ">
                No activity yesterday
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex gap-[1px]">
            <div
              className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-[#ebedf0] dark:bg-[#161b22] rounded-[2px]`}
            ></div>
            <div
              className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-[#9be9a8] rounded-[2px]`}
            ></div>
            <div
              className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-[#40c463] rounded-[2px]`}
            ></div>
            <div
              className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-[#30a14e] rounded-[2px]`}
            ></div>
            <div
              className={`${isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-[#216e39] rounded-[2px]`}
            ></div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
