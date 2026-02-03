import { Select, SelectItem } from '@tremor/react';
import { TEAMS } from './types';

interface TeamFilterProps {
  selectedTeam: string;
  onTeamChange: (team: string) => void;
}

export function TeamFilter({ selectedTeam, onTeamChange }: TeamFilterProps) {
  return (
    <div className="mb-4 max-w-xs">
      <Select
        value={selectedTeam}
        onValueChange={onTeamChange}
        placeholder="Filter by team..."
      >
        <SelectItem value="all">All Teams</SelectItem>
        {TEAMS.map((team) => (
          <SelectItem key={team.name} value={team.name}>
            {team.name.charAt(0).toUpperCase() + team.name.slice(1)} - {team.description}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
