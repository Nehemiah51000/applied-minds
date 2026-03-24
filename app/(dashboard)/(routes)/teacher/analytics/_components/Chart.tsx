'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
} from 'recharts';
import {
  type NameType,
  type ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';

interface ChartProps {
  data: {
    courseId: string;
    title: string;
    enrollments: number;
    completions: number;
    completionRate: number;
  }[];
}

function Chart({ data }: ChartProps) {
  const chartData = data.map((course, index) => ({
    name:
      course.title.length > 20
        ? course.title.slice(0, 20) + '...'
        : course.title,
    enrollments: course.enrollments,
    completions: course.completions,
    completionRate: Number((course.completionRate * 100).toFixed(0)),
    isTop: index === 0,
  }));
  const formatter: TooltipProps<ValueType, NameType>['formatter'] = (
    value,
    name,
  ) => {
    if (name === 'Completion Rate') {
      return [`${Number(value ?? 0)}%`, name];
    }
    return [value ?? 0, name];
  };

  return (
    <Card>
      <div className='w-full h-112.5 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold'>Course Performance</h2>

          {chartData[0] && (
            <div className='text-lg bg-orange-500  text-white px-4 py-2 rounded-full font-medium p-6'>
              🏆 Top Performer: {chartData[0].name}
            </div>
          )}
        </div>

        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />

            <XAxis dataKey='name' stroke='#888888' fontSize={12} />

            <YAxis yAxisId='left' stroke='#888888' fontSize={12} />

            <YAxis
              yAxisId='right'
              orientation='right'
              stroke='#f97316'
              fontSize={12}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={formatter}
            />

            <Legend />

            <Bar
              yAxisId='left'
              dataKey='enrollments'
              fill='#f97316'
              radius={[6, 6, 0, 0]}
              name='Enrollments'
              animationDuration={800}
            />

            <Bar
              yAxisId='left'
              dataKey='completions'
              fill='#fb923c'
              radius={[6, 6, 0, 0]}
              name='Completions'
              animationDuration={800}
            />

            <Line
              yAxisId='right'
              type='monotone'
              dataKey='completionRate'
              stroke='#ea580c'
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name='Completion Rate'
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default Chart;
