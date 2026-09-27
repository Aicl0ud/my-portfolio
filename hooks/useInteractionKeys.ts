import { useEffect } from "react";

import { useGameStore } from "../store/game";

export function useInteractionKeys() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const game = useGameStore.getState();

      if (event.code === "Escape" && game.activeStationId) {
        event.preventDefault();
        game.closeStation();
        return;
      }

      if (!["Enter", "Space", "KeyE"].includes(event.code) || !game.nearbyStationId) return;
      event.preventDefault();
      game.openStation(game.nearbyStationId);
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
