import { Badge } from '@tremor/react';

interface HealthBadgeProps {
  healthy: boolean;
  status?: string;
}

export function HealthBadge({ healthy, status }: HealthBadgeProps) {
  if (healthy) {
    return <Badge color="green">Healthy</Badge>;
  }
  return <Badge color="red">{status || 'Unhealthy'}</Badge>;
}

interface ApiStatusBadgeProps {
  status: string;
}

export function ApiStatusBadge({ status }: ApiStatusBadgeProps) {
  const colorMap: Record<string, 'green' | 'yellow' | 'blue' | 'red' | 'gray'> = {
    warm: 'green',
    running: 'blue',
    cold: 'yellow',
    not_found: 'red',
    error: 'red',
    unknown: 'gray',
  };

  return <Badge color={colorMap[status] || 'gray'}>{status}</Badge>;
}

interface ToolBadgeProps {
  available: boolean | null;
  tool: string;
}

export function ToolBadge({ available, tool }: ToolBadgeProps) {
  if (available === null) {
    return <Badge color="gray">{tool}: ?</Badge>;
  }
  return (
    <Badge color={available ? 'green' : 'red'}>
      {tool}: {available ? 'yes' : 'no'}
    </Badge>
  );
}
