// Fleet Dashboard Types
// Matches the JSON structure from agent-harness/scripts/fleet/fleet.py

export interface SpriteStatus {
  name: string;
  api_status: string;           // warm, cold, running, not_found, error
  api_response_ms: number | null;
  responsive: boolean | null;
  probe_response_ms: number | null;
  claude_available: boolean | null;
  codex_available: boolean | null;
  healthy: boolean;
}

export interface FleetReport {
  timestamp: string;
  total: number;
  healthy: number;
  unhealthy: number;
  sprites: SpriteStatus[];
  errors: Array<{
    sprite: string;
    status: string;
    error: string | null;
  }>;
}

// Team definitions from config.yaml
export interface Team {
  name: string;
  description: string;
  sprites: string[];
}

export const TEAMS: Team[] = [
  {
    name: 'agents',
    description: 'Automated code review and synthesis',
    sprites: ['agents-review-claude-01', 'agents-review-codex-01', 'agents-synth-01'],
  },
  {
    name: 'dev',
    description: 'General purpose workspaces',
    sprites: ['dev-workspace-01'],
  },
  {
    name: 'infra',
    description: 'Infrastructure and provisioning',
    sprites: ['infra-bootstrap-01'],
  },
  {
    name: 'mobile',
    description: 'Distributed task execution',
    sprites: ['mobile-conductor-01', 'mobile-worker-01', 'mobile-worker-02'],
  },
];

export function getTeamForSprite(spriteName: string): string {
  for (const team of TEAMS) {
    if (team.sprites.includes(spriteName)) {
      return team.name;
    }
  }
  return 'unknown';
}
