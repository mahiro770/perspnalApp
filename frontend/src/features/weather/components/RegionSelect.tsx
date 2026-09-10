import { Select } from '@/components/ui';
import { useWeatherRegions } from '../hooks/useWeather';

interface RegionSelectProps {
  value: string;
  onChange: (regionCode: string) => void;
}

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  const { data: regions = [] } = useWeatherRegions();

  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} className="min-w-[10rem]">
      {regions.map((region) => (
        <option key={region.code} value={region.code}>
          {region.name}
        </option>
      ))}
    </Select>
  );
}
