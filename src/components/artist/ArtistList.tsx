"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../common/loading";
import { IArtistReadFormSchema } from "@/schema/ArtistSchema";
import { RoleEnum } from "@/schema/userSchema";
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
import { ModalAction } from "@/types/generic";
import AddEditArtist from "./AddEditArtist";
import DeleteModel from "../common/DeleteModel";
import { format } from "date-fns";

export default function ArtistList() {
  const [artists, setArtists] = useState<IArtistReadFormSchema[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const [action, setAction] = useState<ModalAction>(ModalAction.ADD);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedArtist, setSelectedArtist] =
    useState<IArtistReadFormSchema | null>(null);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<string | null>(null);
  const [isOpenDeleteArtistModel, setIsOpenDeleteArtistModel] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get("/api/artist");
        setArtists(response.data.data as IArtistReadFormSchema[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setLoading(false);
        toast("Failed to fetch artists.");
      }
    }
    fetchData();
  }, [isReload]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
            <p className="text-muted-foreground">
              Manage your artists here. You can add, edit, or delete artists as
              needed.
            </p>
          </div>
          {/* check if user is superadmin */}
          {session?.user?.role === RoleEnum.superadmin && (
            <Button
              onClick={() => {
                setSelectedArtist(null); // reset
                setAction(ModalAction.ADD);
                setIsOpen(true);
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
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists?.map((us) => (
                <TableRow key={us._id}>
                  {/* <TableCell className="font-medium">{us._id}</TableCell> */}
                  <TableCell>{us.name}</TableCell>
                  <TableCell>{format(us.createdAt, "MMM d, yyyy")}</TableCell>

                  <TableCell className="text-right">
                    {/* check if user is superadmin */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedArtist(us);
                          setAction(ModalAction.EDIT);
                          setIsOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsDelete(us._id!);
                          setAction(ModalAction.DELETE);
                          setIsOpenDeleteArtistModel(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {artists.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No artists found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      {isOpen && (
        <AddEditArtist
          isOpenArtist={isOpen}
          setIsOpenArtist={setIsOpen}
          action={action}
          onReload={() => setIsReload((prev) => !prev)}
          artist={selectedArtist || undefined}
        />
      )}
      {isDelete && (
        <DeleteModel
          isOpenDelete={isOpenDeleteArtistModel}
          open={setIsOpenDeleteArtistModel}
          recordId={isDelete}
          onReload={() => setIsReload((prev) => !prev)}
          modelName="Artist"
        />
      )}
    </>
  );
}
