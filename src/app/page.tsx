"use client";

import { useState } from 'react';
import { BrainyTutor } from '@/components/BrainyTutor';
import { Vault } from '@/components/Vault';

export default function Home() {
  const [userQuery, setUserQuery] = useState('');
  const [stepByStep, setStepByStep] = useState(false);

  return (
    <>
      <BrainyTutor
        userQuery={userQuery}
        stepByStep={stepByStep}
        onUserQueryChange={setUserQuery}
        onStepByStepChange={setStepByStep}
      />
      <Vault />
    </>
  );
}

