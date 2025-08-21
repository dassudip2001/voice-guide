"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Breadcrumb>
                <BreadcrumbList>
                  {segments.map((segment, idx) => (
                    <React.Fragment key={segment}>
                      <BreadcrumbItem>
                        {idx < segments.length - 1 ? (
                          <BreadcrumbLink asChild>
                            <Link
                              href={"/" + segments.slice(0, idx + 1).join("/")}
                            >
                              {segment.charAt(0).toUpperCase() +
                                segment.slice(1)}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {idx < segments.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
