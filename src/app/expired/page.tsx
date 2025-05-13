import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExpiredLinkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 animate-fade-in">
        <XCircle className="w-16 h-16 mx-auto text-rose-400 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Link Expired</h1>
        <p className="text-white/80 mb-6">
          This self-destructing link has vanished into the digital void.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-white text-rose-900 hover:bg-white/90"
        >
          Create New Link
        </Button>
      </div>
    </div>
  );
}