"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { 
  Activity, 
  HeartPulse, 
  ShieldCheck, 
  Brain, 
  Stethoscope, 
  Database, 
  Zap, 
  Lock, 
  ChevronDown 
} from "lucide-react";

// --- Components for Sections ---

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <Activity className="text-emerald-500" />
          <span>CardioAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#predictor" className="hover:text-white transition-colors">Predictor</a>
          <a href="#process" className="hover:text-white transition-colors">How it Works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <Button size="sm" variant="outline" className="hidden md:flex border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800">
          Get App
        </Button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-zinc-400">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
            <Activity className="text-emerald-500" />
            <span>CardioAI</span>
          </div>
          <p className="text-sm max-w-sm leading-relaxed">
            Empowering patients with early detection tools powered by Random Forest Machine Learning algorithms. Our goal is to make heart health monitoring accessible to everyone.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Documentation</li>
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Model Accuracy Report</li>
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Medical Disclaimer</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-emerald-500 cursor-pointer transition-colors">Contact Support</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-xs text-zinc-600 flex justify-between">
        <span>© 2024 CardioAI Inc. All rights reserved.</span>
        <span>Not a replacement for professional medical advice.</span>
      </div>
    </footer>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-zinc-200">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 opacity-100 pb-6" : "max-h-0 opacity-0"}`}>
        <p className="text-zinc-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | number>(null);

  // Updated State with all required fields
  const [formData, setFormData] = useState({
    age: "",
    gender: "1",
    height: "",
    weight: "",
    ap_hi: "",
    ap_lo: "",
    cholesterol: "1",
    gluc: "1",
    smoke: "0",
    alco: "0",
    active: "1"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculatePrediction = async () => {
    setLoading(true);
    
    // Calculate BMI explicitly before sending
    // BMI = weight(kg) / (height(m) * height(m))
    const heightInMeters = Number(formData.height) / 100;
    const bmiValue = Number(formData.weight) / (heightInMeters * heightInMeters);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: Number(formData.age),
          gender: Number(formData.gender),
          height: Number(formData.height), // Sending raw height too if needed
          weight: Number(formData.weight), // Sending raw weight too if needed
          ap_hi: Number(formData.ap_hi),
          ap_lo: Number(formData.ap_lo),
          cholesterol: Number(formData.cholesterol),
          gluc: Number(formData.gluc),
          smoke: Number(formData.smoke),
          alco: Number(formData.alco),
          active: Number(formData.active),
          bmi: bmiValue // Sending the calculated BMI
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.risk); 
    } catch (error) {
      console.error("Error connecting to Python model:", error);
      alert("Error: Could not connect to the model. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />
      
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black -z-10" />
      
      <main className="pt-32 px-6">
        
        {/* HERO SECTION */}
        <div id="predictor" className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-emerald-400 text-sm font-medium">
              <Brain className="w-4 h-4" />
              <span>Powered by Random Forest v1.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Predict Heart Health <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
                In Seconds.
              </span>
            </h1>
            
            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Our advanced ML model analyzes your biometrics—Age, BMI, Blood Pressure, and Lifestyle—to estimate cardiovascular risk with 73% accuracy.
            </p>

            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Secure Data
               </div>
               <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Stethoscope className="w-5 h-5 text-emerald-500" /> Medically Tuned
               </div>
            </div>

            {result !== null && (
              <div className={`mt-8 p-6 rounded-2xl border ${result === 1 ? 'border-red-500/30 bg-red-950/20' : 'border-emerald-500/30 bg-emerald-950/20'} backdrop-blur-sm animate-in zoom-in-95 duration-300`}>
                <h3 className={`text-xl font-bold flex items-center gap-3 ${result === 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <HeartPulse className="w-6 h-6" />
                  {result === 1 ? "Attention Needed" : "Optimal Health"}
                </h3>
                <p className="text-zinc-400 mt-2">
                  {result === 1 
                    ? "Our model detects patterns similar to patients with cardiovascular issues. Please consult a specialist." 
                    : "Your biometric patterns align with healthy patients in our dataset. Keep up the good work!"}
                </p>
              </div>
            )}
          </div>

          {/* FORM CARD */}
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <SpotlightCard className="p-8 border-zinc-800/50 bg-black/40 backdrop-blur-xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Health Analysis</h2>
                  <p className="text-zinc-500 text-sm">Enter your vitals below.</p>
                </div>
                
                {/* Row 1: Age & Gender */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Age (Years)</Label>
                    <Input name="age" type="number" placeholder="50" className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 h-11" onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Gender</Label>
                    <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="2">Male</SelectItem>
                        <SelectItem value="1">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Height & Weight */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Height (cm)</Label>
                    <Input name="height" type="number" placeholder="175" className="bg-zinc-900/50 border-zinc-800 h-11" onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Weight (kg)</Label>
                    <Input name="weight" type="number" placeholder="75" className="bg-zinc-900/50 border-zinc-800 h-11" onChange={handleChange} />
                  </div>
                </div>

                {/* Row 3: Blood Pressure */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Systolic (Hi)</Label>
                    <Input name="ap_hi" type="number" placeholder="120" className="bg-zinc-900/50 border-zinc-800 h-11" onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Diastolic (Lo)</Label>
                    <Input name="ap_lo" type="number" placeholder="80" className="bg-zinc-900/50 border-zinc-800 h-11" onChange={handleChange} />
                  </div>
                </div>

                {/* Row 4: Cholesterol & Glucose */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Cholesterol</Label>
                    <Select onValueChange={(val) => handleSelectChange("cholesterol", val)} defaultValue="1">
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="Normal" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="1">Normal</SelectItem>
                        <SelectItem value="2">Above Normal</SelectItem>
                        <SelectItem value="3">Well Above Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Glucose</Label>
                    <Select onValueChange={(val) => handleSelectChange("gluc", val)} defaultValue="1">
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="Normal" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="1">Normal</SelectItem>
                        <SelectItem value="2">Above Normal</SelectItem>
                        <SelectItem value="3">Well Above Normal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 5: Habits (Smoke, Alcohol, Active) */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Smoke?</Label>
                    <Select onValueChange={(val) => handleSelectChange("smoke", val)} defaultValue="0">
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="No" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Alcohol?</Label>
                    <Select onValueChange={(val) => handleSelectChange("alco", val)} defaultValue="0">
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="No" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="0">No</SelectItem>
                        <SelectItem value="1">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">Active?</Label>
                    <Select onValueChange={(val) => handleSelectChange("active", val)} defaultValue="1">
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 h-11">
                        <SelectValue placeholder="Yes" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={calculatePrediction} 
                  disabled={loading}
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 mt-4 text-base font-semibold tracking-tight transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <Activity className="animate-spin w-4 h-4" /> Processing...
                    </span>
                  ) : "Analyze My Risk"}
                </Button>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <div className="max-w-7xl mx-auto mb-32 border-y border-zinc-900 bg-zinc-950/30">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">70k+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Patient Records</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">73%</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Model Accuracy</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">&lt;1s</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Analysis Time</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-zinc-500 uppercase tracking-widest">Availability</div>
            </div>
          </div>
        </div>

        {/* PROCESS SECTION */}
        <div id="process" className="max-w-7xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400">From your data to a detailed health insight in three steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="relative p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-900/40 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mb-6">
                   <Database />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Data Entry</h3>
                <p className="text-zinc-400">You input simple biometrics. We don't ask for names or sensitive personal identifiers, ensuring your privacy.</p>
             </div>
             
             <div className="relative p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-900/40 transition-all">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-6">
                   <Zap />
                </div>
                <h3 className="text-xl font-bold mb-3">2. AI Processing</h3>
                <p className="text-zinc-400">Our Random Forest model cross-references your vitals against 70,000 historical patient outcomes to find patterns.</p>
             </div>

             <div className="relative p-8 rounded-2xl bg-zinc-900/20 border border-zinc-800 hover:bg-zinc-900/40 transition-all">
                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-6">
                   <Lock />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Risk Assessment</h3>
                <p className="text-zinc-400">You receive an instant probability score, allowing you to decide if you need to schedule a doctor's visit.</p>
             </div>
          </div>
        </div>

        {/* INFO GRID SECTION */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8 md:p-12 overflow-hidden relative">
            <div className="relative z-10">
               <h2 className="text-3xl font-bold mb-6">Understanding BMI & Blood Pressure</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">1</div>
                     <div>
                        <h4 className="font-bold text-white">Systolic (Top Number)</h4>
                        <p className="text-zinc-400 text-sm mt-1">Measures the pressure in your arteries when your heart beats. High values can indicate stress.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">2</div>
                     <div>
                        <h4 className="font-bold text-white">Diastolic (Bottom Number)</h4>
                        <p className="text-zinc-400 text-sm mt-1">Measures the pressure in your arteries between beats. This should be lower than the top number.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Decorative chart visual */}
            <div className="relative h-64 bg-zinc-950 rounded-xl border border-zinc-800 p-4 flex items-end justify-between gap-2">
               {[40, 65, 45, 80, 55, 90, 70, 95].map((h, i) => (
                  <div key={i} style={{height: `${h}%`}} className="w-full bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors" />
               ))}
               <div className="absolute top-4 left-4 text-xs text-zinc-500 font-mono">Sample Patient Data Distribution</div>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div id="faq" className="max-w-3xl mx-auto mb-24">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
           </div>
           <div className="space-y-2">
              <FAQItem 
                 question="Is this a medical diagnosis?" 
                 answer="No. This tool is for informational purposes only. It uses statistical probability based on historical data to estimate risk. Always consult a certified medical professional for diagnosis." 
              />
              <FAQItem 
                 question="How accurate is the 73% figure?" 
                 answer="This accuracy was achieved using K-Fold Cross Validation on the Cardiovascular Disease dataset. While 73% is standard for this specific public dataset, real-world individual results may vary." 
              />
              <FAQItem 
                 question="Is my data saved?" 
                 answer="No. All processing happens in your browser session (or transiently on our server for the demo). We do not store your personal health data." 
              />
               <FAQItem 
                 question="What do I do if the result is 'High Risk'?" 
                 answer="Don't panic. High risk in our model simply means your vitals match patterns of patients who had heart issues. We recommend scheduling a routine check-up with your doctor to be sure." 
              />
           </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

function ScaleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
  )
}