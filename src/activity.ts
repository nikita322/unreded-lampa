import { createSignal, type Accessor, type Component } from 'solid-js';

/** Общий контракт экрана: App передаёт, является ли экран верхним в стеке. */
export interface ScreenProps {
  isActive: boolean;
}

export interface ActivityDescriptor {
  readonly id: number;
  readonly component: Component<ScreenProps>;
}

const [stack, setStack] = createSignal<ActivityDescriptor[]>([]);

let nextId = 1;

export const activityStack: Accessor<ActivityDescriptor[]> = stack;

export const currentActivity = (): ActivityDescriptor | undefined => {
  const list = stack();
  return list[list.length - 1];
};

export function push(component: Component<ScreenProps>): void {
  setStack(prev => [...prev, { id: nextId++, component }]);
}

export function pop(): void {
  setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
}

export function bootstrap(component: Component<ScreenProps>): void {
  setStack([{ id: nextId++, component }]);
}
