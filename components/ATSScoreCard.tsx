interface ATSScoreCardProps {
  score: number;
  strengths: string[];
  improvements: string[];
  missingSkills: string[];
}

export default function ATSScoreCard({
  score,
  strengths,
  improvements,
  missingSkills,
}: ATSScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="bg-transparent mt-10 border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">ATS Compatibility Score</h2>
        <div
          className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBg(
            score
          )} text-white mb-4`}
        >
          <span className="text-6xl font-bold">{score}</span>
        </div>
        <p className={`text-xl font-semibold ${getScoreColor(score)}`}>
          {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>

      {/* Strengths */}
        <div className="bg-transparent border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Strengths
        </h3>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start border-b-2 border-green-500 pb-2">
              <span className="text-green-600 mr-2 text-2xl">•</span>
              <span className="text-cyan-100">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="bg-transparent border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Suggested Improvements
        </h3>
        <ul className="space-y-2">
          {improvements.map((improvement, index) => (
            <li key={index} className="flex items-start border-b-2 border-red-500 pb-2">
              <span className="text-orange-600 mr-2 text-2xl">•</span>
              <span className="text-cyan-100">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Skills */}
      <div className="bg-transparent border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Recommended Skills to Add
        </h3>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
