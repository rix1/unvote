// Helper function to assert conditions and throw meaningful errors if they fail
export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
