import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrimingStatus = 'unseen' | 'later' | 'dismissed' | 'granted';

interface NotificationState {
  /** 最初の予定作成をきっかけに一度でも「プライミング」バナーを表示する条件が揃ったか */
  primingTriggered: boolean;
  /** バナーに対するユーザーの選択状態 */
  primingStatus: PrimingStatus;
  /** 設定画面で選べる毎日の通知時刻(HH:mm) */
  reminderTime: string;
  triggerPriming: () => void;
  setPrimingStatus: (status: PrimingStatus) => void;
  setReminderTime: (time: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      primingTriggered: false,
      primingStatus: 'unseen',
      reminderTime: '07:30',
      triggerPriming: () => {
        // 一度「あとで」「拒否」を選んだ後は、初回作成のたびに出し直さない
        if (get().primingStatus === 'unseen') {
          set({ primingTriggered: true });
        }
      },
      setPrimingStatus: (status) => set({ primingStatus: status, primingTriggered: false }),
      setReminderTime: (time) => set({ reminderTime: time }),
    }),
    { name: 'kurashi-log-notification' },
  ),
);
