export const FEATURE_FLAGS = {
  BOLT_DS_V1: true, // Set to false to disable the new nursing modules
} as const;

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag] === true;
}