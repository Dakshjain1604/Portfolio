import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache response for 1 hour

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const USER_CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
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
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          url
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

interface GitHubResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
      repositories: {
        totalCount: number;
        nodes: Array<{
          name: string;
          stargazerCount: number;
          forkCount: number;
          primaryLanguage: {
            name: string;
            color: string;
          } | null;
          url: string;
        }>;
      };
      pinnedItems: {
        nodes: Array<{
          name: string;
          description: string;
          url: string;
          stargazerCount: number;
          forkCount: number;
          primaryLanguage: {
            name: string;
            color: string;
          } | null;
        }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const MOCK_DATA = {
  contributions: {
    total: 1248,
    weeks: Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => {
        const rand = Math.random();
        if (rand < 0.6) return 0; // 60% chance of 0 contributions
        if (rand < 0.8) return Math.floor(Math.random() * 2) + 1; // 1-2 contributions
        if (rand < 0.95) return Math.floor(Math.random() * 5) + 3; // 3-7 contributions
        return Math.floor(Math.random() * 8) + 8; // 8-15 contributions
      })
    ),
  },
  stats: {
    repos: 38,
    stars: 124,
    forks: 42,
  },
  languages: [
    { name: "TypeScript", count: 18 },
    { name: "JavaScript", count: 12 },
    { name: "Python", count: 6 },
    { name: "HTML", count: 4 },
    { name: "CSS", count: 3 },
    { name: "Shell", count: 2 },
  ],
  pinned: [
    {
      name: "transactly_frontend",
      description: "A secure, high-performance financial transactions frontend platform with real-time tracking.",
      url: "https://github.com/Dakshjain1604/transactly_frontend",
      stars: 32,
      forks: 8,
      language: "TypeScript",
      languageColor: "#3178c6"
    },
    {
      name: "DocuMind-Ai",
      description: "Intelligent document parsing and analysis utilizing LangChain and RAG pipelines.",
      url: "https://github.com/Dakshjain1604/DocuMind-Ai",
      stars: 45,
      forks: 15,
      language: "TypeScript",
      languageColor: "#3178c6"
    },
    {
      name: "SOH_Ships",
      description: "Real-time vessel tracking and maritime telemetry intelligence platform.",
      url: "https://github.com/Dakshjain1604/SOH_Ships",
      stars: 24,
      forks: 7,
      language: "TypeScript",
      languageColor: "#3178c6"
    }
  ]
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || "Dakshjain1604";

  if (!token) {
    console.warn("GitHub token not configured, using mock fallback data.");
    return NextResponse.json(MOCK_DATA);
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: USER_CONTRIBUTIONS_QUERY,
        variables: { username },
      }),
    });

    const json: GitHubResponse = await response.json();

    if (json.errors) {
      console.error("GitHub API errors:", json.errors);
      console.warn("Using mock fallback data due to GitHub API error.");
      return NextResponse.json(MOCK_DATA);
    }

    const user = json.data?.user;
    if (!user) {
      console.warn("User not found in GitHub API, using mock fallback data.");
      return NextResponse.json(MOCK_DATA);
    }

    // Process contribution calendar (last 52 weeks)
    const weeks = user.contributionsCollection.contributionCalendar.weeks.slice(-52);
    const contributions = weeks.map((week) =>
      week.contributionDays.map((day) => day.contributionCount)
    );

    // Process repositories for stats
    const repos = user.repositories.nodes;
    const totalStars = repos.reduce((acc, repo) => acc + repo.stargazerCount, 0);
    const totalForks = repos.reduce((acc, repo) => acc + repo.forkCount, 0);

    // Calculate language distribution
    const languageMap = new Map<string, number>();
    repos.forEach((repo) => {
      if (repo.primaryLanguage) {
        const current = languageMap.get(repo.primaryLanguage.name) || 0;
        languageMap.set(repo.primaryLanguage.name, current + 1);
      }
    });

    const languages = Array.from(languageMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Process pinned items
    const pinned = user.pinnedItems.nodes.map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name,
      languageColor: repo.primaryLanguage?.color,
    }));

    return NextResponse.json({
      contributions: {
        total: user.contributionsCollection.contributionCalendar.totalContributions,
        weeks: contributions,
      },
      stats: {
        repos: user.repositories.totalCount,
        stars: totalStars,
        forks: totalForks,
      },
      languages,
      pinned,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    console.warn("Using mock fallback data due to exception.");
    return NextResponse.json(MOCK_DATA);
  }
}
