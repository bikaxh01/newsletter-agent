import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

import React from "react";

function EmailDialog({ handleSubmitClick, setEmails }: any) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" w-full bg-blue-600">
            {" "}
            Ready to send <SendHorizonal />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Emails</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Textarea onChange={(e) => setEmails(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                onClick={handleSubmitClick}
                className=" bg-blue-500 w-full"
              >
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmailDialog;
