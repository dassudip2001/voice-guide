import { IArtistReadFormSchema } from "@/schema/ArtistSchema";
import { ModalAction } from "@/types/generic";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function AddEditArtist({
  isOpenArtist,
  setIsOpenArtist,
  action = ModalAction.ADD,
  artist,
  onReload,
}: {
  isOpenArtist: boolean;
  setIsOpenArtist: (isOpen: boolean) => void;
  action?: ModalAction;
  artist?: IArtistReadFormSchema;
  onReload?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IArtistReadFormSchema>();
  useEffect(() => {
    if (action === ModalAction.EDIT && artist) {
      reset({
        name: artist.name,
      });
    } else {
      reset({ name: "" });
    }
  }, [action, artist, reset]);

  const onSubmit: SubmitHandler<IArtistReadFormSchema> = async (data) => {
    setLoading(true);
    try {
      if (action === ModalAction.EDIT && artist?._id) {
        await axios.put(`/api/artist/${artist._id}`, data);
        toast.success("Artist updated successfully!");
      } else {
        await axios.post("/api/artist", data);
        toast.success("Artist added successfully!");
      }
      setIsOpenArtist(false);
      onReload?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${action.toLowerCase()} artist.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpenArtist} onOpenChange={setIsOpenArtist}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{action} Artist</DialogTitle>
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
