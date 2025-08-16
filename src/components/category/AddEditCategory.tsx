"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IReadCategory, IWriteCategory } from "@/schema/categorySchema";
import axios from "axios";
import { toast } from "sonner";

export enum CategoryAction {
  ADD = "Add",
  EDIT = "Edit",
}

export function AddEditCategory({
  isOpenCategory,
  setIsOpenCategory,
  action = CategoryAction.ADD,
  category,
  onReload
}: {
  isOpenCategory: boolean;
  setIsOpenCategory: (isOpen: boolean) => void;
  action?: CategoryAction;
  category?: IReadCategory
  onReload?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IWriteCategory>();


  useEffect(() => {
    if (action === CategoryAction.EDIT && category) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      reset({ name: "", description: "" });
    }
  }, [action, category, reset]);

  const onSubmit: SubmitHandler<IWriteCategory> = async (data) => {
    setLoading(true);
    try {
      if (action === CategoryAction.EDIT && category?._id) {
        await axios.put(`/api/category/${category._id}`, data);
        toast.success("Category updated successfully!");
      } else {
        await axios.post("/api/category", data);
        toast.success("Category added successfully!");
      }
      setIsOpenCategory(false);
      onReload?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${action.toLowerCase()} category.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpenCategory} onOpenChange={setIsOpenCategory}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{action} category</DialogTitle>
            <DialogDescription>
              <span>*All fields are required.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter the name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Enter the description"
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
