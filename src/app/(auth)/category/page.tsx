"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { RoleEnum } from "@/schema/userSchema";
import { useState } from "react";
import { AddEditCategory, CategoryAction } from "@/components/category/AddEditCategory";

const qrData = [
  {
    id: "QR001",
    name: "Website Link",
    created: "2024-01-15",
    status: "Active",
  },
  {
    id: "QR002",
    name: "Contact Card",
    created: "2024-01-20",
    status: "Active",
  },
  {
    id: "QR003",
    name: "WiFi Access",
    created: "2024-01-25",
    status: "Inactive",
  },
  {
    id: "QR004",
    name: "Event Info",
    created: "2024-02-01",
    status: "Active",
  },
  {
    id: "QR005",
    name: "App Download",
    created: "2024-02-05",
    status: "Active",
  },
];

export default function Category() {

  const { data: session } = useSession();
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  return (
    <>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your categories here. You can add, edit, or delete categories as needed.
            </p>
          </div>
          {/* check if user is superadmin */}
          {session?.user?.role === RoleEnum.superadmin && (
            <Button onClick={() => setIsOpenCategory(true)} >Create New</Button>
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
              {qrData.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell className="font-medium">{qr.id}</TableCell>
                  <TableCell>{qr.name}</TableCell>
                  <TableCell>{qr.created}</TableCell>

                  <TableCell className="text-right">
                    {/* check if user is superadmin */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
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
        <AddEditCategory isOpenCategory={isOpenCategory} setIsOpenCategory={setIsOpenCategory} action={CategoryAction.ADD} />
      )}
    </>
  );
}
