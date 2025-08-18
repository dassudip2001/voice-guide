import { IReadUser, IWriteUser, RoleEnum } from "@/schema/userSchema";
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
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Role } from "@/types/roleType";

export default function AddEditUser({
  isOpenUser,
  setIsOpenUser,
  action = ModalAction.ADD,
  onReload,
  user,
}: {
  isOpenUser: boolean;
  setIsOpenUser: (isOpen: boolean) => void;
  action?: ModalAction;
  user?: IReadUser;
  onReload?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IWriteUser>();

  useEffect(() => {
    if (action === ModalAction.EDIT && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
      });
    } else {
      reset({ name: "", email: "", role: RoleEnum.user, password: "" });
    }
  }, [action, user, reset]);

  const onSubmit: SubmitHandler<IWriteUser> = async (data) => {
    setLoading(true);
    try {
      if (action === ModalAction.EDIT && user?._id) {
        await axios.put(`/api/user/${user._id}`, data);
        toast.success("User updated successfully!");
      } else {
        await axios.post("/api/user", data);
        toast.success("User added successfully!");
      }
      setIsOpenUser(false);
      onReload?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${action.toLowerCase()} user.`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={isOpenUser} onOpenChange={setIsOpenUser}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{action} User</DialogTitle>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter the email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Role.map((role)=>(
                    <SelectItem value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <span className="text-red-500 text-sm">
                    {errors.role.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter the password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
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
    </>
  );
}
