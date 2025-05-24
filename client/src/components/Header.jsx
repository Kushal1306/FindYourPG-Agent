import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Header = ({ campaigns, selectedCampaign, setSelectedCampaign, newCampaign, setNewCampaign, handleAddCampaign }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCampaign} className="space-y-4">
                  <div>
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      required />
                  </div>
                  <div>
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={newCampaign.jobDescription}
                      onChange={(e) => setNewCampaign({ ...newCampaign, jobDescription: e.target.value })}
                      required />
                  </div>
                  <div>
                    <Label htmlFor="questions">Screening Questions</Label>
                    <Textarea
                      id="questions"
                      value={newCampaign.questions}
                      onChange={(e) => setNewCampaign({ ...newCampaign, questions: e.target.value })}
                      placeholder="Enter each question on a new line" />
                  </div>
                  <Button type="submit">Create Campaign</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Select
              value={selectedCampaign?._id?.toString() || ""}
              onValueChange={(value) => setSelectedCampaign(campaigns.find(c => c._id.toString() === value) || null)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign._id} value={campaign._id.toString()}>{campaign.role_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;