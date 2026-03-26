import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IDataCardProps {
  value: number;
  label: string;
  dataType: string;
}

function DataCard({ value, label, dataType }: IDataCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {value} {value === 1 ? `${dataType}` : `${dataType}s`}
        </div>
      </CardContent>
    </Card>
  );
}

export default DataCard;
