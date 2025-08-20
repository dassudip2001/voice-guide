"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RoleEnum } from "@/schema/userSchema";
import { useEffect, useState } from "react";
import { IReadPost, PostStatus } from "@/schema/postSchema";
import Loading from "@/components/common/loading";

export default function QR() {
  const [posts, setPosts] = useState<IReadPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  const navigation = useRouter();
  const { data: session } = useSession();

  if (loading) {
    <Loading />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">Manage and track your posts</p>
        </div>
        {session?.user?.role === RoleEnum.superadmin && (
          <Button onClick={() => navigation.push("/posts/add")}>
            Create New
          </Button>
        )}
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[100px]">ID</TableHead> */}
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              {/* <TableHead className="text-right">Scans</TableHead> */}
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((qr) => (
              <TableRow key={qr._id}>
                {/* <TableCell className="font-medium">{qr._id}</TableCell> */}
                <TableCell>{qr.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {(qr.category as unknown as string) || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {qr.content}
                </TableCell>
                {/* <TableCell className="text-right">{qr.scans}</TableCell> */}
                <TableCell>{qr.createdAt as unknown as string}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      qr.status === PostStatus.published
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-gray-50 text-gray-600 ring-gray-500/10"
                    }`}
                  >
                    {qr.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </div>
  );
}
