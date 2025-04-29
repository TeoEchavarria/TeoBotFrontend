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
    { value: "expert_socratic_partner", label: "Expert", imgSrc: "/profiles/expert_socratic_partner.png" },
  ];

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setResponse(null);
    setSearchClicked(false);
    setRevealedClues([]);
  }, [stepByStep]);
  useEffect(() => {
    if (stepByStep && response) {
      const count = Object.keys(response).filter(
        (key) => !["generate_image", "generate_graphic", "search_video"].includes(key)
      ).length;
      setRevealedClues(Array(count).fill(false));
    }
  }, [stepByStep, response]);
  useEffect(() => {
    setIsSaved(savedQueries.some((q) => q.text === userQuery));
  }, [savedQueries, userQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: BrainyTutorParams = { user_query: userQuery, step_by_step: stepByStep, profile: selectedProfile };
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
    } else saveQuery(userQuery);
    setIsSaved(!isSaved);
  };

  // Flatten media
  const images = [...(response?.generate_image || []), ...(response?.generate_graphic || [])];
  const videos = response?.search_video || [];
  const getYouTubeThumbnail = (url: string) => {
    const m = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w-]{11})/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
  };

  if (!mounted) return null;

  return (
    <div className="w-full mx-auto space-y-6 pb-24">
      <form className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full sm:w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <img
                  src={profiles.find((p) => p.value === selectedProfile)?.imgSrc}
                  alt={selectedProfile}
                  className="hidden sm:block rounded-full"
                />
                <span className="sm:hidden text-sm truncate">
                  {profiles.find((p) => p.value === selectedProfile)?.label}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={4} className="w-56">
              <DropdownMenuLabel>Profiles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedProfile} onValueChange={setSelectedProfile}>
                {profiles.map(({ value, label }) => (
                  <DropdownMenuRadioItem key={value} value={value} className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Input
            value={userQuery}
            placeholder="Enter your query"
            onChange={(e) => onUserQueryChange(e.target.value)}
            className="flex-1 h-12 px-4 text-lg rounded-lg border border-gray-300 dark:border-gray-600"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={fetchData} disabled={isLoading} className="flex-1 h-12 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700">
              {isLoading ? <><Icons.spinner className="mr-2 h-5 w-5 animate-spin"/>Searching...</> : "Search"}
            </Button>
            <Button
              onClick={() => onStepByStepChange(!stepByStep)}
              className={`flex-1 h-12 rounded-full shadow ${stepByStep ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 hover:bg-gray-300'}`}
            >
              {stepByStep ? 'Step-by-Step On' : 'Step-by-Step Off'}
            </Button>
          </div>
        </div>
      </form>

      {isLoading && (
        <Alert>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          <AlertTitle>Loading</AlertTitle>
          <AlertDescription>Fetching the answer...</AlertDescription>
        </Alert>
      )}

      {searchClicked && response && !isLoading && (
        <Card className="mx-auto max-w-[90%] sm:max-w-[70%] md:max-w-[65%] border-none shadow-none">
          <CardContent className="p-4">
            {(stepByStep
              ? Object.entries(response).filter(([k]) => !["generate_image","generate_graphic","search_video"].includes(k))
              : Object.entries(response).filter(([k]) => !["generate_image","generate_graphic","search_video"].includes(k))
            ).map(([title, content], idx) => (
              <div key={idx} className="mb-6">
                {stepByStep && <Badge variant="secondary">Clue {idx+1}</Badge>}
                <h3 className="text-lg font-semibold mt-1">{title}</h3>
                <div className={`prose prose-sm mt-2 text-justify ${stepByStep && !revealedClues[idx] ? 'blur-lg' : ''}`}>
                  <ReactMarkdown>{String(content)}</ReactMarkdown>
                </div>
                {stepByStep && !revealedClues[idx] && (
                  <Button variant="outline" className="mt-2" onClick={() => revealClue(idx)}>
                    Reveal Clue
                  </Button>
                )}
              </div>
            ))}

            {images.length > 0 && (
              images.length === 1 ? (
                <div className="flex justify-center mt-6">
                  <a href={`data:image/png;base64,${images[0]}`} target="_blank" rel="noopener noreferrer">
                    <img src={`data:image/png;base64,${images[0]}`} alt="img-0" className="max-w-full h-auto rounded-lg shadow" />
                  </a>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
                  {images.map((b64, i) => (
                    <a key={i} href={`data:image/png;base64,${b64}`} target="_blank" rel="noopener noreferrer">
                      <img src={`data:image/png;base64,${b64}`} alt={`img-${i}`} className="max-w-full h-auto rounded-lg shadow" />
                    </a>
                  ))}
                </div>
              )
            )}

            {videos.length > 0 && (
              <div className="mt-6 flex flex-col items-center space-y-2">
                {videos.map((url, i) => {
                  const thumb = getYouTubeThumbnail(url);
                  return (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                          {thumb && <img src={thumb} alt="thumb" className="w-8 h-8 rounded" />}
                          <span>Ver video de YouTube</span>
                        </div>
                      </Button>
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-8">
              <Button onClick={toggleSave} aria-label={isSaved ? 'Remove' : 'Save'} className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700">
                <Bookmark className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};