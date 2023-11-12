export abstract class SoundManager {
  private static readonly audios = new Map<string, HTMLAudioElement>();

  public static play(sound: string) {
    const audio = document.getElementById(sound) as HTMLAudioElement;

    if (!audio)
      return;
    audio.volume = 0.1;
    audio.currentTime = 0;
    audio.play();
  }
}