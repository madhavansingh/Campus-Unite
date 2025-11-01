import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, User, GraduationCap, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  college: string;
  year: string;
  branch: string;
  interests: string[];
}

interface OnboardingModalProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
}

const interests = [
  "Technical", "Music", "Art", "Sketching", "Sports", "Photography",
  "Dance", "Writing", "Gaming", "Cooking", "Fashion", "Volunteering"
];

const colleges = [
  "IIT Delhi", "IIT Bombay", "BITS Pilani", "NIT Trichy", "VIT Vellore",
  "SRM Chennai", "Manipal University", "DTU Delhi"
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const branches = ["CSE", "ECE", "Mechanical", "Civil", "EEE", "IT", "Chemical", "Biotech"];

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: "",
    email: "",
    phone: "+91",
    dob: "",
    college: "",
    year: "",
    branch: "",
    interests: []
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleComplete = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => onComplete(formData), 500);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 bg-gradient-to-br from-background via-background to-primary/5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome to Campus Unite! 👋
                </h2>
                <p className="text-muted-foreground">Let's get to know you better</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full" size="lg">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Academic Details 🎓
                </h2>
                <p className="text-muted-foreground">Tell us about your college life</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="college">College Name</Label>
                  <select
                    id="college"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select your college</option>
                    {colleges.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="year">Year of Study</Label>
                  <select
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <select
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select branch</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="w-full" size="lg">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="w-full" size="lg">
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-secondary to-accent mx-auto flex items-center justify-center">
                  <Heart className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  Your Interests ✨
                </h2>
                <p className="text-muted-foreground">Select what you're passionate about</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                      formData.interests.includes(interest)
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground border-transparent scale-105"
                        : "border-border hover:border-primary hover:scale-105"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="w-full" size="lg">
                  Back
                </Button>
                <Button onClick={handleComplete} className="w-full" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
