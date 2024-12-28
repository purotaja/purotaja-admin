"use client";

import React, { useEffect, useState } from "react";
import SettingsForm from "./SettingsForm";
import { Separator } from "@/components/ui/separator";
import StoreDetails from "./StoreDetails";
import { Button } from "@/components/ui/button";
import StoreDialog from "@/components/StoreDialog";

const Settings = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Store</h1>
          </div>
          <SettingsForm />
        </div>
        <Separator />
        <div className="px-5 py-3">
          <StoreDetails />
        </div>
      </div>
      <StoreDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default Settings;
