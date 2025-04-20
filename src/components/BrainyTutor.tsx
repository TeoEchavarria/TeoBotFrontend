"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getBrainyTutorResponse, SummaryResponse, StepByStepResponse, BrainyTutorParams, Clue } from '@/services/brainy-tutor';
import ReactMarkdown from 'react-markdown';
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bookmark } from 'lucide-react';

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
  const [revealedClues, setRevealedClues] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (stepByStep && response && (response as StepByStepResponse).clues) {
      setRevealedClues(new Array((response as StepByStepResponse).clues.length).fill(false));
    }
  }, [stepByStep, response]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Mocked data for testing purposes
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      const mockedSummaryResponse: SummaryResponse = {
        answer: 'The answer is multifaceted and complex, tailored to the query.',
        example: {
          title: 'A Practical Scenario',
          steps: ['Consider a scenario...', 'Apply the concept...', 'Observe the result...'],
        },
        analogy: 'It is like building a house from scratch, one brick at a time.',
        anki: { front: 'What is a key concept?', back: 'Multifacetedness and step-by-step learning' },
      };

      const mockedStepByStepResponse: StepByStepResponse = {
        clues: [
          { order: 1, title: 'Step 1: Foundation', content: 'Lay the groundwork...', revealed: false },
          { order: 2, title: 'Step 2: Construction', content: 'Build upon the base...', revealed: false },
          { order: 3, title: 'Step 3: Completion', content: 'Finalize the structure...', revealed: false },
        ],
        anki: { front: 'What is the final step?', back: 'Completion with iterative refinement' },
      };

      const params: BrainyTutorParams = {
        user_query: userQuery,
        step_by_step: stepByStep,
      };

      // setResponse(params.step_by_step ? mockedStepByStepResponse : mockedSummaryResponse);
      const response = await getBrainyTutorResponse(params);
      setResponse(response);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to retrieve information. Please try again.",
        variant: "destructive",
      });
      setResponse(null); // Clear previous response on error
      setRevealedClues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUserQueryChange(event.target.value);
    setSearchClicked(false); // Reset search clicked when typing
    setResponse(null); // Clear previous response when typing
    setRevealedClues([]);
    if (event.target.value) {
      fetchData();
    }
  };

  const handleToggle = (checked: boolean) => {
    onStepByStepChange(checked);
    setRevealedClues([]);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
    setRevealedClues([]);
    fetchData();
  };

  const revealClue = (index: number) => {
    setRevealedClues(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const ExampleSection = ({ example }: { example: SummaryResponse['example'] }) => {
    return (
      <div>
        <h3 className="text-lg font-semibold mt-4">Example: {example.title}</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="example">
            <AccordionTrigger>
              Preview Steps
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 mt-2">
                {example.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };


  const AnkiSection = ({ anki }: { anki: SummaryResponse['anki'] }) => {
    return (
      <div>
        <h3 className="text-lg font-semibold mt-4">Anki Flashcard</h3>
        <div className="mt-2">
          <p>
            <span className="font-semibold">Front:</span> {anki.front}
          </p>
          <p>
            <span className="font-semibold">Back:</span> {anki.back}
          </p>
          <Button variant="outline" className="mr-2">
            Convert to ANKI CARD
          </Button>
          <Button variant="outline" aria-label="Save to vault" title="Save to vault">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
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
              (response as StepByStepResponse)?.clues?.map((clue, index) => (
                <div key={clue.order} className="mb-4">
                  <Badge variant="secondary">Clue {clue.order}</Badge>
                  <h3 className="text-lg font-semibold">{clue.title}</h3>
                  <div className={`prose prose-sm mt-2 ${!revealedClues[index] ? 'blur-lg' : ''}`}>
                    <ReactMarkdown>{clue.content}</ReactMarkdown>
                  </div>
                  {!revealedClues[index] && (
                    <Button variant="outline" onClick={() => revealClue(index)}>
                      Reveal Clue
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Answer</h3>
                  <div className="prose prose-sm mt-2">
                    <ReactMarkdown>{(response as SummaryResponse).answer}</ReactMarkdown>
                  </div>
                </div>

                <ExampleSection example={(response as SummaryResponse).example} />

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mt-4">Analogy</h3>
                  <p className="mt-2">{(response as SummaryResponse).analogy}</p>
                </div>

                <AnkiSection anki={(response as SummaryResponse).anki} />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
