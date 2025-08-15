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
import { useSession } from "next-auth/react";
import { RoleEnum } from "@/schema/userSchema";
import { useEffect, useState } from "react";
import {
  AddEditCategory,
  CategoryAction,
} from "@/components/category/AddEditCategory";
import { toast } from "sonner";
import { IReadCategory } from "@/schema/categorySchema";
import axios from "axios";

export default function Category() {
  const { data: session } = useSession();
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategories] = useState<IReadCategory[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get("/api/category");
        setCategories(response.data.data as IReadCategory[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
        toast("Failed to fetch categories.");
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your categories here. You can add, edit, or delete
              categories as needed.
            </p>
          </div>
          {/* check if user is superadmin */}
          {session?.user?.role === RoleEnum.superadmin && (
            <Button onClick={() => setIsOpenCategory(true)}>Create New</Button>
          )}
        </div>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {category?.map((qr) => (
                <TableRow key={qr._id}>
                  <TableCell className="font-medium">{qr._id}</TableCell>
                  <TableCell>{qr.name}</TableCell>
                  <TableCell>{qr.createdAt as unknown as string}</TableCell>

                  <TableCell className="text-right">
                    {/* check if user is superadmin */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      {/* Modal for creating new category */}
      {isOpenCategory && (
        <AddEditCategory
          isOpenCategory={isOpenCategory}
          setIsOpenCategory={setIsOpenCategory}
          action={CategoryAction.ADD}
        />
      )}
    </>
  );
}
