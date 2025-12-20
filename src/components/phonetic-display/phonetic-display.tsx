import { useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import styles from "./phonetic-display.module.css";

type PhoneticDisplayProps = {
  phonetic?: { audio: string; text: string } | null;
};

export function PhoneticDisplay({ phonetic }: PhoneticDisplayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!phonetic) return null;

  const handlePlayAudio = () => {
    if (!phonetic.audio) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(phonetic.audio);
    } else {
      audioRef.current.src = phonetic.audio;
    }

    audioRef.current.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  return (
    <div className={styles.phoneticContainer}>
      <button
        className={styles.audioButton}
        onClick={handlePlayAudio}
        title="Listen to pronunciation"
      >
        <FaVolumeUp />
      </button>
      <span className={styles.phoneticText}>{phonetic.text}</span>
    </div>
  );
}
