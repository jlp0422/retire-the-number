import Image from "next/image";

interface JerseySceneProps {
  imageFile: string;
  className?: string;
}

// Composites the shared generated background art with a real per-player
// jersey photo (public/players/<imageFile>), using the alignment tuned in the
// jersey_reveal.html prototype (hook-top 11%, jersey width 75% of stage,
// stage aspect 941:1672). Rendered for every player in PlayGame.tsx.
export function JerseyScene({ imageFile, className }: JerseySceneProps) {
  return (
    <div className={`relative aspect-[941/1672] overflow-hidden rounded-2xl ${className ?? ""}`}>
      <Image
        src="/players/background.png"
        alt=""
        fill
        priority
        sizes="400px"
        className="object-cover"
      />
      <div className="absolute left-1/2 top-[11%] aspect-[1024/1536] w-[75%] -translate-x-1/2 drop-shadow-[0_18px_22px_rgba(0,0,0,0.45)]">
        <Image
          src={`/players/${imageFile}`}
          alt="Retired jersey, team hidden"
          fill
          priority
          sizes="300px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
