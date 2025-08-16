"use client "

import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../ui/dialog"


interface DeleteProp {
    recordId: string;
    isOpenDelete:boolean;
    open: (isOpen: boolean) => void;
    modelName:string;
}

export default function DeleteModel({ recordId, open, isOpenDelete, modelName }: DeleteProp) {
    
    return (
        <>
            <Dialog  onOpenChange={open} open={isOpenDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
