import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { constant } from "effect/Function";
import * as Layer from "effect/Layer";

import type { TelemetryOwner } from "./Identify.ts";

export class AnalyticsService extends Context.Service<
  AnalyticsService,
  {
    readonly record: (
      event: string,
      properties?: Readonly<Record<string, unknown>>,
    ) => Effect.Effect<void>;

    readonly flush: Effect.Effect<void>;

    /**
     * Records `install.owner_observed` for each owner of this install that the
     * server read itself or a connecting client reported. Each owner is sent once
     * per server process, so reconnects and repeated reads are free.
     */
    readonly recordOwners: (
      owners: ReadonlyArray<TelemetryOwner>,
      observedBy: "server" | "client",
    ) => Effect.Effect<void>;
  }
>()("t3/telemetry/AnalyticsService") {}

// Keep the instrumentation port for callers and tests without collecting or exporting events.
export const layer = Layer.succeed(
  AnalyticsService,
  AnalyticsService.of({
    record: constant(Effect.void),
    flush: Effect.void,
    recordOwners: constant(Effect.void),
  }),
);
