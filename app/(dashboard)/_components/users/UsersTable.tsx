"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideLoader, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubCategories } from "@/hooks/use-subcategories";
import { getUsers } from "@/hooks/get-users";
import RoleBox from "@/components/RoleBox";

interface Props {
  setOpen: (open: boolean) => void;
  setMode: (mode: "create" | "edit") => void;
  setInitialData: (data: any) => void;
}

const UsersTable = () => {
  const { users, isLoading, deleteUser } = getUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState(users);

  console.log(users)
  useEffect(() => {
    setFilteredSubCategories(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <section className="flex flex-col mt-5">
      <Input
        placeholder="Search"
        className="w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredSubCategories.length !== 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Id</TableHead>
              <TableHead className="">Name</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead className="">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubCategories.map((user) => (
              <TableRow key={user.id}>
                <TableHead className="">{user.id}</TableHead>
                <TableHead className="">{user.name}</TableHead>
                <TableHead className="">{user.email}</TableHead>
                <TableHead className="flex flex-col h-full justify-center items-center">
                  <RoleBox id={user.id} user_role={user.role} />
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <TableBody className="flex items-center justify-center w-full">
          <h1 className="text-gray-400 mt-5 text-center">
            No users found.
          </h1>
        </TableBody>
      )}
    </section>
  );
};

export default UsersTable;
