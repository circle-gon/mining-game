import { shallowReactive } from "vue";

/** An object of global data that is not persistent. */
export interface Transient {
  /** A list of the duration, in ms, of the last 10 game ticks. Used for calculating TPS. */
  lastTenTicks: number[];
  /** Whether or not a NaN value has been detected and undealt with. */
  hasNaN: boolean;
  /** The location within the player save data object of the NaN value. */
  NaNPath?: string[];
  /** The parent object of the NaN value. */
  NaNReceiver?: Record<string, unknown>;
}

/** The global transient state object. */
const state = shallowReactive<Transient>({
  lastTenTicks: [],
  hasNaN: false,
  NaNPath: [],
});
export default state;
