import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    type: "JUST_SOLD",
    objective: "",
    printSize: "DL",
    printStock: "150gsm Gloss",
    printQuantity: 1000,
    inHomeDate: "",
    territories: [{ name: "Local Area", geoJson: "{}", estimatedHouseholds: 1000 }]
  });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <div className="text-sm text-gray-500">Step {step} of 4</div>
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
              <div className="space-y-2">
                <Label>Campaign Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. 42 Wallaby Way Just Sold" />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JUST_SOLD">Just Sold</SelectItem>
                    <SelectItem value="JUST_LISTED">Just Listed</SelectItem>
                    <SelectItem value="FARMING">Farming / Nurture</SelectItem>
                    <SelectItem value="MARKET_UPDATE">Market Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Objective</Label>
                <Textarea value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} placeholder="What are you trying to achieve?" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Print Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={formData.printSize} onValueChange={v => setFormData({...formData, printSize: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DL">DL</SelectItem>
                      <SelectItem value="A5">A5</SelectItem>
                      <SelectItem value="A4">A4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Select value={formData.printStock} onValueChange={v => setFormData({...formData, printStock: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150gsm Gloss">150gsm Gloss</SelectItem>
                      <SelectItem value="250gsm Silk">250gsm Silk</SelectItem>
                      <SelectItem value="300gsm Matte">300gsm Matte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" value={formData.printQuantity} onChange={e => setFormData({...formData, printQuantity: parseInt(e.target.value)})} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Target Area & Schedule</h2>
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 mb-4">
                Map Module Placeholder
                <p className="text-sm mt-2">In a full implementation, this integrates with Leaflet/Mapbox to draw polygons and estimate households.</p>
              </div>
              <div className="space-y-2">
                <Label>Requested In-Home Date</Label>
                <Input type="date" value={formData.inHomeDate} onChange={e => setFormData({...formData, inHomeDate: e.target.value})} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">Title:</span> <span className="font-medium">{formData.title}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-medium">{formData.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Specs:</span> <span className="font-medium">{formData.printQuantity}x {formData.printSize} on {formData.printStock}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">In-Home Date:</span> <span className="font-medium">{formData.inHomeDate || 'TBD'}</span></div>
              </div>
              <p className="text-sm text-gray-500">Submitting will send this campaign for agency admin approval before it is dispatched to the printer.</p>
            </div>
          )}
        </CardContent>
        
        <div className="p-6 border-t bg-gray-50 flex justify-between rounded-b-lg">
          <Button variant="outline" onClick={handlePrev} disabled={step === 1}>Back</Button>
          {step < 4 ? (
            <Button onClick={handleNext}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Campaign</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
