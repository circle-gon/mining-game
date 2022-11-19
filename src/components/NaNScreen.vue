<template>
  <Modal v-model="hasNaN" v-bind="$attrs">
    <template #header>
      <div class="nan-modal-header">
        <h2>NaN value detected!</h2>
      </div>
    </template>
    <template #body>
      <div>
        Attempted to assign "{{ path }}" to NaN<span v-if="previous">
          {{ " " }}(previously {{ format(previous) }})</span
        >. Auto-saving has been {{ autosave ? "enabled" : "disabled" }}. Check
        the console for more details, and consider sharing it with the
        developers on discord.
      </div>
      <br />
      <div>
        <a :href="discordLink" class="nan-modal-discord-link">
          <span class="material-icons nan-modal-discord">discord</span>
          {{ discordName }}
        </a>
      </div>
      <br />
      <Toggle v-model="autosave" title="Autosave" />
      <Toggle
        v-if="projInfo.enablePausing"
        v-model="isPaused"
        title="Pause game"
      />
    </template>
    <template #footer>
      <div class="nan-footer">
        <button class="button" @click="savesManager?.open()">
          Open Saves Manager
        </button>
        <button class="button" @click="setZero">Set to 0</button>
        <button class="button" @click="setOne">Set to 1</button>
        <button
          v-if="
            previous && Decimal.neq(previous, 0) && Decimal.neq(previous, 1)
          "
          class="button"
          @click="hasNaN = false"
        >
          Set to previous
        </button>
        <button class="button danger" @click="ignore">Ignore</button>
      </div>
    </template>
  </Modal>
  <SavesManager ref="savesManager" />
</template>

<script setup lang="ts">
import Modal from "components/Modal.vue";
import projInfo from "data/projInfo.json";
import player from "game/player";
import state from "game/state";
import type { DecimalSource } from "util/bignum";
import Decimal, { format } from "util/bignum";
import type { ComponentPublicInstance } from "vue";
import { computed, ref, toRef } from "vue";
import Toggle from "./fields/Toggle.vue";
import SavesManager from "./SavesManager.vue";

const { discordName, discordLink } = projInfo;
const autosave = toRef(player, "autosave");
const hasNaN = toRef(state, "hasNaN");
const savesManager = ref<ComponentPublicInstance<typeof SavesManager> | null>(
  null
);

const path = computed(() => state.NaNPath?.join("."));
const property = computed(() => state.NaNPath?.slice(-1)[0]);
const previous = computed<DecimalSource | null>(() => {
  if (state.NaNReceiver && property.value) {
    return state.NaNReceiver[property.value] as DecimalSource;
  }
  return null;
});
const isPaused = computed({
  get() {
    return player.devSpeed === 0;
  },
  set(value: boolean) {
    player.devSpeed = value ? null : 0;
  },
});

function setZero() {
  if (state.NaNReceiver && property.value) {
    state.NaNReceiver[property.value] = new Decimal(0);
    state.hasNaN = false;
  }
}

function setOne() {
  if (state.NaNReceiver && property.value) {
    state.NaNReceiver[property.value] = new Decimal(1);
    state.hasNaN = false;
  }
}

function ignore() {
  if (state.NaNReceiver && property.value) {
    state.NaNReceiver[property.value] = new Decimal(NaN);
    state.hasNaN = false;
  }
}
</script>

<style scoped>
.nan-modal-header {
  padding: 10px 0;
  margin-left: 10px;
}

.nan-footer {
  display: flex;
  justify-content: flex-end;
}

.nan-footer button {
  margin: 0 10px;
}

.nan-modal-discord-link {
  display: flex;
  align-items: center;
}

.nan-modal-discord {
  margin: 0;
  margin-right: 4px;
}
</style>
