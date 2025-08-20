import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";

export default function Published({
  postId,
  open,
  onOpenChange,
  reload,
}: {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reload?: () => void;
}) {
  const handlePublish = async () => {
    try {
      const response = await axios.put(`/api/posts/publish/${postId}`);
      if (response.status === 200) {
        console.log("Post published successfully");
        toast.success("Post published successfully");
        reload?.();
        onOpenChange(false); // Close the dialog after successful publish
      }
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to publish this post?</DialogTitle>
          <DialogDescription>
            Once you publish, this post will be visible to the public.
          </DialogDescription>
        </DialogHeader>
        {/* Additional content or actions can be added here */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant={"outline"} onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {/* This button is just for demonstration; you can replace it with actual publish logic */}
          <Button onClick={() => handlePublish()}>Publish Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
