"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Card from "@/components/Card";
import InterviewSession from "@/components/InterviewSession";

interface InterviewEntryProps {
  id: string;
}

export default function InterviewEntry({ id }: InterviewEntryProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState<string | undefined>();
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      setLoadingQuestions(true);

      try {
        const response = await fetch(`/api/interview/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (!cancelled) {
            setQuestions(data.questions ?? []);
            setJobTitle(data.jobTitle);
            setLoadingQuestions(false);
          }
          return;
        }
      } catch (err) {
        console.error("Failed to fetch interview from API:", err);
      }

      const storedQuestions = sessionStorage.getItem(
        `interview_questions_${id}`,
      );
      if (storedQuestions && !cancelled) {
        try {
          setQuestions(JSON.parse(storedQuestions));
        } catch (err) {
          console.error("Failed to parse questions from sessionStorage:", err);
        }
      }

      if (!cancelled) setLoadingQuestions(false);
    };

    loadQuestions().finally(() => {
      if (!cancelled) setLoadingQuestions(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStartInterview = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      setHasStarted(true);
    }, 800);
  };

  const handleEndInterview = () => {
    setHasStarted(false);
    setName("");
    setEmail("");
  };

  if (hasStarted) {
    return (
      <InterviewSession
        hasStarted={hasStarted}
        onEnd={handleEndInterview}
        questions={questions}
        candidateName={name}
        jobTitle={jobTitle}
      />
    );
  }

  return (
    <div className=" min-h-screen  py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full ">
        <Card>
          <div className="text-center mb-8">
            <SectionTitle center subtitle="Please enter your details to begin">
              AI Interview Session
            </SectionTitle>
            <p className="text-sm text-gray-300">Interview ID: {id}</p>
            {!loadingQuestions && questions.length > 0 && (
              <p className="text-sm text-green-400 mt-2">
                {questions.length} interview questions ready
              </p>
            )}
            {!loadingQuestions && questions.length === 0 && (
              <p className="text-sm text-amber-400 mt-2">
                No saved questions found — the AI will use general interview
                questions
              </p>
            )}
          </div>

          <div className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="p-4 bg-indigo-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">
                Before you start:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Ensure you&apos;re in a quiet environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Check your microphone permissions (required)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Camera is optional for the video preview</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStartInterview}
              className="w-full cursor-pointer hover:scale-105 transition-all  "
              size="lg"
              disabled={
                !name || !email || isStarting || loadingQuestions
              }
            >
              {isStarting
                ? "Connecting..."
                : loadingQuestions
                  ? "Loading interview..."
                  : "Start AI Interview"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By starting this interview, you agree to be recorded for
              evaluation purposes
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact{" "}
            <a
              href="mailto:support@aijobassistant.com"
              className="text-indigo-600 hover:underline"
            >
              support@aijobassistant.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
