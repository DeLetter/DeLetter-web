import React from 'react';
import create from 'zustand';
import cx from 'clsx';
import { uniqueId } from 'lodash-es';

interface Toast {
  content: string | React.ReactNode;
  type: 'success' | 'warning' | 'failed';
  id: string;
}
interface ToastState {
  toasts: Array<Toast> | never[];
  showToast: (param: Omit<Toast, 'id'> & { key?: string }) => void;
}

const toastsState = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (param: Omit<Toast, 'id'> & { key?: string }) => {
    let cur = get().toasts;
    if (param.key && cur.find((item: Toast & { key?: string }) => item.key && item.key === param.key)) { set({ toasts: cur }); return };
    const newArr = cur ? [...cur] : [];
    const id = uniqueId();
    newArr.push({ ...param, id });
    setTimeout(() => {
      let curAfter = get().toasts;
      let newAfter = curAfter ? [...curAfter] : [];
      newAfter = newAfter.filter((toast) => toast.id !== id);
      set({ toasts: [] });
      return
    }, 3000);
    set({ toasts: newArr })
    return
  }
}));

const useToast = () => toastsState.getState().toasts;
export const showToast = toastsState.getState().showToast;

export const ToastRender: React.FC = () => {
  const toasts = useToast();
  return (
    <div className="fixed left-0 top-[100px] right-0 pointer-events-none flex flex-col justify-center items-center gap-[12px] z-40">
      {toasts.map(({ content, type, id }) => (
        <div
          key={id}
          className={cx('px-[42px] h-[72px] flex justify-center items-center text-[28px] leading-[36px] text-[#FFFFFF] rounded-[42px] z-40', {
            'bg-[#05001FB2]': type === 'failed' || type === 'warning',
            'bg-[#F15C5C] opacity-70': type === 'success',
          })}
        >
          {content}
        </div>
      ))}
    </div>
  );
};
