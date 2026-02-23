import classnames from "classnames";

type ClassValue = string | number | boolean | undefined | null | Record<string, boolean | undefined | null> | ClassValue[];

export function cn(...args: ClassValue[]): string {
  return classnames(...(args as Parameters<typeof classnames>));
}
