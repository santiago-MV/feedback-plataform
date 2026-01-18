Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => "uuid-123",
  },
  configurable: true,
});
