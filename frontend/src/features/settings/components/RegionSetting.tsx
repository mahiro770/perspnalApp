import { Card, CardContent, CardHeader, CardTitle, Select, Button } from '@/components/ui';
import { useWeatherStore } from '@/stores/weatherStore';
import { useSetDefaultRegion, useWeatherRegions } from '@/features/weather/hooks/useWeather';
import { useState } from 'react';
import { Check } from 'lucide-react';

export function RegionSetting() {
  const { data: regions = [] } = useWeatherRegions();
  const { selectedRegionCode, setSelectedRegionCode } = useWeatherStore();
  const mutation = useSetDefaultRegion();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    mutation.mutate(selectedRegionCode, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>天気の地域設定</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 pt-0">
        <Select value={selectedRegionCode} onChange={(e) => setSelectedRegionCode(e.target.value)}>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>
              {r.name}
            </option>
          ))}
        </Select>
        <Button size="sm" variant="secondary" onClick={handleSave} disabled={mutation.isPending}>
          {saved ? <Check className="h-4 w-4 text-success" /> : 'デフォルトに設定'}
        </Button>
      </CardContent>
    </Card>
  );
}
