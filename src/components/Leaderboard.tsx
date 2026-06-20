import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  playedAt: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scores/leaderboard')
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader>
        <CardTitle className="text-center text-amber-900">🏆 Top 10 Scores</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-amber-700">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-amber-700">No scores yet!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-300 text-amber-800">
                <th className="py-1 text-left">#</th>
                <th className="py-1 text-left">Player</th>
                <th className="py-1 text-right">Score</th>
                <th className="py-1 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={`${entry.rank}-${entry.username}-${entry.playedAt}`} className="border-b border-amber-100">
                  <td className="py-1 text-amber-700">{entry.rank}</td>
                  <td className="py-1 font-medium text-amber-900">{entry.username}</td>
                  <td className={`py-1 text-right font-bold ${entry.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${entry.score}
                  </td>
                  <td className="py-1 text-right text-amber-600">
                    {entry.playedAt.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
