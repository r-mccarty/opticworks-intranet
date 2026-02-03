import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from '@tremor/react';
import type { SpriteStatus } from './types';
import { getTeamForSprite } from './types';
import { HealthBadge, ApiStatusBadge, ToolBadge } from './HealthBadge';

interface FleetTableProps {
  sprites: SpriteStatus[];
  teamFilter: string;
}

export function FleetTable({ sprites, teamFilter }: FleetTableProps) {
  const filteredSprites = teamFilter === 'all'
    ? sprites
    : sprites.filter((s) => getTeamForSprite(s.name) === teamFilter);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Sprite</TableHeaderCell>
          <TableHeaderCell>Team</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>API Status</TableHeaderCell>
          <TableHeaderCell>Response</TableHeaderCell>
          <TableHeaderCell>Tools</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredSprites.map((sprite) => (
          <TableRow key={sprite.name}>
            <TableCell>
              <code className="text-sm">{sprite.name}</code>
            </TableCell>
            <TableCell>
              <Badge color="gray">{getTeamForSprite(sprite.name)}</Badge>
            </TableCell>
            <TableCell>
              <HealthBadge healthy={sprite.healthy} status={sprite.api_status} />
            </TableCell>
            <TableCell>
              <ApiStatusBadge status={sprite.api_status} />
            </TableCell>
            <TableCell>
              {sprite.api_response_ms !== null ? (
                <span className="text-sm">{sprite.api_response_ms}ms</span>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <ToolBadge available={sprite.claude_available} tool="claude" />
                <ToolBadge available={sprite.codex_available} tool="codex" />
              </div>
            </TableCell>
          </TableRow>
        ))}
        {filteredSprites.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-400">
              No sprites found for the selected filter
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
