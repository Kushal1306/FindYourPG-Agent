import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, ClipboardList, Calendar } from "lucide-react";

const JobDetailsTab = ({ selectedCampaign }) => {
  if (!selectedCampaign) return null;
  
  useEffect(() => {
    console.log("Job description:", selectedCampaign.job_description);
    console.log("Questions:", selectedCampaign.questions);
  }, [selectedCampaign]);

  // Debug helper to ensure questions are properly displayed
  const renderQuestions = () => {
    if (!selectedCampaign.questions) return <p>No questions available</p>;
    
    // Handle the case where questions might be a single string or an array
    const questionsArray = Array.isArray(selectedCampaign.questions) 
      ? selectedCampaign.questions 
      : selectedCampaign.questions.split('\n').filter(q => q.trim());
    
    return questionsArray.map((question, index) => (
      <div key={index} className="flex gap-4 group/item hover:bg-muted/50 p-3 rounded-lg transition-colors">
        {/* <span className="text-primary font-bold text-lg min-w-[24px]">{index + 1}.</span> */}
        <p className="text-[15px] leading-7 text-foreground/80">{question}</p>
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="scroll-m-20 text-3xl font-bold tracking-tight first:mt-0">
          {selectedCampaign.role_name}
        </h2>
        {selectedCampaign.expiry_time && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Expires: {new Date(selectedCampaign.expiry_time).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Job Description Card */}
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl font-bold">Job Description</CardTitle>
              <CardDescription className="font-medium">Role Overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Fixed ScrollArea implementation */}
          <div className="w-full max-h-96">
            <ScrollArea className="h-96 w-full rounded-md pr-4">
              {selectedCampaign.job_description ? (
                <div 
                  className="prose max-w-none text-[15px] leading-7 text-foreground/80"
                  dangerouslySetInnerHTML={{ 
                    __html: selectedCampaign.job_description 
                  }} 
                />
              ) : (
                <p>No job description available</p>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Screening Questions Card */}
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center space-x-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-xl font-bold">Screening Questions</CardTitle>
              <CardDescription className="font-medium">Technical Assessment</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Fixed ScrollArea implementation */}
          <div className="w-full max-h-96">
            <ScrollArea className="h-96 w-full rounded-md">
              <div className="space-y-6 pr-4">
                {renderQuestions()}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsTab;