export interface RegionCode {
  code: string;
  name: string;
}

// 気象庁 予報API (https://www.jma.go.jp/bosai/forecast/data/forecast/{code}.json) の地域コード。
// 変更頻度が低いため静的データとして同梱。全国網羅はせず、代表的な都道府県/主要都市のみ。
export const REGION_CODES: RegionCode[] = [
  { code: '016000', name: '北海道(石狩・空知・後志地方)' },
  { code: '040000', name: '宮城県' },
  { code: '130000', name: '東京都' },
  { code: '140000', name: '神奈川県' },
  { code: '230000', name: '愛知県' },
  { code: '270000', name: '大阪府' },
  { code: '340000', name: '広島県' },
  { code: '400000', name: '福岡県' },
  { code: '471000', name: '沖縄本島地方' },
];
