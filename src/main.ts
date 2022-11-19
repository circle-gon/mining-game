import "@fontsource/material-icons";
import App from "App.vue";
import projInfo from "data/projInfo.json";
import "game/notifications";
import { load } from "util/save";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { createApp, nextTick } from "vue";
import { useToast } from "vue-toastification";

document.title = projInfo.title;
if (projInfo.id === "") {
  throw "Project ID is empty! Please select a unique ID for this project in /src/data/projInfo.json";
}

requestAnimationFrame(async () => {
  await load();
  const { globalBus, startGameLoop } = await import("./game/events");

  // Create Vue
  const vue = createApp(App);
  globalBus.emit("setupVue", vue);
  vue.mount("#app");

  // Setup PWA update prompt
  nextTick(() => {
    const toast = useToast();
    const { updateServiceWorker } = useRegisterSW({
      onNeedRefresh() {
        toast.info("New content available, click or reload to update.", {
          timeout: false,
          closeOnClick: false,
          draggable: false,
          icon: {
            iconClass: "material-icons",
            iconChildren: "refresh",
            iconTag: "i",
          },
          rtl: false,
          onClick() {
            updateServiceWorker();
          },
        });
      },
      onOfflineReady() {
        toast.info("App ready to work offline");
      },
      onRegisterError: console.warn,
      onRegistered(r) {
        if (r) {
          setInterval(r.update, 60 * 60 * 1000);
        }
      },
    });
  });

  startGameLoop();
});
