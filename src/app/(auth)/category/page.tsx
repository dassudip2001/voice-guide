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
import { AddEditCategory } from "@/components/category/AddEditCategory";
import { toast } from "sonner";
import { IReadCategory } from "@/schema/categorySchema";
import axios from "axios";
import Loading from "@/components/common/loading";
import DeleteModel from "@/components/common/DeleteModel";
import { ModalAction } from "@/types/generic";
import { format } from "date-fns";

export default function Category() {
  const { data: session } = useSession();
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategories] = useState<IReadCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<IReadCategory | null>(null);
  const [action, setAction] = useState<ModalAction>(ModalAction.ADD);
  const [reloadCategory, setIsReloadCategory] = useState<boolean>(true);
  const [selectCategoryId, setSelectcategoryId] = useState<string | null>(null);
  const [isOpenDeleteCategoryModel, setIsOpenCategoryModel] =
    useState<boolean>(false);

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
  }, [reloadCategory]);

  if (loading) {
    <Loading />;
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
            <Button
              onClick={() => {
                setSelectedCategory(null); // reset
                setAction(ModalAction.ADD);
                setIsOpenCategory(true);
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
              {category?.map((category) => (
                <TableRow key={category._id}>
                  {/* <TableCell className="font-medium">{category._id}</TableCell> */}
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {format(new Date(category.createdAt), "MMM d, yyyy")}
                  </TableCell>

                  <TableCell className="text-right">
                    {/* check if user is superadmin */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setAction(ModalAction.EDIT);
                          setIsOpenCategory(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectcategoryId(category?._id);
                          console.log(selectCategoryId);
                          setIsOpenCategoryModel(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {category.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </div>
      {/* Modal for creating new category */}
      {isOpenCategory && (
        <AddEditCategory
          isOpenCategory={isOpenCategory}
          setIsOpenCategory={setIsOpenCategory}
          action={action}
          onReload={() => setIsReloadCategory((prev) => !prev)}
          category={selectedCategory || undefined}
        />
      )}
      {/* Delete model */}
      {isOpenDeleteCategoryModel && (
        <DeleteModel
          recordId={selectCategoryId!}
          open={setIsOpenCategoryModel}
          isOpenDelete={isOpenDeleteCategoryModel}
          onReload={() => setIsReloadCategory((prev) => !prev)}
          modelName="Category"
        />
      )}
    </>
  );
}
