import backgroundVideo from "../assets/videos/bg-video.mp4";
import profileVideo from "../assets/videos/profile.mp4";
import clickSound from "../assets/sounds/click.mp3";
import changeSound from "../assets/sounds/change.mp3";
import loveSound from "../assets/sounds/love.mp3";

const MEDIA_TIMEOUT_MS = 1800;

const preloadMedia = (src, tagName) =>
  new Promise((resolve) => {
    const media = document.createElement(tagName);
    let timeout;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve();
    };

    media.preload = "auto";
    media.addEventListener("loadeddata", finish, { once: true });
    media.addEventListener("error", finish, { once: true });
    timeout = window.setTimeout(finish, MEDIA_TIMEOUT_MS);
    media.src = src;

    try {
      media.load();
    } catch {
      finish();
    }
  });

export const preloadHomeMedia = () =>
  Promise.all([
    preloadMedia(backgroundVideo, "video"),
    preloadMedia(profileVideo, "video"),
    preloadMedia(clickSound, "audio"),
    preloadMedia(changeSound, "audio"),
    preloadMedia(loveSound, "audio"),
  ]);