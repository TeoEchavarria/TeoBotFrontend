"use client";

import React, { useState, useEffect } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bookmark, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useVault } from '@/hooks/use-vault';

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
  const { savedQueries, saveQuery, deleteQuery } = useVault();
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (stepByStep && response && (response as StepByStepResponse).clues) {
      setRevealedClues(new Array((response as StepByStepResponse).clues.length).fill(false));
    }
  }, [stepByStep, response]);

  useEffect(() => {
    const exists = savedQueries.some(q => q.text === userQuery);
    setIsSaved(exists);
  }, [savedQueries, userQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: BrainyTutorParams = { user_query: userQuery, step_by_step: stepByStep };
      const res = await getBrainyTutorResponse(params);
      setResponse(res);
      setSearchClicked(true);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo obtener la respuesta.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const revealClue = (index: number) => {
    setRevealedClues(prev => { const next = [...prev]; next[index] = true; return next; });
  };

  const handleSaveClick = () => {
    if (isSaved) {
      const idx = savedQueries.findIndex(q => q.text === userQuery);
      if (idx > -1) deleteQuery(idx);
      setIsSaved(false);
    } else {
      saveQuery(userQuery);
      setIsSaved(true);
    }
  };

  const ExampleSection = ({ example }: { example?: SummaryResponse['example'] }) => {
    if (!example) return null;
    return (
      <div>
        <h3 className="text-lg font-semibold mt-4">Example: {example.title}</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="example" className="border-none">
            <AccordionTrigger>Preview Steps</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 mt-2">
                {example.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  const AnkiSection: React.FC<{anki: SummaryResponse['anki']}> = ({ anki }) => (
    <div>
      <h3 className="text-lg font-semibold mt-4">Anki Flashcard</h3>
      <div className="mt-2 anki-actions">
        <Button variant="outline" className="btn">Convert to ANKI CARD</Button>
        <Button
          onClick={handleSaveClick}
          aria-label={isSaved ? "Remove from vault" : "Save to vault"}
          title={isSaved ? "Removed from vault" : "Saved to vault"}
          className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" />
        </Button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="w-full mx-auto space-y-6 pb-24">
      {/* Search Form */}
      <form className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Input
            type="text"
            placeholder="Enter your query"
            value={userQuery}
            onChange={e => onUserQueryChange(e.target.value)}
            className="flex-1 h-12 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button type="button" onClick={fetchData} disabled={isLoading}
              className="flex-1 h-12 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition transform hover:scale-105"
            >
              {isLoading ? <><Icons.spinner className="mr-2 h-5 w-5 animate-spin"/>Searching...</> : "Search"}
            </Button>
            <Button
              type="button"
              onClick={() => onStepByStepChange(!stepByStep)}
              className={`flex-1 h-12 rounded-full shadow transition transform hover:scale-105 ${stepByStep ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {stepByStep ? "Step-by-Step On" : "Step-by-Step Off"}
            </Button>
          </div>
        </div>
      </form>

      {/* Loading */}
      {isLoading && (
        <Alert>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>Fetching the answer...</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {searchClicked && response && !isLoading && (
        <Card className="shadow-sm mx-auto max-w-[85%]">
          <CardContent className="p-3">
            {Object.entries(response).map(([key, value]) => (
              <div key={key} className="mb-3 py-2 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0  max-w-[90%] mx-auto">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">{key}</h3>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{String(value)}</ReactMarkdown>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
