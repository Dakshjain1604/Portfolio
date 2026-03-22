import { NextResponse } from "next/server";

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

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME || "Dakshjain1604";

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: json.errors[0].message },
        { status: 500 }
      );
    }

    const user = json.data?.user;
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
