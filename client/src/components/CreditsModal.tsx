import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, Heart, ExternalLink } from "lucide-react";

interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreditsModal({ open, onClose }: CreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-[6px] border-foreground shadow-brutal max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold mb-4 flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-[oklch(0.55_0.25_265)]" strokeWidth={3} />
            Credits
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pb-4">
          {/* Creator Info */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.98_0.01_90)]">
            <h3 className="text-2xl font-bold mb-3">Creator</h3>
            <p className="text-xl font-bold mb-2">Moez Ben-Azzouz</p>
            <p className="text-base leading-relaxed mb-4">
              Professor Ben-Azzouz has over 24 years of teaching experience at the college level. He has expertise in mathematics, ML/AI, and computer science. He is passionate about teaching and helping students grasp difficult concepts.
            </p>
            <p className="text-base leading-relaxed mb-4">
              He has developed this application as a means to help his students with comprehending and manipulating exponential and logarithmic functions. This is also provided as a free resource that colleagues can use to do the same.
            </p>
            <div className="flex items-center gap-2 text-base">
              <span className="font-medium">Read more on Substack:</span>
              <a 
                href="https://mbazzouz.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[oklch(0.55_0.25_265)] font-bold hover:underline flex items-center gap-1"
              >
                mbazzouz.substack.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Pedagogical Approach */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.65_0.20_145)] text-white">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Heart className="w-6 h-6" strokeWidth={3} />
              Why Gamification?
            </h3>
            <p className="text-base leading-relaxed">
              Research supports gamification as a powerful means for teaching and learning, especially when working with Gen Z students. By transforming abstract mathematical concepts into interactive challenges and real-world scenarios, students develop deeper understanding and retain knowledge more effectively.
            </p>
          </div>
          
          {/* Technical Credits */}
          <div className="border-[4px] border-foreground p-6 bg-white">
            <h3 className="text-xl font-bold mb-3">Technical Development</h3>
            <p className="text-base leading-relaxed mb-3">
              Graphics and user interface artifacts were developed with the assistance of Manus AI, enabling rapid prototyping and polished visual design.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, Tailwind CSS, and Recharts
            </p>
          </div>
          
          {/* Free Resource */}
          <div className="border-[4px] border-foreground p-6 bg-[oklch(0.70_0.20_55)]">
            <h3 className="text-xl font-bold mb-3">Free Educational Resource</h3>
            <p className="text-base leading-relaxed">
              This application is provided free of charge for educational purposes. Educators are encouraged to use it with their students and share it with colleagues. Together, we can make mathematics more engaging and accessible for all learners.
            </p>
          </div>
          
          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-[oklch(0.55_0.25_265)] text-white border-[4px] border-foreground shadow-brutal-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-lg h-12"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
