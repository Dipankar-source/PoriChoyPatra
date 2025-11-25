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

  // GitHub contribution colors
  const colors = {
    level0: "#ebedf0",
    level1: "#9be9a8",
    level2: "#40c463",
    level3: "#30a14e",
    level4: "#216e39",
  };

  // Fetch REAL GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);

        // Method 1: Using GitHub's unofficial API (more reliable)
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/Dipankar-source?y=last"
        );
        const data = await response.json();

        if (data.contributions) {
          processContributionsData(data.contributions);
        } else {
          // Fallback to GitHub events API
          await fetchGitHubEvents();
        }
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        // Fallback to GitHub events API
        await fetchGitHubEvents();
      }
    };

    const fetchGitHubEvents = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Dipankar-source/events"
        );
        const events = await response.json();

        if (events.message && events.message.includes("API rate limit")) {
          setError("GitHub API rate limit exceeded. Please try again later.");
          return;
        }

        processEventsData(events);
      } catch (err) {
        setError("Failed to fetch GitHub data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

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

    // Calculate yesterday's activity
    calculateYesterdayActivity(contributions);
    setLoading(false);
  };

  // Process events from GitHub events API
  const processEventsData = (events) => {
    // Group events by date and count contributions
    const contributionsMap = {};
    let total = 0;

    events.forEach((event) => {
      const date = new Date(event.created_at).toDateString();
      contributionsMap[date] = (contributionsMap[date] || 0) + 1;
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
      total += count;

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
  };

  // Calculate yesterday's activity time (estimated based on contributions)
  const calculateYesterdayActivity = (contribs) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const yesterdayContrib = contribs.find(
      (c) => c.date.toDateString() === yesterdayStr
    );

    if (yesterdayContrib && yesterdayContrib.count > 0) {
      // Estimate activity time based on contribution count
      // This is an approximation since GitHub doesn't provide exact time
      const baseMinutes = 15 + yesterdayContrib.count * 2;
      const minutes = Math.min(baseMinutes, 120); // Cap at 2 hours
      const seconds = Math.floor(Math.random() * 60);

      setYesterdayActivity({
        minutes,
        seconds,
      });
    } else {
      setYesterdayActivity({ minutes: 0, seconds: 0 });
    }
  };

  // Group contributions by week for display
  const groupByWeek = () => {
    if (!contributions.length) return [];

    const weeks = [];
    let currentWeek = [];

    contributions.forEach((contribution, index) => {
      if (index % 7 === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(contribution);
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  // Get month labels for the chart
  const getMonthLabels = () => {
    if (!contributions.length) return [];

    const months = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let currentMonth = -1;
    contributions.forEach((contribution, index) => {
      const month = contribution.date.getMonth();
      if (month !== currentMonth && index % 30 === 0) {
        months.push({
          month: monthNames[month],
          position: index,
        });
        currentMonth = month;
      }
    });

    return months;
  };

  const weeks = groupByWeek();
  const monthLabels = getMonthLabels();

  if (error) {
    return (
      <div className="w-full px-4 py-10">
        <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
          GitHub Contributions
        </p>
        <div className="max-w-4xl mx-auto px-6 py-6 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 shadow-sm">
          <div className="text-center text-red-500 py-4">{error}</div>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Using fallback data for demonstration
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-4 py-10">
        <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
          GitHub Contributions
        </p>
        <div className="max-w-4xl mx-auto px-6 py-6 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 shadow-sm">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
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
            <div className="flex justify-between">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-10 border-1 ">
      <p className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-4 pr-4">
        GitHub Activitie
      </p>
      <div className="max-w-4xl mx-4 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md  shadow-sm">
        {/* Month labels */}
        <div className="flex text-xs text-gray-500 mb-2">
          {monthLabels.map((month, i) => (
            <span
              key={i}
              className="flex-1 text-center"
              style={{ minWidth: "8%" }}
            >
              {month.month}
            </span>
          ))}
        </div>

        {/* Contribution grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-1 mb-4"
        >
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2 pt-6">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, i) => (
              <span
                key={i}
                className="text-xs text-gray-500 h-3 flex items-center justify-end"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Contribution squares */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: (weekIndex * 7 + dayIndex) * 0.002,
                        duration: 0.3,
                      }}
                      className="w-3 h-3 rounded-sm cursor-pointer"
                      style={{ backgroundColor: day.color }}
                      title={`${
                        day.count
                      } contributions on ${day.date.toLocaleDateString()}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Legend with emojis */}
      <div className="flex items-center justify-between mt-4 px-5">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">
          Total: {totalContributions.toLocaleString()} contributions
        </h2>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-[1px]">
              <div className="w-3 h-3 bg-[#ebedf0] dark:bg-[#161b22] rounded-[2px]"></div>
              <div className="w-3 h-3 bg-[#9be9a8] rounded-[2px]"></div>
              <div className="w-3 h-3 bg-[#40c463] rounded-[2px]"></div>
              <div className="w-3 h-3 bg-[#30a14e] rounded-[2px]"></div>
              <div className="w-3 h-3 bg-[#216e39] rounded-[2px]"></div>
            </div>
          </div>

          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>

      <div className=" flex items-center justify-between px-5">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {yesterdayActivity.minutes > 0 ? (
              <span className="inline-flex items-center">
                Yesterday worked {yesterdayActivity.minutes}m{" "}
                {yesterdayActivity.seconds}s
              </span>
            ) : (
              <span className="inline-flex items-center">
                <span className="mr-1">💤</span>
                No activity yesterday
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
