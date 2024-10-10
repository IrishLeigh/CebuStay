import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';

export default function PageViewsBarChart({profitData}) {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  console.log(profitData);
  const months = profitData.map(item => item.month.split(' ')[0]); // Get month names
  const profits = profitData.map(item => item.profit);

  const totalProfit = profits.reduce((acc, profit) => acc + profit, 0);
  const profitMargin = (totalProfit / (totalProfit + 10000)) * 100;
  const formattedMargin = profitMargin.toFixed(2); // Format to 2 decimal places
  const chipLabel = `${formattedMargin > 0 ? '+' : ''}${formattedMargin}%`;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Profit margin
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
            {totalProfit.toLocaleString()}
            </Typography>
            {/* <Chip size="small" color="error" label={chipLabel} /> */}
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Profit  for the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: months,
            },
          ]}
          series={[
            {
              id: 'profit',
            label: 'Profit',
            data: profits,
              stack: 'A',
            },

          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: { 
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
