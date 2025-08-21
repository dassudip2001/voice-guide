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
import { PostStatus } from "@/schema/postSchema";
import Loading from "@/components/common/loading";
import { format } from "date-fns";
import { IReadPostResponse } from "@/types/post";
import axios from "axios";
import Published from "@/components/common/Published";
import Image from "next/image";
import DeleteModel from "@/components/common/DeleteModel";

export default function QR() {
  const [posts, setPosts] = useState<IReadPostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishedPost, setPublishedPost] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [selectDeletePostId, setSelectDeletePostId] = useState<string | null>(
    null
  );
  const [isOpenDeleteModel, setOpenDeleteModel] = useState<boolean>(false);
  const navigation = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [reload]);

  if (loading && posts.length === 0) {
    <Loading />;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">Manage and track your posts</p>
          </div>
          {(session?.user?.role === RoleEnum.superadmin ||
            session?.user?.role === RoleEnum.admin) && (
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
              {posts?.map((posts) => (
                <TableRow key={posts._id}>
                  {/* <TableCell className="font-medium">{posts._id}</TableCell> */}
                  <TableCell
                    className="cursor-pointer font-medium text-blue-600 hover:underline"
                    onClick={() => {
                      setPublishedPost(true);
                      setPostId(posts._id);
                    }}
                  >
                    <div
                      role="row"
                      className="flex items-center text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <Image
                        className="w-10 h-10 rounded-full"
                        src={posts.imageUrl || "/images/default.png"}
                        width={40}
                        height={40}
                        alt="Jese image"
                      />
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {posts.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {posts.category.name || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {posts.content}
                  </TableCell>
                  {/* <TableCell className="text-right">{posts.scans}</TableCell> */}
                  <TableCell>
                    {format(new Date(posts.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        posts.status === PostStatus.published
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-gray-50 text-gray-600 ring-gray-500/10"
                      }`}
                    >
                      {posts.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigation.push(`/posts/${posts._id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectDeletePostId(posts._id);
                          setOpenDeleteModel(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      {/* Published */}
      {publishedPost && (
        <Published
          open={publishedPost}
          onOpenChange={setPublishedPost}
          postId={postId}
          reload={() => setReload(!reload)}
        />
      )}
      {/* Delete Confirmation */}
      {isOpenDeleteModel && (
        <DeleteModel
          recordId={selectDeletePostId!}
          open={setOpenDeleteModel}
          isOpenDelete={isOpenDeleteModel}
          onReload={() => setReload(!reload)}
          modelName="Post"
        />
      )}
    </>
  );
}
