// BrainyTutor.tsx – responsive: stacked on mobile, side‑by‑side on ≥sm

"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Icons } from "@/components/icons";
import { getBrainyTutorResponse, BrainyTutorParams } from "@/services/brainy-tutor";
import { useToast } from "@/hooks/use-toast";
import { useVault } from "@/hooks/use-vault";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

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
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [revealedClues, setRevealedClues] = useState<boolean[]>([]);
  const { toast } = useToast();
  const { savedQueries, saveQuery, deleteQuery } = useVault();
  const [isSaved, setIsSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("default");

  const profiles = [
    { value: "default", label: "Default", imgSrc: "/profiles/default.png" },
    { value: "life_coach", label: "Life Coach", imgSrc: "/profiles/life_coach.png" },
    { value: "playful_explorer", label: "Playful Explorer", imgSrc: "/profiles/playful_explorer.png" },
    { value: "expert", label: "Expert", imgSrc: "/profiles/expert_socratic_partner.png" },
  ];

  /* ---------------- Effects ---------------- */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setResponse(null);
    setSearchClicked(false);
    setRevealedClues([]);
  }, [stepByStep]);

  useEffect(() => {
    if (stepByStep && response) {
      const len = Object.keys(response).length;
      setRevealedClues(Array(len).fill(false));
    }
  }, [stepByStep, response]);

  useEffect(() => {
    setIsSaved(savedQueries.some((q) => q.text === userQuery));
  }, [savedQueries, userQuery]);

  /* ---------------- Handlers ---------------- */
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const profileLabel =
        profiles.find((p) => p.value === selectedProfile)?.label ?? selectedProfile;

      const params: BrainyTutorParams = {
        user_query: userQuery,
        step_by_step: stepByStep,
        profile: profileLabel,
      };

      const res = await getBrainyTutorResponse(params);
      setResponse(res);
      setSearchClicked(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo obtener la respuesta.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const revealClue = (idx: number) =>
    setRevealedClues((prev) => prev.map((v, i) => (i === idx ? true : v)));

  const toggleSave = () => {
    if (isSaved) {
      const idx = savedQueries.findIndex((q) => q.text === userQuery);
      if (idx > -1) deleteQuery(idx);
    } else {
      saveQuery(userQuery);
    }
    setIsSaved(!isSaved);
  };

  /* ---------------- JSX ---------------- */
  if (!mounted) return null;

  return (
    <div className="w-full mx-auto space-y-6 pb-24">
      {/* Form */}
      <form className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Profile selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center sm:justify-center focus:outline-none">
                <img
                  src={profiles.find((p) => p.value === selectedProfile)?.imgSrc}
                  alt={selectedProfile}
                  className="hidden sm:block rounded-full"
                />
                <span className="sm:hidden text-sm font-medium truncate">
                  {profiles.find((p) => p.value === selectedProfile)?.label}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={4} className="w-56">
              <DropdownMenuLabel>Profiles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedProfile} onValueChange={setSelectedProfile}>
                {profiles.map(({ value, label, imgSrc }) => (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    className="flex items-center space-x-4 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <span>{label}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Input */}
          <Input
            value={userQuery}
            placeholder="Enter your query"
            onChange={(e) => onUserQueryChange(e.target.value)}
            className="flex-1 h-12 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600"
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              type="button"
              onClick={fetchData}
              disabled={isLoading}
              className="flex-1 h-12 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition-transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => onStepByStepChange(!stepByStep)}
              className={`flex-1 h-12 rounded-full shadow transition-transform hover:scale-105 ${
                stepByStep
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {stepByStep ? "Step-by-Step On" : "Step-by-Step Off"}
            </Button>
          </div>
        </div>
      </form>

      {/* Loading alert */}
      {isLoading && (
        <Alert>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>Fetching the answer...</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {searchClicked && response && !isLoading && (
        <Card className="border-none shadow-none mx-auto max-w-[85%]">
          <CardContent className="p-4">
            {stepByStep ? (
              Object.entries(response).map(([title, content], idx) => (
                <div key={idx} className="mb-4">
                  <Badge variant="secondary">Clue {idx + 1}</Badge>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <div className={`${!revealedClues[idx] ? "blur-lg" : ""} prose prose-sm mt-2`}>
                    <ReactMarkdown>{String(content)}</ReactMarkdown>
                  </div>
                  {!revealedClues[idx] && (
                    <Button
                      variant="outline"
                      className="rounded-full shadow hover:scale-105 transition-transform mt-2"
                      onClick={() => revealClue(idx)}
                    >
                      Reveal Clue
                    </Button>
                  )}
                </div>
              ))
            ) : (
              Object.entries(response).map(([title, content], idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <div className="prose prose-sm mt-2">
                    <ReactMarkdown>{String(content)}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}
            {searchClicked && (
              <div className="flex justify-end mt-6">
                <Button
                  onClick={toggleSave}
                  aria-label={isSaved ? "Remove from vault" : "Save to vault"}
                  className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
                >
                  <Bookmark className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
