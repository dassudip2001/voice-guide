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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RoleEnum } from "@/schema/userSchema";

const qrData = [
  {
    id: "QR001",
    name: "Website Link",
    type: "URL",
    content: "https://example.com",
    scans: 245,
    created: "2024-01-15",
    status: "Active",
  },
  {
    id: "QR002",
    name: "Contact Card",
    type: "vCard",
    content: "John Doe Contact",
    scans: 89,
    created: "2024-01-20",
    status: "Active",
  },
  {
    id: "QR003",
    name: "WiFi Access",
    type: "WiFi",
    content: "Office Network",
    scans: 156,
    created: "2024-01-25",
    status: "Inactive",
  },
  {
    id: "QR004",
    name: "Event Info",
    type: "Text",
    content: "Conference 2024",
    scans: 78,
    created: "2024-02-01",
    status: "Active",
  },
  {
    id: "QR005",
    name: "App Download",
    type: "URL",
    content: "https://app.store.com",
    scans: 312,
    created: "2024-02-05",
    status: "Active",
  },
];

export default function QR() {

  const navigation = useRouter()
  const { data: session } = useSession();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground">
            Manage and track your QR codes
          </p>
        </div>
        {session?.user?.role === RoleEnum.superadmin && (
          <Button onClick={() => navigation.push('/qr/add')}>Create New QR</Button>
        )}
      </div>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Scans</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrData.map((qr) => (
              <TableRow key={qr.id}>
                <TableCell className="font-medium">{qr.id}</TableCell>
                <TableCell>{qr.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {qr.type}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {qr.content}
                </TableCell>
                <TableCell className="text-right">{qr.scans}</TableCell>
                <TableCell>{qr.created}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${qr.status === "Active"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-gray-50 text-gray-600 ring-gray-500/10"
                      }`}
                  >
                    {qr.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
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
  );
}
