"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { IReadPost } from "@/schema/postSchema";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { IReadPostResponse } from "@/types/post";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
};

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-5 w-5 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalArtists: 0,
    totalPosts: 0,
  });
  const [unpublishedPosts, setUnpublishedPosts] = useState<IReadPostResponse[]>(
    []
  );
  const [loading, setLoading] = useState({
    stats: true,
    posts: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading((prev) => ({ ...prev, stats: true }));

        // Fetch all data in parallel
        const [categoriesRes, artistsRes, postsRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/artist"),
          fetch("/api/posts"),
        ]);

        const [categories, artists, posts] = await Promise.all([
          categoriesRes.json(),
          artistsRes.json(),
          postsRes.json(),
        ]);

        setStats({
          totalCategories: categories.data?.length || 0,
          totalArtists: artists.data?.length || 0,
          totalPosts: posts.data?.length || 0,
        });

        // Filter draft posts (unpublished)
        const unpublished =
          posts.data?.filter((post: IReadPost) => post.status === "draft") ||
          [];
        setUnpublishedPosts(unpublished);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, stats: false, posts: false }));
      }
    };

    fetchStats();
  }, []);

  if (loading.stats) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatsCard
          title="Total Artists"
          value={stats.totalArtists}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unpublished Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading.posts ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : unpublishedPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpublishedPosts?.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category.name || "N/A"}</TableCell>
                    <TableCell>{post.artist.name || "N/A"}</TableCell>
                    <TableCell>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Unpublished
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  No unpublished posts found
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
