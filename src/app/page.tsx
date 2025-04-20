"use client";

import { useState } from 'react';
import { BrainyTutor } from '@/components/BrainyTutor';

export default function Home() {
  const [userQuery, setUserQuery] = useState('');
  const [stepByStep, setStepByStep] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Brainy Tutor</h1>
      <BrainyTutor
        userQuery={userQuery}
        stepByStep={stepByStep}
        onUserQueryChange={setUserQuery}
        onStepByStepChange={setStepByStep}
      />
    </div>
  );
}
