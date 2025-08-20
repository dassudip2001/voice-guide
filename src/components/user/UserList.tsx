"use client";

import { IReadUser, RoleEnum } from "@/schema/userSchema";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import axios from "axios";
import Loading from "../common/loading";
import { ModalAction } from "@/types/generic";
import AddEditUser from "./AddEditUser";
import DeleteModel from "../common/DeleteModel";
import { format } from "date-fns";

export default function UserList() {
  const [users, setUsers] = useState<IReadUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [action, setAction] = useState<ModalAction>(ModalAction.ADD);
  const [selectedUser, setSelectedUser] = useState<IReadUser | null>(null);
  const [isOpenUser, setIsOpenUser] = useState<boolean>(false);
  const [reloadUser, setIsReloadUser] = useState<boolean>(true);
  const [selectUserId, setSelectuserId] = useState<string | null>(null);
  const [isOpenDeleteUserModel, setIsOpenUserModel] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get("/api/user");
        setUsers(response.data.data as IReadUser[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        toast("Failed to fetch users.");
      }
    }
    fetchData();
  }, [reloadUser]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage your users here. You can add, edit, or delete users as
              needed.
            </p>
          </div>
          {/* check if user is superadmin */}
          {session?.user?.role === RoleEnum.superadmin && (
            <Button
              onClick={() => {
                setSelectedUser(null); // reset
                setAction(ModalAction.ADD);
                setIsOpenUser(true);
              }}
            >
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((us) => (
                <TableRow key={us._id}>
                  {/* <TableCell className="font-medium">{us._id}</TableCell> */}
                  <TableCell>{us.name}</TableCell>
                  <TableCell>{us.email}</TableCell>
                  <TableCell>{us.role}</TableCell>
                  <TableCell>{format(us.createdAt, "MMM d, yyyy")}</TableCell>

                  <TableCell className="text-right">
                    {/* check if user is superadmin */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(us);
                          setAction(ModalAction.EDIT);
                          setIsOpenUser(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectuserId(us._id);
                          setIsOpenUserModel(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      {/* AddEditUser Modal */}
      {isOpenUser && (
        <AddEditUser
          isOpenUser={isOpenUser}
          setIsOpenUser={setIsOpenUser}
          action={action}
          onReload={() => setIsReloadUser((prev) => !prev)}
          user={selectedUser || undefined}
        />
      )}

      {isOpenDeleteUserModel && (
        <DeleteModel
          recordId={selectUserId!}
          open={setIsOpenUserModel}
          isOpenDelete={isOpenDeleteUserModel}
          onReload={() => setIsReloadUser((prev) => !prev)}
          modelName="User"
        />
      )}
    </>
  );
}
