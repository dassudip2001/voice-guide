"use client";

import axios from "axios";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";

interface DeleteProp {
  recordId: string;
  isOpenDelete: boolean;
  open: (isOpen: boolean) => void;
  modelName: string;
  onReload?: () => void;
}

export default function DeleteModel({
  recordId,
  open,
  isOpenDelete,
  modelName,
  onReload,
}: DeleteProp) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!recordId) return;

    setLoading(true);
    try {
      if (modelName === "Category") {
        await axios.delete(`/api/category/${recordId}`);
      }
      if (modelName === "User") {
        await axios.delete(`/api/user/${recordId}`);
      }
      if (modelName === "Artist") {
        await axios.delete(`/api/artist/${recordId}`);
      }
      toast.success(`${modelName} deleted successfully`);
      onReload?.();
      open(false);
    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      toast.error(`Failed to delete ${modelName}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={open} open={isOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-semibold">{modelName}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
