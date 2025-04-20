"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getBrainyTutorResponse, SummaryResponse, StepByStepResponse, BrainyTutorParams } from '@/services/brainy-tutor';
import ReactMarkdown from 'react-markdown';
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface BrainyTutorProps {
  userQuery: string;
  stepByStep: boolean;
  onUserQueryChange: (query: string) => void;
  onStepByStepChange: (stepByStep: boolean) => void;
}

export const BrainyTutor: React.FC<BrainyTutorProps> = ({
  userQuery,
  stepByStep,
  onUserQueryChange,
  onStepByStepChange,
}) => {
  const [response, setResponse] = useState<SummaryResponse | StepByStepResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: BrainyTutorParams = {
        user_query: userQuery,
        step_by_step: stepByStep,
      };
      const data = await getBrainyTutorResponse(params);
      setResponse(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to retrieve information. Please try again.",
        variant: "destructive",
      });
      setResponse(null); // Clear previous response on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUserQueryChange(event.target.value);
  };

  const handleToggle = (checked: boolean) => {
    onStepByStepChange(checked);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
    fetchData();
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-2xl">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter your query"
          value={userQuery}
          onChange={handleSearch}
          className="flex-grow"
        />
        <Button onClick={handleSearchClick} disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
        <Label htmlFor="step-by-step" className="text-sm font-medium">
          Step-by-Step
        </Label>
        <Switch
          id="step-by-step"
          checked={stepByStep}
          onCheckedChange={handleToggle}
        />
      </div>

      {isLoading && (
        <Alert>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>Fetching the answer...</AlertDescription>
        </Alert>
      )}

      {searchClicked && response && !isLoading && (
        <Card>
          <CardContent className="p-4">
            {stepByStep ? (
              (response as StepByStepResponse)?.clues?.map((clue) => (
                <div key={clue.order} className="mb-4">
                  <Badge variant="secondary">Clue {clue.order}</Badge>
                  <h3 className="text-lg font-semibold">{clue.title}</h3>
                  <div className="prose prose-sm mt-2">
                    <ReactMarkdown>{clue.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  Answer
                </h3>
                <div className="prose prose-sm mt-2">
                  <ReactMarkdown>{(response as SummaryResponse).answer}</ReactMarkdown>
                </div>
                {(response as SummaryResponse)?.example && (response as SummaryResponse)?.example?.steps && (
                  <>
                    <h3 className="text-lg font-semibold mt-4">
                      Example: {(response as SummaryResponse).example.title}
                    </h3>
                    <ul className="list-disc pl-5 mt-2">
                      {(response as SummaryResponse).example.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </>
                )}
                <h3 className="text-lg font-semibold mt-4">
                  Analogy
                </h3>
                <p className="mt-2">{(response as SummaryResponse).analogy}</p>
              </>
            )}
            <h3 className="text-lg font-semibold mt-4">
              Anki Flashcard
            </h3>
            <div className="mt-2">
              <p>
                <span className="font-semibold">Front:</span>{" "}
                {(response as SummaryResponse).anki.front}
              </p>
              <p>
                <span className="font-semibold">Back:</span>{" "}
                {(response as SummaryResponse).anki.back}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
