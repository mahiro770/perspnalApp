import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const UPDATE_CHECK_INTERVAL_MS = 60 * 1000;

/**
 * ブラウザ標準のService Worker更新チェックはタイミングが不定で、特にiOSの
 * ホーム画面アプリは長時間バックグラウンドのままになりがちなため反映が遅れやすい。
 * 定期的・画面復帰時に明示的にチェックし、新しいバージョンが見つかったら
 * (registerType: autoUpdateの方針通り)確認なしですぐ反映する。
 */
export function PwaUpdater() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;

      const check = () => registration.update().catch(() => {});
      setInterval(check, UPDATE_CHECK_INTERVAL_MS);

      const onVisible = () => {
        if (document.visibilityState === 'visible') check();
      };
      document.addEventListener('visibilitychange', onVisible);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
