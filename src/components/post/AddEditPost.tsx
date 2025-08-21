/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { IWritePost, PostStatus } from "@/schema/postSchema";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { IReadCategory } from "@/schema/categorySchema";
import { Textarea } from "../ui/textarea";
import UploadFile from "../common/UploadFile";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { IArtistReadFormSchema } from "@/schema/ArtistSchema";
import Image from "next/image";

export default function AddEditPost() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IReadCategory[]>([]);
  const [artists, setArtists] = useState<IArtistReadFormSchema[]>([]); // Assuming artists are also categories
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // State for storing image URL
  const router = useRouter();
  const param = useParams();

  const PostId = param?.id;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<IWritePost>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      status: PostStatus.draft, // Default status
      imageUrl: "", // Assuming image is handled separately
    },
  });

  const handleImageUploadComplete = (url: string) => {
    setUploadedImageUrl(url); // Store the uploaded image URL
    setValue("imageUrl", url); // Update the form value for `imagePath`
  };
  // Fetch categories on component mount
  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    // Fetch artists if needed
    const fetchArtists = async () => {
      try {
        const response = await axios.get("/api/artist");
        setArtists(response.data.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    if (PostId) {
      getPostsById(PostId as string);
    }
    fetchArtists();
    fetchCategories();
  }, []);

  // Fetch post details if PostId is provided
  const getPostsById = async (id: string) => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const postData = response.data.post;
      console.log("Post data:", postData);

      setValue("title", postData.title);
      setValue("content", postData.content);
      setValue("category", postData.category._id);
      setValue("artist", postData.artist._id);
      setValue("status", postData.status);
      setValue("imageUrl", postData.imageUrl || ""); // Set image URL if available
      setUploadedImageUrl(postData.imageUrl || ""); // Set uploaded image URL if available
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      toast.error("Failed to fetch post details. Please try again later.");
    }
  };

  const onSubmit: SubmitHandler<IWritePost> = async (data) => {
    setLoading(true);
    try {
      if (PostId) {
        // Edit existing post
        await axios.put(`/api/posts/${PostId}`, data);
        toast("Post updated successfully!");
      } else {
        // Create new post
        await axios.post("/api/posts", data);
        toast("Post created successfully!");
      }
      reset(); // Reset form after submission
      router.push("/posts"); // Redirect to posts list
    } catch (error) {
      console.error("Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        toast(`Error: ${error.response?.data.message || error.message}`);
      } else {
        toast("An unexpected error occurred. Please try again later.");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full p-6">
        <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {!PostId ? "Create New Post" : "Edit Post"}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {!PostId
                ? "Fill in the details below to create an engaging new post"
                : "Update your post details below"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Title<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter an engaging title for your post..."
                      className={cn(
                        "h-12 text-base transition-all duration-200",
                        errors.title && "border-red-500 focus:border-red-500"
                      )}
                      {...register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters long",
                        },
                        maxLength: {
                          value: 100,
                          message: "Title must be less than 100 characters",
                        },
                      })}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.title.message}
                      </p>
                    )}
                    {/* {watchedValues.title && (
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.title.length}/100 characters
                    </p>
                  )} */}
                  </div>

                  {/* Content Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="content"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your post content here... Share your thoughts, ideas, and insights."
                      className={cn(
                        "min-h-[200px] text-base resize-none transition-all duration-200",
                        errors.content && "border-red-500 focus:border-red-500"
                      )}
                      {...register("content")}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.content.message}
                      </p>
                    )}
                    {/* {watchedValues.content && (
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.content.length} characters
                    </p>
                  )} */}
                  </div>

                  {/* Category Field */}
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="categoryId"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Category<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Please select a category" }}
                      render={({ field }) => (
                        <div className="w-full">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={categories.length === 0}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-12 text-base w-full",
                                errors.category &&
                                  "border-red-500 focus:border-red-500"
                              )}
                            >
                              <SelectValue
                                placeholder={
                                  categories.length === 0
                                    ? "Loading categories..."
                                    : "Select a category"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {category.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Artist Field */}
                  <div className="space-y-2 w-full">
                    <Label
                      htmlFor="artist"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      Artist<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="artist"
                      control={control}
                      rules={{ required: "Please select a artist" }}
                      render={({ field }) => (
                        <div className="w-full">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={artists.length === 0}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-12 text-base w-full",
                                errors.category &&
                                  "border-red-500 focus:border-red-500"
                              )}
                            >
                              <SelectValue
                                placeholder={
                                  artists.length === 0
                                    ? "Loading artists..."
                                    : "Select a artist"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {artists.map((artist) => (
                                <SelectItem key={artist._id} value={artist._id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {artist.name}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.artist && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.artist.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - File Upload */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <UploadFile
                      onFileSelect={(file) =>
                        console.log("Selected file:", file)
                      }
                      onUploadComplete={(url) => {
                        console.log("URL uploaded:", url);
                        handleImageUploadComplete(url);
                        // reset((prev) => ({ ...prev, public_path: url }));
                      }}
                    />
                    {uploadedImageUrl && (
                      <div className="mt-4 flex justify-center">
                        <Image
                          src={uploadedImageUrl}
                          alt="Uploaded Preview"
                          width={100}
                          height={100}
                          className="rounded-lg border max-h-60 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={isSubmitting || loading}>
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
