import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IDataCardProps {
  value: number;
  label: string;
}

function DataCard({ value, label }: IDataCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {value} {value === 1 ? 'student' : 'students'}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataCard;
