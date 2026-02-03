import { Card, Metric, Text, Flex, ProgressBar, Grid } from '@tremor/react';
import type { FleetReport } from './types';

interface FleetMetricsProps {
  data: FleetReport;
}

export function FleetMetrics({ data }: FleetMetricsProps) {
  const healthPercent = data.total > 0 ? Math.round((data.healthy / data.total) * 100) : 0;

  return (
    <Grid numItemsSm={2} numItemsLg={4} className="gap-4 mb-6">
      <Card decoration="top" decorationColor="blue">
        <Text>Total Sprites</Text>
        <Metric>{data.total}</Metric>
      </Card>

      <Card decoration="top" decorationColor="green">
        <Text>Healthy</Text>
        <Metric>{data.healthy}</Metric>
      </Card>

      <Card decoration="top" decorationColor="red">
        <Text>Unhealthy</Text>
        <Metric>{data.unhealthy}</Metric>
      </Card>

      <Card decoration="top" decorationColor="indigo">
        <Flex>
          <Text>Health</Text>
          <Text>{healthPercent}%</Text>
        </Flex>
        <ProgressBar value={healthPercent} color={healthPercent >= 80 ? 'green' : healthPercent >= 50 ? 'yellow' : 'red'} className="mt-2" />
      </Card>
    </Grid>
  );
}
