export abstract class SoundManager {
  private static readonly audios = new Map<string, HTMLAudioElement>();

  public static play(sound: string, volume = 0.6) {
    const audio = document.getElementById(sound) as HTMLAudioElement;

    if (!audio)
      return;
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play();
  }
}